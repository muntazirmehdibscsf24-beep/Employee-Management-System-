const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const EmployeeModel = require("./models/Employee");
const authRoutes = require("./routes/auth");
const { authenticateToken, requireAdmin } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth routes (public)
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port', process.env.PORT || 8000);
});

// Protected Employee routes (require authentication)
app.post('/api/employees', authenticateToken, async (req, res) => {
  try {
    // Find the highest employeeID
    const lastEmployee = await EmployeeModel.findOne({}, {}, { sort: { employeeID: -1 } });
    let nextID = '01';
    if (lastEmployee && lastEmployee.employeeID) {
      // Parse as integer, increment, pad to 2 digits
      const lastID = parseInt(lastEmployee.employeeID, 10);
      nextID = (lastID + 1).toString().padStart(2, '0');
    }
    const employeeData = { ...req.body, employeeID: nextID };
    const employee = await EmployeeModel.create(employeeData);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/employees', authenticateToken, async (req, res) => {
  try {
    const employees = await EmployeeModel.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      {
        employeeName: req.body.employeeName,
        email: req.body.email,
        employeeID: req.body.employeeID,
        department: req.body.department,
        designation: req.body.designation,
        salary: req.body.salary
      },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});