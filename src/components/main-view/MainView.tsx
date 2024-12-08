import { FC, useState } from "react";
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
  const [modalTitle, setModalTitle] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("file");
  const s3Service = useS3Service();

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

    try {
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

        await Promise.all([uploadNewFilePromise, updateFileStructure]);
      }
    } catch (error: Error) {
      console.error("Error uploading objects:", error);
    }
  };

  const isDisabled = currentWorkingDirectory ? false : true;

  return (
    <>
      <nav className="top-navigation">
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
    </>
  );
};

export default MainView;
