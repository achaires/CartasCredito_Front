import { useAppSelector } from "@/store";
import { Link, Outlet } from "react-router-dom";

export const AdminRoute = () => {
  const { isLoggedIn } = useAppSelector((s) => s.auth);

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Acceso no autorizado</h1>
        <ul>
          <li>
            <Link to="/login">Iniciar Sesión</Link>
          </li>
        </ul>
      </div>
    );
  }

  return <Outlet />;
};
