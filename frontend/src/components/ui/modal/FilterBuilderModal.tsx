import { useState } from "react";

interface Filter {
  field: string;
  value: string;
  operator: "AND" | "OR";
}

interface FilterBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filter[]) => void;
}

const FilterBuilderModal: React.FC<FilterBuilderProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  const addFilter = () => {
    setFilters([...filters, { field: "name", value: "", operator: "AND" }]);
  };

  const updateFilter = (index: number, key: keyof Filter, value: string) => {
    const newFilters = [...filters];
    (newFilters[index] as any)[key] = value;
    setFilters(newFilters);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold">Filter Builder</h2>
        {filters.map((filter, index) => (
          <div key={index} className="flex gap-2 my-2">
            <select value={filter.field} onChange={(e) => updateFilter(index, "field", e.target.value)}>
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
            <input type="text" value={filter.value} onChange={(e) => updateFilter(index, "value", e.target.value)} />
            <select value={filter.operator} onChange={(e) => updateFilter(index, "operator", e.target.value)}>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
        ))}
        <button onClick={addFilter} className="bg-blue-500 text-white px-2 py-1">+ Add Filter</button>
        <button onClick={() => onApply(filters)} className="bg-green-500 text-white px-2 py-1 ml-2">Apply</button>
      </div>
    </div>
  ) : null;
};

export default FilterBuilderModal;
