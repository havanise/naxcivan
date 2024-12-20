import React, { useState } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Text, RefreshControl, View, StyleSheet } from "react-native";

const ProAsyncSelect = ({
  data = [],
  setData,
  fetchData,
  searchWithBack = false,
  label,
  required = false,
  name,
  control,
  notForm = false,
  notValue = false,
  disabled = false,
  handleSelectValue = () => {},
  defaultValue = false,
  style = undefined,
  allowClear = true,
  width = "100%",
  selectedValueFromParent = undefined,
  handleChange,
  isMulti = false,
}: any) => {
  const [isFocus, setIsFocus] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [multiSelected, setMultiSelected] = useState([]);

  const renderItem = (item: any) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 7,
          gap: 5,
          justifyContent: "center",
        }}
      >
        <FontAwesome name="circle" size={10} color={item.color} />
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: width,
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {label ? <Text>{label}</Text> : null}
        {required ? <Text style={styles.paragraph}>*</Text> : null}
      </View>
      {notForm ? (
        <Dropdown
          renderItem={renderItem}
          disable={disabled}
          style={[
            styles.dropdown,
            disabled && { backgroundColor: "#ececec" },
            style && style,
          ]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={defaultValue}
          searchPlaceholder="Search..."
          renderRightIcon={() => null}
          value={
            notValue
              ? undefined
              : selectedValueFromParent
              ? selectedValueFromParent
              : selectedValue
          }
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          onChange={(item) => {
            if (handleChange) {
              handleChange(item.id);
            } else {
              setSelectedValue(item.value);
              handleSelectValue(item.id);
              setIsFocus(false);
            }
          }}
          flatListProps={{
            refreshControl: <RefreshControl refreshing={false} />,
            onEndReachedThreshold: 0.5,
            onEndReached: () => {},
          }}
        />
      ) : (
        <Controller
          control={control}
          rules={{
            required: required ? "Bu dəyər boş olmamalıdır" : false,
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                {isMulti ? (
                  <MultiSelect
                    disable={disabled}
                    style={[
                      styles.formDropdown,
                      isFocus && { borderColor: "blue" },
                      disabled && { backgroundColor: "#ececec" },
                    ]}
                    placeholderStyle={styles.formPlaceholderStyle}
                    selectedTextStyle={styles.formSelectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Seçin"
                    searchPlaceholder="Search..."
                    value={value || []}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => {
                      setIsFocus(false);
                    }}
                    onChange={(item: any) => {
                      onChange(item);
                      handleSelectValue(item[item.length - 1]);
                      setIsFocus(false);
                    }}
                    flatListProps={{
                      refreshControl: <RefreshControl refreshing={false} />,
                      onEndReachedThreshold: 0.5,
                    }}
                  />
                ) : (
                  <Dropdown
                    disable={disabled}
                    style={[
                      styles.formDropdown,
                      isFocus && { borderColor: "blue" },
                      disabled && { backgroundColor: "#ececec" },
                    ]}
                    placeholderStyle={styles.formPlaceholderStyle}
                    selectedTextStyle={styles.formSelectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="id"
                    placeholder={"Seçin"}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => {
                      setIsFocus(true);
                    }}
                    onBlur={() => {
                      setIsFocus(false);
                      searchWithBack && setData([]);
                    }}
                    onChange={(item) => {
                      onChange(item.id);
                      setIsFocus(false);
                      handleSelectValue(item.id);
                    }}
                    renderRightIcon={(item) => {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {value && allowClear && (
                              <Text
                                onPress={() => {
                                  onChange(undefined);
                                }}
                                style={{ marginRight: 6 }}
                              >
                                <FontAwesome
                                  name="close"
                                  size={14}
                                  color="black"
                                />
                              </Text>
                            )}
                            <Text
                              onPress={() => {
                                console.log("clickdown");
                              }}
                              style={{ marginRight: 10 }}
                            >
                              <Entypo
                                name="chevron-small-down"
                                size={20}
                                color="black"
                              />
                            </Text>
                          </View>
                        </>
                      );
                    }}
                    flatListProps={{
                      refreshControl: <RefreshControl refreshing={false} />,
                      onEndReachedThreshold: 0.5,
                      onEndReached: () => {},
                    }}
                  />
                )}
                {error && <Text style={{ color: "red" }}>{error.message}</Text>}
              </>
            );
          }}
          name={name}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: { color: "red", marginLeft: 5 },
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: 12,
    textAlign: "center",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  formDropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  formPlaceholderStyle: {
    fontSize: 16,
  },
  formSelectedTextStyle: {
    fontSize: 16,
  },
});

export default ProAsyncSelect;
