import { Navigate, Route, Routes } from 'react-router';

import { LoginPage, RegisterPage } from './pages';
import { AppWrapper } from './styled/AppWrapper.styled';
import { GlobalStyle } from './styled/GlobalStyle.styled';

function App() {
    return (
        <AppWrapper>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </AppWrapper>
    );
}

export default App;
