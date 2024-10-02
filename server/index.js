import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));  // For JSON payloads
app.use(express.urlencoded({ limit: '100mb', extended: true }));  // For form-data payloads

app.use(morgan('dev')); // Logging middleware

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from Satya');
});

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL); // Await the DB connection
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'));
    } catch (error) {
        console.log(error);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down the server...');
    process.exit();
});
