import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";

// Define Consumable structure
interface Categories {
  category_id: number;
  category_type: string;
  category_name: string;
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dataLimit, setDataLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category_type: "",
    category_name: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Categories | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

// Filtered data based on search and status
const filteredCategories = categories.filter((item) => {
  const matchesSearch =
    (item.category_type?.toLowerCase().includes(search.toLowerCase()) || 
    item.category_name?.toLowerCase().includes(search.toLowerCase())) ?? false;

  const matchesStatus = statusFilter
    ? item.category_type === statusFilter
    : true;

  return matchesSearch && matchesStatus;
});


  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / dataLimit);
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  
  const handleEdit = (category: Categories) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleDelete = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${categoryToDelete}`, {
          method: "DELETE",
        });
        setCategories((prev) => prev.filter((category) => category.category_id !== categoryToDelete));
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error("Error deleting category", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (categoryToEdit) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${categoryToEdit.category_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryToEdit),
        });
        if (res.ok) {
          const updatedCategory = await res.json();
          setCategories((prev) =>
            prev.map((category) =>
              category.category_id === updatedCategory.category_id ? updatedCategory : category
            )
          );
          setShowEditModal(false);
          setCategoryToEdit(null);
        }
      } catch (err) {
        console.error("Error saving edited category", err);
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border w-[62rem] border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {/* Search and Filters */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-5 py-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by category name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-xs p-2 rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Category Type</option>
            <option value="Tools And Equipments">Tools And Equipments</option>
            <option value="Consumables">Consumables</option>
            <option value="Vehicles">Vehicles</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-2 text-xs rounded-md bg-white dark:bg-blue-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            New
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="border-b text-sm border-gray-100 dark:border-gray-700">
            <TableRow>
              {["Category Type", "Category Name", "Actions"].map(
                (header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-10 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-50 whitespace-nowrap"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentCategories.length > 0 ? (
              currentCategories.map((item) => (
                <TableRow key={item.category_id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-white/70">
                      {item.category_type}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-gray-400">
                      {item.category_name}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex items-center justify-center space-x-2 w-full h-full">
                      <button
                        onClick={() => handleEdit(item.category_id)}
                        className="px-3 py-1 text-xs font-medium text-blue-900 bg-blue-600 bg-opacity-70 rounded-lg hover:bg-blue-900"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-7" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.category_id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-800 rounded-lg hover:bg-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-7" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-start text-red-500 dark:text-red-400">
                  Error Fetching Categories
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Data Limit Selector */}
        <div className="px-5 py-3 flex space-x-5 items-center">
          <div>
            <select
              value={dataLimit}
              onChange={(e) => setDataLimit(Number(e.target.value))}
              className="border p-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800"
            >
              <option value={10}>10 Items</option>
              <option value={20}>20 Items</option>
              <option value={50}>50 Items</option>
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-900"
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 text-xs font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-white text-blue-700"
                } border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800`}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-900"
            >
              &gt;
            </button>
          </div>

          
        {/* Edit Modal */}
        {showEditModal && categoryToEdit && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Edit Category</h2>
              <div className="space-y-3">
                <select
                  name="category_type"
                  value={categoryToEdit.category_type}
                  onChange={(e) =>
                    setCategoryToEdit((prev) => ({
                      ...prev,
                      category_type: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <option value="Tools And Equipments">Tools And Equipments</option>
                  <option value="Consumables">Consumables</option>
                  <option value="Vehicles">Vehicles</option>
                </select>

                <input
                  name="category_name"
                  type="text"
                  placeholder="Category Name"
                  value={categoryToEdit.category_name}
                  onChange={(e) =>
                    setCategoryToEdit((prev) => ({
                      ...prev,
                      category_name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        
        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Are you sure you want to delete this category?</h2>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                  Add New Category
                </h2>

                <div className="space-y-3">
                  <select
                    name="category_type"
                    value={newCategory.category_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select Category Type</option>
                    <option value="Tools And Equipments">
                      Tools And Equipments
                    </option>
                    <option value="Consumables">Consumables</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>

                  <input
                    name="category_name"
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.category_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${import.meta.env.VITE_API_BASE_URL}/api/categories`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(newCategory),
                          }
                        );
                        if (res.ok) {
                          setShowAddModal(false);
                          setNewCategory({
                            category_type: "",
                            category_name: "",
                          });
                          // Refresh categories
                          const updated = await res.json();
                          setCategories((prev) => [...prev, updated]);
                        } else {
                          console.error("Failed to add category");
                        }
                      } catch (err) {
                        console.error("Error adding category", err);
                      }
                    }}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
