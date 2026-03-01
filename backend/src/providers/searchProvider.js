const { config } = require('../config');

const allowedDomains = [
  'cancer.gov',
  'pubmed.ncbi.nlm.nih.gov',
  'medlineplus.gov',
  'who.int',
  'mayoclinic.org',
  'clevelandclinic.org'
];

const buildSearchQuery = (question) => {
  return `${question} (${allowedDomains.map((item) => `site:${item}`).join(' OR ')})`;
};

const searchWithTavily = async (question) => {
  if (!config.tavilyApiKey) {
    return [];
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: config.tavilyApiKey,
      query: buildSearchQuery(question),
      search_depth: 'advanced',
      topic: 'general',
      max_results: 6,
      include_answer: false,
      include_raw_content: false
    })
  });

  if (!response.ok) {
    throw new Error(`Search provider failed: ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map((item) => ({
    title: item.title || 'Untitled',
    site: item.url ? new URL(item.url).hostname : '',
    url: item.url || '',
    snippet: item.content || ''
  }));
};

module.exports = {
  searchWithTavily
};
