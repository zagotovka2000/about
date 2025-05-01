import React from "react";
import "./modalWindow.css";

const ModalWindow = ({ modalWindowActive, setModalWindowActive, modalText }) => {
  return (
    <div
      className={modalWindowActive ? "modalWindow active" : "modalWindow"}
      onClick={() => setModalWindowActive(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-container">
          <div className="abzac">{modalText}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
