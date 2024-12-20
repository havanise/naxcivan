import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { AntDesign } from "@expo/vector-icons";
import { uploadAttachment } from "@/api";
import * as ImagePicker from "expo-image-picker";

const ProCamera = ({ selectedFile, setSelectedFile }: any) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);

  const formData = new FormData();
  const openCamera = async () => {
    const getstatus = await ImagePicker.requestCameraPermissionsAsync();
    console.log(getstatus, "getstatus");
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }
    try {
      let result: any = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        console.log(result);
        const fileSize: any = await FileSystem.getInfoAsync(
          result.assets[0].uri
        );
        const maxSize = 20 * 1024 * 1024; // 20 MB in bytes
        if (fileSize.size > maxSize) {
          Alert.alert("Faylın ölçüsü 20 MB-dan çox ola bilməz.");
        } else if (selectedFile.length > 4) {
          Alert.alert("5-dən çox fayl seçilə bilməz.");
        } else {
          const fileData: any = {
            uri: result.assets[0].uri,
            type: result.assets[0].mimeType,
            name: result.assets[0].fileName,
          };
          setSelectedFile((prevDocuments: any) => [
            ...prevDocuments,
            {
              ...result.assets[0],
              status: "wait",
              name: result.assets[0].fileName,
            },
          ]);

          formData.append("file", fileData);
          console.log(fileData);
          uploadAttachment({ data: formData }).then((res) => {
            console.log(res.id);
            setSelectedFile((prevDocuments: any) =>
              prevDocuments.map((document: any) => {
                if (document.name === res.originalName) {
                  console.log("okkk");
                  return {
                    ...document,
                    id: res.id,
                    status: "done",
                  };
                }
                return document;
              })
            );
          });
        }
      }
    } catch (error) {
      console.log("Error occurred while launching the camera: ", error);
    }
  };
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <AntDesign name="camera" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ProCamera;
