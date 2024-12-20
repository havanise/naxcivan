/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Text,
  Image,
  ScrollView,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  fetchRequestComments,
  createComment,
  uploadAttachment,
  deleteAttachment,
} from "@/api";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import moment from "moment";
// import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import { AntDesign } from "@expo/vector-icons";
import { ProButton, ProCamera } from "@/components";
import HTMLView from "react-native-htmlview";
import { shareAsync } from "expo-sharing";

const images = {
  1: require("@/assets/images/fileXsl.png"),
  2: require("@/assets/images/fileWord.png"),
  3: require("@/assets/images/fileImg.png"),
  4: require("@/assets/images/filePdf.png"),
  5: require("@/assets/images/fileMp4.png"),
};

function isImage(type: any) {
  return type === "image/png" ||
    type === "image/jpeg" ||
    type === "image/jpg" ||
    type === "image/svg"
    ? true
    : false;
}
function getFileAvatar(file: any) {
  if (file.type === "application/zip") {
    if (file.name.split(".").pop() === "xlsx") {
      return 1;
    } else if (file.name.split(".").pop() === "docx") {
      return 2;
    }
  }
  if (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/svg"
  )
    return 3;
  if (
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return 1;
  if (file.type === "application/pdf") return 4;
  if (file.type === "video/mp4") return 5;

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"
  )
    return 2;
  return 3;
}
const Document = (props: any) => {
  const { file, downloadFileUrl } = props;

  async function saveFile(uri: string, filename: string, mimetype: string) {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mimetype
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => console.log(e));
    } else {
      shareAsync(uri);
    }
  }

  const onDownloadFile = async (file: any) => {
    const result = await FileSystem.downloadAsync(
      file.url,
      FileSystem.documentDirectory + file?.name
    );

    saveFile(result.uri, file?.name, result.headers["Content-Type"]);
    console.log(result, "result");
  };

  return (
    <View
      style={{ marginBottom: 12, flexDirection: "row", alignItems: "center" }}
    >
      {isImage(file.type) ? (
        <Image src={file.url} style={{ width: 30, height: 30 }} />
      ) : (
        <>
          <Image
            source={images[getFileAvatar(file)]}
            style={{ width: 30, height: 30 }}
          />
          <Text>{file.name || "Test"}</Text>
        </>
      )}

      <Pressable style={[styles.button]} onPress={() => onDownloadFile(file)}>
        <Feather
          name="download"
          size={20}
          style={{ marginLeft: 10 }}
          color="#FF716A"
        />
      </Pressable>
    </View>
  );
};

const Documents = ({ documents, downloadFileUrl }: any) => (
  <View>
    <Text style={{ fontSize: 16, fontWeight: 600, color: "#383d3e" }}>
      Əlavə edilmiş sənədlər :
    </Text>
    <View style={{ width: "100%", marginTop: 10, marginBottom: 10 }}>
      {documents.map(
        (
          document: { id: any; mimeType: any; originalName: any; url: any },
          key: any
        ) => (
          <View style={{ paddingLeft: 6, paddingRight: 6 }}>
            <Document
              file={{
                id: document.id,
                type: document.mimeType,
                name: document.originalName,
                url: document.url,
                status: "done",
              }}
              downloadFileUrl={downloadFileUrl}
            />
          </View>
        )
      )}
    </View>
  </View>
);

