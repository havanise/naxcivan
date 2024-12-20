/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Dispetcer = ({ selectedCall }: any) => {
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
        <Text style={styles.text}>Briqada</Text>
        <Text>{`${selectedCall?.brigade?.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Ambulans</Text>
        <Text>{`${selectedCall?.ambulance?.name || "-"}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Həkim</Text>
        <Text>{getNameByRole(selectedCall?.members, 1)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Feldşer</Text>
        <Text>{getNameByRole(selectedCall?.members, 2)}</Text>
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

export default Dispetcer;
