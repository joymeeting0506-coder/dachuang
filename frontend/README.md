# 🏮 非遗纹样 AI 生成平台 — 前端

> 基于 **React 19 + TypeScript + Vite 8** 构建的非物质文化遗产纹样智能生成平台，助力传统文化数字化创新。

---

## 📖 项目简介

本平台是一个面向非遗纹样设计的 AI 辅助工具，用户可以通过选择纹样类别、主题标签、配色方案等参数，一键生成精美的非遗风格纹样图案。平台采用经典的三栏布局：

| 区域 | 功能 |
|------|------|
| **左侧面板** | 参数配置区 — 选择类别、主题、配色、尺寸、风格强度等 |
| **中央面板** | 结果展示区 — 展示 AI 生成的纹样图片，支持对比和灯箱浏览 |
| **右侧面板** | 历史记录区 — 查看生成历史、收藏纹样、查看详情 |

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [React](https://react.dev/) | ^19.2 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | 类型安全 |
| [Vite](https://vite.dev/) | ^8.1 | 构建工具 |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.3 | 原子化 CSS 框架 |
| [Zustand](https://zustand.docs.pmnd.rs/) | ^5.0 | 轻量级状态管理 |
| [Oxlint](https://oxc.rs/) | ^1.71 | 代码检查工具 |

---

## 📁 项目结构

```
非遗AI-前端/
├── index.html                  # 入口 HTML
├── package.json                # 项目依赖与脚本
├── tsconfig.json               # TypeScript 配置入口
├── tsconfig.app.json           # 应用 TS 配置
├── tsconfig.node.json          # 工具链 TS 配置
├── public/                     # 静态资源（不经编译）
│   ├── favicon.svg             # 网站图标
│   ├── logo.svg                # 平台 Logo
│   └── icons.svg               # 图标集
├── src/                        # 源代码
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件（三栏布局）
│   ├── index.css               # 全局样式 + Tailwind 引入
│   ├── components/
│   │   ├── Header/             # 顶部导航栏
│   │   │   ├── Header.tsx
│   │   │   ├── Logo.tsx
│   │   │   └── ActionButtons.tsx
│   │   ├── LeftPanel/          # 左侧参数面板
│   │   │   ├── LeftPanel.tsx
│   │   │   ├── CategoryDropdown.tsx      # 纹样类别下拉
│   │   │   ├── ThemeTagsSelector.tsx     # 主题标签选择
│   │   │   ├── ColorSchemePicker.tsx     # 配色方案选择
│   │   │   ├── SizePresetSelector.tsx    # 尺寸预设
│   │   │   ├── StyleStrengthSlider.tsx   # 风格强度滑块
│   │   │   ├── SeedInput.tsx             # 随机种子输入
│   │   │   ├── GenerationCountSelector.tsx # 生成数量
│   │   │   └── GenerateButton.tsx        # 生成按钮
│   │   ├── CenterPanel/        # 中央结果展示
│   │   │   ├── CenterPanel.tsx
│   │   │   ├── PlaceholderState.tsx      # 空状态占位
│   │   │   ├── ResultGrid.tsx            # 结果网格
│   │   │   ├── ImageCard.tsx             # 单张图片卡片
│   │   │   ├── ImageLightbox.tsx         # 图片灯箱
│   │   │   ├── ComparisonOverlay.tsx     # 对比叠加
│   │   │   └── CulturalProductBar.tsx    # 文创产品栏
│   │   └── RightPanel/         # 右侧历史面板
│   │       ├── RightPanel.tsx
│   │       ├── TabBar.tsx                # 标签页切换
│   │       ├── HistoryTab.tsx            # 历史记录
│   │       ├── CurrentDetailTab.tsx      # 当前详情
│   │       ├── HistoryThumbnail.tsx      # 历史缩略图
│   │       └── StarRating.tsx            # 星级评分
│   ├── store/                  # 状态管理
│   │   ├── constants.ts        # 常量定义
│   │   └── mockData.ts         # 模拟数据
│   └── utils/
│       └── formatTime.ts       # 时间格式化工具
└── dist/                       # 构建产物（`npm run build` 后生成）
```

---

## 🚀 快速开始（本地开发）

跟着下面的步骤，你就能在 5 分钟内把项目跑起来 👇

### 第 1 步：检查电脑环境

在开始之前，请确保你的电脑已经安装了以下工具：

- **Node.js** ≥ 18 版本（推荐 20 LTS 或更高）
- **npm**（一般随 Node.js 一起安装，版本 ≥ 9）

> 🔍 **怎么检查有没有安装？**
>
> 打开终端（Windows 上按 `Win + R`，输入 `cmd` 回车），分别输入以下命令：
>
> ```bash
> node --version    # 应该显示 v18.x.x 或 v20.x.x 等
> npm --version     # 应该显示 9.x.x 或 10.x.x 等
> ```
>
> 如果提示 "不是内部或外部命令"，说明还没安装，请看下面的安装指南 👇

#### 📥 安装 Node.js（如果还没装）

1. 打开浏览器，访问 [Node.js 官网](https://nodejs.org/)
2. 点击左侧的 **"LTS"** 按钮（长期支持版，最稳定），下载安装包
3. 双击下载好的 `.msi` 安装包，一路点击 **"Next"**，全部用默认选项即可
4. 安装完成后，**重新打开**终端，再次输入 `node --version` 验证

> ✅ 如果显示版本号，说明安装成功！

---

### 第 2 步：下载项目代码

如果你还没有项目代码，可以通过以下方式获取：

**方式一：Git 克隆（推荐）**
```bash
git clone <你的仓库地址>
cd 非遗AI-前端
```

**方式二：直接下载 ZIP**
- 从代码托管平台下载 ZIP 压缩包
- 解压到你想要的位置
- 打开终端，`cd` 到解压后的 `非遗AI-前端` 文件夹

> 💡 **终端小技巧**：在 Windows 文件资源管理器中，先进入 `非遗AI-前端` 文件夹，然后在地址栏输入 `cmd` 并回车，可以直接在该目录打开终端！

---

### 第 3 步：安装项目依赖

在终端中确保当前目录是 `非遗AI-前端`，然后运行：

```bash
npm install
```

这个命令会根据 `package.json` 自动下载所有需要的第三方库。根据网络情况，通常需要 1-3 分钟。

> ⚠️ **常见问题**：如果安装特别慢，可以改用国内镜像源：
>
> ```bash
> npm config set registry https://registry.npmmirror.com
> npm install
> ```

安装完成后，项目根目录会多出一个 `node_modules/` 文件夹（这就是所有依赖库），**不要删除它**。

---

### 第 4 步：启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示类似以下信息：

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

在浏览器中打开 `http://localhost:5173/`，就能看到运行中的平台啦 🎉

> 💡 开发模式下，你修改的任何代码都会**自动热更新**（无需刷新浏览器），非常方便调试。

---

### 第 5 步：开始开发 ✨

常用的几个命令：

| 命令 | 作用 | 什么时候用 |
|------|------|------------|
| `npm run dev` | 启动开发服务器 | 日常开发调试 |
| `npm run build` | 构建生产版本 | 准备好要部署上线时 |
| `npm run preview` | 本地预览生产版本 | 构建后先看看效果再部署 |
| `npm run lint` | 代码检查 | 提交代码前检查规范性 |

---

## 📦 部署指南（小白友好版）

本节将手把手教你如何将项目部署到服务器上，让所有人都能通过网址访问。

### 🖥️ 方式一：部署到静态服务器（推荐新手）

项目构建后的产物是纯静态文件（HTML + CSS + JS），可以部署到任何静态服务器上。

#### 步骤 1：构建生产版本

在项目根目录运行：

```bash
npm run build
```

构建完成后，项目根目录会生成一个 `dist/` 文件夹，这里面就是你要部署的全部文件。

#### 步骤 2：把 `dist/` 文件夹上传到服务器

以下是几种常见的部署方式，任选其一：

---

**选项 A：使用 Nginx（最经典、最推荐）**

1. **安装 Nginx**（以 Ubuntu/Debian 为例）：
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **上传 `dist/` 文件夹**到服务器的某个目录，比如 `/var/www/feiyi-ai/`：
   ```bash
   # 在本地电脑执行（替换为你的服务器 IP）
   scp -r dist/* user@你的服务器IP:/var/www/feiyi-ai/
   ```

3. **配置 Nginx**，创建一个配置文件：
   ```bash
   sudo nano /etc/nginx/sites-available/feiyi-ai
   ```

   写入以下内容：
   ```nginx
   server {
       listen 80;
       server_name 你的域名.com;   # 没有域名就填服务器 IP

       root /var/www/feiyi-ai;
       index index.html;

       # 处理 SPA 路由（重要！）
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 静态资源缓存（提升访问速度）
       location /assets {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Gzip 压缩（减少传输体积）
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   }
   ```

4. **启用配置并重启 Nginx**：
   ```bash
   sudo ln -s /etc/nginx/sites-available/feiyi-ai /etc/nginx/sites-enabled/
   sudo nginx -t          # 先检查配置有没有语法错误
   sudo systemctl restart nginx
   ```

5. 现在访问你的服务器 IP 或域名，就能看到平台了！

---

**选项 B：使用宝塔面板（更适合小白）**

如果你觉得命令行太复杂，可以用带图形界面的宝塔面板：

1. 在服务器上安装宝塔面板：[官方安装教程](https://www.bt.cn/new/download.html)
2. 登录宝塔面板 → 点击左侧 **"网站"** → **"添加站点"**
3. 填写域名（没有就用 IP），选择 **"纯静态"**
4. 点击刚创建的站点 → **"文件"** → 进入网站根目录
5. 把本地 `dist/` 文件夹里的所有文件拖拽上传
6. 点击 **"设置"** → **"伪静态"**，粘贴以下规则：
   ```
   try_files $uri $uri/ /index.html;
   ```
7. 保存，访问你的站点即可！

---

**选项 C：使用 Vercel / Netlify（免费、最简单、适合个人项目）**

这两个平台提供免费额度，部署只需几分钟：

1. 注册 [Vercel](https://vercel.com/) 或 [Netlify](https://www.netlify.com/) 账号（可以直接用 GitHub 登录）

2. **Vercel 部署**：
   - 点击 **"New Project"** → 导入你的 Git 仓库
   - 框架自动识别为 Vite，无需修改任何设置
   - 点击 **"Deploy"**，等待 1 分钟左右就完成
   - Vercel 会自动分配一个 `xxx.vercel.app` 域名

3. **Netlify 部署**：
   - 点击 **"Add new site"** → **"Deploy manually"**
   - 将本地 `dist/` 文件夹直接拖拽到网页上的虚线框区域
   - 松开鼠标，Netlify 自动完成部署，分配 `xxx.netlify.app` 域名

> 🎉 无需服务器、无需配置，几分钟就能上线！

---

**选项 D：使用 GitHub Pages（免费）**

1. 将项目推送到 GitHub 仓库
2. 在仓库的 **Settings** → **Pages** 中：
   - Source 选择 **"GitHub Actions"**
3. 在项目中创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

4. 推送代码到 `main` 分支，GitHub Actions 会自动构建并部署
5. 访问 `https://你的用户名.github.io/仓库名/` 即可

---

### 🐳 方式二：使用 Docker 部署

适合已经熟悉 Docker 的用户：

1. 在项目根目录创建 `Dockerfile`：
   ```dockerfile
   # 阶段一：构建
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   # 阶段二：运行
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. 创建 `nginx.conf`：
   ```nginx
   server {
       listen 80;
       root /usr/share/nginx/html;
       index index.html;
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. 构建并运行：
   ```bash
   docker build -t feiyi-ai .
   docker run -d -p 8080:80 --name feiyi-ai feiyi-ai
   ```

4. 访问 `http://localhost:8080`

---

## 🔧 配置说明

### 环境变量

项目目前未使用环境变量，如需添加后端 API 地址等配置，可以创建 `.env` 文件：

```bash
# .env（开发环境）
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production（生产环境）
VITE_API_BASE_URL=https://你的后端域名.com/api
```

> ⚠️ 以 `VITE_` 开头的变量才能在代码中通过 `import.meta.env.VITE_xxx` 访问。

### Tailwind CSS 配置

项目使用 Tailwind CSS v4，样式入口在 `src/index.css`。如需要自定义主题，在 `index.css` 中使用 `@theme` 指令：

```css
@import "tailwindcss";

@theme {
  --color-paper: #fdf8f0;
  --color-primary: #b91c1c;
  /* 添加更多自定义颜色... */
}
```

---

## ❓ 常见问题 FAQ

### Q1：`npm install` 报错怎么办？
- 先确认 Node.js 版本 ≥ 18：`node --version`
- 尝试清除缓存后重装：`npm cache clean --force && npm install`
- 尝试删除 `node_modules` 和 `package-lock.json` 后重装

### Q2：`npm run dev` 后浏览器一片空白？
- 按 `F12` 打开开发者工具，查看 **Console** 面板有没有红色报错
- 确认所有依赖都安装成功（检查 `node_modules` 文件夹是否存在）

### Q3：部署后刷新页面出现 404？
- Nginx 需要配置 `try_files $uri $uri/ /index.html;`（见上方 Nginx 部署步骤）
- 这是单页应用（SPA）的典型问题，所有路由都要指向 `index.html`

### Q4：图片加载不出来？
- 检查图片资源是否放在 `public/` 目录下
- 确认引用路径是否正确（`public/` 下的文件在代码中用 `/xxx.svg` 引用，不需要写 `public`）

### Q5：如何更换网站图标和 Logo？
- 替换 `public/favicon.svg` → 浏览器标签页图标
- 替换 `public/logo.svg` → 平台 Logo

### Q6：开发时端口被占用？
- Vite 会自动尝试下一个端口（5174、5175…），看终端提示即可
- 或者手动指定端口：修改 `vite.config.ts`，或运行 `npm run dev -- --port 3000`

---

## 📄 License

本项目仅供学习交流使用。

---

## 🙏 鸣谢

- [Vite](https://vite.dev/) — 极速的前端构建工具
- [React](https://react.dev/) — 强大的 UI 库
- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的 CSS 框架
- [Zustand](https://zustand.docs.pmnd.rs/) — 简单好用的状态管理
