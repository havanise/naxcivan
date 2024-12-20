import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text } from "react-native";
import ProAsyncSelect from "../ProAsyncSelect";

export const ProStageDynamicColor = (props: any) => {
  const {
    visualStage,
    statuses = [],
    onChange = () => {},
    disabled = false,
    color,
  } = props;

  return (
    <ProAsyncSelect
      data={statuses}
      notForm
      setData={() => {}}
      fetchData={() => {}}
      style={
        color
          ? { backgroundColor: `${color}`, height: 30, marginBottom: 10}
          : { height: 40 }
      }
      showArrow={false}
      size="small"
      defaultValue={visualStage?.id}
      handleChange={onChange}
      disabled={disabled}
      icon={<FontAwesome name="circle" size={10} color={color} />}
    />
  );
};
