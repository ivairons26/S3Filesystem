import { useState, FC, FormEvent, ChangeEvent } from "react";
import "./Modal.css";
import xMark from "../../assets/xmark.svg";
import { EntityType } from "../../utils/entitity.util";

interface ModalProps {
  type: EntityType;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string, content: string) => void;
}

const Modal: FC<ModalProps> = ({ type, title, isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [inputContent, setInputContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue, inputContent);
    setInputValue("");
    onClose();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="icon-button">
          <img src={xMark} alt="" />
        </button>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
          {type === "file" && (
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Enter content"
            />
          )}
          <button className="primary" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
