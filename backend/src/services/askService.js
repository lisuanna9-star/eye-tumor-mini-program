const { config } = require('../config');
const { mockKnowledge } = require('../data/mockKnowledge');
const { generateAnswer } = require('../providers/llmProvider');
const { searchWithTavily } = require('../providers/searchProvider');
const { dedupeSources } = require('../utils/sources');
const { buildRiskNotice } = require('../utils/triage');

const buildMockResponse = (question) => {
  const matched = mockKnowledge.find((item) =>
    item.keywords.some((keyword) => question.toLowerCase().includes(keyword.toLowerCase()))
  );
  const riskNotice = buildRiskNotice(question);

  if (!matched) {
    return {
      answer:
        '当前后端仍在 mock 模式，而且本地示例知识库没有匹配到这个问题。\n\n' +
        '如果你希望像真实 AI 一样根据任意问题联网检索并生成答案，请把 backend/.env 里的 USE_MOCK 改成 false，然后重启后端。' +
        (riskNotice ? `\n\n${riskNotice}` : ''),
      sources: [],
      mode: 'mock_unmatched'
    };
  }

  const answer = riskNotice ? `${matched.answer}\n\n${riskNotice}` : matched.answer;

  return {
    answer,
    sources: matched.sources,
    mode: 'mock'
  };
};

const buildRealResponse = async (question) => {
  const riskNotice = buildRiskNotice(question);
  const searchResults = await searchWithTavily(question);

  if (searchResults.length === 0) {
    return {
      answer:
        '当前没有检索到足够的权威资料，建议换一种问法，或优先咨询医院眼科/眼肿瘤专科。' +
        (riskNotice ? `\n\n${riskNotice}` : ''),
      sources: [],
      mode: 'search_empty'
    };
  }

  const answer = await generateAnswer(question, searchResults, riskNotice);

  return {
    answer,
    sources: dedupeSources(searchResults),
    mode: 'live'
  };
};

const askQuestion = async (question) => {
  if (config.useMock || !config.tavilyApiKey || !config.openAiApiKey) {
    return buildMockResponse(question);
  }

  return buildRealResponse(question);
};

module.exports = {
  askQuestion
};
