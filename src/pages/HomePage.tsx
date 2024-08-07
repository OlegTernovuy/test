import { useNavigate } from 'react-router';

import { handleLogoutUser } from '../services/Auth.service';

const HomePage = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await handleLogoutUser();
        navigate('/login');
    };
    return (
        <div>
            <h4>Loki</h4>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;
