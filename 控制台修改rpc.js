/*
 HttpRequest HTTP发送请求时需要处理的函数
*/
function HttpRequest(Sunny) {
  // 替换Alchemy节点为LlamaRPC节点
  if (Sunny.url == "https://bsc-rpc.publicnode.com/") {
    // 对指定的连接进行替换
    Sunny.url = "https://bsc-rpc.publicnode.com/";
    return Sunny;
  }

  return Sunny;
}

/*
 HttpResponse HTTP请求完成时需要处理的函数
*/
function HttpResponse(Sunny) {
  return Sunny;
}

/*
 TCPWillConnection TCP请求即将连接
*/
function TCPWillConnection(Sunny) {
  return Sunny;
}
