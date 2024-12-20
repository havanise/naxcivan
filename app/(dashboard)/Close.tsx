/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fullDateTimeWithSecond } from "@/utils";
import { ProButton, ProDateTimePicker, ProText } from "@/components";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

const Close = ({
  isVisible,
  handleModal,
  closeRequest,
  requestInfo,
  profile,
  fetchBusinessSettings,
  maxLength = 120,
}: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      dateOfTransaction: new Date(),
    },
  });

  const [note, setNote] = useState("");
  const [selectedUserSettings, setSelectedUserSettings] = useState<any>({});

  const canChangeDate = Boolean(selectedUserSettings?.canClose);

  const handleConfirmClick = () => {
    const data = {
      closingDate: canChangeDate
        ? moment(getValues("dateOfTransaction"))?.format(fullDateTimeWithSecond)
        : null,
      note,
    };

    closeRequest({ id: requestInfo.id, data }).then((resp: any) => {
      handleModal(true);
    });
  };

  useEffect(() => {
    if (requestInfo) {
      fetchBusinessSettings({
        id: profile.id,
        filter: {
          businessUnitIds: requestInfo?.businessUnit?.id
            ? [requestInfo.businessUnit.id]
            : [0],
        },
      }).then((resp: any) => {
        setSelectedUserSettings(resp?.settings || {})});
    }
  }, [requestInfo]);

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
          <ProText variant="heading" style={{ color: "black" }}>
            Bağlı statusu
          </ProText>
          <View
            style={{
              marginBottom: 24,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={{ paddingTop: 7 }}>Çağırışın bağlanma tarixi</Text>

              <ProDateTimePicker
                name="dateOfTransaction"
                control={control}
                label={false}
                setValue={setValue}
                disabled={!canChangeDate}
              />
            </View>
          </View>
          <TextInput
            multiline={true}
            placeholder="Yazın"
            onChangeText={(e: any) => setNote(e)}
            value={note}
            maxLength={maxLength}
            style={[styles.multiText]}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ProButton
              label="Təsdiq et"
              type="primary"
              onClick={handleConfirmClick}
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
  multiText: {
    minHeight: 100,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 30,
  },
});

export default Close;
