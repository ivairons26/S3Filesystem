import addFolder from "../../assets/add-folder.svg"; // TODO create a button
import newFile from "../../assets/file-plus.svg"; // TODO create a button

export default function MainView() {
  return (
    <>
      <div>MainView</div>
      <img src={addFolder} className="folder" alt="Add new folder" />
      <img src={newFile} className="file" alt="Create new file" />
    </>
  );
}
