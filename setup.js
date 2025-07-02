#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Employee Management System Setup");
console.log("=====================================\n");

try {
  const nodeVersion = process.version;
  console.log(` Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error(" Node.js is not installed. Please install Node.js first.");
  process.exit(1);
}

try {
  const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
  console.log(` npm version: ${npmVersion}`);
} catch (error) {
  console.error(" npm is not available. Please install npm first.");
  process.exit(1);
}

console.log("\n📦 Installing Backend Dependencies...");
try {
  execSync("npm install", { cwd: "./Backend", stdio: "inherit" });
  console.log(" Backend dependencies installed successfully!");
} catch (error) {
  console.error(" Failed to install backend dependencies.");
  process.exit(1);
}

console.log("\n📦 Installing Frontend Dependencies...");
try {
  execSync("npm install", { cwd: "./Frontend", stdio: "inherit" });
  console.log(" Frontend dependencies installed successfully!");
} catch (error) {
  console.error(" Failed to install frontend dependencies.");
  process.exit(1);
}

// Create .env file for backend
const envPath = path.join(__dirname, "Backend", ".env");
if (!fs.existsSync(envPath)) {
  const envContent = `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://127.0.0.1:27017/mern
PORT=8000
`;
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Created .env file in Backend directory");
}

console.log("\n Setup completed successfully!");
console.log("\n Next Steps:");
console.log("1.  MongoDB is running on your system");
console.log("2. Start the backend server: cd Backend && npm start");
console.log("3. Start the frontend server: cd Frontend && npm run dev");
console.log("4. Open http://localhost:5173 in the browser");
console.log("\n For more information, check the README.md file");
