import React, { useState } from "react";
import { ProIcon } from "@/components";
import { Container, Input, IconContainer, EndIconContainer } from "./styles";

interface Props {
  placeholder: string;
  icon: string;
  onChange: any;
  value: any;
  rest?: any;
  error: any;
  secure?: boolean;
  endIcon?: any;
  keyboardType?: string;
}

const ProInput = (props: Props) => {
  const {
    secure = false,
    placeholder,
    onChange,
    value = null,
    icon = "",
    error,
    rest,
    endIcon = null,
  } = props;

  const [focused, setFocused] = useState(false);

  return (
    <Container>
      {icon && icon !== "" ? (
        <IconContainer>
          <ProIcon name={icon} />
        </IconContainer>
      ) : null}
      <Input
        placeholder={placeholder}
        onChange={onChange}
        secureTextEntry={secure}
        value={value}
        underlineColorAndroid="transparent"
        style={{
          borderWidth: 1,
          borderColor: error ? "#FF5842" : focused ? "#37B874" : "#D0DBEA",
        }}
        onPressIn={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        error={error}
        {...rest}
      />
      {endIcon ? <EndIconContainer>{endIcon}</EndIconContainer> : null}
    </Container>
  );
};

export default ProInput;
