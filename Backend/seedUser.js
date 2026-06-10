require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Mongoose model for User

const seedUser = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const email = 'millan@gmail.com';
        const password = '1234';
        const name = 'Millan';

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists, updating password...');
            user.password = password;
            await user.save();
            console.log('Password updated.');
        } else {
            console.log('User not found, creating...');
            user = new User({ email, password, name, role: 'admin' });
            await user.save();
            console.log('User created successfully.');
        }
        process.exit();
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
}

seedUser();
