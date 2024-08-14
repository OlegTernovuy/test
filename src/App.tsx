import { Navigate, Route, Routes } from 'react-router';

import {
    ForgotPassword,
    ProjectsPage,
    LoginPage,
    ResetPassword,
    RegisterPage,
    AudioRecorderPage,
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
                <Route
                    path="/microphone"
                    element={
                        <ProtectedRoute>
                            <AudioRecorderPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <ProjectsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AppWrapper>
    );
}

export default App;
