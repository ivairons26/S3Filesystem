import { OBJECT_STRUCTURE, Tree } from "../models/filesystem.model";
import S3Provider from "../providers/s3.provider";

class S3Service {
  public listObjects = async (bucketName: string, prefix: string) => {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    return await S3Provider.getInstance().listObjectsV2(params).promise();
  };

  public getObject = async (bucketName: string, objectName: string) => {
    const params = {
      Bucket: bucketName,
      Key: objectName,
    };

    return (
      await S3Provider.getInstance().getObject(params).promise()
    ).Body.toString("utf-8");
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

  public setStructureObject = async (bucketName: string, body: Tree) => {
    const params = {
      Bucket: bucketName,
      Key: OBJECT_STRUCTURE,
      Body: JSON.stringify(body),
      ContentType: "text/plain",
    };

    return await S3Provider.getInstance().putObject(params).promise();
  };

  public putObject = async (bucketName: string, key: string, body: string) => {
    const params = {
      Bucket: bucketName,
      Key: key, // File name to be saved in S3
      Body: body,
      ContentType: "text/plain",
    };

    return await S3Provider.getInstance().putObject(params).promise();
  };

  public deleteObject = async (bucketName: string, key: string) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return await S3Provider.getInstance().deleteObject(params).promise();
  };

  public headBucket = async (bucketName: string) => {
    const params = {
      Bucket: bucketName,
    };
    return await S3Provider.getInstance().headBucket(params).promise();
  };
}

export default S3Service;
