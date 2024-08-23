@echo off

REM Remove Pingendo code from HTML files using PowerShell
for /r %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace '<pingendo.*?</pingendo>', '' | Set-Content '%%f'"
)

REM Add the changes to the staging area
git add .

REM Commit the changes with a message
git commit -m "Removed Pingendo code"

REM Push the committed changes to the remote repository
git push origin master --force
