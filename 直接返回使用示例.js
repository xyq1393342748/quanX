// Kraken API 直接返回模拟数据 - 使用示例
// 先运行 kraken_api_直接返回.js，然后使用以下命令

// ============ 基本使用方法 ============

// 1. 查看当前模拟数据和配置
KrakenMockAPI.getConfig();

// 2. 测试模拟API（验证是否生效）
KrakenMockAPI.testAPI();

// 3. 查看完整的模拟数据
KrakenMockAPI.getMockData();

// ============ 修改数据字段 ============

// 修改状态为不同值
KrakenMockAPI.updateField("status", "LIVE"); // 改为LIVE状态
KrakenMockAPI.updateField("status", "UPCOMING"); // 改为即将开始
KrakenMockAPI.updateField("status", "ENDED"); // 改为已结束

// 修改代币价格
KrakenMockAPI.updateField("token.price", "0.150000"); // 降价到0.15
KrakenMockAPI.updateField("token.price", "0.250000"); // 涨价到0.25

// 修改用户分配限额
KrakenMockAPI.updateField("userAllocation.max", "5000000.000000");

// 修改总可用代币数量
KrakenMockAPI.updateField(
  "totalTokensAvailable",
  "20000000.000000000000000000"
);

// ============ 时间相关操作 ============

// startTime提前不同天数
KrakenMockAPI.setStartTimeOffset(-1); // 提前1天（默认已设置）
KrakenMockAPI.setStartTimeOffset(-3); // 提前3天
KrakenMockAPI.setStartTimeOffset(0); // 恢复原始时间
KrakenMockAPI.setStartTimeOffset(2); // 延后2天

// 直接设置具体时间戳
const specificTime = new Date("2024-10-02 10:00:00").getTime();
KrakenMockAPI.updateField("startTime", specificTime.toString());

// ============ 批量修改数据 ============

// 模拟销售进行中的状态
KrakenMockAPI.setMockData({
  status: "ACTIVE",
  startTime: (Date.now() - 3600000).toString(), // 1小时前开始
  globalState: {
    totalTokensAvailable: "12500000.000000000000000000",
    totalTokensSold: "2500000.000000000000000000", // 已售出20%
    totalUsdAvailable: "2500000",
    totalUsdInvested: "500000.000000", // 已投资50万
  },
  cexState: {
    totalTokensAvailable: "12500000.000000000000000000",
    totalTokensSold: "2500000.000000000000000000",
    totalUsdAvailable: "2500000",
    totalUsdInvested: "500000.000000",
  },
});

// 模拟即将开始的销售
KrakenMockAPI.setMockData({
  status: "UPCOMING",
  startTime: (Date.now() + 1800000).toString(), // 30分钟后开始
  endTime: (Date.now() + 86400000).toString(), // 24小时后结束
});

// 模拟已结束的销售
KrakenMockAPI.setMockData({
  status: "ENDED",
  startTime: (Date.now() - 86400000).toString(), // 1天前开始
  endTime: (Date.now() - 3600000).toString(), // 1小时前结束
  globalState: {
    totalTokensAvailable: "12500000.000000000000000000",
    totalTokensSold: "12500000.000000000000000000", // 全部售完
    totalUsdAvailable: "2500000",
    totalUsdInvested: "2500000.000000", // 全部投资完成
  },
});

// ============ 网络延迟模拟 ============

// 设置网络延迟模拟真实请求
KrakenMockAPI.setDelay(500); // 500ms延迟
KrakenMockAPI.setDelay(1000); // 1秒延迟
KrakenMockAPI.setDelay(0); // 无延迟（默认）

// ============ 常用场景快捷设置 ============

// 场景1：销售即将开始（5分钟后）
function setupUpcomingSale() {
  KrakenMockAPI.setMockData({
    status: "UPCOMING",
    startTime: (Date.now() + 5 * 60 * 1000).toString(),
  });
  console.log("📅 设置为即将开始销售（5分钟后）");
}

