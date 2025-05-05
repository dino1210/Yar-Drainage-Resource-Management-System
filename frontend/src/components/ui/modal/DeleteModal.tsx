// components/modals/DeleteModal.tsx

import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Are you sure you want to delete <strong>{itemName}</strong>?
        </p>

        <div className="mt-6 flex justify-end space-x-2">
        <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
