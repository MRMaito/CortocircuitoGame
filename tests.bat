@echo off
rem Doble clic para correr los tests automaticos. Necesita Node.js 18 o superior.
cd /d "%~dp0"
title Cortocircuito - tests
where node >nul 2>nul
if errorlevel 1 goto sin_node

node --test
set RESULTADO=%ERRORLEVEL%
echo.
if "%RESULTADO%"=="0" (
  echo   Todos los tests pasaron.
) else (
  echo   Hay tests que fallaron. Revisa los mensajes de arriba.
)
echo.
pause
exit /b %RESULTADO%

:sin_node
echo.
echo   Para correr los tests hace falta Node.js, version 18 o superior.
echo   Descargalo de https://nodejs.org - elegi la version LTS -, instalalo
echo   y volve a abrir este archivo.
echo.
pause
exit /b 1
