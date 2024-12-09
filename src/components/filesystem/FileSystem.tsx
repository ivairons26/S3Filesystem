import { useEffect, useState } from "react";
import { useConfigContext } from "../../contexts/config.context";
import MainView from "../main-view/MainView";
import { useS3Service } from "../../contexts/S3ServiceProvider";
import { buildEmptyRootFolder } from "../../utils/folderTree.util";
import "./FileSystem.css";
import { FolderTree } from "../folder-tree/FolderTree";
import { Tree } from "../../models/filesystem.model";

export default function FileSystemComponent() {
  const configContext = useConfigContext();
  const [fileData, setFileData] = useState<Tree>();
  const [currentWorkingDirectory, setCurrentWorkingDirectory] =
    useState<string>("");
  const s3Service = useS3Service();

  useEffect(() => {
    if (configContext.config) {
      s3Service
        .getStructureObject(configContext.config.bucketName)
        .then((data) => {
          setFileData(data);
        })
        .catch((error: Error) => {
          if (error.message === "The specified key does not exist.") {
            setFileData(buildEmptyRootFolder());
          }
        });
    }
  }, []);

  return (
    <>
      {fileData?.root.children && (
        <div className="viewport">
          <div className="navigation">
            <FolderTree
              setCurrentWorkingDirectory={setCurrentWorkingDirectory}
              currentWorkingDirectory={currentWorkingDirectory}
              data={fileData["root"].children}
            ></FolderTree>
          </div>
          <MainView
            setCurrentWorkingDirectory={setCurrentWorkingDirectory}
            currentWorkingDirectory={currentWorkingDirectory}
            data={fileData}
            setFileData={setFileData}
          ></MainView>
        </div>
      )}
    </>
  );
}
