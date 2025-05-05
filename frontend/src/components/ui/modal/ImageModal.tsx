// ImageModal.tsx
import React from 'react';

type ImageModalProps = {
  imageUrl: string;
  onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt="Full Size"
          className="w-[250px] h-[250px] object-cover rounded-lg"
        />
        {/* Close Button */}
        <button
          className="absolute top-0 right-0 bg-white bg-opacity-20 text-black p-2 rounded-full hover:bg-gray-300"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
