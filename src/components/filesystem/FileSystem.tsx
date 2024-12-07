import { useEffect, useState } from "react";
import { useConfigContext } from "../../contexts/config.context";
import MainView from "../main-view/MainView";
// import FolderTree from "../folder-tree/FolderTree";
import { useS3Service } from "../../contexts/S3ServiceProvider";
import { buildEmptyRootFolder } from "../../utils/folderTree.util";
import "./FileSystem.css";
import { FolderTree } from "../folder-tree/FolderTree";
const data = [
  {
    type: "folder",
    name: "public",
    path: "public/",
    children: [
      {
        type: "file",
        name: "index.html",
        path: "public/index.html",
      },
    ],
  },
  {
    type: "folder",
    name: "src",
    path: "src/",
    children: [
      {
        type: "folder",
        name: "components",
        path: "src/components",
        children: [
          {
            type: "folder",
            name: "home",
            path: "src/components/home",
            children: [],
          },
        ],
      },
      {
        type: "file",
        name: "App.js",
        path: "src/App.js",
      },
    ],
  },
];

export default function FileSystemComponent() {
  const configContext = useConfigContext();
  const [fileData, setFileData] = useState({});
  console.log(123);

  const s3Service = useS3Service();

  useEffect(() => {
    if (configContext.config) {
      // s3Service.deleteObject(
      //   configContext.config.bucketName,
      //   "~s3_filesystem_structure~"
      // );
      // s3Service.uploadObject(
      //   configContext.config.bucketName,
      //   "~s3_filesystem_structure~",
      //   JSON.stringify(buildEmptyRootFolder())
      // );
      s3Service
        .getStructureObject(configContext.config.bucketName)
        .then((data) => {
          setFileData(data);
          console.log("fileSystemTree", data);
        })
        .catch((error: Error) => {
          if (error.message === "The specified key does not exist") {
            setFileData(buildEmptyRootFolder());
          }
        });
    }
  }, []);

  return (
    <>
      {fileData?.type && (
        <div className="viewport">
          <div className="navigation">
            <FolderTree data={fileData.children}></FolderTree>
          </div>
          <MainView></MainView>
        </div>
      )}
    </>
  );
}
