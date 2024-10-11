import { Modal } from "@mui/material";
import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: string;
  height: string;
}

const CustomModal = ({ isOpen, onClose, children, height = "530px", width = "408px" }: CustomModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableAutoFocus
    >
      <div className="flex justify-center items-center h-full">
        <div className={`w-[${width}] h-[${height}] p-5 bg-white relative`}>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
