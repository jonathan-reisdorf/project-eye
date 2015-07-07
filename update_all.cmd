@echo off
cd server
call npm update --save
cd gazejs
call npm update  --save
cd ..\..\remote
call npm update --save
cd ..\client
call npm update --save
cd ..