import { FC, useEffect, useState } from "react";
import { objectName } from "../../utils/folderTree.util";
import { useS3Service } from "../../contexts/S3ServiceProvider";
import { useConfigContext } from "../../contexts/config.context";
import back from "../../assets/flip-backward.svg";

interface Props {
  fileOpen: string;
  goBack: () => void;
}

const MainViewFileOpen: FC<Props> = ({ fileOpen, goBack }) => {
  const configContext = useConfigContext();
  const [fileContent, setFileContent] = useState("");

  const s3Service = useS3Service();

  useEffect(() => {
    if (configContext.config) {
      s3Service
        .getObject(configContext.config.bucketName, fileOpen)
        .then((data) => setFileContent(data))
        .catch((error: Error) => {
          console.error("Error getting object", error);
        });
    }
  }, []);
  return (
    <>
      {fileOpen && (
        <>
          <nav className="top-navigation">
            <button onClick={goBack} title="Back" className="icon-button">
              <img src={back} alt="" />
            </button>
            <span className="current-directory">{objectName(fileOpen)}</span>
          </nav>
          <p>{fileContent}</p>
        </>
      )}
    </>
  );
};

export default MainViewFileOpen;
