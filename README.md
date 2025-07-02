# Employee Management System

A full-stack employee management application with authentication, user roles, and CRUD operations for employee data.

## Features

- 🔐 **Authentication System**: Login and registration with JWT tokens
- 👥 **User Roles**: Admin and regular user roles with different permissions
- 👨‍💼 **Employee Management**: Create, read, update, and delete employee records
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔒 **Protected Routes**: Secure access to different parts of the application
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend

- **React.js** with Vite
- **React Router** for navigation
- **Context API** for state management
- **Tailwind CSS** for styling
- **Font Awesome** for icons

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Employee-Management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create a .env file (optional - JWT_SECRET will use default if not set)
echo "JWT_SECRET=your-super-secret-jwt-key" > .env

# Start the development server
npm start
```

The backend server will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will run on `http://localhost:5173`

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Windows)
mongod

# Start MongoDB (macOS/Linux)
sudo systemctl start mongod
```

The application will automatically connect to MongoDB at `mongodb://127.0.0.1:27017/mern`

## Usage

### 1. Registration

1. Open the application in your browser
2. Click "Register here" to create a new account
3. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
   - Role (Admin or Regular User)
4. Agree to the terms and conditions
5. Click "Create Account"

### 2. Login

1. Use your registered email and password to log in
2. Click "Sign in"
3. You'll be redirected to the employee dashboard

### 3. Employee Management

#### For Admin Users:

- View all employees
- Add new employees
- Edit existing employee information
- Delete employees
- Access all features

#### For Regular Users:

- View all employees
- Add new employees
- Edit existing employee information
- Cannot delete employees

### 4. Employee Data Fields

Each employee record includes:

- Employee Name
- Email Address
- Employee ID
- Department
- Designation
- Salary

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Employees (All protected routes)

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get specific employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (admin only)

## Project Structure

```
Employee Management/
├── Backend/
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   ├── Employee.js       # Employee model
│   │   └── User.js           # User model
│   └── routes/
│       └── auth.js           # Authentication routes
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx # Login/Register component
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   └── App.jsx           # Main app component
│   ├── public/
│   │   └── login.html        # Standalone login page
│   └── package.json          # Frontend dependencies
└── README.md
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using express-validator
- **Protected Routes**: Client and server-side route protection
- **Role-based Access**: Different permissions for admin and regular users
- **CORS Configuration**: Proper cross-origin request handling

## Environment Variables

Create a `.env` file in the Backend directory:

```env
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://127.0.0.1:27017/mern
PORT=8000
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Make sure MongoDB is running
   - Check if the connection string is correct

2. **CORS Error**

   - Ensure the backend is running on port 8000
   - Check if the frontend is making requests to the correct URL

3. **JWT Token Issues**

   - Clear browser localStorage
   - Check if the JWT_SECRET is set correctly

4. **Port Already in Use**
   - Change the port in the backend configuration
   - Update the frontend API_BASE_URL accordingly

### Development Tips

- Use browser developer tools to check for console errors
- Check the Network tab for API request/response issues
- Verify MongoDB connection in the backend console
- Clear localStorage if authentication issues persist
