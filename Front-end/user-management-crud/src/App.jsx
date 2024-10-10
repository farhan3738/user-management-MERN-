import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const API_URL = 'http://localhost:3000/api/users'; // Set your API URL

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data || []); // Handle the case where data is undefined
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set an empty array if fetching fails
    }
  }

  const handleDialogOpen = (user) => {
    setDialogOpen(true);
    if (user) {
      setEditMode(true);
      setCurrentUserId(user._id); // Ensure you're using the correct ID field
      setNewUser({ name: user.name, email: user.email });
    } else {
      setEditMode(false);
      setNewUser({ name: '', email: '' });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewUser({ name: '', email: '' });
    setEditMode(false);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(API_URL, newUser);
      fetchUsers();
      handleDialogClose();
      showMessage('User added successfully!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error adding user', 'error');
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`${API_URL}/${currentUserId}`, newUser);
      fetchUsers();
      handleDialogClose();
      showMessage('User updated successfully!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      showMessage('User deleted successfully!', 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error deleting user', 'error');
    }
  };

  return (
    <div className="app-container">
      <h1>User Management</h1>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {dialogOpen && (
        <div className="dialog">
          <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <div className="dialog-actions">
            <button onClick={handleDialogClose}>Cancel</button>
            <button onClick={editMode ? handleUpdateUser : handleAddUser}>
              {editMode ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}> {/* Ensure you're using the correct key */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleDialogOpen(user)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)}> {/* Ensure you're using the correct ID */}
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={() => handleDialogOpen()} style={{ marginTop: '20px' }}>
        <FontAwesomeIcon icon={faPlus} /> Add New User
      </button>
    </div>
  );
};

export default App;
