import { Navigate, Route, Routes } from 'react-router';

import { HomePage, LoginPage, RegisterPage } from './pages';
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
