import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  TablePagination,
  Box
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useState } from 'react';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTransactions = transactions
    .filter(transaction =>
      transaction.to.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  // Função de download atualizada
  const handleDownload = (transaction) => {
    if (!transaction.anexo) return;

    // Pega a extensão do nome original ou tenta detectar
    const getExtension = () => {
      if (transaction.anexoFileName) {
        return transaction.anexoFileName.split('.').pop();
      }
      // Fallback: detecção por assinatura (como no código anterior)
      const signatures = {
        '/9j/': 'jpg',
        'iVBORw': 'png',
        'JVBERi': 'pdf'
      };
      for (const [signature, ext] of Object.entries(signatures)) {
        if (transaction.anexo.startsWith(signature)) return ext;
      }
      return 'bin';
    };

    const extension = getExtension();
    const filename = transaction.anexoFileName || `anexo_${transaction.id}.${extension}`;

    // Cria o Blob e força o download
    const byteCharacters = atob(transaction.anexo);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Tenta detectar o tipo MIME
    const mimeType = {
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'pdf': 'application/pdf'
    }[extension] || 'application/octet-stream';

    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;  // Usa o nome original aqui
    document.body.appendChild(link);
    link.click();

    // Limpeza
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Filtrar por descrição"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: '50%' }}
        />
        <Button
          variant="contained"
          onClick={() => window.location.href = '/transacoes/novo'}
        >
          Adicionar Transação
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.type === 'Debit' ? 'Débito' : 'Crédito'}</TableCell>
                <TableCell>
                  {transaction.type === 'Debit' ? '-' : ''}
                  {Math.abs(transaction.value).toFixed(2)}
                </TableCell>
                <TableCell>{transaction.to}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(transaction.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(transaction)}>
                    <DeleteIcon />
                  </IconButton>
                  {transaction.anexo && (
                    <IconButton
                      onClick={() => handleDownload(transaction)}
                      disabled={!transaction.anexo}
                      title="Baixar anexo"
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Transações por página:"
      />
    </Box>
  );
};

export default TransactionTable;