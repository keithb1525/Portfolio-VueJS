@echo off
set branch=%1
if "%branch%"=="" set branch=main

echo === BRANCH SUMMARY ===
echo Current Branch:
git branch --show-current
echo.
echo Comparing: %branch%..HEAD
echo.
echo Files Changed:
git diff --name-status %branch%..HEAD
echo.
echo Statistics:
git diff --stat %branch%..HEAD
echo.
echo Commits:
git log --oneline %branch%..HEAD