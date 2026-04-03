import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import AppLayout from "./components/ui/AppLayout";

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
