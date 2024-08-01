import { Navigate, Route, Routes } from 'react-router';

import { ProtectedRoute, SnackbarNotification } from './components';
import { HomePage, LoginPage, RegisterPage } from './pages';
import { GlobalStyle } from './styled/GlobalStyle.styled';
import { AppWrapper } from './styled/AppWrapper.styled';

import { auth } from './firebase';

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
            {!auth && (
                <SnackbarNotification
                    message={'Missing variables in the env file'}
                />
            )}
        </AppWrapper>
    );
}

export default App;
