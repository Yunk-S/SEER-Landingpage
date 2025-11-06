@echo off
echo ====================================
echo    SEER 宣传页启动器
echo ====================================
echo.
echo 正在启动本地服务器...
echo.

REM 检查是否安装了 Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 使用 Python 启动服务器...
    echo 请在浏览器中访问: http://localhost:8000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
) else (
    REM 如果没有Python，尝试直接打开HTML文件
    echo Python 未安装，直接在浏览器中打开...
    start index.html
)

pause

