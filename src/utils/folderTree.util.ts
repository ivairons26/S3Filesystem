import { Tree } from "../models/filesystem.model";

export function buildEmptyRootFolder(): Tree {
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
            path: "dir_1/dir_2/",
            children: [],
          },
        ],
      },
    ],
  };
}
