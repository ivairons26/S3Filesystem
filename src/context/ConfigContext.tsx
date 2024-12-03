import React, { createContext, useState, ReactNode, useEffect } from "react";
import { Config } from "./config.model";

interface ConfigContextType {
  config: Config | undefined;
  writeConfig: (config: Config) => void;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(
  undefined
);

// Define a key for localStorage
const CONNECTION_STRING_STORAGE_KEY = "connectionString";

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | undefined>(undefined);

  // Load the initial state from localStorage
  useEffect(() => {
    const hasConfig = localStorage.getItem(CONNECTION_STRING_STORAGE_KEY);
    if (hasConfig) {
      setConfig(JSON.parse(hasConfig));
    }
  }, []);

  const writeConfig = (config: Config) => {
    const configModel = {
      bucketName: config.bucketName,
      options: config.options,
    };
    setConfig(configModel);

    localStorage.setItem(
      CONNECTION_STRING_STORAGE_KEY,
      JSON.stringify(configModel)
    );
  };

  return (
    <ConfigContext.Provider value={{ config, writeConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
