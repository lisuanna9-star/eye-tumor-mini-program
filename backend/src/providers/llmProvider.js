const { config } = require('../config');
const { stripThinkBlocks } = require('../utils/llmText');

const systemPrompt = [
  '你是一个眼肿瘤健康知识助手。',
  '你只能根据提供的检索资料回答。',
  '如果资料不足，明确说“目前检索到的资料不足以支持明确结论”。',
  '不要给出确定性诊断，不要替代医生面诊。',
  '回答尽量通俗，适合普通用户阅读。',
  '如果存在高风险症状，提醒尽快线下就医。',
  '输出中文，不使用 markdown 标题。'
].join('\n');

const buildUserPrompt = (question, searchResults, riskNotice) => {
  const references = searchResults
    .map((item, index) => {
      return [
        `来源${index + 1}: ${item.title}`,
        `站点: ${item.site}`,
        `链接: ${item.url}`,
        `摘要: ${item.snippet || '无'}`
      ].join('\n');
    })
    .join('\n\n');

  return [
    `用户问题: ${question}`,
    riskNotice ? `风险提示: ${riskNotice}` : '',
    '请基于以下资料生成回答，先给出简明结论，再给出解释，最后补一句风险提示。',
    references
  ]
    .filter(Boolean)
    .join('\n\n');
};

const generateAnswer = async (question, searchResults, riskNotice) => {
  if (!config.openAiApiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const response = await fetch(`${config.openAiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openAiApiKey}`
    },
    body: JSON.stringify({
      model: config.openAiModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: buildUserPrompt(question, searchResults, riskNotice)
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`LLM provider failed: ${response.status}`);
  }

  const data = await response.json();
  const rawText =
    data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '目前未获取到有效回答。';

  return stripThinkBlocks(rawText) || '目前未获取到有效回答。';
};

module.exports = {
  generateAnswer
};
