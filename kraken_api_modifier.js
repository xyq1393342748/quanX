// Kraken API 响应修改脚本
// 可以直接在DevTools控制台运行，用于修改指定API的返回数据

(function () {
  "use strict";

  // 配置选项
  let apiConfig = {
    // 目标API URL
    targetUrl: "https://api.kraken.com/0/public/TokenSales/YB",
    // 是否启用API修改
    enabled: true,
    // startTime 偏移量（毫秒）- 负数代表提前
    startTimeOffset: -86400000, // 提前1天 (24 * 60 * 60 * 1000)
    // 自定义修改数据
    customData: {},
  };

  // 保存原始的网络请求方法
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // 修改响应数据的函数
  function modifyResponseData(data, url) {
    try {
      let modifiedData = JSON.parse(JSON.stringify(data));

      // 检查是否是目标API
      if (url.includes("/TokenSales/YB") || url === apiConfig.targetUrl) {
        console.log("🎯 检测到目标API请求:", url);
        console.log("📥 原始数据:", data);

        // 修改 startTime（提前指定时间）
        if (modifiedData.startTime) {
          const originalStartTime = parseInt(modifiedData.startTime);
          const newStartTime = originalStartTime + apiConfig.startTimeOffset;
          modifiedData.startTime = newStartTime.toString();

          console.log(`⏰ startTime 修改:`);
          console.log(
            `   原始: ${originalStartTime} (${new Date(
              originalStartTime
            ).toLocaleString()})`
          );
          console.log(
            `   修改: ${newStartTime} (${new Date(
              newStartTime
            ).toLocaleString()})`
          );
          console.log(
            `   偏移: ${apiConfig.startTimeOffset / (24 * 60 * 60 * 1000)} 天`
          );
        }
        if (modifiedData.status) {
          modifiedData.status = "ACTIVE";
        }

        // 应用自定义修改
        if (Object.keys(apiConfig.customData).length > 0) {
          console.log("🔧 应用自定义修改:", apiConfig.customData);
          modifiedData = { ...modifiedData, ...apiConfig.customData };
        }

        console.log("📤 修改后数据:", modifiedData);
        console.log("✅ API数据修改完成");
      }

      return modifiedData;
    } catch (error) {
      console.error("❌ 修改响应数据时出错:", error);
      return data;
    }
  }

  // 劫持 fetch API
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = args[0];

    if (!apiConfig.enabled) {
      return response;
    }

    // 检查是否是目标API
    if (
      typeof url === "string" &&
      (url.includes("/TokenSales/YB") || url === apiConfig.targetUrl)
    ) {
      // 克隆响应以便修改
      const responseClone = response.clone();

      try {
        const originalData = await responseClone.json();
        const modifiedData = modifyResponseData(originalData, url);

        // 创建新的响应对象
        const modifiedResponse = new Response(JSON.stringify(modifiedData), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

        return modifiedResponse;
      } catch (error) {
        console.error("❌ fetch拦截处理出错:", error);
        return response;
      }
    }

    return response;
  };

  // 劫持 XMLHttpRequest
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._url = url;
    return originalXHROpen.call(this, method, url, ...args);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (!apiConfig.enabled) {
      return originalXHRSend.apply(this, args);
    }

    const xhr = this;
    const originalOnReadyStateChange = xhr.onreadystatechange;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const url = xhr._url;

        if (
          typeof url === "string" &&
          (url.includes("/TokenSales/YB") || url === apiConfig.targetUrl)
        ) {
          try {
            const originalData = JSON.parse(xhr.responseText);
            const modifiedData = modifyResponseData(originalData, url);

            // 修改响应内容
            Object.defineProperty(xhr, "responseText", {
              value: JSON.stringify(modifiedData),
              writable: false,
            });
            Object.defineProperty(xhr, "response", {
              value: JSON.stringify(modifiedData),
              writable: false,
            });
          } catch (error) {
            console.error("❌ XMLHttpRequest拦截处理出错:", error);
          }
        }
      }

      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.apply(xhr, arguments);
      }
    };

    return originalXHRSend.apply(this, args);
  };

  // 全局控制函数
  window.KrakenAPIModifier = {
    // 启用API修改
    enable: function () {
      apiConfig.enabled = true;
      console.log("✅ Kraken API修改已启用");
      console.log(`🎯 目标API: ${apiConfig.targetUrl}`);
      console.log(
        `⏰ startTime偏移: ${
          apiConfig.startTimeOffset / (24 * 60 * 60 * 1000)
        } 天`
      );
    },

    // 禁用API修改
    disable: function () {
      apiConfig.enabled = false;
      console.log("❌ Kraken API修改已禁用");
    },

    // 设置startTime偏移（天数）
    setStartTimeOffset: function (days) {
      apiConfig.startTimeOffset = days * 24 * 60 * 60 * 1000;
      console.log(`⏰ startTime偏移设置为: ${days} 天`);
    },

    // 设置自定义数据修改
    setCustomData: function (customData) {
      apiConfig.customData = { ...customData };
      console.log("🔧 自定义数据修改已设置:", customData);
    },

    // 添加自定义字段
    addCustomField: function (key, value) {
      apiConfig.customData[key] = value;
      console.log(`🔧 添加自定义字段: ${key} = ${value}`);
    },

    // 移除自定义字段
    removeCustomField: function (key) {
      delete apiConfig.customData[key];
      console.log(`🗑️ 移除自定义字段: ${key}`);
    },

    // 清空自定义数据
    clearCustomData: function () {
      apiConfig.customData = {};
      console.log("🗑️ 已清空所有自定义数据");
    },

    // 获取当前配置
    getConfig: function () {
      console.log("📋 当前Kraken API修改配置:");
      console.log(`- 启用状态: ${apiConfig.enabled}`);
      console.log(`- 目标API: ${apiConfig.targetUrl}`);
      console.log(
        `- startTime偏移: ${
          apiConfig.startTimeOffset / (24 * 60 * 60 * 1000)
        } 天`
      );
      console.log(`- 自定义数据:`, apiConfig.customData);
      return apiConfig;
    },

    // 重置配置
    reset: function () {
      apiConfig.startTimeOffset = -86400000; // 默认提前1天
      apiConfig.customData = {};
      apiConfig.enabled = true;
      console.log("🔄 配置已重置为默认值");
    },

    // 恢复原始API函数
    restore: function () {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      console.log("🔄 已恢复原始API函数");
    },

    // 手动触发API请求（用于测试）
    testAPI: async function () {
      console.log("🧪 发起测试API请求...");
      try {
        const response = await fetch(apiConfig.targetUrl);
        const data = await response.json();
        console.log("📥 API响应:", data);
      } catch (error) {
        console.error("❌ 测试API请求失败:", error);
      }
    },
  };

  // 快捷方法
  window.setStartTimeOffset = window.KrakenAPIModifier.setStartTimeOffset;
  window.testKrakenAPI = window.KrakenAPIModifier.testAPI;

  console.log("🚀 Kraken API修改脚本已加载!");
  console.log("📝 使用方法:");
  console.log("  KrakenAPIModifier.enable()           // 启用API修改");
  console.log("  KrakenAPIModifier.disable()          // 禁用API修改");
  console.log(
    "  KrakenAPIModifier.setStartTimeOffset(-1)  // startTime提前1天"
  );
  console.log(
    "  KrakenAPIModifier.setStartTimeOffset(2)   // startTime延后2天"
  );
  console.log(
    '  KrakenAPIModifier.addCustomField("status", "ACTIVE")  // 添加自定义字段'
  );
  console.log("  KrakenAPIModifier.getConfig()        // 查看当前配置");
  console.log("  KrakenAPIModifier.testAPI()          // 测试API请求");
  console.log("  KrakenAPIModifier.restore()          // 恢复原始API");
  console.log("");
  console.log("💡 快捷方法:");
  console.log(
    "  setStartTimeOffset(-1)               // 等同于 KrakenAPIModifier.setStartTimeOffset(-1)"
  );
  console.log(
    "  testKrakenAPI()                      // 等同于 KrakenAPIModifier.testAPI()"
  );
  console.log("");
  console.log("⚡ 当前配置: startTime 提前 1 天");
})();
