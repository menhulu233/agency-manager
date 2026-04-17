# agency-manager

> [English](./README.md)

AI Agency Manager — 一款用于管理 AI Agent、LLM 配置和 MCP 服务器的桌面端应用。

## 功能特性

- **Agents（智能体）** — 创建、编辑和管理 AI Agent 配置
- **LLM Configs（大模型配置）** — 管理 LLM 提供商设置和 API 密钥
- **MCP Servers（MCP 服务器）** — 配置和切换 MCP（Model Context Protocol）服务器
- **Teams（团队）** — 将 Agent 分组为协作团队
- **Templates（模板）** — 可复用的提示词和配置模板
- **CLIs（命令行工具）** — 管理命令行工具集成
- **Settings（设置）** — 应用偏好设置和主题切换
- **双语界面** — 内置英文 / 简体中文支持

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **桌面端**: Electron 28
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据库**: sql.js（WASM 版 SQLite）
- **国际化**: 自定义 React i18n 上下文

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（Vite + Electron）
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
agency-manager/
├── electron/           # Electron 主进程 & 预加载脚本
│   ├── database/       # SQLite 数据库 Schema & 初始数据
│   ├── ipc/            # IPC 通信处理（agents、llm、mcp 等）
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── features/       # 功能模块（agents、llm、mcp、teams 等）
│   ├── shared/         # 共享组件、样式、国际化
│   ├── App.tsx
│   └── main.tsx
├── dist-electron/      # Electron 编译输出
└── README.md
```

## 许可证

[MIT](./LICENSE)
