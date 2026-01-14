import express from 'express';
import { getAllOrders, getOrderById, getOrderByNumber, createOrder, updateOrderStatus, searchOrdersByEmail, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// Rutas públicas
router.post('/', createOrder); // Crear orden
router.get('/search/email', searchOrdersByEmail); // Buscar por email
router.get('/number/:orderNumber', getOrderByNumber); // Obtener por número de orden
router.get('/:id', getOrderById); // Obtener por ID

// Rutas administrativas
router.get('/', getAllOrders); // Listar todas las órdenes
router.patch('/:id', updateOrderStatus); // Actualizar estado
router.delete('/:id', deleteOrder); // Eliminar orden

export default router;
