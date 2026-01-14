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

interface FormDataWithDiscount extends CreateProductInput {
  descuento?: number;
}

export function ProductFormModal({ open, onOpenChange, product, onSubmit, categories, isLoading = false }: ProductFormModalProps) {
  const [formData, setFormData] = useState<FormDataWithDiscount>({
    nombre: '',
    descripcion: '',
    precio: 0,
    precioOriginal: undefined,
    imagen: '',
    categoria: '',
    stock: 0,
    enOferta: false,
    descuento: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      // Calcular descuento a partir de precioOriginal si existe
      let descuento = 0;
      if (product.precioOriginal && product.precio) {
        descuento = Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100);
      }

      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || 0,
        precioOriginal: product.precioOriginal,
        imagen: product.imagen || '',
        categoria: product.categoria || '',
        stock: product.stock || 0,
        enOferta: product.enOferta || false,
        descuento: descuento,
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
        descuento: 0,
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

    if (formData.descuento && formData.descuento < 0) {
      newErrors.descuento = 'El descuento no puede ser negativo';
    }

    if (formData.descuento && formData.descuento > 90) {
      newErrors.descuento = 'El descuento máximo es 90%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imagen: url }));
    setImagePreview(url);
  };

  const handleDiscountChange = (value: number) => {
    setFormData((prev) => {
      const newFormData = { ...prev, descuento: value };

      // Calcular precio final basado en precioOriginal y descuento
      if (prev.precioOriginal && prev.precioOriginal > 0) {
        const precioFinal = Math.round(prev.precioOriginal * (1 - value / 100) * 100) / 100;
        newFormData.precio = precioFinal;
        if (value > 0) {
          newFormData.enOferta = true;
        } else {
          newFormData.enOferta = false;
        }
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // No enviar el descuento al backend, solo precioOriginal
      const { descuento, ...dataToSubmit } = formData;
      await onSubmit(dataToSubmit as CreateProductInput);
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

          {/* Precio Original */}
          <div>
            <Label htmlFor="precioOriginal">Precio Original (ARS) *</Label>
            <Input
              id="precioOriginal"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.precioOriginal || ''}
              onChange={(e) => {
                const newPrecioOriginal = parseFloat(e.target.value) || 0;
                setFormData((prev) => {
                  const newFormData = { ...prev, precioOriginal: newPrecioOriginal };
                  // Recalcular precio final si hay descuento
                  if (prev.descuento && prev.descuento > 0 && newPrecioOriginal > 0) {
                    newFormData.precio = Math.round(newPrecioOriginal * (1 - prev.descuento / 100) * 100) / 100;
                  } else {
                    newFormData.precio = newPrecioOriginal;
                  }
                  return newFormData;
                });
                if (errors.precioOriginal) setErrors((prev) => ({ ...prev, precioOriginal: '' }));
              }}
              disabled={isLoading}
              className={errors.precioOriginal ? 'border-red-500' : ''}
            />
            {errors.precioOriginal && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.precioOriginal}
              </p>
            )}
          </div>

          {/* Descuento */}
          <div>
            <Label htmlFor="descuento">Descuento (%) - 0 a 90%</Label>
            <div className="flex gap-2">
              <Input
                id="descuento"
                type="number"
                placeholder="0"
                min="0"
                max="90"
                value={formData.descuento || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value <= 90) {
                    handleDiscountChange(value);
                    if (errors.descuento) setErrors((prev) => ({ ...prev, descuento: '' }));
                  } else {
                    setErrors((prev) => ({ ...prev, descuento: 'El descuento máximo es 90%' }));
                  }
                }}
                disabled={isLoading}
                className={`${errors.descuento ? 'border-red-500' : ''}`}
              />
              <span className="flex items-center text-sm text-muted-foreground">%</span>
            </div>
            {errors.descuento && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.descuento}
              </p>
            )}
          </div>

          {/* Precio Final */}
          {formData.descuento && formData.descuento > 0 && (
            <div className="rounded-md bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-medium text-green-900 mb-2">Resumen de Oferta</p>
              <div className="space-y-1 text-sm text-green-800">
                <p>
                  Precio original: <span className="font-semibold">${formData.precioOriginal?.toLocaleString('es-AR')}</span>
                </p>
                <p>
                  Descuento: <span className="font-semibold">{formData.descuento}%</span>
                </p>
                <p className="border-t border-green-200 pt-1 mt-1">
                  <strong>Precio final: ${formData.precio.toLocaleString('es-AR')}</strong>
                </p>
                <p>
                  Ahorro: <span className="font-semibold">${(formData.precioOriginal! - formData.precio).toLocaleString('es-AR')}</span>
                </p>
              </div>
            </div>
          )}

          {/* Precio (sin descuento) */}
          {(!formData.descuento || formData.descuento === 0) && (
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
          )}

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

          {/* Estado de oferta (automático si hay descuento) */}
          {formData.descuento && formData.descuento > 0 && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              ✓ Este producto está marcado como <strong>EN OFERTA</strong>
            </div>
          )}

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
