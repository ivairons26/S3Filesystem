import { EntityType } from "../utils/entitity.util";

export type Tree = {
  type: EntityType;
  name: string;
  path: string;
  children: Tree[];
};

export const OBJECT_STRUCTURE = "~s3_filesystem_structure~";
