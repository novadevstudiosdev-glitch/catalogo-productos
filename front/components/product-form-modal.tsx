'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { type Product, type CreateProductInput, isValidImageUrl } from '@/lib/products';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  categories: string[];
  isLoading?: boolean;
}

export function ProductFormModal({ open, onOpenChange, product, onSubmit, categories, isLoading = false }: ProductFormModalProps) {
  const [formData, setFormData] = useState<CreateProductInput>({
    nombre: '',
    descripcion: '',
    precio: 0,
    precioOriginal: undefined,
    imagen: '',
    categoria: '',
    stock: 0,
    enOferta: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || 0,
        precioOriginal: product.precioOriginal,
        imagen: product.imagen || '',
        categoria: product.categoria || '',
        stock: product.stock || 0,
        enOferta: product.enOferta || false,
      });
      setImagePreview(product.imagen || '');
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: 0,
        precioOriginal: undefined,
        imagen: '',
        categoria: '',
        stock: 0,
        enOferta: false,
      });
      setImagePreview('');
    }
    setErrors({});
  }, [product, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!isNaN(formData.precio) && formData.precio && !Number.isFinite(formData.precio)) {
      newErrors.precio = 'El precio debe ser un número válido';
    }

    if (formData.stock < 0 || !Number.isInteger(formData.stock)) {
      newErrors.stock = 'El stock debe ser un número entero >= 0';
    }

    if (!formData.imagen.trim()) {
      newErrors.imagen = 'La imagen es requerida';
    } else if (!isValidImageUrl(formData.imagen)) {
      newErrors.imagen = 'La URL de imagen no es válida';
    }

    if (formData.precioOriginal !== undefined && formData.precioOriginal <= 0) {
      newErrors.precioOriginal = 'El precio original debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imagen: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>
          <DialogDescription>{product ? 'Actualiza los datos del producto' : 'Completa el formulario para agregar un nuevo producto'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Cafetera Nespresso"
              value={formData.nombre}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' }));
              }}
              disabled={isLoading}
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el producto..."
              value={formData.descripcion}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, descripcion: e.target.value }));
                if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: '' }));
              }}
              disabled={isLoading}
              rows={4}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria">Categoría *</Label>
            <Select value={formData.categoria} onValueChange={(value) => setFormData((prev) => ({ ...prev, categoria: value }))}>
              <SelectTrigger disabled={isLoading} className={errors.categoria ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <Label htmlFor="precio">Precio (ARS) *</Label>
            <Input
              id="precio"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.precio}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, precio: parseFloat(e.target.value) || 0 }));
                if (errors.precio) setErrors((prev) => ({ ...prev, precio: '' }));
              }}
              disabled={isLoading}
              className={errors.precio ? 'border-red-500' : ''}
            />
            {errors.precio && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.precio}
              </p>
            )}
          </div>

          {/* Precio Original (para ofertas) */}
          <div>
            <Label htmlFor="precioOriginal">Precio Original (opcional)</Label>
            <Input id="precioOriginal" type="number" placeholder="0.00" min="0" step="0.01" value={formData.precioOriginal || ''} onChange={(e) => setFormData((prev) => ({ ...prev, precioOriginal: e.target.value ? parseFloat(e.target.value) : undefined }))} disabled={isLoading} className={errors.precioOriginal ? 'border-red-500' : ''} />
            {errors.precioOriginal && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.precioOriginal}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              min="0"
              value={formData.stock}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }));
                if (errors.stock) setErrors((prev) => ({ ...prev, stock: '' }));
              }}
              disabled={isLoading}
              className={errors.stock ? 'border-red-500' : ''}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Imagen URL */}
          <div>
            <Label htmlFor="imagen">URL de Imagen *</Label>
            <Input id="imagen" placeholder="https://images.unsplash.com/..." value={formData.imagen} onChange={handleImageChange} disabled={isLoading} className={errors.imagen ? 'border-red-500' : ''} />
            {errors.imagen && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.imagen}
              </p>
            )}
            {imagePreview && !errors.imagen && (
              <div className="mt-2 rounded border border-border p-2">
                <img src={imagePreview} alt="Vista previa" className="h-32 w-full object-cover rounded" />
              </div>
            )}
          </div>

          {/* Oferta */}
          <div className="flex items-center space-x-2">
            <Checkbox id="enOferta" checked={formData.enOferta} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enOferta: checked === true }))} disabled={isLoading} />
            <Label htmlFor="enOferta" className="cursor-pointer">
              Este producto está en oferta
            </Label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
