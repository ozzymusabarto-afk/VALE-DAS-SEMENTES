@echo off
title Criar Link Temporario - O Vale das Sementes
cd /d "%~dp0"
echo =========================================================
echo    Gerando Link Temporario para compartilhar o jogo...
echo =========================================================
echo.
echo Conectando ao tunel seguro...
echo.
ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:5176 serveo.net
pause
