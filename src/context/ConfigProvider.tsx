import React, { useState, ReactNode, useEffect } from "react";
import { Config } from "./config.model";
import "./ConfigProvider.css";
import { ConfigContext } from "./config.context";

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
