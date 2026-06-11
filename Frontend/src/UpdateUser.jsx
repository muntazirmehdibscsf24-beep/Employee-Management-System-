import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
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

function UpdateUser() {
  const { id } = useParams();
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/employees/" + id)
      .then(result => {
        setEmployeeName(result.data.employeeName)
        setDepartment(result.data.department)
        setDesignation(result.data.designation)
        setSalary(result.data.salary)
        setEmail(result.data.email)
      })
      .catch(err => {
        setError('Failed to load employee data');
        console.log(err);
      })
  }, [id])

  const update = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    axios.put("http://localhost:8000/api/employees/" + id, {
      employeeName,
      email,
      department,
      designation,
      salary
    })
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      })
      .catch(err => {
        setError('Failed to update employee');
        console.log(err);
      })
  }

  return (
    <div className='container'>
      <form onSubmit={update}>
        <h2>Update Employee</h2>
        {success && (
          <div className="alert alert-info mb-3">Employee updated successfully!</div>
        )}
        {error && (
          <div className="alert alert-danger mb-3">{error}</div>
        )}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" onChange={(e) => setEmployeeName(e.target.value)} value={employeeName} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select className="form-select" onChange={(e) => { setDepartment(e.target.value); setDesignation(''); }} value={department} required>
            <option value="">Select Department</option>
            {departmentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Designation</label>
          <select className="form-select" onChange={(e) => setDesignation(e.target.value)} value={designation} required disabled={!department}>
            <option value="">Select Designation</option>
            {department && designationOptions[department].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input type="number" className="form-control" onChange={(e) => setSalary(e.target.value)} value={salary} placeholder="Enter salary" />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <Link to="/" className="btn btn-secondary" style={{marginLeft: '10px'}}>Back</Link>
      </form>
    </div>
  )
}

export default UpdateUser;
