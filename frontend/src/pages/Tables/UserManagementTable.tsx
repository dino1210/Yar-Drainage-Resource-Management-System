import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  profile_picture: string;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dataLimit, setDataLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", status: "Active", password: "" });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(" Failed to fetch users:", err));
  };

  const handleDelete = (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    axios.delete(`http://localhost:5000/api/users/${userId}`)
      .then(() => fetchUsers())
      .catch((err) => console.error(" Failed to delete user:", err));
  };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.role || !form.password) {
      return alert("Please fill in all fields.");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/users", form);
      if (res.status === 201 || res.status === 200) {
        setShowModal(false);
        fetchUsers();
        setForm({ name: "", email: "", role: "", status: "Active", password: "" });
      } else {
        alert("Failed to add user. Please try again.");
      }
    } catch (err: any) {
      console.error(" Failed to add user:", err);
      alert(err.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ""
    });
    setShowEditModal(true);
  };

  const submitEdit = () => {
    if (!editId || !form.name || !form.email || !form.role) {
      return alert("Please fill in all fields.");
    }
    axios.put(`http://localhost:5000/api/users/${editId}`, form)
      .then(() => {
        setShowEditModal(false);
        fetchUsers();
        setEditId(null);
        setForm({ name: "", email: "", role: "", status: "Active", password: "" });
      })
      .catch((err) => {
        console.error(" Failed to update user:", err);
        alert("Failed to update user. Please try again.");
      });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / dataLimit);
  const currentUsers = filteredUsers.slice((currentPage - 1) * dataLimit, currentPage * dataLimit);

  const getBadgeColor = (status: string): "success" | "error" => {
    return status === "Active" ? "success" : "error";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.1] dark:bg-gray-900">
      <div className="max-w-full overflow-x-auto">
        {/* Filter Controls */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-5 py-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Staff">Staff</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-xs p-2 rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add User
          </button>
        </div>


        <Table>
          <TableHeader className="border-b text-sm border-gray-100 dark:border-gray-700">
            <TableRow>
              {["Name", "Email", "Role", "Status", "Actions"].map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-semibold text-theme-xs text-gray-500 dark:text-gray-400 text-start"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start text-xs font-medium text-gray-800 dark:text-white">{user.name}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-start">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-start">{user.role}</TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-start">
                    <Badge size="sm" color={getBadgeColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-start">
                    <button onClick={() => handleEdit(user)} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="ml-2 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="px-5 py-3 flex justify-between items-center">
          <select
            value={dataLimit}
            onChange={(e) => setDataLimit(Number(e.target.value))}
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value={10}>10 Items</option>
            <option value={20}>20 Items</option>
            <option value={50}>50 Items</option>
          </select>

          <div className="flex items-center space-x-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="w-8 h-8 text-xs font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800">&lt;</button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 text-xs font-medium rounded-full ${currentPage === index + 1 ? "bg-blue-700 text-white" : "bg-white text-blue-700"}`}
              >
                {index + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="w-8 h-8 text-xs font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800">&gt;</button>
          </div>
        </div>

        {/* Add Modal */}
     {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-5 rounded w-96">
      <h2 className="text-lg font-semibold mb-3">Add User</h2>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className="w-full mb-2 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        className="w-full mb-2 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <input
        type="text"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        placeholder="Role"
        className="w-full mb-2 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="w-full mb-4 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input
        type="password"
        value={form.password || ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
        className="w-full mb-4 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <div className="flex justify-end gap-2">
        <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded">Cancel</button>
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Save</button>
      </div>
    </div>
  </div>
)}


        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-5 rounded w-96">
              <h2 className="text-lg font-semibold mb-3">Edit User</h2>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full mb-2 p-2 border" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full mb-2 p-2 border" />
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="w-full mb-2 p-2 border" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full mb-4 p-2 border">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={submitEdit} className="px-4 py-2 bg-green-600 text-white rounded">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
