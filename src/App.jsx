import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const initialForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  city: "",
};

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // GET - READ USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.website.trim() ||
      !formData.city.trim()
    ) {
      setError("Please fill in all required fields.");
      return false;
    }

    return true;
  };

  // =========================
  // POST - CREATE USER
  // =========================
  const createUser = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          address: {
            city: formData.city,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const newUser = await response.json();

      // JSONPlaceholder returns a simulated ID
      const userToAdd = {
        ...newUser,
        id: users.length + 1,
        city: formData.city,
      };

      setUsers((previousUsers) => [userToAdd, ...previousUsers]);

      setFormData(initialForm);
      setMessage("User added successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // PUT - UPDATE USER
  // =========================
  const updateUser = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: {
            city: formData.city,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === editingId
            ? {
                ...user,
                ...updatedUser,
                city: formData.city,
              }
            : user
        )
      );

      setFormData(initialForm);
      setEditingId(null);
      setMessage("User updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // FORM SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    if (editingId !== null) {
      await updateUser();
    } else {
      await createUser();
    }
  };

  // =========================
  // EDIT USER
  // =========================
  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      website: user.website || "",
      city: user.address?.city || user.city || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setMessage("");
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id)
      );

      setMessage("User deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>USER MANAGEMENT SYSTEM</h1>

        {/* FORM */}
        <div className="form-container">
          <h2>{editingId !== null ? "Edit User" : "Add New User"}</h2>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website *</label>
                <input
                  type="text"
                  name="website"
                  placeholder="Enter website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="submit-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update User"
                  : "Add User"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* USERS TABLE */}
        <div className="table-container">
          <h2>User List</h2>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="loading">No users found.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Website</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.website}</td>
                      <td>{user.address?.city || user.city}</td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;