const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
import { error } from 'console';
import User from '../mongo-models/Userlist.js'

// Variables
const port = 9000;
const mongoUrl = "mongodb://root:example@database:27017/people?authSource=admin";

// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Startup relevant services
const app = express();
app.use(express.json());
app.use(cors()); // Allow CORS MAKE SURE SECURE FOR DEPLOYMENT

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // CHANGE THIS BEFORE DEPLOYMENT
        methods: ['GET', 'POST', 'DELETE']
    }
});

//deal with requests / pass them off to other files
app.post('/api/post/newuser', async (req, res) => {
    const { email, password, isLecturer } = req.body;

    if (!email || !password || !isLecturer) {
        return res.status(406).send('406-Not Acceptable: Missing Fields Name or Password');
    }

    try {
        const user = new User({ email, password, isLecturer })
        await user.save();
        res.status(201).send('201-Created: User '+email+' Created');
        console.log('User Registered under email: '+email);
    } catch (error) {
        console.error(error);
        res.status(500).send('500-Internal Server Error')
    }
});


// Start the server
server.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
});