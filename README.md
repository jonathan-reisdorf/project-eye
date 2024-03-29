![Project Eye Logo](logo.png)

# Pre-Requirements

In order to start, you need the following Hard- / Software:

## For Server:
- Device with Windows 7+ (ideally x64) - Mac / Linux currently untested / unsupported
- Tobii EyeX Controller or SR EyeLink (untested!)
- USB 3 Port
- Node.js
- Latest Tobii Gaze SDK (already included in the project source; please read the license agreement before using it) or SR EyeLink SDK
- Visual Studio 2013 Express (or higher) - necessary for compiling dependencies

## For Remote or Client
- Device with Windows, Mac or Linux
- Node.js

## For the Client User Script
- Chrome Browser and Tampermonkey Add-On or Firefox Browser and Greasemonkey
- alternatively: there's a new zip file (client/CustomizedFF.zip) that contains a portable FireFox that already has Greasemonkey and the user script installed and running, as well as some additional settings -- use it to quickly get started


# Initial Run:

## Server:

```
cd server
set_path.cmd
REM set_path.cmd is only optional -- only if cl compile tools are not available in command line
npm install -g gulp
npm install
node server.js
```


## Remote

```
cd remote
npm install -g gulp
npm install
gulp start
```


## Client

```
cd client
npm install -g gulp
npm install
gulp start
```


## Client User Script (only if you don't use the CustomizedFF.zip file)

Install the user script in Tampermonkey or Greasemonkey and activate it (it's in the client/userscript folder)


# How to use as a developer

Once the initial run has been done, you can simply call `start_everything.cmd` to get everything started and running.
