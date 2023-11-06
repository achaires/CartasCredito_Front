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
            <button
              disabled={isLoading}
              onClick={_handleLogin}
              className={`flex items-center justify-center w-full py-3 text-base rounded-full ${isLoading ? `bg-gray-400 text-white` : `bg-brandDark text-white`} `}>
              {isLoading && (
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-brandPrimary animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
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
