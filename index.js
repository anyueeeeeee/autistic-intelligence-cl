import openai from './config/openai.js';
import express from 'express';
import bodyParser from 'body-parser'; // Ensure this is imported
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const defaultData = { messages: [] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

const app = express();

//Serve a public folder
app.use(bodyParser.json()); // Parse JSON in request body
app.use(express.static('public'));
app.use(express.json()); //11. parse the message data

app.get('/api/training-data', async (req, res) => {
    try {
        await db.read(); // Ensure the latest data is loaded
        const trainingData = db.data.trainingData || []; // Default to an empty array if no training data exists
        res.json({ trainingData });
    } catch (error) {
        console.error('Error fetching training data:', error.message);
        res.status(500).json({ error: 'Failed to fetch training data.' });
    }
});

app.post('/api/gpt', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a warm and friendly Autistic Translator. When given a sentence, provide two translations: one from the perspective of an autistic individual, focusing on clear, literal, and unambiguous meanings for practical communication, but do embrac ambiguity and intrigue when exploring existential ideas; and another from an allistic individual, capturing nuanced, implied, or socially contextual meanings. Maintain a warm and approachable tone in your explanations, ensuring clarity and understanding without exaggeration. Highlight key differences in interpretation gently and constructively." },
                { role: "user", content: prompt }
            ],
        });

        const responseContent = completion.choices[0].message.content;

        // Save the chat in db.json
        await db.read();
        db.data.messages.push({
            prompt,
            response: responseContent,
            time: new Date().toISOString(),
        });
        await db.write();

        res.json({ response: responseContent });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to generate response from GPT" });
    }
});

// Submit Training Data
app.post('/api/submit-training-data', async (req, res) => {
    try {
        const { prompt, completion, identity } = req.body;
        if (!prompt || !completion || !identity) {
            return res.status(400).json({ error: 'Both prompt and completion are required' });
        }

        // Save training data in db.json
        await db.read();
        db.data.trainingData ||= [];
        db.data.trainingData.push({
            prompt,
            completion,
            identity,
            submittedAt: new Date().toISOString(),
        });
        await db.write();

        res.status(201).json({ message: 'Training data submitted successfully!' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Failed to submit training data.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("App is listening at http://localhost:3000");
});