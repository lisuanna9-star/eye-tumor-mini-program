# 后端接口设计

这个项目的核心不是小程序页面，而是后端这一层。

你最终要做的是：

1. 接收用户问题
2. 联网搜索权威医学来源
3. 让大模型基于搜索结果生成回答
4. 把回答和来源一起返回给小程序

## 推荐接口

### `POST /api/ask`

请求体：

```json
{
  "question": "视网膜母细胞瘤常见于什么年龄？"
}
```

返回体：

```json
{
  "answer": "视网膜母细胞瘤多见于婴幼儿和儿童，很多病例在 5 岁以前被发现。",
  "sources": [
    {
      "title": "Retinoblastoma Treatment",
      "site": "National Cancer Institute",
      "url": "https://www.cancer.gov/types/retinoblastoma"
    },
    {
      "title": "Retinoblastoma",
      "site": "PubMed",
      "url": "https://pubmed.ncbi.nlm.nih.gov/"
    }
  ]
}
```

## 后端内部流程

### 1. 搜索

建议只搜高质量来源，例如：

- `pubmed.ncbi.nlm.nih.gov`
- `cancer.gov`
- `who.int`
- 国内大型三甲医院官网
- 正式指南网站

### 2. 过滤

过滤广告、论坛、营销站和无作者来源。

### 3. 生成回答

把搜索结果摘要后交给模型，并明确要求：

- 只能依据检索结果回答
- 不确定时明确说不确定
- 必须返回来源
- 不要输出确定性诊断

### 4. 风险控制

如果用户提到以下内容，建议优先返回“尽快就医”提示：

- 视力突然下降
- 白瞳症
- 持续眼痛
- 眼球突出
- 明显视物变形
- 儿童异常斜视

## 小程序接入方法

修改 `services/agent.js` 里的这两处：

1. 把 `USE_MOCK` 改成 `false`
2. 把 `API_BASE_URL` 改成你的真实后端地址
