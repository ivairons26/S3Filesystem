import { useContext } from "react";
import { ConfigContext } from "./ConfigContext";

export function useConfigContext() {
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error("useConfigContext must be used with a ConfigContext");
  }

  return config;
}
