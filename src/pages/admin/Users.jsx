import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import AddUserModal from "../../components/modal/AddUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const apiClient = axios.create({
    baseURL: "http://localhost:3001/api",
  });

  const debounceTimeout = useRef(null);

  // Fetch users with debounce
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage("");

    try {
      const params = searchTerm ? { name: searchTerm } : {};
      const response = await apiClient.get("/users", { params });
      setUsers(response.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to fetch users.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Debounce the search input
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, fetchUsers]);

  const openAddEditModal = (user) => {
    setIsAddEditModalOpen(true);
    setSelectedUser(user); // Pass the user for editing or null for adding
  };
  

  const closeModals = () => {
    setIsAddEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (user) => {
    closeModals();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (user.id) {
        await apiClient.put(`/user/${user.id}`, user);
        setSuccessMessage("User updated successfully!");
      } else {
        await apiClient.post("/user", user);
        setSuccessMessage("User added successfully!");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrorMessage(error.response?.data?.message || "Error saving user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await apiClient.delete(`/user/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSuccessMessage("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setErrorMessage(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search user ..."
            className="px-10 py-2 border border-gray-300 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a user"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          aria-label="Add a new user"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center space-x-2"
          onClick={() => openAddEditModal(null)}
        >
          <FaPlus />
          <span>Add User</span>
        </button>
      </div>

      {/* Messages */}
      {loading && <div>Loading...</div>}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      {/* User Table */}
      {!loading && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-green-200">
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Contact Number</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">User Type</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="py-2 px-4 border-b">{user.userName}</td>
                  <td className="py-2 px-4 border-b">{user.age}</td>
                  <td className="py-2 px-4 border-b">{user.gender}</td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">{user.contactNo}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.userType}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openAddEditModal(user)}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center"
                        aria-label={`Edit ${user.userName}`}
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                        aria-label={`Delete ${user.userName}`}
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {isAddEditModalOpen && (
        <AddUserModal
          isOpen={isAddEditModalOpen}
          onClose={closeModals}
          onSave={handleSave}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default Users;
