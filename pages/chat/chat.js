const { askEyeTumorAgent, agentConfig } = require('../../services/agent');

Page({
  data: {
    inputValue: '',
    loading: false,
    suggestions: [
      '视网膜母细胞瘤常见于什么年龄？',
      '葡萄膜黑色素瘤有哪些症状？',
      '孩子拍照有白瞳是不是很危险？'
    ],
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          `我是眼肿瘤智能助手。当前模式：${agentConfig.useMock ? '前端本地演示' : '后端联网问答'}。\n你可以直接问我：葡萄膜黑色素瘤是什么、视网膜母细胞瘤常见症状、哪些情况需要尽快去医院检查。`,
        sources: []
      }
    ]
  },

  handleInput(event) {
    this.setData({
      inputValue: event.detail.value
    });
  },

  useSuggestion(event) {
    this.setData({
      inputValue: event.currentTarget.dataset.question
    });
  },

  copySourceUrl(event) {
    const { url } = event.currentTarget.dataset;

    if (!url) {
      return;
    }

    wx.setClipboardData({
      data: url
    });
  },

  handleSend() {
    const question = this.data.inputValue.trim();

    if (!question || this.data.loading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      sources: []
    };

    this.setData({
      loading: true,
      inputValue: '',
      messages: [...this.data.messages, userMessage]
    });

    askEyeTumorAgent(question)
      .then((answer) => {
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: answer.content,
          sources: answer.sources
        };

        this.setData({
          loading: false,
          messages: [...this.data.messages, assistantMessage]
        });
      })
      .catch((error) => {
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            '当前接口不可用。\n\n' +
            (error && error.message
              ? error.message
              : '请先确认后端是否启动，或先把 `services/agent.js` 里的 `useMock` 保持为 `true`。'),
          sources: []
        };

        this.setData({
          loading: false,
          messages: [...this.data.messages, assistantMessage]
        });
      });
  }
});