const Detail = ({ isVisible, handleModal, selectedId }: any) => {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState<any>();
  // const [documents, setDocuments] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>([]);

  const handleCreateComment = () => {
    const data = {
      message: value,
      attachments_ul: selectedFile.map((d: any) => d.id),
    };

    console.log(data, 'send')

    createComment({
      id: selectedId,
      data,
    }).then(() => {
      Toast.show({
        type: "success",
        text1: "Uğurla əlavə olundu",
      });
      setValue("");
      setSelectedFile([]);
      fetchRequestComments({ id: selectedId }).then((res: any) => {
        setComments(res);
      });
    });
  };

  useEffect(() => {
    fetchRequestComments({ id: selectedId }).then((res: any) => {
      setComments(res);
    });
  }, []);

  const formData = new FormData();

  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      });

      const fileSize: any = await FileSystem.getInfoAsync(result.assets[0].uri);
      const maxSize = 20 * 1024 * 1024; // 20 MB in bytes
      if (fileSize.size > maxSize) {
        Alert.alert("Faylın ölçüsü 20 MB-dan çox ola bilməz.");
      } else if (selectedFile.length > 4) {
        Alert.alert("5-dən çox fayl seçilə bilməz.");
      } else {
        const fileData: any = {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].name,
        };
        setSelectedFile((prevDocuments: any) => [
          ...prevDocuments,
          { ...result.assets[0], status: "wait" },
        ]);

        formData.append("file", fileData);

        uploadAttachment({ data: formData }).then((res) => {
          setSelectedFile((prevDocuments: any) =>
            prevDocuments.map((document: any) => {
              if (document.name === res.originalName) {
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
    } catch (err) {
      throw err;
    }
  };

  const onDeletedFile = (id: any) => {
    console.log(id);
    deleteAttachment({ id }).then((res) =>
      setSelectedFile(selectedFile.filter((item: any) => item.id !== id))
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        handleModal(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            <View style={{ justifyContent: "space-between", height: "100%" }}>
              {comments?.map(
                (
                  {
                    createdBy,
                    createdAt,
                    message,
                    attachments,
                    downloadFileUrl,
                  }: any,
                  index: any
                ) => (
                  <View
                    style={
                      index === comments.length - 1
                        ? { flexDirection: "row", marginTop: 20 }
                        : styles.message
                    }
                  >
                    <View>
                      <Image
                        source={require("@/assets/images/default.jpg")}
                        style={{ borderRadius: 50, width: 40, height: 40 }}
                      />
                    </View>
                    <View style={{ marginLeft: 15 }}>
                      <View style={{ display: "flex" }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#373737",
                          }}
                        >{`${createdBy.lastName || ""} ${
                          createdBy.name
                        } `}</Text>
                        <Text style={{ fontSize: 12, color: "#7C7C7C" }}>
                          {moment(createdAt).format("DD-MM-YYYY HH:mm")}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <HTMLView value={message || ""} stylesheet={styles} />
                      </View>
                      {attachments.length ? (
                        <Documents
                          documents={attachments}
                          downloadFileUrl={downloadFileUrl}
                        />
                      ) : null}
                    </View>
                  </View>
                )
              )}
              <View>
                <TextInput
                  multiline={true}
                  style={styles.dropdown}
                  placeholder="Yazın"
                  onChangeText={(event) => {
                    setValue(event);
                  }}
                  value={value}
                />
                {/* <QuillEditor
                style={styles.editor}
                ref={editor}
                initialHtml="<h1>Quill Editor for react-native</h1>"
              />
              <QuillToolbar editor={editor} options="full" theme="light" /> */}
                <View style={{ marginTop: 20 }}>
                  <Pressable
                    style={{
                      borderWidth: 1,
                      borderStyle: "dashed",
                      borderColor: "#d9d9d9",
                      borderRadius: 5,
                      padding: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={pickDocument}
                  >
                    <View style={{ marginRight: 5 }}>
                      <AntDesign name="cloudupload" size={22} color="black" />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#909090",
                          marginRight: 15,
                          textAlign: "center",
                        }}
                      >
                        Faylları buradan yükləyin (limit - 20MB / 5 ədəd)
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#909090",
                          marginRight: 15,
                          textAlign: "center",
                        }}
                      >
                        Qəbul edilən fayl növləri: .jpg, .jpeg, .pdf, .doc,
                        .xlsx
                      </Text>
                    </View>
                  </Pressable>

                  <ProCamera selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

                  {selectedFile && selectedFile.length > 0 && (
                    <View style={{ marginTop: 15 }}>
                      {selectedFile.map((item: any) => (
                        <View
                          style={{
                            backgroundColor: "#f9f9f9",
                            padding: 5,
                            marginTop: 15,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={images[getFileAvatar(item)]}
                              style={{ width: 30, height: 30, marginRight: 3 }}
                            />
                            <Text>{item.name}</Text>
                          </View>
                          <Pressable
                            style={[styles.button]}
                            onPress={() => onDeletedFile(item.id)}
                          >
                            <AntDesign
                              name="delete"
                              size={20}
                              style={{ marginLeft: 10 }}
                              color="#FF716A"
                            />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                  {/* <Button title="Upload File" onPress={uploadFile} /> */}
                </View>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              marginTop: 20,
            }}
          >
            <ProButton
              label="Əlavə et"
              type="primary"
              flex={false}
              style={{ width: 150 }}
              onClick={handleCreateComment}
              defaultStyle={{ borderRadius: 5 }}
              buttonBorder={styles.buttonStyle}
            />
          </View>
          <Pressable style={[styles.button]} onPress={() => handleModal(false)}>
            <AntDesign name="close" size={18} color="black" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    height: "80%",
    padding: 30,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: "absolute",
    borderRadius: 20,
    padding: 10,
    right: 0,
  },
  buttonStyle: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "transparent",
  },
  tabbar: {
    backgroundColor: "white",
  },
  message: {
    borderBottomWidth: 1,
    borderColor: "#e09191",
    marginTop: 20,
    flexDirection: "row",
  },
  messageText: {
    fontSize: 16,
    margin: 10,
    color: "#313131",
  },
  dropdown: {
    height: 80,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  webview: {
    flex: 1,
  },
});

export default Detail;
