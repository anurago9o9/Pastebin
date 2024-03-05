const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pastebin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Paste model
const Paste = mongoose.model('Paste', {
  content: String,
  language:String,
  slug: { type: String, unique: true },
});

app.use(express.json());
app.use(cors());

const generateUniqueSlug = () => {
  // Use shortid or your own logic to generate a unique slug
  return shortid.generate();

};

app.get('/api/pastes/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Received request for slug:', req.params.slug);
    const paste = await Paste.findOne({ slug });
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    res.json({ content: paste.content });
  } catch (error) {
    console.error('Error fetching paste:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get all pastes
app.get('/api/pastes', async (req, res) => {
  try {
    const pastes = await Paste.find();
    res.json(pastes);
  } catch (error) {
    console.error('Error fetching pastes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to create a new paste
app.post('/api/pastes', async (req, res) => {
  try {
    const { content ,language, slug} = req.body;
    const serverSlug = generateUniqueSlug();
    const newPaste = new Paste({ content , language, slug:serverSlug});
    await newPaste.save();
    res.status(201).json(newPaste);
  } catch (error) {
    console.error('Error creating paste:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint to update a paste by ID
app.put('/api/pastes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, language,slug } = req.body;
    const serverSlug = generateUniqueSlug();
    console.log(serverSlug);
    // Find the paste by ID and update its content and language
    const updatedPaste = await Paste.findByIdAndUpdate(id, { content, language, slug:serverSlug }, { new: true });

    if (!updatedPaste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    res.json(updatedPaste);
  } catch (error) {
    console.error('Error updating paste:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to delete a paste by ID
app.delete('/api/pastes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Paste.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting paste:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




