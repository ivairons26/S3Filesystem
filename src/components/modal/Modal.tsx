import React from "react";
import "./Modal.css";
import xMark from "../../assets/xmark.svg";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string, content: string) => void;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState("");
  const [inputContent, setInputContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue, inputContent);
    setInputValue("");
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.includes("/") || newValue.includes(".")) {
      setError("Characters are not allowed: '.' and '/'");
    } else {
      setError(null);
      setInputValue(newValue);
    }
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
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Enter content"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="primary" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
