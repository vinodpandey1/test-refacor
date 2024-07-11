import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_DEV || process.env.NEXT_PUBLIC_API_URL, // Replace this with your API's base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
      'Content-Type': 'application/json', // Default content type
      // Add any other default headers here
    },
  })

