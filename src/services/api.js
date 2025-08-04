const API_BASE_URL = process.env.API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchAccount = async () => {
  const response = await fetch(`${API_BASE_URL}/account`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error("Failed to fetch account");
  const data = await response.json();
  return data.result.account[0].id;
};

export const fetchTransactions = async (accountId) => {
  const response = await fetch(
    `${API_BASE_URL}/account/${accountId}/statement`,
    {
      headers: getAuthHeader(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch transactions");
  const data = await response.json();
  return data.result.transactions;
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${API_BASE_URL}/account/transaction`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) throw new Error("Failed to create transaction");
  return response.json();
};
