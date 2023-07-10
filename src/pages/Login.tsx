import { useContext, useEffect, useState } from "react";
import loginBgImg from "../assets/img/cartas-login-bg-opt.png";
import brandImg from "../assets/img/gis-logo-gris.png";
import { useLazyGetCurrentUserQuery, useLazyLoginUserQuery } from "@/apis";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { loggedIn, storeAccessToken } from "@/store/authSlice";

export const Login = () => {
  const nav = useNavigate();

  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");

  const [loginUser, { data: loginRsp, isSuccess, isError, isLoading, error: loginError }] = useLazyLoginUserQuery();
  const [getCurrentUser, { data: getUserRsp, isSuccess: getUserSuccess, isLoading: getUserLoading, isError: getUserError }] = useLazyGetCurrentUserQuery();

  const dispatch = useAppDispatch();

  const _handleLogin = () => {
    loginUser({ UserName: userName, Password: userPass });
  };

  useEffect(() => {
    if (isSuccess && loginRsp) {
      dispatch(storeAccessToken(loginRsp));
      getCurrentUser();
    }

    if (isError) {
      // @ts-ignore
      if (loginError && loginError.data && loginError.data === "LOGIN_GIS") {
        toast.error("Verifique su cuenta GIS", { position: "top-right" });
      }

      // @ts-ignore
      if (loginError && loginError.data && loginError.data === "LOGIN_APP") {
        toast.error("Verifique usuario y contraseña", { position: "top-right" });
      }
    }
  }, [isLoading, isError, isSuccess, loginRsp, loginError]);

  useEffect(() => {
    if (getUserSuccess && getUserRsp && getUserRsp.Activo) {
      dispatch(loggedIn(getUserRsp));

      if (loginRsp) {
        localStorage.setItem("accessToken", loginRsp);
      }

      toast.success(`Bienvenido ${getUserRsp.Profile?.DisplayName}`, { position: "top-right" });
      nav("/dashboard");
    }
  }, [getUserRsp, getUserSuccess, getUserError, getUserLoading]);

  return (
    <div className="flex flex-1 flex-col h-screen" style={{ backgroundImage: "url(" + loginBgImg + ")", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
      <div className="bg-white px-12 h-24 flex items-start justify-center flex-col">
        <img src={brandImg} alt="" className="h-full" />
      </div>
      <div className="lg:flex lg:items-center lg:justify-between lg:flex-1 px-12">
        <div className="text-center flex-1 mb-4">
          <div className="text-white font-medium text-7xl">Cartas de Crédito</div>
        </div>

        <div className="bg-white rounded-lg p-8 flex flex-col items-stretch w-full md:w-2/3 lg:w-1/3 m-auto lg:mr-0">
          <div className="font-bold text-2xl mb-4">Iniciar Sesión</div>

          <div className="mb-4 text-sm">
            <p className="mb-1">Correo Electrónico</p>
            <input
              type="text"
              className="border rounded border-gray-300 text-sm py-2 px-2 w-full block"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="mb-8 text-sm">
            <p className="mb-1">Contraseña</p>
            <input
              type="password"
              className="border rounded border-gray-300 text-sm py-2 px-2 w-full block"
              onChange={(e) => {
                setUserPass(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={_handleLogin} className="block w-full py-3 text-base rounded-full bg-brandDark text-white">
              INICIAR SESIÓN
            </button>

            <div className="mt-4 text-center">
              <Link to="/actualizar-contrasena" className="text-sm">
                Actualizar Contraseña
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
