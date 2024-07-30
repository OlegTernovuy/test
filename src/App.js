import { Route, Routes } from "react-router";

import { LoginPage, RegisterPage } from "./pages";
import { AppWrapper } from "./styled/AppWrapper.styled";
import { GlobalStyle } from "./styled/GlobalStyle.styled";

function App() {
    return (
        <AppWrapper>
            <GlobalStyle />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </AppWrapper>
    )
}

export default App;
