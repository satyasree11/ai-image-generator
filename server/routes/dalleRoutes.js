import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY; // Ensure your API key is set in your .env file

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Make a POST request to the new Hugging Face model
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`, // Use the API key from environment variables
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Change response type to arraybuffer
      }
    );

    // Log the full response for debugging
    console.log(response.data);

    // Convert the response data (arraybuffer) to base64
    const base64data = Buffer.from(response.data, 'binary').toString('base64');
    
    // Return the base64 image
    res.status(200).json({ photo: `data:image/jpeg;base64,${base64data}` }); // Send the base64 image to the client

  } catch (error) {
    console.error('Error making API request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while generating the image.' });
  }
});

export default router;
