import { useEffect, useState } from "react";
import { useConfigContext } from "../../contexts/config.context";
import { ObjectList } from "aws-sdk/clients/s3";
import MainView from "../main-view/MainView";
import FolderTree from "../folder-tree/FolderTree";
import { useS3Service } from "../../contexts/S3ServiceProvider";
import { buildFolderTree } from "../../utils/folderTree.util";

export default function FileSystemComponent() {
  const configContext = useConfigContext();
  const [fileData, setFileData] = useState<ObjectList | undefined>([]);
  console.log(123);

  const s3Service = useS3Service();

  // Load all files on init
  useEffect(() => {
    if (configContext.config) {
      s3Service.listObjects(configContext.config.bucketName).then((data) => {
        if (data) {
          setFileData(data.Contents);
          const fileSystemTree = buildFolderTree(data.Contents || []);
          console.log("fileSystemTree", fileSystemTree);
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
