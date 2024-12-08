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

interface Props {
  data: Tree;
  currentWorkingDirectory: string;
  setCurrentWorkingDirectory: React.Dispatch<React.SetStateAction<string>>;
  setFileData: React.Dispatch<React.SetStateAction<Tree | undefined>>;
}

const getOneLevelNestedItems = (data: ObjectList, root: string) => {
  return data
    .filter(({ Key }) => Key?.includes(root))
    .filter(({ Key }) => {
      let relativePath = Key?.slice(root.length) || ""; // Remove "new/" prefix
      if (relativePath[relativePath.length - 1] === "/") {
        relativePath = relativePath.slice(0, -1);
      }

      return (
        relativePath && !relativePath.includes("/") // Ensure it doesn't contain more than one `/` after root
      );
    });
};

const MainView: FC<Props> = ({
  data,
  currentWorkingDirectory,
  setCurrentWorkingDirectory,
  setFileData,
}) => {
  const configContext = useConfigContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oneLevelItems, setOneLevelItems] = useState<ObjectList>();
  const [modalTitle, setModalTitle] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("file");
  const s3Service = useS3Service();

  useEffect(() => {
    console.log("change");
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
    }
  }, [currentWorkingDirectory]);

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

  const isDisabled = currentWorkingDirectory ? false : true;

  return (
    <>
      <nav className="top-navigation">
        <span>{currentWorkingDirectory}</span>
        <button
          onClick={() => handleOpenModal("folder")}
          title="Add new folder"
          className="icon-button"
        >
          <img src={addFolder} alt="" />
        </button>
        <button
          disabled={isDisabled}
          onClick={() => handleOpenModal("file")}
          title="Create new file"
          className="icon-button"
        >
          <img src={newFile} alt="" />
        </button>
      </nav>
      <Modal
        title={modalTitle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <ul>
        {oneLevelItems &&
          oneLevelItems.map((item, index) => <li key={index}>{item.Key}</li>)}
      </ul>
    </>
  );
};

export default MainView;
