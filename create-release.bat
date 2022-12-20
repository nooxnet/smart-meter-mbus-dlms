
copy "smart-meter-mbus-dlms.js" "release/smart-meter-mbus-dlms"
cd ./config/
copy default.template.json5 "../release/smart-meter-mbus-dlms/config/default.json5"
cd ..

call npm version patch > ./release/version.txt
set /p version=<./release/version.txt
REM set version=v1.0.1

cd ./release/

"C:\Program Files\7-Zip\7z.exe" a -ttar -so -an ./smart-meter-mbus-dlms | "C:\Program Files\7-Zip\7z.exe" a -si smart-meter-mbus-dlms-%version%.tar.gz

cd ..


