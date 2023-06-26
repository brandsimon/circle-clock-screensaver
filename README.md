# circle-clock-screensaver
Screensaver which shows the time and date as circles.
The screensaver closes on a keypress, it does not exit on mouseclick or mousemove.

You can set the this project as a screensaver via a nwjs or a browser, e.g.
Create a batch file to start the browser:

```bash
@echo off
start /wait "" "C:\Program Files\Mozilla Firefox\firefox.exe" -profile C:/screensaver/firefox_profile -kisok file:///C:/screensaver/index.html
rem
```

Register the screensaver
```regedit
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d C:\screensaver\firefox.bat /f
```
