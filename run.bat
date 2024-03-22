@echo off
:: tạo file .env trong tất cả các service
<nul set /p ="Khoi tao file .env trong cac service "
for /r %%x in (*.example) do copy "%%x" "%%~dx%%~px%%~nx" >nul
echo [OK]
:: chạy backend
:: check flag --init để khởi tạo database
set "flag_init="
for %%i in (%*) do (
    if "%%i" == "--init" (
        set "flag_init=1"
    )
)
if defined flag_init (
    <nul set /p ="Chay backend va khoi tao database "
    docker-compose --log-level ERROR -f micro-services/docker-compose.yml -f micro-services/docker-init-db.yml up -d --build --quiet-pull >nul
) else (
    <nul set /p ="Chay backend "
    docker-compose --log-level ERROR -f micro-services/docker-compose.yml up -d --build --quiet-pull >nul
)
echo [OK]
:: chạy frontend
<nul set /p ="Chay frontend "
docker-compose -f client/docker-compose.yml up -d --quiet-pull --build >nul
echo [OK]
