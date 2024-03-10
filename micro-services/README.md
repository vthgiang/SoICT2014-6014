## Tạo file .env từ file .env.example cho tất cả các service

### Linux

```bash
find . -name .env.example -exec cp {} .env \;
```

### Windows

```bash
for /r %x in (*.example) do copy %x %~dx%~px%~nx
```

## Build và chạy các service

```bash
docker-compose up -d --build
```