// 场景2：销售进行中（50%进度）
function setupActiveSale() {
  KrakenMockAPI.setMockData({
    status: "ACTIVE",
    startTime: (Date.now() - 3600000).toString(),
    globalState: {
      totalTokensAvailable: "12500000.000000000000000000",
      totalTokensSold: "6250000.000000000000000000", // 50%已售出
      totalUsdAvailable: "2500000",
      totalUsdInvested: "1250000.000000", // 125万已投资
    },
    cexState: {
      totalTokensAvailable: "12500000.000000000000000000",
      totalTokensSold: "6250000.000000000000000000",
      totalUsdAvailable: "2500000",
      totalUsdInvested: "1250000.000000",
    },
  });
  console.log("🔥 设置为进行中销售（50%进度）");
}

// 场景3：销售已结束
function setupEndedSale() {
  KrakenMockAPI.setMockData({
    status: "ENDED",
    startTime: (Date.now() - 86400000).toString(),
    endTime: (Date.now() - 1800000).toString(),
    globalState: {
      totalTokensAvailable: "12500000.000000000000000000",
      totalTokensSold: "12500000.000000000000000000", // 100%售完
      totalUsdAvailable: "2500000",
      totalUsdInvested: "2500000.000000", // 全部完成
    },
  });
  console.log("✅ 设置为已结束销售（售罄）");
}

// 使用快捷场景
setupUpcomingSale(); // 取消注释来使用
// setupActiveSale();
// setupEndedSale();

// ============ 实时验证和监控 ============

// 验证模拟数据是否生效
async function verifyMockData() {
  console.log("🔍 验证模拟API是否生效...");
  try {
    const response = await fetch(
      "https://api.kraken.com/0/public/TokenSales/YB"
    );
    const data = await response.json();

    console.log("📊 返回的数据:");
    console.log(
      `- startTime: ${data.startTime} (${new Date(
        parseInt(data.startTime)
      ).toLocaleString()})`
    );
    console.log(`- status: ${data.status}`);
    console.log(`- token.price: ${data.token.price}`);
    console.log(`- 已售代币: ${data.globalState.totalTokensSold}`);
    console.log(`- 已投资金额: ${data.globalState.totalUsdInvested}`);

    // 检查是否为模拟数据
    const isModified =
      data.startTime !== "1759327200000" || data.status === "ACTIVE";
    console.log(`${isModified ? "✅ 模拟数据生效" : "❌ 使用的是原始数据"}`);

    return data;
  } catch (error) {
    console.error("❌ 验证失败:", error);
  }
}

// 运行验证
verifyMockData();

// 持续监控（每5秒检查一次）
let monitorInterval = setInterval(async () => {
  await verifyMockData();
  console.log(`📊 [${new Date().toLocaleTimeString()}] 模拟数据检查完成`);
}, 5000);

// 停止监控
// clearInterval(monitorInterval);

// ============ 控制命令 ============

// 临时禁用模拟（使用真实API）
KrakenMockAPI.disable();

// 重新启用模拟
KrakenMockAPI.enable();

// 重置为默认数据
KrakenMockAPI.reset();

// 完全恢复原始API
KrakenMockAPI.restore();

// ============ 快捷方法使用 ============

// 使用快捷方法
setMockStartTime(-2); // 提前2天
updateMockField("status", "LIVE"); // 改为LIVE状态
updateMockField("token.price", "0.180000"); // 改价格
testMockAPI(); // 测试

// ============ 调试技巧 ============

// 1. 打开Network面板查看请求
// 你会发现该URL的请求实际没有发送到服务器

// 2. 对比真实数据
// 临时禁用模拟看原始数据
KrakenMockAPI.disable();
// 发起请求查看真实数据...
// 重新启用模拟
KrakenMockAPI.enable();

// 3. 导出当前模拟数据
const currentData = KrakenMockAPI.getMockData();
console.log("当前模拟数据JSON:", JSON.stringify(currentData, null, 2));

console.log("🎉 使用示例加载完成!");
console.log("💡 提示: 刷新页面后需要重新运行主脚本");
console.log("🚀 现在可以测试网站功能，API将返回您设定的模拟数据");
