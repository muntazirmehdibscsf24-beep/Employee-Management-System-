import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css"
import "./App.css"

function User() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/employees")
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
  }, [])

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
      axios.delete(`http://127.0.0.1:8000/api/employees/${id}`)
        .then(() => {
          setEmployees(prev => prev.filter(u => u._id !== id));
          setFilteredEmployees(prev => prev.filter(u => u._id !== id));
        })
        .catch((err) => {
          setError('Failed to delete employee. Please try again.');
          console.error('Error deleting employee:', err);
        });
    }
  }

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
                >
                  <option value="name">Search by Name</option>
                  <option value="department">Search by Department</option>
                  <option value="designation">Search by Designation</option>
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
            <Link to="/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Add Employee
            </Link>
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
              <th scope="col">Actions</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredEmployees.length === 0 && searchTerm !== '' && (
        <div className="alert alert-info mt-4">
          No results found for "{searchTerm}"
        </div>
      )}
      {filteredEmployees.length === 0 && searchTerm === '' && (
        <div className="alert alert-info mt-4">
          No employees found. Click "Add Employee" to add one.
        </div>
      )}
    </div>
  );
}

export default User;
