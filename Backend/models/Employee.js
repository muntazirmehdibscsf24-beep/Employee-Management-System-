const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    employeeID: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        enum: ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'],
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    joiningDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    salary: {
        type: Number,
        min: 0
    }
})

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;