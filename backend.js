// Import express, a Node.js web framework
import express from 'express';

// Import mongoose, a MongoDB ORM for Node.js
import mongoose from 'mongoose';

// Import cors, a package for enabling CORS
import cors from 'cors';

// Create an express app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other domains
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PasswordManager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// Define a schema for the password collection
const passwordSchema = new mongoose.Schema({
  website: String,
  username: String,
  password: String
});

// Create a model from the schema
const Password = mongoose.model('allpasswords', passwordSchema);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('🟢 Server is running');
});

// Define a route for adding a new password
app.post('/add', async (req, res) => {
  try {
    // Extract the website, username, and password from the request body
    const { website, username, password } = req.body;

    // Create a new document in the Password collection
    const newEntry = new Password({ website, username, password });

    // Save the document
    await newEntry.save();

    // Return a success response
    res.status(201).json({ message: '✅ Password saved!', data: newEntry });
  } catch (err) {
    // Return an error response
    res.status(500).json({ message: '❌ Failed to save', error: err });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('🚀 Listening on port 3001');
});

