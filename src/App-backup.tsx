import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeProvider from "./theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import PublicPage from "./pages/PublicPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
