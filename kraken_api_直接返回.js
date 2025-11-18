// Kraken API 直接返回模拟数据脚本
// 不等待真实API响应，直接返回预设数据

(function () {
  "use strict";

  // 预设的模拟数据（startTime已提前1天）
  const mockData = {
    id: "9adab611-7732-4de9-9055-bcf4c5733a20",
    name: "YieldBasis",
    startTime: "1759240800000", // 提前1天：1759327200000 - 86400000
    endTime: "1759327200000",
    status: "ACTIVE", // 改为ACTIVE状态
    chain: {
      name: "Ethereum Mainnet",
      id: "1",
      type: "EVM",
    },
    token: {
      symbol: "YB",
      price: "0.200000",
      name: "Yield Basis",
      chainId: "1",
      address: "0x01791f726b4103694969820be083196cc7c045ff",
      decimals: 18,
    },
    userAllocation: {
      min: "0.000000",
      max: "2500000.000000",
    },
    totalTokensAvailable: "12500000.000000000000000000",
    globalTotalTokensAvailable: "15000000.000000000000000000",
    bgImage:
      "https://legion-static-storage-prod.s3.eu-central-1.amazonaws.com/projectBg/9e60920d-c53a-44f7-b1df-fe1d66fa015d",
    logo: "https://legion-static-storage-prod.s3.eu-central-1.amazonaws.com/logo/9e60920d-c53a-44f7-b1df-fe1d66fa015d",
    oneSentence:
      "Turning crypto into productive assets using original Automatic Market Making without impermanent loss.",
    slug: "yieldbasis",
    socials: {
      x: "yieldbasis",
      telegram: "yieldbasis_chat",
      discord: "yieldbasis",
    },
    summary:
      "YieldBasis eliminates impermanent loss for liquidity providers with a breakthrough AMM design. Built by Curve Finance founder Michael Egorov, the protocol lets holders keep full exposure to their Bitcoin while earning sustainable yield from trading fees.\n\nWith more than $2 trillion in Bitcoin sitting idle, YieldBasis unlocks this capital by allowing holders to earn yield without ever giving up their price exposure. Unlike traditional AMMs, which dilute returns through impermanent loss, YieldBasis ensures deposits track Bitcoin's price 1:1 while simultaneously capturing real yield from trading activity. Users simply deposit tokenised Bitcoin, such as wBTC, cbBTC, or tBTC, and the protocol automatically manages positions in the background. The result is simple: your Bitcoin continues to behave exactly like Bitcoin, but now it generates income.\n\nThe protocol operates through sophisticated automated market makers built on Curve's battle-tested infrastructure, using dynamic rebalancing to maintain precise leverage ratios. As asset prices move, the system continuously rebalances to preserve perfect exposure while capturing trading fees. This approach eliminates the square-root price tracking that causes impermanent loss in traditional AMMs, replacing it with linear price tracking that behaves exactly like holding the underlying asset - but with yield.",
    website: "https://yieldbasis.com",
    globalState: {
      totalTokensAvailable: "12500000.000000000000000000",
      totalTokensSold: "0.000000000000000000",
      totalUsdAvailable: "2500000",
      totalUsdInvested: "0.000000",
    },
    cexState: {
      totalTokensAvailable: "12500000.000000000000000000",
      totalTokensSold: "0.000000000000000000",
      totalUsdAvailable: "2500000",
      totalUsdInvested: "0.000000",
    },
  };

  // 配置选项
  let mockConfig = {
    targetUrl: "https://api.kraken.com/0/public/TokenSales/YB",
    enabled: true,
    data: { ...mockData }, // 创建数据副本
    delay: 0, // 模拟网络延迟（毫秒）
  };

  // 保存原始的网络请求方法
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // 创建模拟响应
  function createMockResponse(data) {
    return new Response(JSON.stringify(data), {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // 劫持 fetch API
  window.fetch = async function (...args) {
    const url = args[0];

    if (!mockConfig.enabled) {
      return originalFetch.apply(this, args);
    }

    // 检查是否是目标API
    if (
      typeof url === "string" &&
      (url.includes("/TokenSales/YB") || url === mockConfig.targetUrl)
    ) {
      console.log("🎯 拦截API请求:", url);
      console.log("⚡ 直接返回模拟数据，无需等待真实请求");

      // 模拟网络延迟
      if (mockConfig.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, mockConfig.delay));
      }

      console.log("📤 返回模拟数据:", mockConfig.data);
      console.log(
        `⏰ startTime: ${mockConfig.data.startTime} (${new Date(
          parseInt(mockConfig.data.startTime)
        ).toLocaleString()})`
      );
      console.log(`🔥 status: ${mockConfig.data.status}`);

      return createMockResponse(mockConfig.data);
    }

    // 不是目标API，使用原始fetch
    return originalFetch.apply(this, args);
  };

  // 劫持 XMLHttpRequest
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._url = url;
    this._method = method;
    return originalXHROpen.call(this, method, url, ...args);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (!mockConfig.enabled) {
      return originalXHRSend.apply(this, args);
    }

    const xhr = this;
    const url = xhr._url;

    // 检查是否是目标API
    if (
      typeof url === "string" &&
      (url.includes("/TokenSales/YB") || url === mockConfig.targetUrl)
    ) {
      console.log("🎯 拦截XHR请求:", url);
      console.log("⚡ 直接返回模拟数据，无需等待真实请求");

      // 模拟异步响应
      setTimeout(() => {
        try {
          // 模拟成功响应
          Object.defineProperty(xhr, "readyState", {
            value: 4,
            writable: false,
          });
          Object.defineProperty(xhr, "status", { value: 200, writable: false });
          Object.defineProperty(xhr, "statusText", {
            value: "OK",
            writable: false,
          });
          Object.defineProperty(xhr, "responseText", {
            value: JSON.stringify(mockConfig.data),
            writable: false,
          });
          Object.defineProperty(xhr, "response", {
            value: JSON.stringify(mockConfig.data),
            writable: false,
          });

          console.log("📤 XHR返回模拟数据:", mockConfig.data);
          console.log(
            `⏰ startTime: ${mockConfig.data.startTime} (${new Date(
              parseInt(mockConfig.data.startTime)
            ).toLocaleString()})`
          );

          // 触发事件
          if (xhr.onreadystatechange) {
            xhr.onreadystatechange();
          }
          if (xhr.onload) {
            xhr.onload();
          }
        } catch (error) {
          console.error("❌ XHR模拟响应出错:", error);
        }
      }, mockConfig.delay);

      return; // 不调用原始send方法
    }

    // 不是目标API，使用原始send
    return originalXHRSend.apply(this, args);
  };

  // 全局控制函数
  window.KrakenMockAPI = {
    // 启用API模拟
    enable: function () {
      mockConfig.enabled = true;
      console.log("✅ Kraken API模拟已启用");
      console.log(`🎯 目标API: ${mockConfig.targetUrl}`);
      console.log("⚡ 将直接返回模拟数据，不发送真实请求");
    },

    // 禁用API模拟
    disable: function () {
      mockConfig.enabled = false;
      console.log("❌ Kraken API模拟已禁用，将使用真实API");
    },

    // 更新模拟数据
    setMockData: function (newData) {
      mockConfig.data = { ...mockConfig.data, ...newData };
      console.log("🔧 模拟数据已更新:", newData);
    },

    // 修改特定字段
    updateField: function (key, value) {
      if (key.includes(".")) {
        // 支持嵌套字段，如 "token.price"
        const keys = key.split(".");
        let obj = mockConfig.data;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
      } else {
        mockConfig.data[key] = value;
      }
      console.log(`🔧 字段 ${key} 已更新为:`, value);
    },

    // 设置startTime偏移
    setStartTimeOffset: function (offsetDays) {
      const originalTime = parseInt(mockData.startTime); // 使用原始基础时间
      const offsetMs = offsetDays * 24 * 60 * 60 * 1000;
      const newTime = originalTime + offsetMs;
      mockConfig.data.startTime = newTime.toString();

      console.log(`⏰ startTime偏移设置为: ${offsetDays} 天`);
      console.log(
        `   新时间: ${newTime} (${new Date(newTime).toLocaleString()})`
      );
    },

    // 设置网络延迟
    setDelay: function (delayMs) {
      mockConfig.delay = delayMs;
      console.log(`⏱️ 模拟网络延迟设置为: ${delayMs}ms`);
    },

    // 获取当前模拟数据
    getMockData: function () {
      console.log("📋 当前模拟数据:", mockConfig.data);
      return mockConfig.data;
    },

    // 获取配置信息
    getConfig: function () {
      console.log("📋 当前模拟配置:");
      console.log(`- 启用状态: ${mockConfig.enabled}`);
      console.log(`- 目标API: ${mockConfig.targetUrl}`);
      console.log(`- 网络延迟: ${mockConfig.delay}ms`);
      console.log(
        `- startTime: ${mockConfig.data.startTime} (${new Date(
          parseInt(mockConfig.data.startTime)
        ).toLocaleString()})`
      );
      console.log(`- status: ${mockConfig.data.status}`);
      return mockConfig;
    },

    // 重置为默认数据
    reset: function () {
      mockConfig.data = { ...mockData };
      mockConfig.enabled = true;
      mockConfig.delay = 0;
      console.log("🔄 模拟数据已重置为默认值");
    },

    // 恢复原始API函数
    restore: function () {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      console.log("🔄 已恢复原始API函数");
    },

    // 测试模拟API
    testAPI: async function () {
      console.log("🧪 测试模拟API...");
      try {
        const response = await fetch(mockConfig.targetUrl);
        const data = await response.json();
        console.log("📥 API响应（模拟）:", data);
        console.log(
          `⏰ startTime验证: ${data.startTime} (${new Date(
            parseInt(data.startTime)
          ).toLocaleString()})`
        );
        console.log(`🔥 status验证: ${data.status}`);
      } catch (error) {
        console.error("❌ 测试失败:", error);
      }
    },
  };

  // 快捷方法
  window.setMockStartTime = window.KrakenMockAPI.setStartTimeOffset;
  window.updateMockField = window.KrakenMockAPI.updateField;
  window.testMockAPI = window.KrakenMockAPI.testAPI;

  console.log("🚀 Kraken API直接返回模拟脚本已加载!");
  console.log("✨ 特性: 直接返回模拟数据，不发送真实网络请求");
  console.log("");
  console.log("📝 使用方法:");
  console.log("  KrakenMockAPI.enable()               // 启用API模拟");
  console.log("  KrakenMockAPI.disable()              // 禁用API模拟");
  console.log("  KrakenMockAPI.setStartTimeOffset(-2) // startTime提前2天");
  console.log('  KrakenMockAPI.updateField("status", "LIVE")  // 修改字段');
  console.log(
    '  KrakenMockAPI.updateField("token.price", "0.150000")  // 修改嵌套字段'
  );
  console.log("  KrakenMockAPI.setDelay(500)          // 设置500ms网络延迟");
  console.log("  KrakenMockAPI.getMockData()          // 查看当前数据");
  console.log("  KrakenMockAPI.testAPI()              // 测试API");
  console.log("  KrakenMockAPI.restore()              // 恢复原始API");
  console.log("");
  console.log("💡 快捷方法:");
  console.log("  setMockStartTime(-1)                 // 提前1天");
  console.log('  updateMockField("status", "ACTIVE")  // 更新字段');
  console.log("  testMockAPI()                        // 测试API");
  console.log("");
  console.log("⚡ 当前状态:");
  console.log(
    `  - startTime: ${mockConfig.data.startTime} (${new Date(
      parseInt(mockConfig.data.startTime)
    ).toLocaleString()})`
  );
  console.log(`  - status: ${mockConfig.data.status}`);
  console.log("  - 已提前1天，状态为ACTIVE");
})();
