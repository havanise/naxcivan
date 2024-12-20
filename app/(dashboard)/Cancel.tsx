/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { fullDateTimeWithSecond } from "@/utils";
import { ProButton, ProText } from "@/components";
import { TextInput, View, Modal } from "react-native";

export const Cancel = ({
  isVisible,
  handleModal,
  cancelRequest,
  requestInfo,
  profile,
  fetchBusinessSettings,
  fetchReasons,
  cancellationReasons,
  maxLength = 120,
}: any) => {
  const [note, setNote] = useState("");
  const [operationTime, setOperationTime] = useState(moment());
  const [cancellationReason, setCancellationReason] = useState(null);
  const [selectedUserSettings, setSelectedUserSettings] = useState({
    canCancel: false,
  });

  const canChangeDate = Boolean(selectedUserSettings?.canCancel);

  const handleConfirmClick = () => {
    const data = {
      cancellationReason: cancellationReason,
      cancellationDate: canChangeDate
        ? operationTime.format(fullDateTimeWithSecond)
        : null,
      note,
    };
    const onSuccessCallback = () => {
      handleModal(true);
    };
    cancelRequest({ id: requestInfo.id, data, onSuccessCallback });
  };

  useEffect(() => {
    if (!cancellationReasons.length) {
      fetchReasons({ filters: { limit: 1000 } });
    }
  }, []);

  useEffect(() => {
    if (requestInfo) {
      fetchBusinessSettings({
        id: profile.id,
        filters: {
          businessUnitIds: requestInfo?.businessUnit?.id
            ? [requestInfo.businessUnit.id]
            : [0],
        },
        onSuccessCallback: ({ data }: any) => {
          setSelectedUserSettings(data?.settings || {});
        },
      });
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
      <View>
        <ProText variant="heading" style={{ color: "black" }}>
          İmtina statusu
        </ProText>
        <View
          style={{
            marginBottom: 24,
          }}
        >
          {/* <div style={{ width: "45%", display: "flex" }}>
            <span style={{ paddingTop: "7px" }}>Imtina tarixi</span>

            <ProDatePicker
              size="large"
              value={operationTime}
              onChange={(value: any) => {
                setOperationTime(value);
              }}
              format={fullDateTimeWithSecond}
              allowClear={false}
              disabled={!canChangeDate}
              style={{ width: "70%", marginLeft: "12px" }}
            />
          </div> */}

          {/* <div style={{ width: "50%", display: "flex" }}>
            <span
              style={{
                marginLeft: "10px",
                paddingTop: "7px",
              }}
            >
              Imtina səbəbi
            </span>
            <ProSelect
              data={cancellationReasons}
              allowClear={false}
              onChange={(e: any) => {
                setCancellationReason(e);
              }}
              style={{ width: "70%", marginLeft: "12px" }}
            />
          </div> */}
        </View>
        <TextInput
          multiline={true}
          placeholder="Yazın"
          onChangeText={(e: any) => setNote(e.target.value)}
          value={note}
          maxLength={maxLength}
        />
        <ProButton
          label="Təsdiq et"
          type="primary"
          onClick={handleConfirmClick}
        />
      </View>
    </Modal>
  );
};
