# 数据集规范

## 一、数据集目标

本数据集用于训练和评估非遗纹样生成模型，覆盖剪纸、敦煌壁画、苗绣、传统丝绸纹样等类别。数据集应尽量做到来源清晰、图片质量稳定、标签格式统一，方便后续进行 SDXL + LoRA 微调、StyleGAN2 训练和平台风格筛选。

## 二、数据类别

初版建议包含以下类别：

| 类别中文名 | 英文目录名 | 说明 |
| --- | --- | --- |
| 剪纸纹样 | `papercut` | 红色剪纸、窗花、节庆图案、动植物纹样 |
| 敦煌壁画纹样 | `dunhuang` | 莲花、飞天、藻井、云纹、边饰 |
| 苗绣纹样 | `miaoxiu` | 几何纹、蝴蝶纹、鸟纹、花草纹 |
| 传统丝绸纹样 | `silk` | 团花、缠枝、云纹、龙凤、植物纹 |

如果数据不足，可以先完成 `papercut` 和 `dunhuang` 两类，后续再扩展。

## 三、目录结构

```text
data/
├── raw/                         # 原始图片
│   ├── papercut/
│   ├── dunhuang/
│   ├── miaoxiu/
│   └── silk/
├── processed/                   # 清洗后图片
│   ├── papercut/
│   ├── dunhuang/
│   ├── miaoxiu/
│   └── silk/
├── metadata/                    # 标签文件
│   ├── images.csv
│   ├── images.jsonl
│   └── label_guide.md
└── splits/                      # 数据集划分
    ├── train.txt
    ├── val.txt
    └── test.txt
```

说明：

- `raw/` 保存原始图片，不直接用于训练。
- `processed/` 保存清洗、裁剪、统一尺寸后的图片。
- `metadata/` 保存标签和数据来源。
- `splits/` 保存训练、验证、测试划分。

## 四、文件命名规则

建议使用统一命名格式：

```text
类别_序号.扩展名
```

示例：

```text
papercut_000001.jpg
dunhuang_000001.jpg
miaoxiu_000001.jpg
silk_000001.jpg
```

命名要求：

- 使用小写英文和数字。
- 不使用中文、空格和特殊符号。
- 序号统一使用 6 位数字。
- 原始图和处理后图片应能通过 `image_id` 对应。

## 五、图片质量标准

建议保留满足以下条件的图片：

- 主体纹样清晰。
- 分辨率不低于 512x512。
- 无明显水印、二维码、边框文字。
- 图案不严重变形。
- 色彩和纹理具有代表性。
- 适合作为模型学习风格的样本。

建议删除以下图片：

- 严重模糊或压缩痕迹明显。
- 纹样主体太小。
- 带有大面积文字说明。
- 重复图片或高度相似图片。
- 来源和版权完全不清晰。

## 六、标准化处理

所有进入 `processed/` 的图片建议统一处理：

| 项目 | 推荐设置 |
| --- | --- |
| 图片尺寸 | 512x512，后续可扩展到 1024x1024 |
| 图片格式 | JPG 或 PNG |
| 色彩模式 | RGB |
| 裁剪方式 | 居中裁剪或主体区域裁剪 |
| 背景处理 | 尽量保留原始纹样背景，不强行抠图 |

初学阶段可以先使用 512x512，训练速度更快，显存压力更小。

## 七、标签字段

推荐使用 CSV 作为主标签文件，字段如下：

```csv
image_id,file_path,category,style,theme,main_color,description,source,license,quality_score,split
papercut_000001,data/processed/papercut/papercut_000001.jpg,papercut,folk,flower,red,"traditional Chinese papercut pattern, red paper, symmetrical flower motif",museum_open_resource,public,4,train
```

字段说明：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `image_id` | 图片唯一编号 | `papercut_000001` |
| `file_path` | 处理后图片路径 | `data/processed/papercut/papercut_000001.jpg` |
| `category` | 大类别 | `papercut` |
| `style` | 风格类型 | `folk` |
| `theme` | 图案主题 | `flower` |
| `main_color` | 主色调 | `red` |
| `description` | 用于 LoRA 训练的英文描述 | `traditional Chinese papercut pattern...` |
| `source` | 图片来源 | `museum_open_resource` |
| `license` | 授权或版权说明 | `public` |
| `quality_score` | 质量评分，1-5 | `4` |
| `split` | 数据划分 | `train` |

## 八、标签标注建议

### 类别标签

类别标签尽量少而稳定，不要一开始分得太细。建议初版只使用：

- `papercut`
- `dunhuang`
- `miaoxiu`
- `silk`

### 风格标签

可选风格：

- `folk`：民间风格。
- `religious`：宗教壁画或佛教装饰风格。
- `geometric`：几何纹样。
- `textile`：织物纹理风格。
- `court`：宫廷或传统丝绸装饰风格。

### 主题标签

可选主题：

- `flower`
- `bird`
- `butterfly`
- `cloud`
- `lotus`
- `dragon`
- `phoenix`
- `symmetry`
- `border`
- `geometric`

如果一张图有多个主题，可以用英文逗号或竖线分隔，例如：

```text
flower|symmetry|border
```

## 九、LoRA 描述文本规范

LoRA 训练需要稳定的图片描述。建议描述文本结构为：

```text
a [category] pattern, [style] style, [theme] motif, [main color], traditional Chinese heritage design
```

示例：

```text
a traditional Chinese papercut pattern, folk style, flower motif, red paper, symmetrical design
a Dunhuang mural decorative pattern, religious style, lotus and cloud motif, gold and blue-green colors
a Miao embroidery pattern, textile style, geometric butterfly motif, colorful stitched texture
a traditional Chinese silk pattern, court style, dragon and cloud motif, gold textile texture
```

注意：

- 同一类别描述格式尽量统一。
- 不要写太长。
- 不要混入不确定信息。
- 尽量使用英文描述，方便扩散模型理解。

## 十、数据划分

建议比例：

| 数据集 | 比例 | 用途 |
| --- | --- | --- |
| 训练集 | 80% | 模型训练或微调 |
| 验证集 | 10% | 调参和观察过拟合 |
| 测试集 | 10% | 最终效果评估 |

如果某类图片太少，可以先不严格划分验证集和测试集，但要保留一小部分图片不参与训练，用于观察模型是否只是在记忆训练图。

## 十一、质量评分标准

| 分数 | 标准 |
| --- | --- |
| 5 | 纹样清晰，风格典型，构图完整，非常适合训练 |
| 4 | 质量较好，略有瑕疵，但适合训练 |
| 3 | 可用，但存在轻微模糊、裁剪或背景问题 |
| 2 | 质量较差，仅作为参考，不建议进入训练集 |
| 1 | 不可用，应删除 |

训练 LoRA 时优先使用评分 4-5 的图片。

## 十二、版权与来源记录

每张图片都应记录来源，至少包括：

- 数据来源名称。
- 原始链接或数据集名称。
- 授权协议或版权说明。
- 下载或整理日期。

如果版权不清晰，该图片不建议用于公开展示和最终报告。

## 十三、当前待补充内容

- [ ] 建立 `data/metadata/images.csv`。
- [ ] 确定第一批公开数据来源。
- [ ] 完成剪纸类别标签样例。
- [ ] 完成敦煌类别标签样例。
- [ ] 编写图片清洗脚本。
- [ ] 建立数据质量检查表。
