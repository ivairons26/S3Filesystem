import { OBJECT_STRUCTURE } from "../models/filesystem.model";
import S3Provider from "../providers/s3.provider";

class S3Service {
  public listObjects = async (bucketName: string) => {
    try {
      const params = {
        Bucket: bucketName,
        // Prefix: "dir_1/"  every object that starts with dir_1
      };

      return await S3Provider.getInstance().listObjectsV2(params).promise();
    } catch (error) {
      console.error("Error listing objects:", error);
    }
  };

  public getObject = async (bucketName: string, objectName: string) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: objectName,
      };

      //   console.log(dir.Body.toString("utf-8"));
      return await S3Provider.getInstance().getObject(params).promise();
    } catch (error) {
      console.error("Error getting object", error);
    }
  };

  public getStructureObject = async (bucketName: string) => {
    const params = {
      Bucket: bucketName,
      Key: OBJECT_STRUCTURE,
    };

    return JSON.parse(
      (
        await S3Provider.getInstance().getObject(params).promise()
      ).Body.toString("utf-8")
    );
  };

  public uploadObject = async (
    bucketName: string,
    key: string,
    body: string
  ) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key, // File name to be saved in S3
        Body: body,
        ContentType: "text/plain", // Optional, helps in setting correct MIME type
      };

      return await S3Provider.getInstance().upload(params).promise();
    } catch (error) {
      console.error("Error uploading object:", error);
    }
  };

  public deleteObject = async (bucketName: string, key: string) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
      };

      return await S3Provider.getInstance().deleteObject(params).promise();
    } catch (error) {
      console.error("Error uploading object:", error);
    }
  };
}

export default S3Service;
