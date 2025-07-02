import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./User.css"
import "./App.css"

function User() {
  const { user: currentUser, logout, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Get token from context or localStorage
    const authToken = token || localStorage.getItem('token');
    axios.get("http://localhost:8000/api/employees", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(result => {
        setEmployees(result.data);
        setError('');
        setFilteredEmployees(result.data);
      })
      .catch(err => {
        setError('Failed to fetch employees. Please try again.');
        console.error('Error fetching employees:', err);
      })
      .finally(() => setLoading(false));
  }, [token])

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = employees.filter(employee => {
      switch (searchType) {
        case 'name':
          return employee.employeeName.toLowerCase().includes(searchValue);
        case 'department':
          return employee.department.toLowerCase().includes(searchValue);
        case 'designation':
          return employee.designation.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });

    setFilteredEmployees(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const authToken = token || localStorage.getItem('token');
      axios.delete(`http://localhost:8000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
        .then((res) => {
          setEmployees(prev => prev.filter(u => u._id !== id));
          setFilteredEmployees(prev => prev.filter(u => u._id !== id));
        })
        .catch((err) => {
          setError('Failed to delete employee. Please try again.');
          console.error('Error deleting employee:', err);
        });
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // Only allow search by name for users
  const searchOptions = isAdmin() ? [
    { value: 'name', label: 'Search by Name' },
    { value: 'department', label: 'Search by Department' },
    { value: 'designation', label: 'Search by Designation' }
  ] : [
    { value: 'name', label: 'Search by Name' }
  ];

  return (
    <div className="container">
      <div className="heading">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Employee Management System</h2>
          <div className="d-flex gap-3">
            <div className="search-container">
              <div className="input-group">
                <select 
                  className="form-select" 
                  value={searchType} 
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{ width: '150px' }}
                  disabled={!isAdmin()}
                >
                  {searchOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
            {isAdmin() && (
              <Link to="/create" className="btn btn-primary">
                <i className="fas fa-plus me-2"></i>Add Employee
              </Link>
            )}
            <button className="btn btn-primary" onClick={handleLogout} style={{marginLeft: '10px'}}>
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">ID</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col">Salary</th>
              <th scope="col">Joined</th>
              {isAdmin() && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <th scope="row">{index + 1}</th>
                <td>{employee.employeeName}</td>
                <td>{employee.email}</td>
                <td>{employee.employeeID}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>${employee.salary ? employee.salary.toLocaleString() : '-'}</td>
                <td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '-'}</td>
                {isAdmin() && (
                  <td>
                    <div className="action-btns">
                      <Link 
                        to={`/update/${employee._id}`} 
                        className="btn btn-edit btn-sm"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => handleDelete(employee._id)} 
                        className="btn btn-delete btn-sm"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredEmployees.length === 0 && searchTerm !== '' && (
        <div className="alert alert-info mt-4">
          No results found for "{searchTerm}" in {searchType === 'name' ? 'names' : searchType === 'department' ? 'departments' : 'designations'}
        </div>
      )}
    </div>
  );
}

export default User;
