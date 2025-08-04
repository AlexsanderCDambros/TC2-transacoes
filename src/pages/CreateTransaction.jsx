import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import { createTransaction, fetchAccount } from '../services/api';

const CreateTransaction = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = await fetchAccount();
        sessionStorage.setItem('accountId', id);
      } catch (err) {
        console.error('Error getting account Id:', err);
      } 
    };

    if(!sessionStorage.getItem('accountId')){
      loadData();
    }
  }, []);

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