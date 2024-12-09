import AWS from "aws-sdk";
import { Config } from "../models/config.model";
import { CONNECTION_STRING_STORAGE_KEY } from "../contexts/ConfigProvider";

class S3Provider {
  private static instance: AWS.S3;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static setInstance(config: Config): void {
    if (!S3Provider.instance) {
      S3Provider.instance = new AWS.S3({
        accessKeyId: config.options.accessKeyId,
        secretAccessKey: config.options.secretAccessKey,
        region: config.options.region,
      });
    }
  }

  public static getInstance(): AWS.S3 {
    if (!S3Provider.instance) {
      const hasConfig = localStorage.getItem(CONNECTION_STRING_STORAGE_KEY);
      if (hasConfig) {
        const configObj = JSON.parse(hasConfig);
        S3Provider.setInstance(configObj);
      }
    }

    return S3Provider.instance;
  }
}

export default S3Provider;
