import React from "react";
import ToolsForm from "./forms/ToolsForm";
import ConsumableForm from "./forms/ConsumablesForm";
import VehicleForm from "./forms/VehiclesForm";

type AddResourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  resourceType: string; 
};


const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
  resourceType,
}) => {

  if (!isOpen) return null;

  
    const handleOverlayCLick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
    };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOverlayCLick}
    >
      <div
        className="bg-white dark:bg-gray-800 dark:bg-opacity-95 dark:text-white p-8 rounded-xl w-auto max-w-4xl shadow-2xl relative text-sm m-5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-6 text-start">
          Add {resourceType}
        </h2>

        {resourceType ===  "Tool" && <ToolsForm onClose={onClose} onAddSuccess={onAddSuccess} />}
        {resourceType ===  "Consumable" && <ConsumableForm onClose={onClose} onAddSuccess={onAddSuccess} />}
        {resourceType ===  "Vehicle" && <VehicleForm onClose={onClose} onAddSuccess={onAddSuccess} />}
      </div>
    </div>
  );
};

export default AddResourceModal;
