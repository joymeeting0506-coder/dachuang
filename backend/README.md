# 🏮 非遗纹样 AI 生成平台 — 后端

> FastAPI + ComfyUI + DeepSeek LLM 智能体，实现自然语言驱动的非遗纹样生成服务。

---

## 📖 项目简介

本后端服务是整个非遗纹样 AI 生成平台的"大脑"，负责：

1. **接收前端请求** — 手动参数生成 or 自然语言生成
2. **调用 DeepSeek LLM** — 将用户的自然语言描述解析为结构化生成参数
3. **驱动 ComfyUI** — 将参数拼成 SDXL + LoRA workflow，提交图片生成任务
4. **返回结果** — 推送生成进度、返回图片地址

---

## 🗂️ 目录结构

```
backend/
├── main.py                          # FastAPI 入口，CORS、静态文件、路由注册
├── config.py                        # 环境变量配置（ComfyUI 地址、输出目录）
├── requirements.txt                 # Python 依赖
├── .env.example                     # 环境变量模板
├── routes/
│   ├── generate.py                  # POST /api/generate（手动参数生成）
│   └── llm_generate.py             # POST /api/generate/natural（自然语言生成）
├── services/
│   ├── pattern_service.py           # 生成任务编排（入队、轮询、下载）
│   ├── comfyui_service.py           # ComfyUI API 客户端（提交、轮询、下载）
│   ├── workflow_builder.py          # 参数 → ComfyUI workflow JSON 构建器
│   └── llm_service.py              # DeepSeek API 调用（自然语言 → 参数）
├── models/
│   └── schemas.py                   # Pydantic 数据模型
└── output/                          # 生成的图片保存目录（自动创建）
```

---

## 🚀 快速开始（5 分钟）

### 第 1 步：检查 Python 环境

```bash
python --version    # 需要 Python >= 3.10
```

