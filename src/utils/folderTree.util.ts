import { ObjectList } from "aws-sdk/clients/s3";
import { Tree } from "../models/filesystem.model";

export function buildEmptyRootFolder(): Tree {
  return {
    root: {
      type: "folder",
      name: "",
      path: "",
      children: {},
    },
  };
}

export const getOneLevelNestedItems = (
  data: ObjectList,
  root: string
): ObjectList => {
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

export const objectName = (name: string): string => {
  const parts = name.split("/").filter((name) => name);

  return parts[parts.length - 1];
};

export const goPreviousDirectory = (name: string): string => {
  const parts = name.split("/").filter((name) => name);
  if (parts.length <= 1) {
    return "";
  }

  return parts[parts.length - 2] + "/";
};
