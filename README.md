# COMP3000 | Felix Pendered
## Welcome to Llamalyze, the AI Assisted Quiz platform!
This is my final year project, i started this project in october 2024. It is a quiz software that allows users to leverage AI in sections to gain feedback on their quizzes. Initially it was also to include generation of quizzes however due to issues in development this has been moved to future developments. 

## Technologies and Features
This app is web based and is made using the MERN stack, a popular web development stack. it makes use of docker to containerise the services including the local AI model for generative AI. The Technologies and Features are as follows
1. Local Ollama instance - This runs a version of meta's Llama large language model AI specifically Llama3.2:1b
2. MongoDB - For data storage of Users Quizzes Questions and more!
3. React Frontend - This is a sophisticated frontend solution that makes use of react, a widely used and adapted frontend framework. 
4. Node.js Backend - This backend contains the API routes and models for interacting with the MongoDB database. 

## How do I Run it?
As mentioned previously this whole application has been containerised using docker, allowing for not only easy development flow but allowing it to function the same on a wide range of systems. 

To begin, ensure that docker is installed and the engine is running. Then simply open the appication in your choice of code editor or command line interface. CD into the directory labeled "mern-quiz-site" and run this command

`. up.sh` 

This will connect to the up.sh shell script and ensure that docker is correctly working and then execute the docker-compose file. 

## Video Demonstration
Below you will find a link to the video demonstration, this is a 5 minute video that goes over the basics of how the application functions and gives you some behind the scenes using mongoDB Compass. 

`https://youtu.be/oA2s2bW62YI`