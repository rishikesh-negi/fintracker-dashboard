import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import AppLayout from "./components/ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import { Provider } from "react-redux";
import store from "./store/store";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { MobileSideNavToggleProvider } from "./contexts/MobileSideNavContext";

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Provider store={store}>
                <MobileSideNavToggleProvider>
                  <AppLayout />
                </MobileSideNavToggleProvider>
              </Provider>
            }>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="insights" element={<Insights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
