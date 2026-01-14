import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes',
      error: error.message,
    });
  }
};

// Obtener orden por ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener orden',
      error: error.message,
    });
  }
};

// Obtener orden por número de orden
export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener orden',
      error: error.message,
    });
  }
};

// Crear nueva orden
export const createOrder = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress, clientCountry, clientProvince, additionalMessage, items, totalAmount } = req.body;

    // Validar datos requeridos
    if (!clientName || !clientEmail || !clientPhone || !clientAddress || !clientCountry || !clientProvince) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos del cliente',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un artículo',
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El total debe ser mayor a cero',
      });
    }

    // Generar número de orden
    const lastOrder = await Order.findOne().sort({ createdAt: -1 }).lean();
    const lastNumber = lastOrder && lastOrder.orderNumber ? parseInt(lastOrder.orderNumber.split('-')[1]) : 0;
    const orderNumber = `ORD-${String(lastNumber + 1).padStart(5, '0')}`;

    // Restar stock de cada producto
    for (const item of items) {
      const productId = item._id || item.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${productId} no encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.nombre}. Stock disponible: ${product.stock}, Solicitado: ${item.quantity}`,
        });
      }

      // Actualizar stock
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -item.quantity } }, { new: true });
    }

    // Crear orden
    const newOrder = new Order({
      orderNumber,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      clientCountry,
      clientProvince,
      additionalMessage: additionalMessage || '',
      items: items.map((item) => ({
        productId: item._id || item.id,
        productName: item.name || item.nombre,
        productPrice: item.price || item.precio,
        quantity: item.quantity,
      })),
      totalAmount,
      status: 'pendiente',
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Orden creada correctamente',
      data: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear orden',
      error: error.message,
    });
  }
};

// Actualizar estado de orden
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El estado es requerido',
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes: notes || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Orden actualizada correctamente',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar orden',
      error: error.message,
    });
  }
};

// Buscar órdenes por email
export const searchOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido',
      });
    }

    const orders = await Order.find({ clientEmail: email }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar órdenes',
      error: error.message,
    });
  }
};

// Eliminar orden
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Orden eliminada correctamente',
      data: order,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar orden',
      error: error.message,
    });
  }
};
