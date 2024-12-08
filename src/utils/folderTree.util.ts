import { Tree } from "../models/filesystem.model";

export function buildEmptyRootFolder(): Tree {
  return {
    root: {
      type: "folder",
      name: "",
      path: "",
      children: {
        // dir_1: {
        //   type: "folder",
        //   name: "dir_1",
        //   path: "dir_1/",
        //   children: {
        //     dir_2: {
        //       type: "folder",
        //       name: "dir_2",
        //       path: "dir_1/dir_2/",
        //       children: {},
        //     },
        //   },
        // },
      },
    },
  };
}
