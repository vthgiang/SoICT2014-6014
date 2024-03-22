#!/bin/bash

# Tạo file .env trong tất cả các service
echo -n "Khoi tao file .env trong cac service"
find . -maxdepth 3 -type f -not -path "*/node_modules/*" -name "*.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;
echo " \e[32m[OK]\e[0m"
# Chạy backend
# Kiểm tra cờ --init để khởi tạo database
flag_init=""
for arg in "$@"; do
    if [ "$arg" = "--init" ]; then
        flag_init="1"
    fi
done

if [ -n "$flag_init" ]; then
    echo -n "Chay backend va khoi tao database"
    docker-compose -f micro-services/docker-compose.yml -f micro-services/docker-init-db.yml up -d --build --quiet-pull 2>/dev/null
else
    echo -n "Chay backend"
    docker-compose -f micro-services/docker-compose.yml up -d --build --quiet-pull 2>/dev/null
fi

echo " \e[32m[OK]\e[0m"
# Chạy frontend
echo -n "Chay frontend"
docker-compose -f client/docker-compose.yml up -d --build --quiet-pull 2>/dev/null
echo " \e[32m[OK]\e[0m"
