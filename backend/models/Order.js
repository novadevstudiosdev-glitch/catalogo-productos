import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: String,
  productPrice: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: false,
    },
    // Datos del cliente
    clientName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'El email es requerido'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },
    clientPhone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    clientAddress: {
      type: String,
      required: [true, 'La dirección es requerida'],
      trim: true,
    },
    clientCountry: {
      type: String,
      required: [true, 'El país es requerido'],
      trim: true,
    },
    clientProvince: {
      type: String,
      required: [true, 'La provincia es requerida'],
      trim: true,
    },
    additionalMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'El mensaje no puede exceder 500 caracteres'],
      default: '',
    },
    // Items del pedido
    items: [orderItemSchema],
    // Total
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Estado
    status: {
      type: String,
      enum: ['pendiente', 'procesando', 'en-envío', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
