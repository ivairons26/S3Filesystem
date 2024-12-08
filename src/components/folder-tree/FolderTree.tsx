import { useState } from "react";
import "./FolderTree.css";
import arrowDown from "../../assets/arrow-down.svg";
import arrowRight from "../../assets/arrow-right.svg";
import { Tree } from "../../models/filesystem.model";

export const FolderTree = ({
  data,
  currentWorkingDirectory,
  setCurrentWorkingDirectory,
}: {
  data: Tree;
  currentWorkingDirectory: string;
  setCurrentWorkingDirectory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showNested, setShowNested] = useState<{ [key: string]: boolean }>({});

  const toggleNested = (name: string) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    clickTimeout = setTimeout(() => {
      setShowNested({ ...showNested, [name]: !showNested[name] });
    }, 300); // Delay to check for double-click
  };

  const handleDoubleClick = (name: string) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout); // Clear the single-click timeout
    }

    setCurrentWorkingDirectory(name);
  };

  let clickTimeout: number | null = null;

  const hasSubFolder = (children: Tree) => {
    // Iterate over the values of the children object
    return Object.values(children).some((child) => child.type === "folder");
  };

  return (
    <div className="left-navigation">
      {Object.keys(data).map((key) => {
        const dirData = data[key];

        return (
          <div key={dirData.path}>
            {/* rendering folders */}
            {dirData.type === "folder" && (
              <button
                className={
                  dirData.path === currentWorkingDirectory ? "active" : ""
                }
                onClick={() => toggleNested(dirData.path)}
                onDoubleClick={() => handleDoubleClick(dirData.path)}
              >
                {dirData.name}
                {hasSubFolder(dirData.children) && (
                  <span>
                    {showNested[dirData.path] ? (
                      <img src={arrowDown} alt="" />
                    ) : (
                      <img src={arrowRight} alt="" />
                    )}
                  </span>
                )}
              </button>
            )}
            {/* TODO delete this since requirement is not to show files rendering files */}
            {/* {dirData.type === "file" && <span>{dirData.name}</span>} */}
            <div
              style={{ display: showNested[dirData.path] ? "block" : "none" }}
            >
              {dirData.children && (
                <FolderTree
                  currentWorkingDirectory={currentWorkingDirectory}
                  setCurrentWorkingDirectory={setCurrentWorkingDirectory}
                  data={dirData.children}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
