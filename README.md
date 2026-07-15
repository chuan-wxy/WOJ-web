# WOJ Web

WOJ Web 是 W Online Judge（WOJ）在线评测系统的前端工程，面向算法训练、课程学习、题库维护、提交评测与平台运营管理等场景提供交互界面。项目基于 Vue 3、TypeScript 与 Vite 构建，通过 OpenAPI 生成的类型化客户端与后端微服务协同，形成前后端分离的 OJ 应用形态。

当前版本：`1.1.0`

## 一、项目定位

WOJ Web 以在线程序设计学习流程为核心，将题目检索、题目详情、代码编辑、提交反馈、课程内容、活动公告、用户中心与后台管理整合在统一的前端应用中。其设计目标不仅是呈现后端数据，更强调在训练、教学与管理之间建立清晰的信息路径和稳定的操作体验。

本工程主要承担以下职责：

- 为普通用户提供题库浏览、题目详情查看、代码编辑、提交记录与个人中心等能力。
- 为管理员提供题目管理、用户管理、课程管理、公告管理与活动管理入口。
- 通过 OpenAPI 类型定义降低前后端接口协作成本。
- 通过路由、权限、状态管理与组件体系支撑可维护的前端架构。
- 为后续文档站、教学资源与竞赛运营能力扩展保留工程基础。

## 二、技术体系

| 层次 | 技术选型 |
| --- | --- |
| 基础框架 | Vue 3、TypeScript |
| 构建工具 | Vite |
| 路由管理 | Vue Router |
| 状态管理 | Pinia、pinia-plugin-persistedstate |
| UI 组件 | Element Plus、Arco Design Vue |
| 样式体系 | Sass、Tailwind CSS |
| 图表能力 | ECharts |
| 富文本编辑 | WangEditor |
| 代码编辑 | Monaco Editor、highlight.js |
| HTTP 与接口 | Axios、openapi-typescript-codegen |
| 国际化 | vue-i18n |
| 工程规范 | ESLint、Prettier、vue-tsc |

## 三、工程结构

```text
WOJ-web
├── public                 # 静态资源
├── src
│   ├── access             # 权限枚举与访问控制
│   ├── api                # 业务 API 封装
│   ├── assets             # 样式、图标与图片资源
│   ├── components         # 通用组件、表格、表单、布局与编辑器组件
│   ├── config             # 全局配置、布局配置与主题配置
│   ├── directives         # 权限、角色、高亮、水波纹等指令
│   ├── hooks              # 组合式函数
│   ├── locales            # 国际化语言资源
│   ├── openapi            # 基于 OpenAPI 生成的类型化服务客户端
│   ├── plugins            # 插件注册与第三方能力接入
│   ├── router             # 路由模块、路由守卫与动态路由处理
│   ├── store              # Pinia 状态模块
│   ├── types              # 全局类型定义
│   ├── utils              # HTTP、表格、存储、导航与 UI 工具
│   └── views              # 页面视图
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 四、功能模块

### 1. 用户与权限

系统包含登录、注册、个人资料维护、密码修改、用户中心与基于角色的路由访问控制。后台管理路由默认面向 `root` 角色开放。

### 2. 题库与评测

题库模块支持题目列表、题目搜索、题目详情、收藏题目、代码编辑与提交反馈等流程。前端通过 `openapi/web` 与 `openapi/judge` 中的客户端与后端题库服务、判题服务进行协作。

### 3. 后台管理

管理员可进入后台管理模块，对用户、题目、课程、公告与活动进行维护。该模块是平台内容治理和运营管理的重要入口。

### 4. 内容与学习支持

项目提供课程、公告、活动、首页看板、图表与富文本编辑等能力，为课程教学、竞赛通知和学习内容组织提供界面支撑。

### 5. OpenAPI 协作

工程中保留了 `woj-user-service_OpenAPI.json` 与 `woj-web-service_OpenAPI.json`，并在 `package.json` 中提供接口客户端生成脚本。生成结果位于 `src/openapi`，用于维持接口模型、服务调用与前端类型系统的一致性。

## 五、本地开发

建议环境如下：

- Node.js：`20+`
- npm：`10+`

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

类型检查与生产构建：

```bash
npm run build
```

本地预览生产产物：

```bash
npm run preview
```

## 六、环境配置

Vite 配置通过环境变量读取运行参数，常用变量包括：

| 变量 | 说明 |
| --- | --- |
| `VITE_VERSION` | 前端应用版本标识 |
| `VITE_BASE_URL` | 应用基础路径 |
| `VITE_PORT` | 本地开发服务端口 |
| `VITE_API_PROXY_URL` | 开发环境 API 代理目标 |
| `VITE_API_URL` | API 地址配置 |

开发环境下，`vite.config.ts` 会将 `/api` 请求代理到后端网关或指定后端服务地址，以适配前后端分离开发流程。

## 七、与后端协同

WOJ Web 推荐通过后端网关访问接口。默认后端路径规划如下：

- `/api/user/**`：用户服务
- `/api/web/**`：题库、课程、公告、活动等业务服务
- `/api/judge/**`：判题服务
- `/api/ai/**`：AI 辅助服务

当后端 OpenAPI 文档更新后，应重新生成对应客户端，并检查 `src/openapi` 中的模型与服务方法是否与页面逻辑保持一致。

## 八、工程约定

- 页面视图集中放置在 `src/views`，通用能力沉淀到 `src/components`、`src/hooks` 与 `src/utils`。
- 路由按业务域拆分到 `src/router/modules`，权限信息通过路由元数据维护。
- 用户态、菜单态、系统设置和表格状态通过 Pinia 模块集中管理。
- 接口类型优先使用 OpenAPI 生成结果，减少手写请求模型造成的协作偏差。
- 提交前建议执行 `npm run build`，以同时完成 TypeScript 校验和生产构建验证。

## 九、版本说明

`1.1.0` 版本聚焦于前端工程说明文档的规范化、应用职责与模块边界的明确化，并与后端微服务工程版本保持一致。
