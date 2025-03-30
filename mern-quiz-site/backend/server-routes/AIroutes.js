const express = require('express');
const axios = require('axios');
const router = express.Router();

//notes, kuba mentions cumputer vision for reading of the lecture slides!!! look into and implement

router.post('/generatequiz', async (req, res) => {
    const { content, numbQuestions } = req.body;
    console.log('[Llama] Generating Llama3.2:1b Request...');

    if (!content) {
        return res.status(400).send('Please provide a "text" field in the request body.');
    }

    //creating the prompt for ollama
    const prompt = "can you create a "+ numbQuestions +" question multiple choice quiz in json format with the fields 'question' and 'answers' and 'correctanswer' about the topic: " + content;

    //send the prompt to ollama locally and ensure that the response is in full by append the individual parts into one
    try {
        const response = await axios.post('http://ollama:11434/api/generate', {
            model: "llama3.2:1b",  
            prompt: prompt
        }, {
            responseType: 'stream' 
        });
        let fullResponse = ''; 
        response.data.on('data', (chunk) => {
            try {
                const chunkData = JSON.parse(chunk.toString()); 
                fullResponse += chunkData.response;
            } catch (error) {
                console.error("[Llama] Error parsing chunk:", error);
                res.status(500).send('Error processing the response chunk.');
            }
        });

        //once the response is collected from ollama send it to the user
        response.data.on('end', () => {
            res.status(200).send(fullResponse);
            console.log("[Llama] Request fulfilled!")
        });

    } catch (error) {
        console.error("[Llama] Ollama API error:", error);
        res.status(500).send('Error generating text with Ollama');
    }
});

router.post('/generatefeedback', async (req, res) => {
    
});

module.exports = router;