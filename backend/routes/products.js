import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

// Rutas
router
  .route('/')
  .get(getProducts) // GET /api/products
  .post(createProduct); // POST /api/products

router
  .route('/:id')
  .get(getProductById) // GET /api/products/:id
  .put(updateProduct) // PUT /api/products/:id
  .delete(deleteProduct); // DELETE /api/products/:id

export default router;
