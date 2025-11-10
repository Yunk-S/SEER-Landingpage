// Vercel Serverless Function for handling survey data
// This uses Vercel KV for data storage

import { kv } from '@vercel/kv';

const SURVEYS_KEY = 'seer_surveys';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET: Retrieve all surveys
    if (req.method === 'GET') {
      const surveys = await kv.get(SURVEYS_KEY) || [];
      res.status(200).json({
        success: true,
        data: surveys,
        count: surveys.length
      });
    }
    
    // POST: Add a new survey
    else if (req.method === 'POST') {
      let surveyData = req.body;

      // Handle cases where body arrives as a JSON string
      if (typeof surveyData === 'string') {
        try {
          surveyData = JSON.parse(surveyData);
        } catch (parseError) {
          console.error('Invalid JSON payload:', parseError);
          return res.status(400).json({
            success: false,
            error: 'Invalid JSON payload'
          });
        }
      }
      
      // Validate survey data
      if (!surveyData || !surveyData.responses) {
        return res.status(400).json({
          success: false,
          error: 'Invalid survey data'
        });
      }

      // Get existing surveys
      const surveys = await kv.get(SURVEYS_KEY) || [];
      
      // Add timestamp if not present
      if (!surveyData.timestamp) {
        surveyData.timestamp = new Date().toISOString();
      }
      
      // Add new survey
      surveys.push(surveyData);
      
      // Save back to KV
      await kv.set(SURVEYS_KEY, surveys);
      
      res.status(201).json({
        success: true,
        message: 'Survey submitted successfully',
        data: surveyData
      });
    }
    
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
