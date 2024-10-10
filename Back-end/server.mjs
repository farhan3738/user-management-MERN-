import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string (replace with your connection string)
const mongoUri = 'mongodb://localhost:27017/user-management'; // Update with your MongoDB connection

// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Define a User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

// Create a User model
const User = mongoose.model('User', userSchema);

// CRUD ROUTES

// 1. CREATE a new user (POST)
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        const newUser = new User({ name, email });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
});

// 2. READ all users (GET)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// 3. READ a specific user by ID (GET)
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// 4. UPDATE a user by ID (PUT)
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});

// 5. DELETE a user by ID (DELETE)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
