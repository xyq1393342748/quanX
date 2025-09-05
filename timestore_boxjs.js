// BoxJS 版本 - Time Store API 重写脚本
// 将 data.type 从 1 改为 0，并添加提示功能

const $ = $substore;

// 检查是否是目标API
if (
  $request.url.includes("api.timestore.vip") &&
  $request.url.includes("/timeline/show")
) {
  try {
    // 解析响应体
    let body = $request.body;

    // 如果是gzip压缩的响应，需要先解压
    if ($request.headers["content-encoding"] === "gzip") {
      // BoxJS 会自动处理gzip解压
      body = $request.body;
    }

    // 解析JSON
    const jsonData = JSON.parse(body);

    // 检查响应结构并修改type字段
    if (jsonData && jsonData.data && typeof jsonData.data.type === "number") {
      const originalType = jsonData.data.type;

      // 将type从1改为0
      if (jsonData.data.type === 1) {
        jsonData.data.type = 0;

        // 添加成功提示到响应中
        if (jsonData.data.postContent) {
          const successMsg = "\n\n✅ [BoxJS] 已成功修改 data.type: 1 → 0";
          jsonData.data.postContent += successMsg;
        }

        console.log("✅ [BoxJS] 已修改 data.type: 1 -> 0");
      } else {
        console.log(`ℹ️ [BoxJS] data.type 当前值: ${originalType}，无需修改`);
      }
    }

    // 重新序列化JSON
    const modifiedBody = JSON.stringify(jsonData);

    // 返回修改后的响应
    $done({
      status: $request.status,
      headers: $request.headers,
      body: modifiedBody,
    });
  } catch (error) {
    console.log("❌ [BoxJS] 处理响应时出错:", error);

    // 添加错误提示到响应中
    try {
      const jsonData = JSON.parse($request.body);
      if (jsonData && jsonData.data && jsonData.data.postContent) {
        const errorMsg = "\n\n❌ [BoxJS] 脚本执行失败，请检查配置";
        jsonData.data.postContent += errorMsg;
        $done({
          status: $request.status,
          headers: $request.headers,
          body: JSON.stringify(jsonData),
        });
      } else {
        $done({});
      }
    } catch (parseError) {
      console.log("❌ [BoxJS] 解析错误响应失败:", parseError);
      $done({});
    }
  }
} else {
  // 不是目标URL，直接返回原始响应
  $done({});
}
