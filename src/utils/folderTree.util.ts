import { ObjectList } from "aws-sdk/clients/s3";

export function buildFolderTree(objects: ObjectList) {
  const root: { [key: string]: object } = {};

  objects.forEach((object) => {
    let parts: string[];
    if (object.Key) {
      parts = object.Key.split("/").filter((p) => p !== "");
      let current = root;

      parts.forEach((part) => {
        if (!current[part]) {
          const isFile = part.substring(part.length - 4) === ".txt";

          current[part] = {
            isFile: isFile,
          };
        }

        current = current[part];
      });
    }
  });

  return root;
}
