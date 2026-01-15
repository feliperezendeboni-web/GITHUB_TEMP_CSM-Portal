@echo off
echo ========================================
echo  Iniciando Servidor do Portal CS
echo ========================================
echo.
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao esta instalado!
    echo.
    echo Por favor, instale Node.js de: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado!
echo.
echo Instalando dependencias...
call npm install

echo.
echo ========================================
echo  Servidor iniciando...
echo ========================================
echo.
echo O servidor estara disponivel em:
echo   http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

node server.js

pause
