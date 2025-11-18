// 时间修改脚本 - 简化使用示例
// 将完整脚本复制到浏览器控制台后，可以使用以下命令

// ============ 基本使用方法 ============

// 1. 时间快进30分钟
TimeController.setOffset(30);

// 2. 时间倒退2小时
TimeController.setOffset(-120);

// 3. 设置固定时间为2024年12月25日
TimeController.setFixedTime("2024-12-25 09:00:00");

// 4. 设置固定时间为今天下午3点
TimeController.setFixedTime("2024-10-01 15:00:00");

// 5. 设置2倍时间流逝速度（时间过得更快）
TimeController.setTimeSpeed(2.0);

// 6. 设置0.5倍时间流逝速度（时间过得更慢）
TimeController.setTimeSpeed(0.5);

// ============ 控制命令 ============

// 查看当前状态
TimeController.getStatus();

// 禁用时间修改（恢复正常时间）
TimeController.disable();

// 重新启用时间修改
TimeController.enable();

// 重置所有设置
TimeController.reset();

// 完全恢复原始时间函数
TimeController.restore();

// ============ 快捷命令 ============

// 快速设置时间偏移（等同于 TimeController.setOffset()）
setTimeOffset(60); // 快进1小时

// 快速设置固定时间（等同于 TimeController.setFixedTime()）
setFixedTime("2024-01-01 00:00:00"); // 新年午夜

// ============ 实用场景示例 ============

// 场景1：测试午夜功能
setFixedTime("2024-10-01 23:59:55");

// 场景2：测试周末功能（设置为周六）
setFixedTime("2024-10-05 10:00:00");

// 场景3：快进到明天
setTimeOffset(24 * 60); // 快进24小时

// 场景4：倒退到昨天
setTimeOffset(-24 * 60); // 倒退24小时

// 场景5：加速时间流逝，快速测试定时器
setTimeSpeed(10); // 10倍速

// ============ 验证时间是否生效 ============

// 检查当前时间
console.log("当前时间:", new Date().toString());

// 检查时间戳
console.log("当前时间戳:", Date.now());

// 连续检查时间变化
setInterval(() => {
  console.log(new Date().toString());
}, 1000);

// ============ 常见问题解决 ============

// 如果页面时间没有变化，可能需要刷新页面
// 或者检查网站是否使用了服务器时间

// 如果出现问题，立即恢复：
// TimeController.restore();
