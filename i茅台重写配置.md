# i 茅台 Quantumult X 重写配置

## 功能说明

此重写脚本用于修改 i 茅台 APP 的 `purchaseInfoV2` API 响应：

1. **修改库存状态** - 将 `inventory` 从 0 改为 1
2. **启用购物车** - 将 `canAddCart` 从 false 改为 true
3. **清除售罄提示** - 清空 `forbiddenBuyDesc` 字段
4. **启用购买按钮** - 将 `disable` 从 true 改为 false
5. **提前开始时间** - 将所有 `startTimeList` 中的时间提前 1 分钟

## Quantumult X 配置

### 重写规则 (Rewrite)

在 Quantumult X 配置文件的 `[rewrite_local]` 或 `[rewrite_remote]` 部分添加：

```ini
[rewrite_local]
^https://h5\.moutai519\.com\.cn/xhr/front/mall/item/purchaseInfoV2 url script-response-body maotai_rewrite.js
```

### MITM 配置

在 `[mitm]` 部分添加域名：

```ini
[mitm]
hostname = h5.moutai519.com.cn
```

## 完整配置示例

```ini
[rewrite_local]
^https://h5\.moutai519\.com\.cn/xhr/front/mall/item/purchaseInfoV2 url script-response-body https://raw.githubusercontent.com/你的用户名/你的仓库/main/maotai_rewrite.js

[mitm]
hostname = h5.moutai519.com.cn
```

## 本地使用

如果脚本存放在本地 iCloud：

```ini
[rewrite_local]
^https://h5\.moutai519\.com\.cn/xhr/front/mall/item/purchaseInfoV2 url script-response-body iCloud/Quantumult X/Scripts/maotai_rewrite.js
```

## 修改效果预览

### 原始响应：

```json
{
  "inventory": 0,
  "canAddCart": false,
  "forbiddenBuyDesc": "已售罄",
  "disable": false,
  "startTimeList": [1767315600000, 1767315900000, ...]
}
```

### 修改后响应：

```json
{
  "inventory": 1,
  "canAddCart": true,
  "forbiddenBuyDesc": "",
  "disable": false,
  "startTimeList": [1767315540000, 1767315840000, ...]
}
```

时间变化示例：

- 原始: `2026-01-02 09:00:00` → 修改后: `2026-01-02 08:59:00`

## 注意事项

1. 确保已开启 MitM 并信任证书
2. 脚本仅修改客户端显示，不影响服务器端实际库存
3. 提前 1 分钟仅影响客户端显示的倒计时，实际抢购时间由服务器控制
