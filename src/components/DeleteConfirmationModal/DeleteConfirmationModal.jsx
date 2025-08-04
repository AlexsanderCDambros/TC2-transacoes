import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, transaction }) => {
  // Adicionando verificação para transaction null/undefined
  if (!transaction) {
    return null; // Ou retornar um fallback UI
  }

  const { type = 'Debit', value = 0 } = transaction; // Valores padrão

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir esta transação de {type === 'Debit' ? 'Débito' : 'Crédito'} no valor de {Math.abs(value).toFixed(2)}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;