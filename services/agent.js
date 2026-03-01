const config = {
  useMock: false,
  apiBaseUrls: ['http://w6d925dd.natappfree.cc', 'http://127.0.0.1:3000']
};

const mockAnswer = (question) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        content:
          '这是前端本地演示数据。\n\n' +
          `你的问题是：“${question}”。\n` +
          '接入后端后，这里会显示联网检索后的正式回答，并带有来源链接。',
        sources: [
          {
            title: 'National Cancer Institute',
            site: 'cancer.gov',
            url: 'https://www.cancer.gov/',
            snippet: '权威癌症信息网站。'
          }
        ]
      });
    }, 600);
  });
};

const requestAgent = (baseUrl, question) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}/api/ask`,
      method: 'POST',
      data: {
        question
      },
      success: (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const data = response.data || {};

          resolve({
            content: data.answer || '未获取到回答。',
            sources: Array.isArray(data.sources) ? data.sources : [],
            mode: data.mode || 'unknown'
          });
          return;
        }

        const message =
          response.data && response.data.message
            ? response.data.message
            : `Request failed with status ${response.statusCode}`;

        reject(new Error(`${baseUrl}: ${message}`));
      },
      fail: (error) => {
        reject(new Error(`${baseUrl}: ${error.errMsg || 'request failed'}`));
      }
    });
  });
};

const askOnlineAgent = async (question) => {
  const errors = [];

  for (const baseUrl of config.apiBaseUrls) {
    try {
      return await requestAgent(baseUrl, question);
    } catch (error) {
      errors.push(error.message);
    }
  }

  throw new Error(errors.join('\n'));
};

const askEyeTumorAgent = (question) => {
  if (config.useMock) {
    return mockAnswer(question);
  }

  return askOnlineAgent(question);
};

module.exports = {
  askEyeTumorAgent,
  agentConfig: config
};
