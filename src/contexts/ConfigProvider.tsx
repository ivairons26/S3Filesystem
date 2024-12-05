import React, { useState, ReactNode, useEffect } from "react";
import { Config } from "../models/config.model";
import { ConfigContext } from "./config.context";
import S3Provider from "../providers/s3.provider";

// Define a key for localStorage
export const CONNECTION_STRING_STORAGE_KEY = "connectionString";

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | undefined>(undefined);

  // Load the initial state from localStorage
  useEffect(() => {
    const hasConfig = localStorage.getItem(CONNECTION_STRING_STORAGE_KEY);
    if (hasConfig) {
      const configObj = JSON.parse(hasConfig);
      setConfig(configObj);
      S3Provider.setInstance(configObj);
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
