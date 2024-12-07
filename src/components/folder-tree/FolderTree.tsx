import { useState } from "react";
import "./FolderTree.css";
import arrowDown from "../../assets/arrow-down.svg";
import arrowRight from "../../assets/arrow-right.svg";
import { Tree } from "../../models/filesystem.model";

export const FolderTree = ({ data }: { data: Tree[] }) => {
  const [showNested, setShowNested] = useState<{ [key: string]: boolean }>({});

  const toggleNested = (name: string) => {
    setShowNested({ ...showNested, [name]: !showNested[name] });
  };

  return (
    <div className="left-navigation">
      {data.map((parent) => {
        return (
          <div key={parent.path}>
            {/* rendering folders */}
            {parent.type === "folder" && (
              <button onClick={() => toggleNested(parent.path)}>
                {parent.name}
                {parent.children.length > 0 && (
                  <span>
                    {showNested[parent.path] ? (
                      <img src={arrowDown} alt="" />
                    ) : (
                      <img src={arrowRight} alt="" />
                    )}
                  </span>
                )}
              </button>
            )}
            {/* TODO delete this since requirement is not to show files rendering files */}
            {parent.type === "file" && <span>{parent.name}</span>}
            <div
              style={{ display: showNested[parent.path] ? "block" : "none" }}
            >
              {parent.children && <FolderTree data={parent.children} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
