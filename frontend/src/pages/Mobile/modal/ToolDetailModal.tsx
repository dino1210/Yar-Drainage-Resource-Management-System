import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ToolDetailsModal = ({ open, onClose, tool }) => {
  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold mb-4">
            Tool Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-6">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${tool.picture}`}
            alt={tool.name}
            className="w-48 h-48 object-cover rounded-xl border shadow"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Tag/Code:</strong> {tool.tag}</p>
          <p><strong>Tools/Equipments:</strong> {tool.name}</p>
          <p><strong>Brand:</strong> {tool.brand}</p>
          <p><strong>Category:</strong> {tool.category}</p>
          <p><strong>Status:</strong> {tool.status}</p>
          <p><strong>Date of Purchase:</strong> {tool.purchase_date}</p>
          <p><strong>Warranty:</strong> {tool.warranty}</p>
          <p><strong>Remarks:</strong> {tool.remarks}</p>
          <p className="col-span-2"><strong>Description:</strong> {tool.description}</p>
          <p className="col-span-2"><strong>Attachment:</strong> {tool.attachment || "None"}</p>
        </div>

        <div className="mt-6">
          <h4 className="text-base font-semibold mb-2">History</h4>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Action</th>
                  <th className="px-4 py-2 border">Performed By</th>
                </tr>
              </thead>
              <tbody>
                {tool.history && tool.history.length > 0 ? (
                  tool.history.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border">{entry.date}</td>
                      <td className="px-4 py-2 border">{entry.action}</td>
                      <td className="px-4 py-2 border">{entry.user}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 border text-center text-gray-400">
                      No history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDetailsModal;
