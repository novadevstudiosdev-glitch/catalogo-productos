// Settings page for admin
'use client';
import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/api';
import type { Settings } from '@/lib/types';

const defaultSettings: Settings = {
  whatsappPhone: '',
  storeAddress: '',
  shippingCosts: { CABA: 0, GBA: 0, Interior: 0 },
  productionTime: '',
  businessHours: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      if (s) setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith('shippingCosts.')) {
      const zone = name.split('.')[1];
      setSettings((s) => ({ ...s, shippingCosts: { ...s.shippingCosts, [zone]: Number(value) } }));
    } else {
      setSettings((s) => ({ ...s, [name]: value }));
    }
  };
  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    alert('Guardado');
  };
  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <form onSubmit={handleSave} className="bg-card rounded-lg p-6 shadow flex flex-col gap-4">
        <label>
          WhatsApp Phone
          <input className="input input-bordered w-full" name="whatsappPhone" value={settings.whatsappPhone} onChange={handleChange} />
        </label>
        <label>
          Dirección de la tienda
          <input className="input input-bordered w-full" name="storeAddress" value={settings.storeAddress} onChange={handleChange} />
        </label>
        <label>
          Costo envío CABA
          <input className="input input-bordered w-full" name="shippingCosts.CABA" type="number" value={settings.shippingCosts.CABA} onChange={handleChange} />
        </label>
        <label>
          Costo envío GBA
          <input className="input input-bordered w-full" name="shippingCosts.GBA" type="number" value={settings.shippingCosts.GBA} onChange={handleChange} />
        </label>
        <label>
          Costo envío Interior
          <input className="input input-bordered w-full" name="shippingCosts.Interior" type="number" value={settings.shippingCosts.Interior} onChange={handleChange} />
        </label>
        <label>
          Tiempo de producción
          <input className="input input-bordered w-full" name="productionTime" value={settings.productionTime} onChange={handleChange} />
        </label>
        <label>
          Horario comercial
          <input className="input input-bordered w-full" name="businessHours" value={settings.businessHours} onChange={handleChange} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
