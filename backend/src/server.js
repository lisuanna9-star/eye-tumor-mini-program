const cors = require('cors');
const express = require('express');
const path = require('path');
const { config } = require('./config');
const { askQuestion } = require('./services/askService');

const app = express();
const publicDir = path.resolve(__dirname, '..', 'public');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    mode: config.useMock ? 'mock' : 'live'
  });
});

app.post('/api/ask', async (req, res) => {
  const question = String((req.body && req.body.question) || '').trim();

  if (!question) {
    res.status(400).json({
      error: 'question is required'
    });
    return;
  }

  try {
    const result = await askQuestion(question);

    res.json({
      answer: result.answer,
      sources: result.sources,
      mode: result.mode
    });
  } catch (error) {
    res.status(500).json({
      error: 'internal_error',
      message: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Eye Tumor Agent backend listening on http://localhost:${config.port}`);
});
