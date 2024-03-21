@echo off
:: tạo file .env trong tất cả các service
echo "Khoi tao file .env trong cac service"
for /r %%x in (*.example) do copy "%%x" "%%~dx%%~px%%~nx"
:: chạy backend
:: check flag --init để khởi tạo database
set "flag_init="
for %%i in (%*) do (
    if "%%i" == "--init" (
        set "flag_init=1"
    )
)
if defined flag_init (
    echo "Chay backend va khoi tao database"
    docker-compose -f micro-services/docker-compose.yml -f micro-services/docker-init-db.yml up -d --build
) else (
    echo "Chay backend"
    docker-compose -f micro-services/docker-compose.yml up -d --build
)
:: chạy frontend
echo "Chay frontend"
docker-compose -f client/docker-compose.yml up -d --build
echo "Hoan thanh"
