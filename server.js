const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Configuration
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'mml_restaurant';
const COLLECTION_NAME = 'reservations';

// POST endpoint to save reservations
app.post('/api/reservations', async (req, res) => {
  try {
    console.log('📥 Received reservation data:', req.body);
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Add server timestamp
    const reservationData = {
      ...req.body,
      serverTimestamp: new Date(),
      _id: undefined // Let MongoDB generate the ID
    };
    
    const result = await collection.insertOne(reservationData);
    console.log('✅ Reservation saved to MongoDB:', result.insertedId);
    
    await client.close();
    
    res.json({ 
      success: true, 
      insertedId: result.insertedId,
      confirmation: req.body.confirmation,
      message: 'Reservation saved successfully'
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save reservation'
    });
  }
});

// GET endpoint to fetch all reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const reservations = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    await client.close();
    
    console.log(`📋 Retrieved ${reservations.length} reservations`);
    
    // Return reservations array directly for booking page compatibility
    res.json(reservations);
    
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Failed to fetch reservations'
    });
  }
});

// GET endpoint to fetch reservation by confirmation number
app.get('/api/reservations/:confirmation', async (req, res) => {
  try {
    const { confirmation } = req.params;
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const reservation = await collection.findOne({ confirmation: confirmation });
    
    await client.close();
    
    if (reservation) {
      res.json({
        success: true,
        data: reservation
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// DELETE endpoint to cancel reservation
app.delete('/api/reservations/:confirmation', async (req, res) => {
  try {
    const { confirmation } = req.params;
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const result = await collection.deleteOne({ confirmation: confirmation });
    
    await client.close();
    
    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: 'Reservation cancelled successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Health check endpoint for database connection
app.get('/api/reservations/health', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    await db.admin().ping();
    
    await client.close();
    
    res.json({ 
      status: 'OK', 
      message: 'MML Restaurant API and MongoDB are running',
      database: DB_NAME,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MML Restaurant API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
🚀 MML Restaurant MongoDB API Server Started!
📍 Server: http://localhost:${PORT}
🗄️ Database: ${DB_NAME}
📊 Collection: ${COLLECTION_NAME}
🔗 API Endpoints:
   POST /api/reservations - Save new reservation
   GET /api/reservations - Get all reservations
   GET /api/reservations/:confirmation - Get specific reservation
   DELETE /api/reservations/:confirmation - Cancel reservation
   GET /health - Health check
  `);
});
