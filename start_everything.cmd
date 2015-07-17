@echo off

echo Starting everything...

cd remote
call start gulp server
call start gulp watch

cd ..\client
call start gulp watch
call start gulp server

cd ..\server
call start start_mongod.cmd
call start node server.js

cd ..