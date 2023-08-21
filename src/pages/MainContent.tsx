import { FC } from "react";
import { useNavigate } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";

const MainContent: FC = () => {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate({to: ROUTES.login, replace: true})
    }
    return (
        <div>
            <h4>HELLO</h4>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default MainContent;