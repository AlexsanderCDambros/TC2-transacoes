import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListTransactions from "./pages/ListTransactions";
import CreateTransaction from "./pages/CreateTransaction";
import EditTransaction from "./pages/EditTransaction";
import { Box } from "@mui/material";
import { RecoilRoot } from "recoil";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function Root(props) {
  return (
    <Box p={4}>
      <RecoilRoot>
        <Router basename="/transacoes">
          <Routes>
            <Route path="/" element={<ListTransactions />} />
            <Route path="/novo" element={<CreateTransaction />} />
            <Route path="/:id" element={<EditTransaction />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </Box>
  );
}
