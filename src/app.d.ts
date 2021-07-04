import 'vue-router';

interface ImportMetaEnv {
  BACKEND_URL: string;
  APP_NAME: string;
}

declare module 'vue-router' {
  interface RouteMeta {
    // must be declared by every route
    requiresAuth?: boolean
  }
}