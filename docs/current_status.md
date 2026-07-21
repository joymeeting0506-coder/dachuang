# 当前完成情况梳理

## 一、读取范围

本梳理基于当前仓库中已经拉取到本地的文档和代码结构：

- `README.md`
- `docs/project_plan.md`
- `docs/dataset_standard.md`
- `docs/experiment_report.md`
- `docs/user_study.md`
- `backend/`
- `frontend/`
- `datas/`
- `models/`
- `scripts/`

## 二、项目目标摘要

项目目标是完成一个“AI 赋能的非遗纹样智能生成与商用设计平台”最小原型。完整路线包括：

- 非遗纹样数据集整理与标注。
- SDXL + LoRA 非遗纹样风格微调。
- StyleGAN2 对比实验。
- Web 平台原型，实现类别选择、提示词输入、参数调节、生成图片和导出。
- 校内用户测试和项目报告。

14 天最小版本建议聚焦：

- 数据只优先做剪纸和敦煌两个类别。
- 模型只优先接通 SDXL + LoRA 或 ComfyUI 生成链路。
- 平台只完成生成、展示、历史记录和 PNG/JPG 导出。
- 测试只完成 5-10 名校内同学的小规模试用。

## 三、已经完成的任务

| 模块 | 已完成内容 | 说明 |
| --- | --- | --- |
| Git 仓库 | 已建立仓库并同步到 `main` 分支 | 本地当前已拉取远端最新提交 |
| 项目说明 | 已有完整 `README.md` | 包含项目目标、技术路线、推荐架构、风险和最小版本建议 |
| 项目计划 | 已有 `docs/project_plan.md` | 包含阶段计划、团队分工、里程碑和当前待办 |
| 数据规范 | 已有 `docs/dataset_standard.md` | 包含类别、目录、命名、标签字段、质量评分和版权记录规范 |
| 实验记录模板 | 已有 `docs/experiment_report.md` | 包含 SDXL + LoRA、StyleGAN2、人工评分和失败案例记录模板 |
| 用户测试模板 | 已有 `docs/user_study.md` | 包含测试对象、测试任务、问卷、访谈和汇总表 |
| 前端工程骨架 | 已有 React + TypeScript + Vite 基础配置 | 包含 `package.json`、`vite.config.ts`、`index.html`、`tsconfig` 等 |
| 后端工程骨架 | 已有 FastAPI 入口和配置文件 | 包含 `backend/main.py`、`backend/config.py`、`backend/requirements.txt` |
| 数据目录骨架 | 已有 `datas/raw/` 和 `datas/processed/` | 当前为空目录，仅有 `.gitkeep` |
| 模型目录骨架 | 已有 `models/` | 当前仅有 `.gitkeep` |
| 脚本目录骨架 | 已有 `scripts/` | 当前仅有 `.gitkeep` |

## 四、当前尚未完成的关键任务

| 模块 | 未完成内容 | 对 MVP 的影响 |
| --- | --- | --- |
| 数据集 | 尚未看到真实图片数据 | 不能训练 LoRA，也不能做真实生成效果评估 |
| 数据标注 | 尚未建立 `images.csv` 或 `images.jsonl` | 不能形成稳定训练输入 |
| 数据脚本 | 尚未实现图片清洗、metadata 生成、数据划分脚本 | 数据整理仍需手工完成，容易拖慢进度 |
| 模型训练 | 尚未看到 LoRA 训练脚本、权重或生成样例 | 真实 AI 生成能力尚未闭环 |
| 模型服务 | 后端计划接 ComfyUI，但相关 `routes/`、`services/`、`models/schemas` 文件尚未存在 | `backend/main.py` 当前直接运行大概率会因为导入缺失而失败 |
| 前端页面 | 尚未看到 `frontend/src/` 业务代码 | 当前只有 Vite 项目配置，未形成可用工具页面 |
| 前后端联调 | 尚未形成 `/api/generate` 可用接口 | 平台不能完成生成流程 |
| 导出功能 | 尚未实现 PNG/JPG 下载 | MVP 的关键演示功能缺失 |
| 用户测试 | 尚未填写测试记录 | 还不能支撑最终可用性分析 |
| 项目报告 | 当前只有模板和规划 | 最终成果材料仍需补充真实截图、实验结果和测试数据 |

## 五、需要尽快确认的风险

| 风险 | 建议处理 |
| --- | --- |
| `data/` 与 `datas/` 目录命名不一致 | 14 天 MVP 内统一使用当前仓库的 `datas/`，文档后续同步修改或注明 |
| 后端文件引用了尚未存在的模块 | 第 1-2 天先补齐最小 FastAPI 路由，避免后期联调卡住 |
| 真实 LoRA 训练需要 GPU 和数据 | 第 1 天确认是否有可用 GPU；若没有，MVP 先用 ComfyUI API 或样例图模拟生成流程 |
| 数据版权和来源不清晰 | 收集图片时必须同步记录来源，避免最终报告无法展示 |
| 14 天时间较短 | 优先完成剪纸、敦煌两个类别，不扩展苗绣和丝绸 |

## 六、MVP 验收标准

14 天结束时，最小版本至少应达到：

- 有剪纸和敦煌两个类别的数据样例，每类至少 50 张可用图片。
- 有 `datas/metadata/images.csv`，包含图片路径、类别、主题、颜色、质量分和英文描述。
- 后端可以启动，并提供 `/api/health`、`/api/styles`、`/api/generate`、`/api/images`、`/api/export` 等最小接口。
- 前端可以启动，用户能选择类别、输入提示词、点击生成、查看结果、下载图片。
- 至少有一条真实或可替换的生成链路：优先 ComfyUI/LoRA，若暂时不可用则用样例图模拟返回。
- 有 5-10 名用户的小规模测试记录。
- 有项目截图、生成样例和一份可继续扩展的实验记录。

