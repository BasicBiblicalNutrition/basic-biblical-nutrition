@echo off
echo.
echo === Publishing Basic Biblical Nutrition ===
echo.

git add .

set /p msg=Commit message: 

git commit -m "%msg%"

git push origin main

echo.
echo ===========================
echo Publish Complete!
echo ===========================
pause