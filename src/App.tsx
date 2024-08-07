import { Navigate, Route, Routes } from 'react-router';

import {
    ForgotPassword,
    HomePage,
    LoginPage,
    ResetPassword,
    RegisterPage,
} from './pages';
import { GlobalStyle } from './styled/GlobalStyle.styled';
import { AppWrapper } from './styled/AppWrapper.styled';
import { ProtectedRoute } from './components';

function App() {
    return (
        <AppWrapper>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AppWrapper>
    );
}

export default App;
