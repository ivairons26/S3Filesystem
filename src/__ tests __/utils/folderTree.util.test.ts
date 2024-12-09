import "@testing-library/jest-dom";
import {
  getOneLevelNestedItems,
  goPreviousDirectory,
  objectName,
} from "../../utils/folderTree.util";

describe("function objectName", () => {
  test("should get only the last part of src/new/text.txt", () => {
    expect(objectName("src/new/text.txt")).toBe("text.txt");
  });

  test("should get only the last part without trailing / for folders", () => {
    expect(objectName("src/new/")).toBe("new");
  });
});

describe("function goPreviousDirectory", () => {
  test("should go back to new folder from text file src/new/text.txt", () => {
    expect(goPreviousDirectory("src/new/text.txt")).toBe("new/");
  });
  test("should go back to src folder from folder src/new/", () => {
    expect(goPreviousDirectory("src/new/")).toBe("src/");
  });
  test("should go back to root directory (empty) from folder src/", () => {
    expect(goPreviousDirectory("src/")).toBe("");
  });
});

describe("function getOneLevelNestedItems", () => {
  test("should return only direct children files or folders to the directory", () => {
    const directChildren = getOneLevelNestedItems(
      [
        { Key: "src/" },
        { Key: "src/new/" },
        { Key: "src/test.txt" },
        { Key: "src/new/nested/" },
        { Key: "src/new/nested/test.txt" },
      ],
      "src/"
    );

    directChildren.forEach((child) => {
      expect(["src/new/", "src/test.txt"]).toContain(child.Key);
    });
  });
});
