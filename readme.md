# Realtime quiz application

## Require
- Docker
- Kubernestes
- Node.js >= 18.17.0

## Run local
### Build backend image
```
cd backend/

docker build -t backend-api . 

```

### Run k8s stack
```
kubectl create configmap be-config --from-env-file=./deployments/env/backend.env

kubectl apply -f deployments/config.yaml
kubectl apply -f deployments/redis.yaml
kubectl apply -f deployments/mysql.yaml
kubectl apply -f deployments/api.yaml
kubectl apply -f deployments/ingress.yaml
```

### Run frontend app

```
cd frondend/

touch .env.local
```

Put this to ```.env.local```
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:80
```

Install and run
```
npm install

npm run dev
```

### Setup grafana and loki
Follow instruction at [this post](https://readmedium.com/a-hands-on-guide-to-kubernetes-logging-using-grafana-loki-%EF%B8%8F-b8d37ea4de13)