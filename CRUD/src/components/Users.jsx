import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrashAlt, FaSearch, FaTimes, FaEye } from 'react-icons/fa';

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [view,setView]=useState(false)
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then((response) => setUserData(response.data.map(user => ({ ...user, status: user.status || 'active' })))
    )
      .catch((error) => console.error("There was an error fetching the users!", error));
  }, []);
  const handleDelete = (id) => {
    if(confirm("Are you sure Deleting this item?")){
      axios.delete(`http://localhost:8000/api/delete/${id}`)
      .then(() => setUserData(userData.filter(user => user._id !== id)))
      .catch((error) => console.error("There was an error deleting the user!", error));
      
    }
  };

  const handleView = (id) => {
    const user = userData.find((u) => u._id === id);
    if (user) {
      setSelectedUser(user);
      setView(true);
    }
  };
  
  const handleSearch = () => {
    setCancel(true);
    if(search.trim()==""){
        alert("Enter valid item")
        setCancel(false)
        setSearch("")
    }else{
      if (search.trim()) {
        const filterSearch=search.trim()
        const filtered = userData.filter(({ name, email }) =>
          name.toLowerCase().includes(filterSearch.toLowerCase()) ||
          email.toLowerCase().includes(filterSearch.toLowerCase())
        );
        setFilteredData(filtered);
        setMessage(filtered.length === 0 ? "No matched users" : "");
      } else {
        setFilteredData([]);
        setMessage("");
      }
    }
    
  };

  function handleFilter(e) {
    const value = e.target.value;
    setSearch(value);
    setCancel(!!value);
  
    if (value.trim()) {
      const filtered = userData.filter(({ name, email }) =>
        name.toLowerCase().includes(value.toLowerCase()) ||
        email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setMessage(filtered.length === 0 ? "No matched users" : "");
    } else {
      setFilteredData([]);
      setMessage("");
    }
  }
  

  const handleSearchReset = () => {
    setCancel(false);
    setSearch("");
    setMessage("");
    setFilteredData([]);
  };

  const handleEdit = (id) => {
    const user = userData.find((u) => u._id === id);
    if (user) {
      setInput({ name: user.name, email: user.email });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setInput((prev) => ({ ...prev, email }));
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name.trim() || !input.email.trim() || error) return;

    axios.put(`http://localhost:8000/api/update/${editingId}`, input)
      .then(() => {
        setUserData(userData.map(user =>
          user._id === editingId ? { ...user, ...input } : user
        ));
        
        setShowModal(false);
        setInput({ name: "", email: "" });
        setEditingId(null);
      })
      .catch((err) => console.error("Failed to update user", err));
  };

  function DeleteAll(){
    if(confirm("Are you sure Deleting this item?")){
      axios.delete(`http://localhost:8000/api/delete`)
      .then(() => setUserData([]))
      .catch((error) => console.error("There was an error deleting the user!", error));
      
    }
  }

  const toggleStatus = (id) => {
    const user = userData.find((u) => u._id === id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
  
    axios.put(`http://localhost:8000/api/status/${id}`, { ...user, status: newStatus })
      .then(() => {
        setUserData(userData.map((u) =>
          u._id === id ? { ...u, status: newStatus } : u
        ));
      })
      .catch((err) => console.error("Failed to update status", err));
  };
  

  return (
    <>
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
        <div>
          <div className='flex gap-5 mb-4'>
          <h3 className="text-xl p-2 font-semibold">Search User</h3>
          <button className='bg-red-500 text-white p-2 h-12 rounded-lg hover:bg-red-600'
          onClick={DeleteAll}>Delete All</button>
          </div>
          
          <div className="flex gap-5">
            <input
              type="text"
              name="search"
              placeholder="Search by name or email"
              className="mb-5 border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) =>{ handleFilter(e)}}
            />
            {cancel ? (
              <button
                className="bg-red-500 text-white p-2 h-12 rounded-full w-12 hover:bg-red-600"
                onClick={handleSearchReset}
              >
                <FaTimes className="mx-auto" />
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white p-2 h-12 rounded-full w-12 hover:bg-blue-600"
                onClick={handleSearch}
              >
                <FaSearch className="mx-auto" />
              </button>
            )}
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filteredData.length > 0 ? filteredData : userData).map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-100">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.email}</td>
              <td className="py-2 px-4">
                <button
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    item.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  onClick={() => toggleStatus(item._id)}
                >
                  {item.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="py-2 px-4 flex space-x-4">
                <button onClick={() => handleEdit(item._id)} className="text-blue-500 hover:text-blue-700">
                  <FaPencilAlt />
                </button>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
                <button
                  onClick={() => handleView(item._id)}
                  className="text-purple-500 hover:text-purple-700 font-semibold text-sm"
                >
                   <FaEye/>
                </button>
              </td>
            </tr>
            
            ))}
          </tbody>
        </table>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={input.name}
                  onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={input.email}
                  onChange={handleEmailChange}
                  required
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setInput({ name: "", email: "" });
                    setEditingId(null);
                  }}
                  className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!input.name.trim() || !input.email.trim() || !!error}
                  className={`w-1/2 py-2 rounded-lg text-white ${
                    !input.name.trim() || !input.email.trim() || !!error
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {view && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">User Details</h2>
      <div className="text-lg mb-2"><strong>Name:</strong> {selectedUser.name}</div>
      <div className="text-lg mb-2"><strong>Email:</strong> {selectedUser.email}</div>
      <div className="text-lg mb-4">
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-1  ${
            selectedUser.status === "active" ? "text-green-500" : "text-gray-500"
          }`}
        >
          {selectedUser.status}
        </span>
      </div>
      <button
        onClick={() => {
          setView(false);
          setSelectedUser(null);
        }}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      >
        Close
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default Users;
