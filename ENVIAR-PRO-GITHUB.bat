@echo off
title Enviar O Vale das Sementes para o GitHub
cd /d "%~dp0"
echo =========================================================
echo    Enviando o projeto para github.com/ozzymusabarto-afk...
echo =========================================================
echo.
git push -u origin main
echo.
echo Processo concluido!
pause
