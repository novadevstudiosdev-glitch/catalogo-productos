import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export type ProductFilters = {
  q: string;
  categories: string[];
  minPrice: string;
  maxPrice: string;
  sort: string;
  onSale: boolean;
};

interface ProductFiltersSidebarProps {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  categories: string[];
  onApply: () => void;
  onClear: () => void;
  isMobile?: boolean;
}

export function ProductFiltersSidebar({ filters, setFilters, categories, onApply, onClear, isMobile = false }: ProductFiltersSidebarProps) {
  const [open, setOpen] = useState(false);

  const handleInput = (key: keyof ProductFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCategory = (cat: string) => {
    let newCats = filters.categories.includes(cat) ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat];
    setFilters({ ...filters, categories: newCats });
  };

  const sidebarContent = (
    <div className="flex flex-col gap-6 p-4 w-full max-w-xs">
      <div>
        <h2 className="text-lg font-semibold mb-2">Filtrar productos</h2>
        <Separator />
      </div>
      {/* Buscar por nombre */}
      <div>
        <label className="block text-sm font-medium mb-1">Buscar</label>
        <Input placeholder="Nombre o descripción" value={filters.q} onChange={(e) => handleInput('q', e.target.value)} />
      </div>
      {/* Categorías */}
      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <div className="flex flex-col gap-1 max-h-32 overflow-auto">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <Checkbox checked={filters.categories.includes(cat)} onCheckedChange={() => handleCategory(cat)} id={`cat-${cat}`} />
              {cat}
            </label>
          ))}
        </div>
      </div>
      {/* Rango de precio */}
      <div>
        <label className="block text-sm font-medium mb-1">Precio</label>
        <div className="flex gap-2 items-center">
          <Input type="number" min={0} placeholder="Mín" value={filters.minPrice} onChange={(e) => handleInput('minPrice', e.target.value)} className="w-20" />
          <span>-</span>
          <Input type="number" min={0} placeholder="Máx" value={filters.maxPrice} onChange={(e) => handleInput('maxPrice', e.target.value)} className="w-20" />
          <Button size="sm" variant="outline" onClick={onApply} className="ml-2">
            Aplicar
          </Button>
        </div>
      </div>
      {/* Ordenar */}
      <div>
        <label className="block text-sm font-medium mb-1">Ordenar</label>
        <RadioGroup value={filters.sort} onValueChange={(v) => handleInput('sort', v)} className="flex flex-col gap-2">
          <label htmlFor="sort-new" className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="new" id="sort-new" />
            <span>Más nuevo</span>
          </label>
          <label htmlFor="sort-asc" className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="asc" id="sort-asc" />
            <span>Menor precio</span>
          </label>
          <label htmlFor="sort-desc" className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="desc" id="sort-desc" />
            <span>Mayor precio</span>
          </label>
          <label htmlFor="sort-az" className="flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="az" id="sort-az" />
            <span>Nombre A-Z</span>
          </label>
        </RadioGroup>
      </div>
      {/* En oferta */}
      <div className="flex items-center gap-2">
        <Switch checked={filters.onSale} onCheckedChange={(v) => handleInput('onSale', v)} id="on-sale" />
        <label htmlFor="on-sale" className="text-sm">
          En oferta
        </label>
      </div>
      {/* Botones */}
      <div className="flex gap-2 mt-2">
        <Button onClick={onApply} className="w-full">
          Aplicar filtros
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4 w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return <aside className="sticky top-24 h-fit w-[280px] shrink-0 border border-border bg-card rounded-lg mr-8">{sidebarContent}</aside>;
}
