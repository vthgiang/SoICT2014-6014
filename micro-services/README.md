## Create env file for all services

### In linux

```bash
find . -name .env.example -exec cp {} .env \;
```

### In Windows

```bash
for /r %x in (*.example) do copy %x %~dx%~px%~nx
```

## Run on Docker

```bash
docker-compose up -d --build
```
