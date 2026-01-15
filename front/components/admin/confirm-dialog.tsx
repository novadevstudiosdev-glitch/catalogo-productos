'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  danger?: boolean;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({ open, onOpenChange, title, description, danger = false, onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar' }: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {danger && <AlertTriangle className="h-5 w-5 text-destructive" />}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} disabled={loading} variant={danger ? 'destructive' : 'default'}>
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
