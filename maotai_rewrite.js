// Quantumult X 重写脚本 - 修改i茅台 purchaseInfoV2 API 响应
// 功能：
// 1. 修改库存和购买状态，使商品可正常显示/购买
// 2. 将所有开始时间提前1分钟（60000毫秒）

// 匹配目标URL
const url = $request.url;
const response = $response;

// 检查是否是目标API
if (url.includes("/xhr/front/mall/item/purchaseInfoV2")) {
  try {
    // 解析响应体
    let body = response.body;

    // 解析JSON
    const jsonData = JSON.parse(body);

    // 检查响应结构
    if (jsonData && jsonData.data && jsonData.data.purchaseInfoMap) {
      const purchaseInfoMap = jsonData.data.purchaseInfoMap;

      // 遍历所有门店/渠道的purchaseInfo
      for (const key in purchaseInfoMap) {
        if (purchaseInfoMap.hasOwnProperty(key)) {
          const item = purchaseInfoMap[key];

          if (item && item.purchaseInfo) {
            const purchaseInfo = item.purchaseInfo;

            // 1. 修改库存为可购买状态
            if (purchaseInfo.inventory === 0) {
              purchaseInfo.inventory = 1;
              console.log(`[${key}] 已修改 inventory: 0 -> 1`);
            }

            // 2. 修改可加入购物车状态
            if (purchaseInfo.canAddCart === false) {
              purchaseInfo.canAddCart = true;
              console.log(`[${key}] 已修改 canAddCart: false -> true`);
            }

            // 3. 清除禁止购买提示
            if (purchaseInfo.forbiddenBuyDesc) {
              const oldDesc = purchaseInfo.forbiddenBuyDesc;
              purchaseInfo.forbiddenBuyDesc = "";
              console.log(`[${key}] 已清除 forbiddenBuyDesc: "${oldDesc}"`);
            }

            // 4. 修改disable状态
            if (purchaseInfo.disable === true) {
              purchaseInfo.disable = false;
              console.log(`[${key}] 已修改 disable: true -> false`);
            }

            // 5. 将所有开始时间提前1分钟（60000毫秒）
            if (
              purchaseInfo.startTimeList &&
              Array.isArray(purchaseInfo.startTimeList)
            ) {
              const oneMinute = 60 * 1000; // 1分钟 = 60000毫秒
              purchaseInfo.startTimeList = purchaseInfo.startTimeList.map(
                (time) => {
                  const newTime = time - oneMinute;
                  console.log(
                    `[${key}] 时间调整: ${new Date(time).toLocaleString()} -> ${new Date(newTime).toLocaleString()}`
                  );
                  return newTime;
                }
              );
              console.log(
                `[${key}] 已将 ${purchaseInfo.startTimeList.length} 个开始时间提前1分钟`
              );
            }
          }
        }
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
    console.log("处理i茅台响应时出错:", error);
    // 如果处理失败，返回原始响应
    $done({});
  }
} else {
  // 不是目标URL，直接返回原始响应
  $done({});
}

