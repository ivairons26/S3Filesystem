import { FC, useEffect, useState } from "react";
import addFolder from "../../assets/add-folder.svg";
import newFile from "../../assets/file-plus.svg";
import Modal from "../modal/Modal";
import { useS3Service } from "../../contexts/S3ServiceProvider";
import {
  entityModalTitle,
  entitySuffix,
  EntityType,
} from "../../utils/entitity.util";
import { useConfigContext } from "../../contexts/config.context";
import { Tree } from "../../models/filesystem.model";
import { ObjectList } from "aws-sdk/clients/s3";
import {
  getOneLevelNestedItems,
  goPreviousDirectory,
  objectName,
} from "../../utils/folderTree.util";
import folder from "../../assets/folder.svg";
import file from "../../assets/file-pencil.svg";
import back from "../../assets/flip-backward.svg";
import dotsVertical from "../../assets/dots-vertical.svg";
import "./MainView.css";
import MainViewFileOpen from "./MainViewFileOpen";

interface Props {
  data: Tree;
  currentWorkingDirectory: string;
  setCurrentWorkingDirectory: React.Dispatch<React.SetStateAction<string>>;
  setFileData: React.Dispatch<React.SetStateAction<Tree | undefined>>;
}

const MainView: FC<Props> = ({
  data,
  currentWorkingDirectory,
  setCurrentWorkingDirectory,
  setFileData,
}) => {
  const configContext = useConfigContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState("");
  const [oneLevelItems, setOneLevelItems] = useState<ObjectList>();
  const [modalTitle, setModalTitle] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("file");
  const s3Service = useS3Service();

  useEffect(() => {
    if (currentWorkingDirectory && configContext.config) {
      s3Service
        .listObjects(configContext.config.bucketName, currentWorkingDirectory)
        .then((data) => {
          if (data.Contents) {
            setOneLevelItems(
              getOneLevelNestedItems(data.Contents, currentWorkingDirectory)
            );
          }
        })
        .catch((error: Error) => {
          console.error(
            `Error listing objects with prefix: ${currentWorkingDirectory}`,
            error
          );
        });
    } else {
      // get root directories only
      const objecList: ObjectList = [];
      Object.keys(data.root.children).forEach((key) =>
        objecList.push({ Key: key + "/" })
      );
      setOneLevelItems(objecList);
    }
  }, [currentWorkingDirectory, data]);

  const handleOpenModal = (entity: EntityType) => {
    setModalTitle(entityModalTitle[entity]);
    setEntityType(entity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (name: string, content: string) => {
    // update the sructure file
    const parts = currentWorkingDirectory.split("/").filter((d) => d);
    const dataCopy = structuredClone(data);
    let newData = dataCopy.root.children;

    parts.forEach((part) => {
      newData = newData[part].children;
    });

    newData[name] = {
      name: name,
      path: currentWorkingDirectory + name + entitySuffix[entityType],
      type: entityType,
      children: {},
    };

    setFileData(dataCopy);

    if (configContext.config) {
      const uploadNewFilePromise = s3Service.putObject(
        configContext.config.bucketName,
        currentWorkingDirectory + name + entitySuffix[entityType],
        content
      );

      const updateFileStructure = s3Service.setStructureObject(
        configContext.config.bucketName,
        dataCopy
      );

      await Promise.all([uploadNewFilePromise, updateFileStructure]).catch(
        (error: Error) => {
          console.error("Error uploading objects:", error);
        }
      );
    }
  };

  const handleItemDoubleClick = (item: string): void => {
    if (item.indexOf(".txt") === -1) {
      // if folder open directory
      setCurrentWorkingDirectory(item);
    } else {
      // if file open file
      setFileOpen(item);
    }
  };

  const goBack = (): void => {
    setCurrentWorkingDirectory(goPreviousDirectory(currentWorkingDirectory));
    setFileOpen("");
  };

  const deleteEntity = async (name: string) => {
    const parts = currentWorkingDirectory.split("/").filter((d) => d);
    const dataCopy = structuredClone(data);

    let newData = dataCopy.root.children;

    parts.forEach((part) => {
      newData = newData[part].children;
    });

    const nameParts = name.split("/").filter((d) => d);
    const nameLastPart = nameParts[nameParts.length - 1];

    delete newData[nameLastPart];
    setFileData(dataCopy);

    if (configContext.config) {
      const deleteEntityPromise = s3Service.deleteObject(
        configContext.config.bucketName,
        name
      );

      const updateFileStructure = s3Service.setStructureObject(
        configContext.config.bucketName,
        dataCopy
      );

      await Promise.all([deleteEntityPromise, updateFileStructure]).catch(
        (error: Error) => {
          console.error("Error deleting object:", error);
        }
      );
    }
  };

  return (
    <div className="main-view">
      {!fileOpen && (
        <>
          <nav className="top-navigation">
            <button onClick={goBack} title="Back" className="icon-button">
              <img src={back} alt="" />
            </button>

            <span className="current-directory">
              {currentWorkingDirectory
                ? objectName(currentWorkingDirectory)
                : "root"}
            </span>
            <button
              onClick={() => handleOpenModal("folder")}
              title="Add new folder"
              className="icon-button"
            >
              <img src={addFolder} alt="" />
            </button>
            <button
              disabled={!currentWorkingDirectory}
              onClick={() => handleOpenModal("file")}
              title="Create new file"
              className="icon-button"
            >
              <img src={newFile} alt="" />
            </button>
          </nav>
          <ul className="file-system">
            {oneLevelItems &&
              oneLevelItems.map((item, index) => (
                <li
                  onDoubleClick={() => handleItemDoubleClick(item.Key || "")}
                  key={index}
                  className="file-item"
                >
                  {item.Key?.indexOf(".txt") !== -1 ? (
                    <img className="icon" src={file} alt="" />
                  ) : (
                    <img className="icon" src={folder} alt="" />
                  )}

                  {objectName(item.Key || "")}
                  <div className="dropdown">
                    <button className="icon-button">
                      {" "}
                      <img src={dotsVertical} alt="" />
                    </button>
                    <div className="dropdown-content">
                      <button
                        onClick={() => deleteEntity(item.Key || "")}
                        className="dropdown-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
      {fileOpen && <MainViewFileOpen fileOpen={fileOpen} goBack={goBack} />}

      <Modal
        type={entityType}
        title={modalTitle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MainView;
