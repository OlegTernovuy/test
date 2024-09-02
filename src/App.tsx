import { Navigate, Route, Routes } from 'react-router';

import {
    ForgotPassword,
    ProjectsPage,
    LoginPage,
    ResetPassword,
    RegisterPage,
} from './pages';
import { AppWrapper } from './styled/AppWrapper.styled';
import { ProtectedRoute } from './components';

function App() {
    return (
        <AppWrapper>
            <Routes>
                <Route path="/" element={<Navigate to="/projects" />} />
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
