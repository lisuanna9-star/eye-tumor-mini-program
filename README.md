# 眼肿瘤智能助手微信小程序

这是一个完整的课程项目起点，包含：

- 微信原生小程序前端
- H5 网页前端
- Node.js 后端
- 本地 mock 模式
- 联网检索 + 大模型问答接入位
- 来源展示
- 医学风险提示

## 项目结构

- `pages/chat/`: 小程序聊天首页
- `backend/public/`: H5 页面
- `services/agent.js`: 小程序请求后端的服务层
- `backend/`: Node.js 后端
- `docs/backend-api.md`: 后端接口说明
- `docs/deploy-render.md`: Render 部署说明
- `render.yaml`: Render 部署配置

## 功能说明

### 前端

- 打开小程序就是 agent 聊天页
- 支持快捷问题
- 支持展示知识来源
- 支持复制来源链接

### H5

- 浏览器打开后端根地址即可使用
- 复用同一套 `/api/ask` 与 `/api/health`
- 适合课程展示、二维码访问和网页引流

## 部署到公网

这个项目已经整理成可以直接部署到 Render 的形态。

部署后：

- H5 可以像普通网页一样通过公网链接访问
- 小程序也可以改成请求同一个公网后端

具体步骤看：

- `docs/deploy-render.md`

### 后端

- `POST /api/ask`: 接收问题并返回答案与来源
- `GET /api/health`: 健康检查
- 没有配置 API Key 时自动回退到 mock
- 配置完成后可切换为真实联网问答

## 先跑起来的方法

### 一、运行小程序前端

1. 安装微信开发者工具
2. 导入当前目录
3. `AppID` 没有的话先用测试号
4. 打开后直接进入聊天页面

当前默认配置是前端本地 mock，所以你现在就能看到聊天效果。

### 二、运行后端

前提：你的电脑要先安装 Node.js 18 或更高版本。

1. 打开终端进入 `backend`
2. 复制 `.env.example` 为 `.env`
3. 安装依赖
4. 启动服务

命令如下：

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Windows 如果没有 `cp`，可以手动复制文件。

启动成功后，默认地址：

```text
http://127.0.0.1:3000
```

浏览器访问这个地址即可打开 H5 版：

```text
http://127.0.0.1:3000
```

## 切换为“前端连后端”

修改 [services/agent.js](d:\第二酱料大学\2025 spring\眼肿瘤\眼肿瘤筛选小程序\services\agent.js)

把：

```js
useMock: true
```

改成：

```js
useMock: false
```

如果后端跑在本机，开发阶段可以先把：

```js
apiBaseUrl: 'http://127.0.0.1:3000'
```

保留不动。

## 切换为“真实联网检索 + 模型回答”

编辑 [backend/.env.example](d:\第二酱料大学\2025 spring\眼肿瘤\眼肿瘤筛选小程序\backend\.env.example) 对应生成的 `.env`：

```env
USE_MOCK=false
TAVILY_API_KEY=你的搜索key
OPENAI_API_KEY=你的模型key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

说明：

- `TAVILY_API_KEY` 用于联网搜索
- `OPENAI_API_KEY` 用于大模型总结回答
- 如果你用的是别家的 OpenAI 兼容接口，只要改 `OPENAI_BASE_URL` 和 `OPENAI_MODEL`

## 微信小程序真机调试要注意

开发者工具里可以比较宽松，但真机和正式版会更严格：

1. 后端接口最好使用 HTTPS
2. 需要在微信小程序后台配置 `request` 合法域名
3. 如果你想让老师或别人手机也能访问，你不能只用 `127.0.0.1`

开发阶段常见做法：

1. 本机启动后端
2. 用内网穿透工具映射成一个 HTTPS 地址
3. 把这个 HTTPS 地址填到小程序 `apiBaseUrl`
4. 在微信后台把该域名加入合法域名

## 推荐演示方式

如果你是做课程作业或毕业设计，推荐分三阶段演示：

1. 先演示前端 mock，证明页面和交互完成
2. 再演示后端 mock，证明前后端联通
3. 最后演示真实联网搜索和来源展示

## 医学提醒

这个项目适合做“健康知识问答”和“高风险提醒”，不适合直接替代医生诊断。正式答辩时建议明确说明：

- 不能替代专业医生面诊
- 不能输出确定性诊断结论
- 对白瞳症、儿童斜视、突然视力下降等情况提示尽快就医
