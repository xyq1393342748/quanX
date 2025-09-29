// Quantumult X 重写脚本 - 替换以太坊RPC请求链接
// 将 Alchemy RPC 替换为 Llama RPC

// 获取请求URL
const url = $request.url;

// 检查是否是目标 Alchemy RPC 请求
if (url.includes("eth-mainnet.g.alchemy.com/v2/")) {
  try {
    console.log("检测到 Alchemy RPC 请求:", url);

    // 替换为 Llama RPC 端点
    const newUrl = url.replace(
      /https:\/\/eth-mainnet\.g\.alchemy\.com\/v2\/[^\/]+/,
      "https://eth.llamarpc.com"
    );

    console.log("重写 RPC 端点:", newUrl);

    // 返回重写后的请求
    $done({
      url: newUrl,
      headers: $request.headers,
    });
  } catch (error) {
    console.log("重写RPC请求时出错:", error);
    // 如果处理失败，返回原始请求
    $done({});
  }
} else {
  // 不是目标URL，直接返回原始请求
  $done({});
}
