import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { theme } from "../../utils";

export const Container = styled(RectButton)`
  padding: ${(props: any) =>
    props.padding
      ? props.padding
      : props.type === "tab" || props.selected
      ? "10px 0"
      : props.type !== "skeleton"
      ? "19px 0"
      : 0};
  background-color: ${(props: any) =>
    (props.type === "primary" || props.selected) && props.enabled
      ? theme.colors.primary
      : props.type === "transparent"
      ? theme.colors.white
      : props.type === "danger"
      ? theme.colors.danger :
      props.type === "grey" ?
      theme.colors.grey2
      : "transparent"};
  align-items: center;
`;
export const Label = styled.Text`
  font-size: 16px;
`;
