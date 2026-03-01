# 运行指南

## 1. 你需要安装什么

先安装这两个软件：

1. Node.js 18 或以上
2. 微信开发者工具

## 2. 怎么跑后端

进入项目的 `backend` 目录：

```bash
cd backend
```

复制环境变量文件：

```bash
cp .env.example .env
```

安装依赖：

```bash
npm install
```

启动：

```bash
npm run dev
```

看到下面这句类似输出，就说明成功了：

```text
Eye Tumor Agent backend listening on http://localhost:3000
```

这时你可以直接在浏览器里打开：

```text
http://127.0.0.1:3000
```

打开的就是 H5 聊天版。

## 3. 怎么让小程序连上后端

打开 [services/agent.js](d:\第二酱料大学\2025 spring\眼肿瘤\眼肿瘤筛选小程序\services\agent.js)

把：

```js
useMock: true
```

改成：

```js
useMock: false
```

## 4. 微信开发者工具怎么导入

1. 打开微信开发者工具
2. 点击“导入”
3. 选择当前项目根目录
4. 没有正式 `AppID` 就先用测试号
5. 导入完成后编译

## 5. 真机为什么可能请求失败

因为微信小程序正式环境通常要求：

- HTTPS
- 已配置合法域名

所以如果你只是本地开发：

- 开发者工具里一般更容易调试
- 真机通常要通过公网 HTTPS 域名访问后端

## 6. 如果你没有 API Key

也可以跑。

方法：

1. 后端 `.env` 里保持 `USE_MOCK=true`
2. 小程序 `services/agent.js` 里把 `useMock` 改成 `false`

这样小程序会请求后端，但后端返回 mock 数据，适合你做作业演示。
