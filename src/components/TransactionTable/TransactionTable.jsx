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

  const getFileExtensionFromBase64 = (base64String) => {
    // Assinaturas mágicas de tipos de arquivo em Base64
    const signatures = {
      'JVBERi0': 'pdf',       // PDF
      'iVBORw0KGgo': 'png',   // PNG
      '/9j/4AAQ': 'jpg',      // JPEG
      'R0lGODdh': 'gif',      // GIF
      'R0lGODlh': 'gif',      // GIF
      'UklGR': 'webp',        // WEBP
      'UEsDBBQ': 'docx',      // DOCX
      'PK': 'zip'             // ZIP ou outros baseados em PK
    };

    // Verifica cada assinatura
    for (const [signature, ext] of Object.entries(signatures)) {
      if (base64String.startsWith(signature)) {
        return ext;
      }
    }

    if (base64String.substring(0, 10).includes('/9j/')) {
      return 'jpg';
    }

    // Fallback para binário se não reconhecer
    return 'bin';
  };

  // Função de download atualizada
  const handleDownload = (transaction) => {
    if (!transaction.anexo) return;

    // Tenta detectar a extensão
    const extension = getFileExtensionFromBase64(transaction.anexo);
    const filename = `anexo_${transaction.id}.${extension}`;

    // Tenta determinar o tipo MIME
    const mimeTypes = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      zip: 'application/zip'
    };

    const mimeType = mimeTypes[extension] || 'application/octet-stream';

    // Cria o link de download
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${transaction.anexo}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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