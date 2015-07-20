@echo off

echo Updating all dependencies...

cd server
call start npm update --save

cd gazejs
call start npm update --save

cd ..\..\remote
call start npm update --save

cd ..\client
call start npm update --save

cd ..