import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable/TransactionTable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { fetchAccount, fetchTransactions, createTransaction } from '../services/api';

const ListTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState({
    type: 'Debit',
    value: 0,
    to: ''
  });
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = await fetchAccount();
        setAccountId(id);
        sessionStorage.setItem('accountId', id);

        const transactionsData = await fetchTransactions(id);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/${id}`);
  };

  const handleDeleteClick = (transaction) => {
  if (transaction) {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  }
};

  const handleDeleteConfirm = async () => {
    try {
      const correctionValue = Math.abs(selectedTransaction.value);
      const correctionType = selectedTransaction.type === 'Debit' ? 'Credit' : 'Debit';

      await createTransaction({
        accountId,
        type: correctionType,
        value: correctionValue,
        to: 'Correção de saldo',
        anexo: ''
      });

      const transactionsData = await fetchTransactions(accountId);
      setTransactions(transactionsData);

      setOpenModal(false);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Transações</h1>
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <DeleteConfirmationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDeleteConfirm}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default ListTransactions;