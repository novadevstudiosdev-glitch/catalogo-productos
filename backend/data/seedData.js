import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { connectDB } from '../config/db.js';
import fs from 'fs'; // importa el módulo nativo de Node para trabajar con el sistema de archivos (leer/escribir archivos).
import path from 'path'; // importa el módulo nativo de Node para trabajar con rutas y directorios de archivos.
import { fileURLToPath } from 'url'; // importa una función para convertir URLs de módulos en rutas de archivos.

const __filename = fileURLToPath(import.meta.url); // convierte la URL del módulo actual a una ruta de archivo (crea una variable __filename equivalente a la que existía en CommonJS; contiene la ruta completa del archivo actual).
const __dirname = path.dirname(__filename); // obtiene el directorio que contiene el archivo actual; útil para construir rutas relativas (por ejemplo, hacia seedProducts.json).

// Si connectDB() u otra parte del script depende de variables del .env (p. ej. MONGO_URI). Sin esta línea, process.env.MONGO_URI estará vacío cuando ejecutes el script localmente.
// Cuándo NO hace falta: si ya exportas las variables desde el entorno (CI, Docker, shell) o si usas otra forma de inicializar dotenv (por ejemplo node -r dotenv/config o import 'dotenv/config').
dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Leer el archivo JSON (carga y parsea el JSON con los productos para insertarlos en la base de datos):
    // path.join(__dirname, 'seedProducts.json') construye la ruta absoluta del archivo seedProducts.json dentro del mismo directorio.
    // fs.readFileSync(..., 'utf-8') lee ese archivo de forma síncrona y devuelve su contenido como cadena (texto).
    // JSON.parse(...) convierte la cadena JSON en un objeto/array de JavaScript asignado a productsData.
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seedProducts.json'), 'utf-8'));

    // Borrar productos existentes
    await Product.deleteMany();
    console.log('🗑️  Productos anteriores eliminados');

    // Insertar nuevos productos
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} productos insertados correctamente`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
