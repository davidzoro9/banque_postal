// Environnement de développement local
// Le frontend (ng serve) tourne sur http://localhost:4200
// Le backend Spring Boot tourne sur http://localhost:8081
// Le proxy proxy.conf.json redirige /api/* -> http://localhost:8081/api/*
export const environment = {
  production: false,
  apiUrl: '/api'
};
