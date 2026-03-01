const state = {
  loading: false
};

const messagesElement = document.getElementById('messages');
const questionInput = document.getElementById('questionInput');
const composer = document.getElementById('composer');
const sendButton = document.getElementById('sendButton');
const healthText = document.getElementById('healthText');
const refreshHealthButton = document.getElementById('refreshHealthButton');
const messageTemplate = document.getElementById('messageTemplate');
const quickQuestionButtons = document.querySelectorAll('.chip');

const setLoading = (loading) => {
  state.loading = loading;
  sendButton.disabled = loading;
  sendButton.textContent = loading ? '整理中...' : '发送';
};

const createSourceCard = (source) => {
  const card = document.createElement('article');
  card.className = 'source-card';

  const title = document.createElement('div');
  title.className = 'source-card__title';
  title.textContent = source.title || '未命名来源';
  card.appendChild(title);

  if (source.site) {
    const meta = document.createElement('div');
    meta.className = 'source-card__meta';
    meta.textContent = source.site;
    card.appendChild(meta);
  }

  if (source.snippet) {
    const snippet = document.createElement('div');
    snippet.className = 'source-card__snippet';
    snippet.textContent = source.snippet;
    card.appendChild(snippet);
  }

  if (source.url) {
    const link = document.createElement('a');
    link.className = 'source-card__url';
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = source.url;
    card.appendChild(link);
  }

  return card;
};

const appendMessage = ({ role, content, sources = [] }) => {
  const fragment = messageTemplate.content.cloneNode(true);
  const message = fragment.querySelector('.message');
  const roleElement = fragment.querySelector('.message__role');
  const contentElement = fragment.querySelector('.message__content');
  const sourcesElement = fragment.querySelector('.sources');
  const sourcesListElement = fragment.querySelector('.sources__list');

  roleElement.textContent = role === 'user' ? '我' : '助手';
  contentElement.textContent = content;

  if (role === 'user') {
    message.classList.add('message--user');
  }

  if (Array.isArray(sources) && sources.length > 0) {
    sourcesElement.hidden = false;
    sources.forEach((source) => {
      sourcesListElement.appendChild(createSourceCard(source));
    });
  }

  messagesElement.appendChild(fragment);
  messagesElement.scrollTop = messagesElement.scrollHeight;
};

const updateHealth = async () => {
  healthText.textContent = '检测中...';

  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    healthText.textContent = data.ok
      ? `在线，当前模式：${data.mode === 'live' ? '联网问答' : '本地示例'}`
      : '服务异常';
  } catch (error) {
    healthText.textContent = '无法连接后端服务';
  }
};

const askAgent = async (question) => {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question || state.loading) {
    return;
  }

  appendMessage({
    role: 'user',
    content: question
  });

  questionInput.value = '';
  setLoading(true);

  try {
    const result = await askAgent(question);

    appendMessage({
      role: 'assistant',
      content: result.answer || '未获取到有效回答。',
      sources: result.sources || []
    });
  } catch (error) {
    appendMessage({
      role: 'assistant',
      content: `当前请求失败。\n\n${error.message || '请稍后再试。'}`
    });
  } finally {
    setLoading(false);
  }
};

composer.addEventListener('submit', handleSubmit);

questionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

refreshHealthButton.addEventListener('click', updateHealth);

quickQuestionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    questionInput.value = button.dataset.question || '';
    questionInput.focus();
  });
});

appendMessage({
  role: 'assistant',
  content:
    '我是眼肿瘤智能助手 H5 版。你可以直接问我：葡萄膜黑色素瘤有哪些症状、视网膜母细胞瘤常见于什么年龄、白瞳症为什么要尽快检查。'
});

updateHealth();
