import { useEffect, useState } from "react";
import { useConfigContext } from "../../contexts/config.context";
import { ObjectList } from "aws-sdk/clients/s3";
import MainView from "../main-view/MainView";
import FolderTree from "../folder-tree/FolderTree";
import { useS3Service } from "../../contexts/S3ServiceProvider";

export default function FileSystemComponent() {
  const configContext = useConfigContext();
  const [fileData, setFileData] = useState<ObjectList | undefined>([]);
  console.log(123);

  const s3Service = useS3Service();

  // const uploadFile = async () => {
  //   try {
  //     const params = {
  //       Bucket: "llib-236960695173-20",
  //       Key: "prefix/subprefix/", // File name to be saved in S3
  //       Body: "weee",
  //       ContentType: "text/plain", // Optional, helps in setting correct MIME type
  //     };

  //     const result = await S3Provider.getInstance().upload(params).promise();
  //     console.log(`File uploaded successfully. S3 URL: ${result.Location}`);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  // uploadFile();

  // const uploadFile = async () => {
  //   try {
  //     const filePath = 'object.txt';
  //     const fileContent = "Weeee";

  //     const params = {
  //       Bucket: 'your-bucket-name',
  //       Key: 'object.txt', // File name to be saved in S3
  //       Body: fileContent,
  //       ContentType: 'text/plain', // Optional, helps in setting correct MIME type
  //     };

  //     const result = await s3.upload(params).promise();
  //     console.log(`File uploaded successfully. S3 URL: ${result.Location}`);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  // Load all files on init
  useEffect(() => {
    if (configContext.config) {
      s3Service.listObjects(configContext.config.bucketName).then((data) => {
        if (data) {
          setFileData(data.Contents);
        }
      });
    }
  }, []);

  return (
    <>
      {(!fileData || fileData.length === 0) && (
        <div>It looks lonely here. Let's add some files or folders.</div>
      )}
      {fileData && fileData.length > 0 && (
        <div>
          <FolderTree></FolderTree>
          <MainView></MainView>
        </div>
      )}
    </>
  );
}
