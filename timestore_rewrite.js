// Quantumult X 重写脚本 - 修改 Time Store API 响应中的 data.type 字段
// 将 data.type 从 1 改为 0

// 匹配目标URL
const url = $request.url;
const response = $response;

// 检查是否是目标API
if (url.includes("api.timestore.vip") && url.includes("/timeline/show")) {
  try {
    // 解析响应体
    let body = response.body;

    // 如果是gzip压缩的响应，需要先解压
    if (response.headers["content-encoding"] === "gzip") {
      // Quantumult X 会自动处理gzip解压
      body = response.body;
    }

    // 解析JSON
    const jsonData = JSON.parse(body);

    // 检查响应结构并修改type字段
    if (jsonData && jsonData.data && typeof jsonData.data.type === "number") {
      // 将type从1改为0
      if (jsonData.data.type === 1) {
        jsonData.data.type = 0;
        console.log("已修改 data.type: 1 -> 0");
      }

      // 将payUserIds加入3928105
      if (jsonData.data.payUserIds) {
        jsonData.data.payUserIds.push(3928105);
      }
    }

    // 处理data中的shareInfo
    if (
      jsonData &&
      jsonData.data &&
      jsonData.data.shareInfo &&
      jsonData.data.postContent
    ) {
      try {
        // shareInfo是字符串，需要先解析
        const shareInfoObj = JSON.parse(jsonData.data.shareInfo);
        if (shareInfoObj && shareInfoObj.postContent) {
          // URL编码shareInfo的postContent
          const encodedShareContent = encodeURIComponent(
            shareInfoObj.postContent
          );
          // 使用分割符号拼接到原postContent
          jsonData.data.postContent =
            jsonData.data.postContent +
            "%0A----------%0A" +
            encodedShareContent;
          console.log("已处理shareInfo，拼接到postContent");
        }
      } catch (error) {
        console.log("处理shareInfo时出错:", error);
      }
    }

    // 重新序列化JSON
    const modifiedBody = JSON.stringify(jsonData);

    // 返回修改后的响应
    $done({
      status: response.status,
      headers: response.headers,
      body: modifiedBody,
    });
  } catch (error) {
    console.log("处理响应时出错:", error);
    // 如果处理失败，返回原始响应
    $done({});
  }
} else {
  // 不是目标URL，直接返回原始响应
  $done({});
}
