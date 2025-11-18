// 浏览器控制台时间修改脚本
// 可以直接在DevTools控制台运行，用于修改页面的本地时间

(function () {
  "use strict";

  // 配置选项
  let timeConfig = {
    // 时间偏移量（毫秒）- 正数代表未来，负数代表过去
    offset: 0,
    // 固定时间（如果设置，将忽略offset）
    fixedTime: null,
    // 是否启用时间修改
    enabled: true,
    // 时间流逝速度倍率（1.0 = 正常速度，2.0 = 2倍速，0.5 = 半速）
    timeSpeed: 1.0,
  };

  // 保存原始的时间相关方法
  const originalDate = Date;
  const originalNow = Date.now;
  const originalPerformanceNow = performance.now;
  const originalGetTime = Date.prototype.getTime;
  const originalValueOf = Date.prototype.valueOf;

  // 记录脚本启动时间
  const scriptStartTime = originalNow.call(Date);

  // 获取修改后的时间戳
  function getModifiedTime() {
    if (!timeConfig.enabled) {
      return originalNow.call(Date);
    }

    if (timeConfig.fixedTime !== null) {
      if (timeConfig.timeSpeed !== 1.0) {
        // 固定时间基础上应用时间流逝速度
        const elapsed =
          (originalNow.call(Date) - scriptStartTime) * timeConfig.timeSpeed;
        return timeConfig.fixedTime + elapsed;
      }
      return timeConfig.fixedTime;
    }

    const currentTime = originalNow.call(Date);
    if (timeConfig.timeSpeed !== 1.0) {
      // 应用时间流逝速度
      const elapsed = (currentTime - scriptStartTime) * timeConfig.timeSpeed;
      return scriptStartTime + elapsed + timeConfig.offset;
    }

    return currentTime + timeConfig.offset;
  }

  // 劫持 Date 构造函数
  function FakeDate(...args) {
    if (args.length === 0) {
      // new Date() - 返回修改后的当前时间
      return new originalDate(getModifiedTime());
    } else {
      // new Date(year, month, ...) 或 new Date(timestamp) - 保持原有行为
      return new originalDate(...args);
    }
  }

  // 复制 Date 的静态属性和方法
  Object.setPrototypeOf(FakeDate, originalDate);
  Object.setPrototypeOf(FakeDate.prototype, originalDate.prototype);

  // 劫持 Date.now()
  FakeDate.now = function () {
    return getModifiedTime();
  };

  // 复制其他 Date 静态方法
  ["parse", "UTC"].forEach((method) => {
    FakeDate[method] = originalDate[method];
  });

  // 劫持 Date.prototype.getTime 和 valueOf
  FakeDate.prototype.getTime = function () {
    const originalTime = originalGetTime.call(this);
    // 只对通过 new Date() 创建的对象应用时间修改
    if (this.constructor === FakeDate && arguments.length === 0) {
      return getModifiedTime();
    }
    return originalTime;
  };

  FakeDate.prototype.valueOf = function () {
    return this.getTime();
  };

  // 替换全局 Date
  window.Date = FakeDate;

  // 劫持 performance.now() (可选)
  performance.now = function () {
    if (!timeConfig.enabled) {
      return originalPerformanceNow.call(performance);
    }

    const originalPerfTime = originalPerformanceNow.call(performance);
    if (timeConfig.timeSpeed !== 1.0) {
      return originalPerfTime * timeConfig.timeSpeed;
    }
    return originalPerfTime;
  };

  // 全局控制函数
  window.TimeController = {
    // 设置时间偏移（分钟）
    setOffset: function (minutes) {
      timeConfig.offset = minutes * 60 * 1000;
      timeConfig.fixedTime = null;
      console.log(`时间偏移设置为: ${minutes} 分钟`);
      console.log(`当前修改后时间: ${new Date().toString()}`);
    },

    // 设置固定时间
    setFixedTime: function (dateStr) {
      if (typeof dateStr === "string") {
        timeConfig.fixedTime = new originalDate(dateStr).getTime();
      } else if (typeof dateStr === "number") {
        timeConfig.fixedTime = dateStr;
      } else if (dateStr instanceof originalDate) {
        timeConfig.fixedTime = dateStr.getTime();
      }
      timeConfig.offset = 0;
      console.log(
        `固定时间设置为: ${new originalDate(timeConfig.fixedTime).toString()}`
      );
      console.log(`当前修改后时间: ${new Date().toString()}`);
    },

    // 设置时间流逝速度
    setTimeSpeed: function (speed) {
      timeConfig.timeSpeed = speed;
      console.log(`时间流逝速度设置为: ${speed}x`);
    },

    // 启用/禁用时间修改
    enable: function () {
      timeConfig.enabled = true;
      console.log("时间修改已启用");
      console.log(`当前修改后时间: ${new Date().toString()}`);
    },

    disable: function () {
      timeConfig.enabled = false;
      console.log("时间修改已禁用");
      console.log(`当前真实时间: ${new Date().toString()}`);
    },

    // 重置所有设置
    reset: function () {
      timeConfig.offset = 0;
      timeConfig.fixedTime = null;
      timeConfig.enabled = true;
      timeConfig.timeSpeed = 1.0;
      console.log("时间修改设置已重置");
    },

    // 获取当前设置
    getStatus: function () {
      console.log("当前时间修改状态:");
      console.log(`- 启用状态: ${timeConfig.enabled}`);
      console.log(`- 时间偏移: ${timeConfig.offset / 60000} 分钟`);
      console.log(
        `- 固定时间: ${
          timeConfig.fixedTime
            ? new originalDate(timeConfig.fixedTime).toString()
            : "未设置"
        }`
      );
      console.log(`- 时间速度: ${timeConfig.timeSpeed}x`);
      console.log(`- 真实时间: ${new originalDate().toString()}`);
      console.log(`- 修改后时间: ${new Date().toString()}`);
    },

    // 恢复原始时间函数（彻底还原）
    restore: function () {
      window.Date = originalDate;
      performance.now = originalPerformanceNow;
      console.log("已恢复原始时间函数");
    },
  };

  // 快捷方法
  window.setTimeOffset = window.TimeController.setOffset;
  window.setFixedTime = window.TimeController.setFixedTime;

  console.log("🕐 时间修改脚本已加载!");
  console.log("📝 使用方法:");
  console.log("  TimeController.setOffset(30)     // 设置时间快进30分钟");
  console.log("  TimeController.setOffset(-60)    // 设置时间倒退1小时");
  console.log(
    '  TimeController.setFixedTime("2024-01-01 12:00:00") // 设置固定时间'
  );
  console.log("  TimeController.setTimeSpeed(2.0) // 设置2倍时间流逝速度");
  console.log("  TimeController.disable()         // 禁用时间修改");
  console.log("  TimeController.enable()          // 启用时间修改");
  console.log("  TimeController.getStatus()       // 查看当前状态");
  console.log("  TimeController.reset()           // 重置所有设置");
  console.log("  TimeController.restore()         // 完全恢复原始时间");
  console.log("");
  console.log("💡 快捷方法:");
  console.log(
    "  setTimeOffset(30)                // 等同于 TimeController.setOffset(30)"
  );
  console.log(
    '  setFixedTime("2024-12-25")       // 等同于 TimeController.setFixedTime()'
  );
})();
