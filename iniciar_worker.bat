@echo off
echo Iniciando HAC Worker...
call venv\Scripts\activate.bat
python -m worker.main
pause
