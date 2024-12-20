/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Modal, Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TabBar, TabView } from "react-native-tab-view";
import Operator from "./Operator";
import Dispetcer from "./Dispetcer";
import Ambulance from "./Ambulance";
import AmbulanceInfo from "./AmbulanceInfo";

const Detail = ({
  isVisible,
  handleModal,
  selectedCall,
  index,
  setIndex,
  fromFirst = false,
}: any) => {
  const [routes] = useState([
    { key: "first", title: "Operator" },
    { key: "second", title: "Dispetçer" },
    { key: "third", title: "Ambulans" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <Operator selectedCall={selectedCall}></Operator>;
      case "second":
        return <Dispetcer selectedCall={selectedCall}></Dispetcer>;
      case "third":
        return fromFirst ? (
          <Ambulance
            handleModal={handleModal}
            selectedCall={selectedCall}
          ></Ambulance>
        ) : (
          <AmbulanceInfo selectedCall={selectedCall} />
        );
      default:
        return null;
    }
  };

  const renderBadge = ({ route }: any) => {
    if (route.key === "albums") {
      return (
        <View>
          <Text>42</Text>
        </View>
      );
    }
    return null;
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      renderBadge={renderBadge}
      labelStyle={{ color: "#37B874" }}
      style={styles.tabbar}
    />
  );

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
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            swipeEnabled={true}
          />

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
    width: '90%',
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
});

export default Detail;
