// components/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    title: string; // Added title prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, title }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-[#111111] rounded-lg p-6 shadow-md w-96 text-center transition-transform transform-gpu scale-100 hover:scale-105">
                <h2 className="text-xl font-bold text-white mb-3">{title}</h2> {/* Dynamic title */}
                <p className="mt-2 text-gray-200 text-sm leading-relaxed">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200 text-sm font-medium shadow-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
