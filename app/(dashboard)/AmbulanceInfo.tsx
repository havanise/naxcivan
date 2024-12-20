/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const AmbulanceInfo = ({ selectedCall }: any) => {
  function getNameByRole(members: any, role: any) {
    const data = members?.[role]?.reduce(
      (accumulator: any, currentValue: { lastName: any; name: any }) => {
        return `${accumulator}${accumulator ? "," : ""} ${
          currentValue?.lastName || ""
        } ${currentValue?.name || ""}`;
      },
      ""
    );
    return data ? data : " - ";
  }
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.row}>
        <Text style={styles.text}>İlkin diaqnoz (Təsnifatı)</Text>
        <Text>{`${selectedCall?.diagnosis?.parent?.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>İlkin diaqnoz (Xəstəlik)</Text>
        <Text>{`${selectedCall?.diagnosis?.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Əlavə müayinə məlumatları</Text>
        <Text>{`${selectedCall?.additionalExamination || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Təyinat və müalicə tədbirləri</Text>
        <Text>{`${selectedCall?.therapeuticActions || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Həkimin A.S.A</Text>
        <Text>{getNameByRole(selectedCall?.members, 1)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Sanitar</Text>
        <Text>{getNameByRole(selectedCall?.members, 3)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Haradan</Text>
        <Text>{`${
          selectedCall.medicalInstitutionFrom ||
          selectedCall.medicalInstitutionTo
            ? selectedCall?.medicalInstitutionFrom?.name || "Çağırış ünvanı"
            : "-"
        }`}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>A/T</Text>
        <Text>{selectedCall?.bloodPressure || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Hərarət</Text>
        <Text>{selectedCall?.temperature || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Nəbzi</Text>
        <Text>{selectedCall?.pulse || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>SpO2</Text>
        <Text>{`${selectedCall?.spO2 || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Feldşer</Text>
        <Text>{getNameByRole(selectedCall?.members, 2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Sürücü</Text>
        <Text>{getNameByRole(selectedCall?.members, 5)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Haraya</Text>
        <Text>{`${
          selectedCall.medicalInstitutionFrom ||
          selectedCall.medicalInstitutionTo
            ? selectedCall?.medicalInstitutionTo?.name || "Çağırış ünvanı"
            : "-"
        }`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: "#505050",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#efefef",
    paddingBottom: 5,
  },
});

export default AmbulanceInfo;
