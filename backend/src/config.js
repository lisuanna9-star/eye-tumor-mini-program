const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '..', '.env')
});

const config = {
  port: Number(process.env.PORT || 3000),
  useMock: String(process.env.USE_MOCK || 'false').toLowerCase() === 'true',
  tavilyApiKey: process.env.TAVILY_API_KEY || '',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiBaseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
};

module.exports = {
  config
};
