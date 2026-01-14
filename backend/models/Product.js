import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    imagen: {
      type: String,
      required: [true, 'La imagen es requerida'],
      default: 'https://via.placeholder.com/300x300?text=Sin+Imagen',
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros', 'Otros'],
        message: '{VALUE} no es una categoría válida',
      },
    },
    stock: {
      type: Number,
      required: [true, 'El stock es requerido'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    enOferta: {
      type: Boolean,
      default: false,
    },
    precioOriginal: {
      type: Number,
      min: [0, 'El precio original no puede ser negativo'],
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  }
);

// Método virtual para calcular si está disponible. Define una propiedad virtual (no se guarda en la base de datos) calculada en tiempo de ejecución (disponible es un campo derivado de stock). Útil para valores derivados, setters/getters personalizados y virtual populate.
productSchema.virtual('disponible').get(function () {
  return this.stock > 0;
});

// Incluir virtuals en JSON. Configura opciones del esquema; aquí pide que las virtuals se incluyan al convertir documentos a JSON al hacer res.json(product) o product.toJSON().
productSchema.set('toJSON', { virtuals: true });

// Crea un modelo de Mongoose llamado Product basado en el productSchema. El modelo representa la colección de MongoDB (por convención, el nombre de colección será la pluralización en minúsculas, p. ej. products). Proporciona la clase/constructor (Product) con métodos para interactuar con la base de datos: new Product(...), Product.find(), Product.findById(), Product.create(), etc. Sin esta línea no podrías realizar consultas ni crear documentos con ese esquema.
const Product = mongoose.model('Product', productSchema);

export default Product;
