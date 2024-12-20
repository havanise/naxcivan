/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Operator = ({ selectedCall }: any) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.row}>
        <Text style={styles.text}>ASA</Text>
        <Text>
          {`${selectedCall?.name || ""} ${selectedCall?.surname || ""} ${
            selectedCall?.patronymic || ""
          }`}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Cinsi</Text>
        <Text>{`${
          selectedCall?.gender === 1
            ? "Kişi"
            : selectedCall?.gender === 2
            ? "Qadin"
            : ""
        }`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Təvəllüd</Text>
        <Text>{`${selectedCall?.birthYear || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Çağırış verən müəssisə (ərazi)</Text>
        <Text>{`${selectedCall?.referencePoint || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Müraciət növü</Text>
        <Text>{`${selectedCall?.reason.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>İmtina edilib</Text>
        <Text>{`${selectedCall?.isRejected ? "Bəli" : "Xeyr"}`}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.text}>Təyin edilmiş nömrə</Text>
        <Text>{selectedCall?.phoneNumber || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Əlavə telefon nömrəsi</Text>
        <Text>{selectedCall?.additionalPhoneNumber || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Çağırış ünvanı</Text>
        <Text>{selectedCall?.address || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Rayon</Text>
        <Text>{`${selectedCall?.region.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Küçə</Text>
        <Text>{`${selectedCall?.street || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Ev</Text>
        <Text>{`${selectedCall?.house || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Blok</Text>
        <Text>{`${selectedCall?.entrance || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Mərtəbə</Text>
        <Text>{`${selectedCall?.floor || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Mənzil</Text>
        <Text>{`${selectedCall?.apartment || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Əlavə məlumat</Text>
        <Text>{`${selectedCall?.note || "-"}`}</Text>
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

export default Operator;
