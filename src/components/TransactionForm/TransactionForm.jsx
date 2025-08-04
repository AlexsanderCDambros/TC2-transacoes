import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Autocomplete,
  Box,
  Typography
} from '@mui/material';
import { suggestionsState } from '../../atoms/suggestionsAtom';

const TransactionForm = ({ initialValues, onSubmit, isEdit }) => {
  const suggestions = useRecoilValue(suggestionsState);
  const [formData, setFormData] = useState(initialValues || {
    type: 'Debit',
    value: '',
    to: '',
    anexo: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, anexo: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.value || Number(formData.value) <= 0) newErrors.value = 'Valor deve ser maior que 0';
    if (!formData.to || formData.to.length < 3) newErrors.to = 'Descrição deve ter pelo menos 3 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        accountId: sessionStorage.getItem('accountId'),
        type: formData.type,
        value: Number(formData.value),
        to: formData.to,
        anexo: formData.anexo || ''
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Editar Transação' : 'Nova Transação'}
      </Typography>
      
      <FormControl fullWidth margin="normal" error={!!errors.type}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select
          labelId="type-label"
          name="type"
          value={formData.type}
          onChange={handleChange}
          label="Tipo"
        >
          <MenuItem value="Debit">Débito</MenuItem>
          <MenuItem value="Credit">Crédito</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Valor"
        name="value"
        type="number"
        value={formData.value}
        onChange={handleChange}
        error={!!errors.value}
        helperText={errors.value}
        inputProps={{ step: "0.01" }}
      />

      <Autocomplete
        freeSolo
        options={suggestions}
        value={formData.to}
        onChange={(_, newValue) => setFormData(prev => ({ ...prev, to: newValue }))}
        onInputChange={(_, newInputValue) => setFormData(prev => ({ ...prev, to: newInputValue }))}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="normal"
            label="Descrição"
            error={!!errors.to}
            helperText={errors.to}
          />
        )}
      />

      <TextField
        fullWidth
        margin="normal"
        type="file"
        onChange={handleFileChange}
        InputLabelProps={{ shrink: true }}
      />

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Salvar
      </Button>
    </Box>
  );
};

export default TransactionForm;