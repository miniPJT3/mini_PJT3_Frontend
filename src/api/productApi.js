import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, 
});

export const productApi = {
  // 1. 상품 조회 (GET /api/products)
  getProducts: () => api.get('/products'),
};