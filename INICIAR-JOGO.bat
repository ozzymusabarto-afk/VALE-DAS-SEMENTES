@echo off
title O Vale das Sementes - Jogo Educativo
cd /d "%~dp0"
echo ===================================================
echo     Iniciando O Vale das Sementes...
echo ===================================================
echo.
echo Abrindo em http://127.0.0.1:5176...
start http://127.0.0.1:5176
cmd /c npm run dev
pause
