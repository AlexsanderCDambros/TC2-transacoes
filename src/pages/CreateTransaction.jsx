import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import { createTransaction } from '../services/api';

const CreateTransaction = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createTransaction(formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div>
      <h1>Nova Transação</h1>
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateTransaction;