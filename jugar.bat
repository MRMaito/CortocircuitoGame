@echo off
rem Doble clic para jugar Cortocircuito en tu compu.
rem Levanta un servidor local (no hace falta instalar nada) y abre el navegador.
cd /d "%~dp0"
title Cortocircuito - servidor local
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\servidor.ps1"
if errorlevel 1 pause
