// Kraken API修改脚本 - 使用示例
// 先运行 kraken_api_modifier.js，然后使用以下命令

// ============ 基本使用方法 ============

// 1. 查看当前配置
KrakenAPIModifier.getConfig();

// 2. startTime 提前1天（默认已设置）
KrakenAPIModifier.setStartTimeOffset(-1);

// 3. startTime 提前3天
KrakenAPIModifier.setStartTimeOffset(-3);

// 4. startTime 延后2天
KrakenAPIModifier.setStartTimeOffset(2);

// 5. 测试API请求（查看修改效果）
KrakenAPIModifier.testAPI();

// ============ 自定义数据修改 ============

// 修改 status 字段
KrakenAPIModifier.addCustomField("status", "ACTIVE");

// 修改 token.price 字段
KrakenAPIModifier.addCustomField("token", {
  symbol: "YB",
  price: "0.150000", // 从 0.200000 改为 0.150000
  name: "Yield Basis",
  chainId: "1",
  address: "0x01791f726b4103694969820be083196cc7c045ff",
  decimals: 18,
});

// 批量设置多个字段
KrakenAPIModifier.setCustomData({
  status: "LIVE",
  userAllocation: {
    min: "0.000000",
    max: "5000000.000000", // 增加最大分配
  },
  totalTokensAvailable: "20000000.000000000000000000", // 增加可用代币
});

// ============ 实用场景示例 ============

// 场景1：模拟代币销售已开始
// 将 startTime 设置为当前时间之前
KrakenAPIModifier.setStartTimeOffset(-0.1); // 提前2.4小时
KrakenAPIModifier.addCustomField("status", "LIVE");

// 场景2：模拟代币销售即将开始
// 将 startTime 设置为5分钟后
KrakenAPIModifier.setStartTimeOffset(0); // 不偏移
KrakenAPIModifier.setCustomData({
  startTime: (Date.now() + 5 * 60 * 1000).toString(), // 5分钟后
  status: "UPCOMING",
});

// 场景3：模拟代币价格变动
KrakenAPIModifier.addCustomField("token", {
  symbol: "YB",
  price: "0.180000", // 降价10%
  name: "Yield Basis",
  chainId: "1",
  address: "0x01791f726b4103694969820be083196cc7c045ff",
  decimals: 18,
});

// 场景4：模拟销售进度
KrakenAPIModifier.setCustomData({
  globalState: {
    totalTokensAvailable: "12500000.000000000000000000",
    totalTokensSold: "3000000.000000000000000000", // 已售出24%
    totalUsdAvailable: "2500000",
    totalUsdInvested: "600000.000000", // 已投资60万美元
  },
  cexState: {
    totalTokensAvailable: "12500000.000000000000000000",
    totalTokensSold: "3000000.000000000000000000",
    totalUsdAvailable: "2500000",
    totalUsdInvested: "600000.000000",
  },
});

// ============ 时间相关操作 ============

// 设置具体的开始时间
const targetStartTime = new Date("2024-10-02 10:00:00").getTime();
KrakenAPIModifier.addCustomField("startTime", targetStartTime.toString());

// 设置相对当前时间的偏移
const oneHourLater = Date.now() + 60 * 60 * 1000;
KrakenAPIModifier.addCustomField("startTime", oneHourLater.toString());

// ============ 控制命令 ============

// 临时禁用修改
KrakenAPIModifier.disable();

// 重新启用修改
KrakenAPIModifier.enable();

// 清空所有自定义数据
KrakenAPIModifier.clearCustomData();

// 移除特定字段
KrakenAPIModifier.removeCustomField("status");

// 重置为默认配置
KrakenAPIModifier.reset();

// 完全恢复原始API
KrakenAPIModifier.restore();

// ============ 快捷命令 ============

// 使用快捷方法
setStartTimeOffset(-1); // 提前1天
testKrakenAPI(); // 测试API

// ============ 调试和验证 ============

// 监听网络请求（需要在Network面板查看）
// 或者通过以下方式验证修改是否生效：

async function validateModification() {
  try {
    console.log("🔍 验证API修改是否生效...");

    const response = await fetch(
      "https://api.kraken.com/0/public/TokenSales/YB"
    );
    const data = await response.json();

    console.log("📊 当前API返回数据:");
    console.log(
      `- startTime: ${data.startTime} (${new Date(
        parseInt(data.startTime)
      ).toLocaleString()})`
    );
    console.log(`- status: ${data.status}`);
    console.log(`- token.price: ${data.token?.price}`);
    console.log(`- totalTokensAvailable: ${data.totalTokensAvailable}`);

    // 对比原始数据
    const originalStartTime = "1759327200000";
    const isModified = data.startTime !== originalStartTime;

    console.log(`✅ API修改${isModified ? "已" : "未"}生效`);

    return data;
  } catch (error) {
    console.error("❌ 验证失败:", error);
  }
}

// 运行验证
validateModification();

// ============ 持续监控 ============

// 每隔10秒检查一次API数据
let monitorInterval = setInterval(async () => {
  const data = await validateModification();
  console.log(`📊 [${new Date().toLocaleTimeString()}] API数据检查完成`);
}, 10000);

// 停止监控
// clearInterval(monitorInterval);

// ============ 恢复操作 ============

// 如果出现问题，立即恢复：
// KrakenAPIModifier.restore();
// location.reload(); // 刷新页面确保完全恢复

