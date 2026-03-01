const normalizeSource = (source) => {
  return {
    title: source.title || '未命名来源',
    site: source.site || '',
    url: source.url || '',
    snippet: source.snippet || ''
  };
};

const dedupeSources = (sources) => {
  const seen = new Set();

  return sources
    .map(normalizeSource)
    .filter((item) => item.url)
    .filter((item) => {
      if (seen.has(item.url)) {
        return false;
      }

      seen.add(item.url);
      return true;
    });
};

module.exports = {
  dedupeSources
};
