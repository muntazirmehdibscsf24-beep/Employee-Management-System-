import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./App.css"

const departmentOptions = [
  { value: "HR", label: "HR" },
  { value: "IT", label: "IT" },
  { value: "Finance", label: "Finance" },
  { value: "Maintenance", label: "Maintenance" }
];

const designationOptions = {
  HR: ["HR Executive"],
  IT: ["Software Developer"],
  Finance: ["Accountant"],
  Maintenance: ["Mechanical Technician"]
};

function CreateUser() {
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const Submit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!employeeName || !email || !department || !designation) {
      setError('Please fill in all required fields');
      return;
    }
    // Format the salary as number if provided
    const salaryValue = salary ? Number(salary) : null;
    setError(''); // Clear any previous error
    const token = localStorage.getItem('token');
    axios.post("http://localhost:8000/api/employees", {
      employeeName,
      email,
      department,
      designation,
      salary: salaryValue
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(result => {
      console.log('Employee created successfully:', result.data);
      navigate("/");
    })
    .catch(err => {
      console.error('Error creating employee:', err);
      setError(err.response?.data?.error || 'Failed to create employee');
    });
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="mb-4">Add New Employee</h2>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={Submit}>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="employeeName" className="form-label">
                Employee Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                onChange={(e) => setEmployeeName(e.target.value)}
                value={employeeName}
                required
                placeholder="Enter employee name"
              />
            </div>
            <div className="col-md-6 mb-4">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Enter email address"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="department" className="form-label">
                Department <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="department"
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDesignation('');
                }}
                value={department}
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-4">
              <label htmlFor="designation" className="form-label">
                Designation <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="designation"
                onChange={(e) => setDesignation(e.target.value)}
                value={designation}
                required
                disabled={!department}
              >
                <option value="">Select Designation</option>
                {department && designationOptions[department].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label htmlFor="salary" className="form-label">
                Salary (optional)
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  id="salary"
                  onChange={(e) => setSalary(e.target.value)}
                  value={salary}
                  min="0"
                  step="1000"
                  placeholder="Enter salary"
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary px-4">
              <i className="fas fa-save me-2"></i>Save Employee
            </button>
            <Link to="/" className="btn btn-secondary px-4">
              <i className="fas fa-arrow-left me-2"></i>Back to List
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
