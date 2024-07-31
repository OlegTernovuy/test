import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase';

const HomePage = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut(auth);
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
