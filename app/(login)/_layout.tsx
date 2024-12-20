import React, { useContext, useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";
import { ProText, ProButton, ProInput } from "@/components";
import {
  useApi,
  checkEmailisValid,
  checkLengthisValid,
  checkSpaceinValue,
  checkStartWithSpace,
} from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import { AuthContext } from "@/context";
import { login, checkToken } from "@/api";
import { saveToken } from "@/utils";

import { Container, Header, Footer, Image, ForgotContainer } from "./styles";

const Login = ({}) => {
  const { isLogged, setIsLogged } = useContext<any>(AuthContext);
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(true);

  const { isLoading, run } = useApi({
    deferFn: login,
    onResolve: (data) => {
      saveToken(data);
      setSaved(true);
    },
    onReject: (error) => {
      console.log(error, "rejected");
    },
  });

  useEffect(() => {
    if (saved) {
      checkToken().then((response) => {
        setIsLogged(true);
      });
    }
  }, [saved]);

  const [{ email, password, error }, setState] = React.useState({
    email: "",
    password: "",
    error: null,
  });

  const onChangeInputs = (name: string, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (error === name) {
      setState((prevState) => ({
        ...prevState,
        error: null,
      }));
    }
  };

  const handleSubmit = React.useCallback(() => {
    if (email === "" || email === null) {
      setState((prevState): any => ({
        ...prevState,
        error: "email",
      }));
      Toast.show({
        type: "error",
        text2: "Email ünvan boş ola bilməz!",
        topOffset: 50,
      });
    } else if (
      !checkEmailisValid(email) ||
      checkSpaceinValue(email) ||
      checkStartWithSpace(email)
    ) {
      setState((prevState): any => ({
        ...prevState,
        error: "email",
      }));
      Toast.show({
        type: "error",
        text2: "Email ünvan düz formatda daxil edilməyib!",
        topOffset: 50,
      });
    } else if (password === "" || password === null) {
      setState((prevState): any => ({
        ...prevState,
        error: "password",
      }));
      Toast.show({
        type: "error",
        text2: "Şifrə boş ola bilməz!",
        topOffset: 50,
      });
    } else if (
      !checkLengthisValid(password) ||
      checkSpaceinValue(password) ||
      checkStartWithSpace(password)
    ) {
      setState((prevState): any => ({
        ...prevState,
        error: "password",
      }));
      Toast.show({
        type: "error",
        text2: "Şifrə düz formatda daxil edilməyib!",
        topOffset: 50,
      });
    } else {
      run({ email, password, deviceToken: "" });
    }
  }, [email, password, error]);

  return (
    <Container>
      <Header>
        <Animatable.View animation="fadeInUp">
          <Image source={require("@/assets/images/logo.png")} />
        </Animatable.View>
        <ProText variant="heading">NMR Təcili Tibbi Yardım Xidməti</ProText>
      </Header>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Footer animation="fadeInUp">
          <ProInput
            placeholder="Email ünvanınızı daxil edin"
            icon="email"
            keyboardType="email-address"
            value={email}
            onChange={({ nativeEvent: { text } }: any) =>
              onChangeInputs("email", text)
            }
            error={error === "email"}
          />
          <ProInput
            placeholder="Şifrəni daxil edin"
            icon="password"
            secure={show}
            value={password}
            onChange={({ nativeEvent: { text } }: any) =>
              onChangeInputs("password", text)
            }
            error={error === "password"}
            endIcon={
              <Pressable
                // style={[styles.button, styles.buttonClose]}
                onPress={() => setShow(!show)}
              >
                {show ? (
                  <Ionicons name="eye-sharp" size={22} color="#767676" />
                ) : (
                  <Ionicons name="eye-off-sharp" size={22} color="#767676" />
                )}
              </Pressable>
            }
          />
          <ForgotContainer>
            <ProButton label="Şifrəni unutmusan?" type="skeleton" />
          </ForgotContainer>
          <ForgotContainer>
            <ProButton
              label="Daxil ol"
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
            />
          </ForgotContainer>
          <ForgotContainer>
            <ProButton label="Qeydiyyatdan keç" type="transparent" />
          </ForgotContainer>
        </Footer>
      </View>
    </Container>
  );
};

export default Login;