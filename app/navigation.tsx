import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context";
import Dashboard from "./(dashboard)/_layout";
import Login from "./(login)/_layout";
import { getData } from "@/utils";
import { checkToken } from "@/api";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const AppEntry = () => {
  const { isLogged, setIsLogged } = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getData("TKN")?.then((result) => {
        return result;
      });
      if (token) {
        checkToken().then((response) => {
          console.log(response, "response");
          setIsLogged(true);
        });
      }
    };

    fetchToken();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLogged ? (
        <>
          <Stack.Screen
            name="(dashboard)"
            component={Dashboard}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="(login)"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
