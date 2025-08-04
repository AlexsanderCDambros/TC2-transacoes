import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import { fetchTransactions, createTransaction } from '../services/api';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalTransaction, setOriginalTransaction] = useState(null);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const accountId = sessionStorage.getItem('accountId');
        const transactions = await fetchTransactions(accountId);
        const transaction = transactions.find(t => t.id === id);
        
        if (!transaction) throw new Error('Transação não encontrada');

        setOriginalTransaction(transaction);
        setInitialValues({
          type: transaction.type,
          value: Math.abs(transaction.value).toString(),
          to: transaction.to,
          anexo: null
        });
      } catch (err) {
        console.error('Erro ao carregar transação:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const accountId = sessionStorage.getItem('accountId');
      
      // 1. Cria transação oposta para cancelar a original
      await createTransaction({
        accountId,
        type: originalTransaction.type === 'Debit' ? 'Credit' : 'Debit',
        value: Math.abs(originalTransaction.value),
        to: 'Estorno - ' + originalTransaction.to,
        anexo: ''
      });

      // 2. Cria a nova transação com os valores editados
      await createTransaction({
        accountId,
        type: formData.type,
        value: parseFloat(formData.value),
        to: formData.to,
        anexo: formData.anexo || ''
      });

      navigate('/');
    } catch (error) {
      console.error('Erro ao editar transação:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!initialValues) return <div>Transação não encontrada</div>;

  return (
    <div>
      <h1>Editar Transação</h1>
      <TransactionForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
};

export default EditTransaction;