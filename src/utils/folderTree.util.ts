// import { ObjectList } from "aws-sdk/clients/s3";
// import { Tree } from "../models/filesystem.model";

// type TestTree = {
//   name: string;
//   filepath: string;
//   type: "folder" | "file";
//   items?: TestTree[];
// };

// const test: TestTree = {
//   name: "dir_1",
//   filepath: "dir_1/",
//   type: "folder",
//   items: [
//     {
//       name: "object1.txt",
//       filepath: "dir_1/object1.txt",
//       type: "file",
//     },
//     {
//       name: "dir_2",
//       filepath: "dir_1/dir_2/",
//       type: "folder",
//       items: [],
//     },
//   ],
// };

// export function buildFolderTree(objects: ObjectList) {
//   const root: Tree = {
//     type: "folder",
//   };

//   objects.forEach((object) => {
//     let parts: string[];
//     if (object.Key) {
//       parts = object.Key.split("/").filter((p) => p !== "");
//       let current = root;

//       parts.forEach((part) => {
//         if (!current[part]) {
//           const type =
//             part.substring(part.length - 4) === ".txt" ? "file" : "folder";

//           current[part] = {
//             type: type,
//           };
//         }

//         if (typeof current[part] !== "string") {
//           current = current[part];
//         }
//       });
//     }
//   });

//   return root;
// }

export function buildEmptyRootFolder() {
  return {
    type: "folder",
    name: "",
    path: "",
    children: [
      {
        type: "folder",
        name: "dir_1",
        path: "dir_1/",
        children: [
          {
            type: "folder",
            name: "dir_2",
            path: "dir_2/",
            children: [],
          },
        ],
      },
    ],
  };
}
