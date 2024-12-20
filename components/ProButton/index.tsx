import React from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { theme } from "../../utils";

import { Container, Label } from "./styles";

interface Props {
  label: any;
  type: string;
  onClick?: any;
  loading?: any;
  rest?: any;
  defaultStyle?: any;
  flex?: boolean;
  style?: any;
  buttonBorder?: any;
  selected?: boolean;
  disabled?: boolean;
  padding?: any;
}

const ProButton = (props: Props) => {
  const {
    label,
    type = "primary",
    onClick,
    loading,
    rest,
    defaultStyle,
    flex = true,
    style,
    buttonBorder = {},
    selected = false,
    disabled = false,
    padding = undefined,
  } = props;

  return (
    <GestureHandlerRootView style={flex ? { flex: 1 } : style}>
      <View
        style={
          disabled ? { ...buttonBorder, backgroundColor: "#eee" } : buttonBorder
        }
      >
        <Container
          type={type}
          style={defaultStyle}
          onPress={onClick}
          selected={selected}
          padding={padding}
          {...rest}
          enabled={!loading && !disabled}
        >
          <View accessible accessibilityRole="button">
            {loading ? (
              <ActivityIndicator
                color={
                  type === "primary" || (selected && !disabled)
                    ? theme.colors.white
                    : theme.colors.primary
                }
              />
            ) : (
              <Label
                disabled={disabled}
                style={
                  type === "tab"
                    ? {
                        color: !selected || disabled ? "#505050" : "#ffffff",
                      }
                    : {
                        color:
                          type === "transparent" || type === "skeleton" || type === 'grey'
                            ? theme.colors.text
                            : type === "primary" && disabled
                            ? theme.colors.grey
                            : theme.colors.white,
                      }
                }
              >
                {label}
              </Label>
            )}
          </View>
        </Container>
      </View>
    </GestureHandlerRootView>
  );
};

export default ProButton;
