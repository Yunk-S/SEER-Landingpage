#!/bin/bash

echo "===================================="
echo "   SEER 宣传页启动器"
echo "===================================="
echo ""
echo "正在启动本地服务器..."
echo ""

# 检查是否安装了 Python
if command -v python3 &> /dev/null; then
    echo "使用 Python 启动服务器..."
    echo "请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用 Python 启动服务器..."
    echo "请在浏览器中访问: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    echo "使用 Node.js serve 启动服务器..."
    echo "请在浏览器中访问显示的地址"
    echo ""
    npx serve .
else
    echo "未找到 Python 或 Node.js"
    echo "请手动在浏览器中打开 index.html"
    echo ""
    # 尝试在默认浏览器中打开
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open index.html
    fi
fi

