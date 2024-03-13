import express from 'express';
import 'dotenv/config'
import fetch from 'node-fetch';

const app = express();
const port = 8000;

// Middleware
app.use(express.json());

// Route to create a live input stream on Cloudflare
app.post('/create-live-input', async (req, res) => {
  const { accountId, ...body } = req.body;
  
  const cloudflareUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`;
  const cloudflareApiKey = process.env.CLOUD_FLARE_API_KEY;
  const cloudflareEmail = process.env.CLOUD_FLARE_EMAIL;

  try {
    const response = await fetch(cloudflareUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': cloudflareEmail,
        'X-Auth-Key': cloudflareApiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Error from Cloudflare: ${response.statusText}`);

    const data = await response.json();
    // console.log(data)
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
