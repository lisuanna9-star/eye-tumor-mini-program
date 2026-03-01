# Render 部署指南

这个项目现在的结构已经适合直接部署到 Render。

部署后：

- `https://你的域名/` 是 H5 页面
- `https://你的域名/api/ask` 是问答接口
- `https://你的域名/api/health` 是健康检查

## 1. 先做什么

### 不要上传这些内容

- `backend/.env`
- `backend/node_modules/`

项目根目录已经有 `.gitignore`，正常情况下不会提交它们。

### 你需要准备

1. 一个 GitHub 仓库
2. 一个 Render 账号
3. `Tavily API Key`
4. `MiniMax API Key`

## 2. 推到 GitHub

如果你电脑已经装了 Git，可以在项目根目录执行：

```bash
git init
git add .
git commit -m "init eye tumor agent"
```

然后把它推到你自己的 GitHub 仓库。

如果你不会用 Git，也可以先在 GitHub Desktop 里操作。

## 3. Render 怎么部署

### 方法一：直接识别 `render.yaml`

1. 登录 Render
2. 选择 `New +`
3. 选择 `Blueprint`
4. 连接你的 GitHub 仓库
5. Render 会读取项目根目录下的 `render.yaml`

当前项目已经提供：

- 根目录文件：`render.yaml`
- 服务根目录：`backend`
- 启动命令：`npm start`

## 4. 需要在 Render 后台补的变量

这两个变量不能直接写进仓库，需要你在 Render 页面手动填：

- `TAVILY_API_KEY`
- `OPENAI_API_KEY`

其他变量已经在 `render.yaml` 里给了默认值：

```text
USE_MOCK=false
OPENAI_BASE_URL=https://api.minimaxi.com/v1
OPENAI_MODEL=MiniMax-M2.5
```

## 5. 部署成功后怎么测试

假设 Render 给你的地址是：

```text
https://eye-tumor-agent.onrender.com
```

你先打开：

```text
https://eye-tumor-agent.onrender.com/api/health
```

如果能看到类似：

```json
{"ok":true,"time":"...","mode":"live"}
```

说明后端已经正常。

再打开：

```text
https://eye-tumor-agent.onrender.com
```

这就是 H5 页面。

## 6. 小程序怎么接这个线上地址

打开：

- `services/agent.js`

把 `apiBaseUrls` 改成：

```js
const config = {
  useMock: false,
  apiBaseUrls: ['https://eye-tumor-agent.onrender.com']
};
```

然后重新编译小程序。

## 7. 小程序后台还要做什么

正式环境下，你还要去微信小程序后台配置：

- `request` 合法域名

填入你的 Render 域名，例如：

```text
https://eye-tumor-agent.onrender.com
```

## 8. 医学内容提醒

你这个项目上线时建议保留这些提示：

- 仅供健康知识参考
- 不能替代医生面诊
- 高风险症状提示尽快就医