如果没有安装 Python，去 [python.org](https://www.python.org/downloads/) 下载安装，安装时**勾选 "Add Python to PATH"**。

---

### 第 2 步：安装依赖

```bash
cd backend
pip install -r requirements.txt
```

> ⚠️ 如果安装很慢，用国内镜像：
> ```bash
> pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
> ```

---

### 第 3 步：配置环境变量

复制模板文件并编辑：

```bash
cp .env.example .env
```

打开 `.env`，填写以下内容：

```env
# ComfyUI 服务地址（本地就是 http://127.0.0.1:8000）
# ⚠️ 注意：ComfyUI 桌面版默认端口是 8000，命令行版默认是 8188
COMFYUI_BASE_URL=http://127.0.0.1:8000

# 图片输出目录
OUTPUT_DIR=./output

# DeepSeek API（自然语言生成需要）
LLM_BASE_URL=https://api.deepseek.com
LLM_API_KEY=sk-你的deepseek-api-key      # ← 改成你自己的 Key
LLM_MODEL=deepseek-chat
LLM_TIMEOUT=15                             # LLM 超时秒数（默认 15）
```

#### 📥 怎么获取 DeepSeek API Key？

1. 打开 [platform.deepseek.com](https://platform.deepseek.com)
2. 注册/登录 → 点击左侧 **"API Keys"**
3. 点击 **"创建 API Key"**，复制并粘贴到 `.env` 文件中
4. 新用户通常有免费额度，够开发测试用

> 🧪 如果你暂时不测试自然语言生成功能，可以先跳过这步，后端仍可以手动参数生成。

---

### 第 4 步：确保 ComfyUI 在运行

后端需要调用 ComfyUI 来生成图片。确认 ComfyUI 已在运行：

- **ComfyUI 桌面版**：直接打开桌面快捷方式即可（默认端口 `8000`）
- **ComfyUI 命令行版**：
  ```bash
  cd ComfyUI
  python main.py --listen 0.0.0.0 --port 8188
  ```

验证 ComfyUI 是否正常运行：
```bash
curl http://127.0.0.1:8000/system_stats
# 返回 JSON 数据说明 OK
```

---

### 第 5 步：启动后端

```bash
python main.py
```

看到以下输出表示成功：

```
INFO:     Uvicorn running on http://0.0.0.0:7860
```

---

### 第 6 步：验证

浏览器打开以下地址验证：

| 接口 | 地址 | 预期结果 |
|------|------|----------|
| 健康检查 | http://localhost:7860/api/health | `{"status":"ok"}` |
| ComfyUI 连通性 | http://localhost:7860/api/comfyui/health | `{"connected":true}` |

也可以直接用 curl：
```bash
curl http://localhost:7860/api/health
```

---

## 📡 API 接口文档

### 1. 手动参数生成

```bash
POST /api/generate
```

**请求示例：**
```json
{
  "category": "paper_cut",
  "style_strength": 70,
  "prompt": "phoenix pattern, symmetrical",
  "theme_tags": ["龙凤呈祥", "花开富贵"],
  "color_scheme_id": "classic-vermillion",
  "size_preset": "square",
  "count": 2
}
```

**可选参数说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `category` | 枚举 | **必填** | `paper_cut` / `dunhuang` / `miao_embroidery` / `silk` |
| `style_strength` | int | 50 | 风格强度 0-100 |
| `prompt` | string | "" | 自定义英文提示词 |
| `theme_tags` | []string | [] | 主题标签（中文） |
| `color_scheme_id` | string | classic-vermillion | 配色方案 ID |
| `size_preset` | 枚举 | square | `square` / `portrait` / `landscape` |
| `count` | int | 2 | 生成数量 1-4 |
| `seed` | int? | null | 随机种子，null=随机 |

**可选配色方案：**
- `classic-vermillion` → 朱砂古韵（红金）
- `dunhuang-mural` → 敦煌壁画（土褐/青绿/金）
- `blue-white` → 青花瓷韵（蓝白）
- `miao-silver` → 苗银风采（深木/银/靛蓝）
- `silk-brocade` → 锦绣华彩（金/红/绿/紫）
- `jade-green` → 碧玉清雅（玉绿/奶油）

**返回：**
```json
{
  "task_id": "task_abc123def456",
  "status": "queued",
  "estimated_time": 13
}
```

**轮询结果：**
```bash
GET /api/generate/{task_id}
```
```json
{
  "task_id": "task_abc123def456",
  "status": "done",
  "progress": 100,
  "images": [
    { "id": "img_task_abc_0", "url": "/api/output/task_abc_0.png" }
  ]
}
```

---

### 2. 自然语言生成（AI 智能体）

```bash
POST /api/generate/natural
```

**请求示例：**
```json
{
  "prompt": "红色剪纸凤凰图案，对称构图，颜色浓重",
  "count": 2
}
```

工作流程：
```
用户输入自然语言 → DeepSeek LLM 解析参数 → 自动填参 → ComfyUI 生成 → 返回图片
```

**返回（含 LLM 解析结果）：**
```json
{
  "task_id": "task_xyz789",
  "status": "queued",
  "estimated_time": 21,
  "parsed_params": {
    "category": "paper_cut",
    "style_strength": 75,
    "color_scheme_id": "classic-vermillion",
    "theme_tags": ["龙凤呈祥", "花开富贵"],
    "prompt": "traditional Chinese paper cut art, phoenix, symmetrical, red and gold",
    ...
  }
}
```

返回的 `parsed_params` 展示了 LLM 对用户输入的理解结果，方便调试和确认。

---

### 3. ComfyUI 连通性检查

```bash
GET /api/comfyui/health
```
```json
{ "connected": true, "endpoint": "http://127.0.0.1:8000" }
```

---

## 🔧 常见问题

### Q1：启动后端报错 `ModuleNotFoundError: No module named 'xxx'`
→ 没有安装依赖，运行 `pip install -r requirements.txt`

### Q2：生成时报错 `Failed to submit to ComfyUI — is it running at ...`
→ ComfyUI 没有启动，或者端口号不对。检查 `.env` 中 `COMFYUI_BASE_URL` 的端口：
- 桌面版默认 `8000`
- 命令行版默认 `8188`

### Q3：自然语言生成失败 `LLM API 调用失败`
→ 检查 `.env` 中 `LLM_API_KEY` 是否正确，是否有额度

### Q4：生成超时
→ ComfyUI 加载大模型时需要预热，第一张图可能慢一些（30-60s），后面会快

### Q5：端口 7860 被占用
→ 修改 `main.py` 最后一行的端口号，改成其他端口（如 `7880`），同时更新前端的 Vite 代理配置

### Q6：想用其他 LLM（不用 DeepSeek）
→ OpenAI 兼容的 API 都支持，修改 `.env`：
```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-your-openai-key
LLM_MODEL=gpt-4o-mini
```

---

## 🖥️ 开发提示

### 热重载

后端代码修改后自动重启（`main.py` 已配置 `reload=True`）：
```python
uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
```

### 生成日志

生成过程中的关键步骤会自动输出到终端。如需更多日志，设置环境变量：
```env
DEBUG=true
```

### 不装 ComfyUI 也能调试前端

如果只是想调前端 UI，可以修改 `backend/routes/generate.py`，用假数据替代 ComfyUI 调用：

```python
# 临时代码：不调 ComfyUI，直接返回示例图片
@router.post("/generate")
async def generate_pattern(req: GenerateRequest):
    return GenerateResponse(
        task_id="mock",
        status="done",
        estimated_time=0,
        images=[...],  # 伪造的图片列表
    )
```

---

## 📦 生产部署

### 使用 uvicorn 生产模式

```bash
uvicorn main:app --host 0.0.0.0 --port 7860 --workers 4
```

### 使用系统服务（Linux / WSL）

```ini
# /etc/systemd/system/feiyi-backend.service
[Unit]
Description=非遗纹样 AI 后端
After=network.target

[Service]
User=youruser
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/uvicorn main:app --host 127.0.0.1 --port 7860
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 📞 团队协作

| 角色 | 需要安装 | 需要配置 |
|------|----------|----------|
| 前端开发 | Node.js（不需要这个后端） | 无 |
| 后端开发 | Python 3.10+, ComfyUI | `.env` 文件 |
| 全栈测试 | Python + Node.js + ComfyUI | `.env` + DeepSeek Key |
| 只跑 Python | Python 3.10+ | `.env`（可不配 LLM Key） |

> 🧪 **最简环境**：只要 Python + ComfyUI 就能跑通手动参数生成。自然语言生成额外需要 DeepSeek Key。

---

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| [FastAPI](https://fastapi.tiangolo.com/) | Web 框架 |
| [Pydantic](https://docs.pydantic.dev/) | 数据校验 |
| [httpx](https://www.python-httpx.org/) | HTTP 客户端（调 ComfyUI） |
| [OpenAI SDK](https://github.com/openai/openai-python) | 调 DeepSeek（兼容接口） |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | AI 图像生成引擎 |
| [python-dotenv](https://github.com/theskumar/python-dotenv) | 环境变量管理 |
