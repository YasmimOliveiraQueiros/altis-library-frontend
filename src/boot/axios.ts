import axios from 'axios';
import type { App } from 'vue';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export default ({ app }: { app: App }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
};

export { api };
