const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

//get the routes to the requests
const userRoutes = require('./server-routes/Userroutes');
const moduleRoutes = require('./server-routes/Moduleroutes');
const quizRoutes = require('./server-routes/Quizroutes');
const attemptRoutes = require('./server-routes/Attemptroutes');
const aiRoutes = require('./server-routes/AIroutes');
const QuestionRoutes = require('./server-routes/Questionroutes');
const populateRoutes = require('./mongoosedata');

//variables
const port = 9000;
const mongoUrl = "mongodb://root:example@database:27017/people?authSource=admin";

//use mongoose to connect to the mongodb instance
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

//start the express app
const app = express();
app.use(express.json());
app.use(cors());

//mount the routes with their paths
app.use('/api/user', userRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/attempt', attemptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/question', QuestionRoutes);
app.use('/api', populateRoutes);

//start the server!
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});