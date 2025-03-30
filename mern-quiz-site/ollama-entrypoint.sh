#!/bin/sh

echo "Starting Ollama and ensuring model is installed..."

#start Ollama in the background
ollama serve &

#wait a few seconds to allow Ollama to initialize
sleep 5

#check if the model is already installed
ollama list | grep -q "llama3.2:1b"
if [ $? -ne 0 ]; then
    echo "Model not found. Downloading llama3.2:1b..."
    ollama pull llama3.2:1b
else
    echo "Model already exists. Skipping download."
fi

#keep the container running with Ollama in the foreground
wait