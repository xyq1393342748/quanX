# Quantumult X 配置指南 - Time Store API 重写

## 脚本功能

将 Time Store API 响应中的 `data.type` 字段从 1 修改为 0。

## 配置步骤

### 1. 添加重写规则

在 Quantumult X 的配置文件中添加以下重写规则：

**方法一：使用内联脚本（推荐）**

```
[rewrite_local]
# Time Store API 重写 - 修改 data.type
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body
let body = $response.body;
try {
    let obj = JSON.parse(body);
    if (obj && obj.data && obj.data.type === 1) {
        obj.data.type = 0;
        body = JSON.stringify(obj);
    }
} catch (e) {}
$done({body});

[mitm]
hostname = api.timestore.vip
```

**方法二：使用外部脚本链接**

```
[rewrite_local]
# Time Store API 重写 - 修改 data.type
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body https://raw.githubusercontent.com/您的用户名/您的仓库名/main/timestore_rewrite.js

[mitm]
hostname = api.timestore.vip
```

### 2. 配置说明

**内联脚本方法**：

- 直接在重写规则中写入 JavaScript 代码
- 无需管理单独的脚本文件
- 配置简单，推荐使用

**外部脚本方法**：

- 需要将脚本上传到 GitHub 等平台
- 获取脚本的 Raw 链接
- 在重写规则中引用链接

### 3. 启用 MITM 证书

1. 打开 Quantumult X 应用
2. 进入「设置」→「MitM」
3. 生成并安装证书
4. 在系统设置中信任该证书

### 4. 启用重写功能

1. 在 Quantumult X 主界面
2. 确保「重写」功能已开启
3. 确保「MitM」功能已开启

## 脚本说明

### 匹配条件

- 目标域名：`api.timestore.vip`
- 目标路径：`/timeline/show?postId=数字`
- 修改字段：`data.type` (从 1 改为 0)

### 工作原理

1. 拦截指定的 API 响应
2. 解析 JSON 响应体
3. 检查 `data.type` 字段值
4. 如果值为 1，则修改为 0
5. 返回修改后的响应

### 内联脚本代码说明

```javascript
let body = $response.body; // 获取响应体
try {
  let obj = JSON.parse(body); // 解析JSON
  if (obj && obj.data && obj.data.type === 1) {
    // 检查条件
    obj.data.type = 0; // 修改字段值
    body = JSON.stringify(obj); // 重新序列化
  }
} catch (e) {} // 错误处理
$done({ body }); // 返回修改后的响应
```

## 测试方法

1. 确保配置正确后，打开 Time Store 应用
2. 查看需要修改的内容（type=1 的内容）
3. 检查是否成功修改为 type=0
4. 查看 Quantumult X 的日志确认脚本执行情况

## 注意事项

1. **证书信任**：确保 MITM 证书已正确安装并信任
2. **重写规则**：确保重写规则语法正确
3. **正则匹配**：重写规则中的正则表达式需要准确匹配目标 URL
4. **JSON 格式**：脚本会保持原始 JSON 格式，只修改指定字段
5. **内联脚本**：如果使用内联脚本，确保 JavaScript 语法正确

## 故障排除

如果脚本不生效，请检查：

1. MITM 证书是否正确安装和信任
2. 重写规则是否正确匹配目标 URL
3. 内联脚本的 JavaScript 语法是否正确
4. 外部脚本链接是否可访问
5. Quantumult X 的重写和 MitM 功能是否已启用
6. 查看 Quantumult X 的日志输出

## 自定义修改

如果需要修改其他字段或条件，可以编辑重写规则：

- 修改 URL 匹配条件（正则表达式）
- 修改字段修改逻辑（JavaScript 代码）
- 添加其他数据处理逻辑
- 如果使用外部脚本，需要修改 `timestore_rewrite.js` 文件

## 快速配置（推荐）

直接复制以下配置到您的 Quantumult X 配置文件中：

```
[rewrite_local]
^https://api\.timestore.vip/timeline/show\?postId=\d+ url script-response-body
let body = $response.body;try{let obj = JSON.parse(body);if(obj && obj.data && obj.data.type === 1){obj.data.type = 0;body = JSON.stringify(obj);}}catch(e){}$done({body});

[mitm]
hostname = api.timestore.vip
```
