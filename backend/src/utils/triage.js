const urgentPatterns = [
  '白瞳',
  '白瞳症',
  '斜视',
  '视力下降',
  '突然看不清',
  '视物变形',
  '眼痛',
  '眼球突出',
  '眼红',
  '飞蚊',
  '闪光',
  '儿童',
  '婴儿'
];

const buildRiskNotice = (question) => {
  const hitKeywords = urgentPatterns.filter((item) => question.includes(item));

  if (hitKeywords.length === 0) {
    return '';
  }

  return '你提到的情况包含潜在高风险眼部症状，线上信息不能替代面诊，建议尽快到眼科或具备眼肿瘤诊疗能力的医院进一步检查。';
};

module.exports = {
  buildRiskNotice
};
