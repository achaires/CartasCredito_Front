import { useEffect, useState } from "react";
import loginBgImg from "../assets/img/cartas-login-bg-opt.png";
import brandImg from "../assets/img/gis-logo-gris.png";
import { useUpdateGISPasswordMutation } from "@/apis";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const Recover = () => {
  const nav = useNavigate();

  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");

  const [updatePassword, { data: updRsp, isSuccess, isError, isLoading, error: loginError }] = useUpdateGISPasswordMutation();

  const _handleUpdatePassword = () => {
    updatePassword({ UserName: userName, Password: userPass });
  };

  useEffect(() => {
    if (isSuccess) {
      if (updRsp && updRsp.Flag) {
        toast.success("Contraseña actualizada correctamente.", { position: "top-right" });
        nav("/login");
      } else {
        toast.error("Verifique su nombre de usuario o contraseña.", { position: "top-right" });
      }
    }

    if (isError) {
      toast.error("Verifique su nombre de usuario o contraseña", { position: "top-right" });
    }
  }, [isLoading, isError, isSuccess, updRsp, loginError]);

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
          <div className="font-bold text-2xl mb-4">Actualizar Contraseña</div>

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
            <button onClick={_handleUpdatePassword} className="block w-full py-3 text-base rounded-full bg-brandDark text-white">
              CONTINUAR
            </button>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
