import { FC } from "react";
import { useNavigate, Link } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";
import { Route } from "react-router";

const MainContent: FC = () => {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate({to: ROUTES.login, replace: true})
    }
    return (
        <div>
            <Link to={ROUTES.mediaManager}>MEDIA MANAGER</Link>
            <button onClick={handleLogout}>LOG OUT</button>
        </div>
    )
}

export default MainContent;