const stripThinkBlocks = (text) => {
  if (!text) {
    return '';
  }

  return String(text)
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^\s*<think>[\s\S]*$/gi, '')
    .trim();
};

module.exports = {
  stripThinkBlocks
};
