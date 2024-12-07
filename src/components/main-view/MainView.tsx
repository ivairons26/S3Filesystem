import { useState } from "react";
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

export default function MainView() {
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

  const handleSubmit = (name: string, content: string) => {
    // TODO add to appropriate directory
    if (configContext.config) {
      s3Service.uploadObject(
        configContext.config.bucketName,
        name + entitySuffix[entityType],
        content
      );
    }
  };

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
}
