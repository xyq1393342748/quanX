# 以太坊 RPC 重写配置指南

## 脚本功能

将 Alchemy 以太坊 RPC 请求自动替换为 [Llama RPC](https://eth.llamarpc.com) 端点。

## 使用方法

### 1. QuantumultX 配置

在 QuantumultX 配置文件中添加以下重写规则：

```ini
[rewrite_local]
# 以太坊RPC重写
^https://eth-mainnet\.g\.alchemy\.com/v2/ url script-request-header ethereum_rpc_rewrite.js

[mitm]
hostname = eth-mainnet.g.alchemy.com
```

### 2. 脚本引用

将 `ethereum_rpc_rewrite.js` 文件放置在 QuantumultX 脚本目录中，或使用远程引用：

```ini
[rewrite_remote]
https://your-domain.com/ethereum_rpc_rewrite.js, tag=以太坊RPC重写, update-interval=86400, opt-parser=false, enabled=true
```

## 重写规则说明

- **原始端点**: `https://eth-mainnet.g.alchemy.com/v2/_8w6TvtzvLeXYLVrX9TyyRYN5Duy9DGA`
- **目标端点**: `https://eth.llamarpc.com`
- **匹配模式**: 所有 Alchemy v2 API 端点
- **支持方法**: 所有以太坊 JSON-RPC 方法 (eth_getBalance, eth_call, eth_sendTransaction 等)

## 测试请求示例

原始请求：

```bash
curl 'https://eth-mainnet.g.alchemy.com/v2/_8w6TvtzvLeXYLVrX9TyyRYN5Duy9DGA' \
  -H 'content-type: application/json' \
  --data-raw '{"jsonrpc":"2.0","id":4669,"method":"eth_getBalance","params":["0xCcdB4EDD62C1e23F1e1D307A7F6C087d4E79123c","latest"]}'
```

重写后请求：

```bash
curl 'https://eth.llamarpc.com' \
  -H 'content-type: application/json' \
  --data-raw '{"jsonrpc":"2.0","id":4669,"method":"eth_getBalance","params":["0xCcdB4EDD62C1e23F1e1D307A7F6C087d4E79123c","latest"]}'
```

## 注意事项

1. **MITM 证书**: 需要安装并信任 QuantumultX 的 MITM 证书
2. **网络环境**: 确保能够访问 eth.llamarpc.com
3. **API 兼容性**: Llama RPC 完全兼容以太坊 JSON-RPC 规范
4. **调试模式**: 开启日志可查看重写详情

## 故障排除

- 检查 QuantumultX 日志是否显示重写成功
- 确认 MITM 功能已启用
- 验证 hostname 配置正确
- 测试 Llama RPC 可访问性
