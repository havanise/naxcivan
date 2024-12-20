import React, {
  useState,
  createContext,
  SetStateAction,
  Dispatch,
  PropsWithChildren,
} from "react";

export interface StateContextType {
  profile: any;
  setProfile: Dispatch<SetStateAction<boolean>>;
  tenant: any;
  setTenant: Dispatch<SetStateAction<boolean>>;
  tenants: any;
  setTenants: Dispatch<SetStateAction<boolean>>;
}

const TenantContext = createContext<StateContextType>({
  profile: {},
  setProfile: () => {},
  tenant: {},
  setTenant: () => {},
  tenants: [],
  setTenants: () => {},
});

const TenantContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [profile, setProfile] = useState<StateContextType["profile"]>({});
  const [tenant, setTenant] = useState<StateContextType["tenant"]>({});
  const [tenants, setTenants] = useState<StateContextType["tenants"]>([]);

  return (
    <TenantContext.Provider
      value={{
        profile,
        setProfile,
        tenant,
        setTenant,
        tenants,
        setTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export { TenantContext, TenantContextProvider };
