# BoxJS 配置指南 - Time Store API 重写

## 脚本功能

将 Time Store API 响应中的 `data.type` 字段从 1 修改为 0，并添加成功/失败提示。

## BoxJS 特点

- 支持更丰富的日志输出
- 可以在内容中显示修改状态
- 更好的错误处理机制
- 支持 Sub-Store 生态

## 配置步骤

### 1. 安装 BoxJS

1. 在 Quantumult X 中安装 BoxJS 模块
2. 确保 BoxJS 已正确配置并运行

### 2. 添加重写规则

在 Quantumult X 的配置文件中添加以下重写规则：

```
[rewrite_local]
# Time Store API 重写 - BoxJS 版本
^https://api\.timestore\.vip/timeline/show\?postId=\d+ url script-response-body timestore_boxjs.js

[mitm]
hostname = api.timestore.vip
```

### 3. 上传脚本文件

**方法一：使用 GitHub（推荐）**

1. 将 `timestore_boxjs.js` 上传到 GitHub 仓库
2. 获取 Raw 链接
3. 在重写规则中使用链接：

```
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body https://raw.githubusercontent.com/xyq1393342748/quanX/main/timestore_rewrite.js
```

**方法二：使用内联脚本**

```
[rewrite_local]
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body
const $ = $substore;
if ($request.url.includes("api.timestore.vip") && $request.url.includes("/timeline/show")) {
  try {
    let body = $request.body;
    const jsonData = JSON.parse(body);
    if (jsonData && jsonData.data && typeof jsonData.data.type === "number") {
      const originalType = jsonData.data.type;
      if (jsonData.data.type === 1) {
        jsonData.data.type = 0;
        if (jsonData.data.postContent) {
          jsonData.data.postContent += "\n\n✅ [BoxJS] 已成功修改 data.type: 1 → 0";
        }
        console.log("✅ [BoxJS] 已修改 data.type: 1 -> 0");
      } else {
        console.log(`ℹ️ [BoxJS] data.type 当前值: ${originalType}，无需修改`);
      }
    }
    $done({
      status: $request.status,
      headers: $request.headers,
      body: JSON.stringify(jsonData),
    });
  } catch (error) {
    console.log("❌ [BoxJS] 处理响应时出错:", error);
    try {
      const jsonData = JSON.parse($request.body);
      if (jsonData && jsonData.data && jsonData.data.postContent) {
        jsonData.data.postContent += "\n\n❌ [BoxJS] 脚本执行失败，请检查配置";
        $done({
          status: $request.status,
          headers: $request.headers,
          body: JSON.stringify(jsonData),
        });
      } else {
        $done({});
      }
    } catch (parseError) {
      $done({});
    }
  }
} else {
  $done({});
}

[mitm]
hostname = api.timestore.vip
```

### 4. 启用功能

1. 确保 BoxJS 模块已启用
2. 确保「重写」功能已开启
3. 确保「MitM」功能已开启
4. 安装并信任 MITM 证书

## 脚本功能说明

### 修改逻辑

1. 拦截 `api.timestore.vip/timeline/show` 的 API 响应
2. 解析 JSON 响应体
3. 检查 `data.type` 字段值
4. 如果值为 1，则修改为 0
5. 在内容中添加成功提示
6. 返回修改后的响应

### 提示功能

- **成功提示**：在 `postContent` 末尾添加 "✅ [BoxJS] 已成功修改 data.type: 1 → 0"
- **失败提示**：在 `postContent` 末尾添加 "❌ [BoxJS] 脚本执行失败，请检查配置"
- **控制台日志**：详细的执行状态和错误信息

### 日志输出

- `✅ [BoxJS] 已修改 data.type: 1 -> 0` - 成功修改
- `ℹ️ [BoxJS] data.type 当前值: X，无需修改` - 无需修改
- `❌ [BoxJS] 处理响应时出错: 错误信息` - 处理错误

## 测试方法

1. 确保配置正确后，打开 Time Store 应用
2. 查看需要修改的内容（type=1 的内容）
3. 检查内容末尾是否显示成功提示
4. 查看 BoxJS 控制台日志确认脚本执行情况

## 优势对比

| 功能       | 普通版本 | BoxJS 版本 |
| ---------- | -------- | ---------- |
| 基本修改   | ✅       | ✅         |
| 控制台日志 | ✅       | ✅         |
| 内容提示   | ❌       | ✅         |
| 错误处理   | 基础     | 增强       |
| 状态显示   | 无       | 详细       |
| 调试友好   | 一般     | 优秀       |

## 注意事项

1. **BoxJS 依赖**：确保 BoxJS 模块已正确安装
2. **脚本路径**：确保脚本文件路径正确
3. **内容提示**：提示信息会添加到 `postContent` 字段中
4. **日志查看**：通过 BoxJS 控制台查看详细日志
5. **错误恢复**：脚本包含完整的错误处理机制

## 故障排除

如果脚本不生效，请检查：

1. BoxJS 模块是否正确安装和配置
2. 重写规则是否正确匹配目标 URL
3. 脚本文件是否存在于正确位置
4. MITM 证书是否正确安装和信任
5. 查看 BoxJS 控制台日志输出
6. 检查内容中是否显示提示信息

## 自定义修改

如果需要修改其他字段或条件：

1. **修改提示信息**：编辑脚本中的提示文本
2. **修改匹配条件**：调整 URL 匹配逻辑
3. **添加其他字段**：在脚本中添加更多字段修改逻辑
4. **自定义提示位置**：修改提示信息的添加位置

## 快速配置（推荐）

直接复制以下配置到您的 Quantumult X 配置文件中：

```
[rewrite_local]
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body
const $ = $substore;if ($request.url.includes("api.timestore.vip") && $request.url.includes("/timeline/show")) {try {let body = $request.body;const jsonData = JSON.parse(body);if (jsonData && jsonData.data && typeof jsonData.data.type === "number") {const originalType = jsonData.data.type;if (jsonData.data.type === 1) {jsonData.data.type = 0;if (jsonData.data.postContent) {jsonData.data.postContent += "\n\n✅ [BoxJS] 已成功修改 data.type: 1 → 0";}console.log("✅ [BoxJS] 已修改 data.type: 1 -> 0");} else {console.log(`ℹ️ [BoxJS] data.type 当前值: ${originalType}，无需修改`);}}$done({status: $request.status, headers: $request.headers, body: JSON.stringify(jsonData)});} catch (error) {console.log("❌ [BoxJS] 处理响应时出错:", error);try {const jsonData = JSON.parse($request.body);if (jsonData && jsonData.data && jsonData.data.postContent) {jsonData.data.postContent += "\n\n❌ [BoxJS] 脚本执行失败，请检查配置";$done({status: $request.status, headers: $request.headers, body: JSON.stringify(jsonData)});} else {$done({});}} catch (parseError) {$done({});}} else {$done({});}

[mitm]
hostname = api.timestore.vip
```
