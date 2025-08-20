// File: /pages/api/detect-skin-condition.js

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Disable Next.js default body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Specify the path to your local image
    const imagePath = 'C:/Users/Jayram/Downloads/images.png'; // Path to the local image

    // Check if the file exists before proceeding
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({ error: 'Image file not found at the specified path' });
    }

    // Read the image buffer from the local system
    const imageBuffer = fs.readFileSync(imagePath);

    // Prepare the form data for Roboflow
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/png', // Ensure correct MIME type (e.g., 'image/png' or 'image/jpeg')
    });

    // Make the API request to Roboflow
    const apiResponse = await fetch(
      'roboflow-model-api-link',
      {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    // Check if the API request was successful
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Roboflow API error: ${apiResponse.status} - ${errorText}`);
    }

    // Parse the API response
    const result = await apiResponse.json();

    // Return the result to the client
    return res.status(200).json(result);

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message || 'Error processing image' });
  }
}
