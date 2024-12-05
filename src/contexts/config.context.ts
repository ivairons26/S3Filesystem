import { createContext, useContext } from "react";
import { Config } from "../models/config.model";

interface ConfigContextType {
  config: Config | undefined;
  writeConfig: (config: Config) => void;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
);

export function useConfigContext() {
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error("useConfigContext must be used with a ConfigContext");
  }

  return config;
}
