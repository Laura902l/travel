const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
const { MongoClient, ObjectId } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'travelAgency';

// Path to history file
const tourHistoryFilePath = path.join(__dirname, 'tourHistory.json');

// Function to connect to MongoDB
async function connectToMongo() {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('bookings');
    return collection;
}
// GET all bookings, either from MongoDB or JSON file, and render HTML
router.get('/history', async (req, res) => {
    try {
        let allBookings;
        const collection = await connectToMongo().catch(() => null);

        allBookings = await collection.find({}).toArray();

        res.render('manageIterm', { tourHistory: allBookings });
    } catch (error) {
        console.error('Error fetching booking history:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CREATE a new booking
router.post('/history', async (req, res) => {
    try {
        const collection = await connectToMongo();
        await collection.insertOne(req.body); 
        res.redirect('/history'); 
    } catch (error) {
        console.error('Error creating booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// READ all bookings
router.get('/history', async (req, res) => {
    try {
        const collection = await connectToMongo();
        const allBookings = await collection.find({}).toArray();
        res.json(allBookings);
    } catch (error) {
        console.error('Error fetching booking history:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// UPDATE a booking
router.put('/history/:id', async (req, res) => {
    try {
        const collection = await connectToMongo();
        const id = req.params.id;
        const newData = req.body;

        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: newData });
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a booking from either MongoDB or JSON file by ID
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let resultMessage;
        const collection = await connectToMongo().catch(() => null);
        if (collection) {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            resultMessage = result.deletedCount ? 'Booking deleted successfully' : 'Booking not found';
        } else {
            const tourHistory = readJsonFile(tourHistoryFilePath);
            const filteredHistory = tourHistory.filter(booking => booking.id !== ObjectId(id)); // Исправлено здесь
            if (filteredHistory.length !== tourHistory.length) {
                writeJsonFile(tourHistoryFilePath, filteredHistory);
                resultMessage = 'Booking deleted successfully';
            } else {
                resultMessage = 'Booking not found';
            }
        }
        res.json({ message: resultMessage });
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/data/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const collection = await connectToMongo();

        const booking = await collection.findOne({ _id: new ObjectId(id) });

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/data', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection('bookings');
        const data = await collection.find({}).toArray();
        res.json(data);

        client.close();
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.patch('/history/:id', async (req, res) => {
    try {
        const collection = await connectToMongo();
        const id = req.params.id;
        const newData = req.body;

        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: newData });
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;