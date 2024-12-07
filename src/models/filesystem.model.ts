import { EntityType } from "../utils/entitity.util";

// TODO remove
export type Tree = {
  [key: string]: Tree | EntityType;
  type: EntityType;
};

export const OBJECT_STRUCTURE = "~s3_filesystem_structure~";
