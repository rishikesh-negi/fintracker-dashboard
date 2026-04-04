import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import AppLayout from "./components/ui/AppLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
