const express = require('express');
const fs = require('fs').promises; // File system module for async operations
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- GET: Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).send('OK 2.6');
});

// --- GET: Serve HTML page for root ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- GET: Get all data from data.json ---
app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data.json:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// --- POST: Add new data to data.json ---
app.post('/data', async (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required' });
  }

  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const existingData = JSON.parse(data);
    
    const newData = {
      id: existingData.length + 1,
      name,
      address,
      timestamp: new Date().toISOString()
    };

    existingData.push(newData);
    await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2));

    res.status(201).json({ message: 'Data added successfully', data: newData });
  } catch (error) {
    console.error('Error personally writing to data.json:', error);
    res.status(500).json({ error: 'Failed to write data' });
  }
});

app.listen(PORT, () => {
  console.log(`0.1.5 Server is running on http://localhost:${PORT}`);
});