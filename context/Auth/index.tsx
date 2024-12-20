import React, {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  PropsWithChildren,
} from "react";

export interface StateContextType {
  isLogged: boolean;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<StateContextType>({
  isLogged: false,
  setIsLogged: () => {},
});

const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isLogged, setIsLogged] = useState<StateContextType["isLogged"]>(false);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
