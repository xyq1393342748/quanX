// Quantumult X 重写脚本 - 修改 Time Store API 响应中的 data.type 字段
// 将 data.type 从 1 改为 0

// 匹配目标URL
const url = $request.url;
const response = $response;

// 检查是否是目标API
if (
  url.includes("/timeline/show") ||
  url.includes("/timeline/squares") ||
  url.includes("/timeline/mymblog") ||
  url.includes("/timeline/follows")
) {
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
    // if (jsonData && jsonData.data && typeof jsonData.data.type === "number") {
    //   // 将type从1改为0
    //   if (jsonData.data.type === 1) {
    //     jsonData.data.type = 0;
    //     console.log("已修改 data.type: 1 -> 0");
    //   }

    //   // 将payUserIds加入3928105
    //   if (jsonData.data.payUserIds) {
    //     jsonData.data.payUserIds.push(3928105);
    //   }
    // }

    // 处理shareInfo的函数
    function processShareInfo(post, index = "") {
      if (post && post.shareInfo) {
        try {
          // shareInfo可能是字符串或空字符串
          if (typeof post.shareInfo === "string" && post.shareInfo.trim()) {
            const shareInfoObj = JSON.parse(post.shareInfo);
            if (shareInfoObj && shareInfoObj.postContent) {
              // URL编码shareInfo的postContent
              const encodedShareContent = encodeURIComponent(
                shareInfoObj.postContent
              );
              // 使用分割符号拼接到原postContent
              post.postContent =
                post.postContent + "%0A----------%0A" + encodedShareContent;
              console.log(`已处理${index}shareInfo，拼接到postContent`);
            }
          }
        } catch (error) {
          console.log(`处理${index}shareInfo时出错:`, error);
        }
      }
    }

    // 检查是否为列表格式 (data.records数组)
    if (
      jsonData &&
      jsonData.data &&
      jsonData.data.records &&
      Array.isArray(jsonData.data.records)
    ) {
      // 处理列表中的每个post
      jsonData.data.records.forEach((post, index) => {
        processShareInfo(post, `第${index + 1}个post的`);
      });
    }
    // 检查是否为单个post格式 (data对象)
    else if (jsonData && jsonData.data && jsonData.data.postContent) {
      // 处理单个post
      processShareInfo(jsonData.data, "");
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
