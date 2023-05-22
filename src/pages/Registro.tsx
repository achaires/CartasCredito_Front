import { useContext, useEffect, useState } from "react";
import loginBgImg from "../assets/img/cartas-login-bg-opt.png";
import brandImg from "../assets/img/gis-logo-gris.png";
import { useLazyGetCurrentUserQuery, useLazyLoginUserQuery, useLazyValidateTokenQuery, useRegisterUserGISMutation, useRegisterUserMutation } from "@/apis";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store";

export const Registro = () => {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");

  const nav = useNavigate();
  const routeParams = useParams();

  const dispatch = useAppDispatch();

  const [registerUser, { data, isSuccess, isError }] = useRegisterUserGISMutation();
  const [validaToken, { data: tknRsp, isSuccess: tknIsSuccess, isError: tknIsError }] = useLazyValidateTokenQuery();

  const _handleSubmit = () => {
    registerUser({ UserName: userName, Password: userPass, Token: routeParams && routeParams.token ? routeParams.token : "" });
  };

  useEffect(() => {
    if (routeParams.token) {
      validaToken(routeParams.token);
    }
  }, [routeParams]);

  useEffect(() => {
    if (tknIsError) {
      toast.error("Invitación no es válida", { position: "top-right" });
      nav("/login");
    }
  }, [tknRsp, tknIsSuccess, tknIsError]);

  useEffect(() => {
    if (isSuccess && data && data.Flag === true) {
      toast.success("Registro exitoso. Ingrese con su nombre de usuario y contraseña.", { position: "top-right" });
      nav("/login");
    }

    if (isSuccess && data && data.Flag === false) {
      var errMsg = data.Errors && data.Errors[0] ? data.Errors[0] : "Verifique su cuenta";
      toast.error(errMsg, { position: "top-right" });
    }
  }, [data, isSuccess, isError]);

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
          <div className="font-bold text-2xl mb-4">Registro de Usuario</div>

          <div className="mb-4 text-sm">
            <p className="mb-1">Email GIS</p>
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
            <button onClick={_handleSubmit} className="block w-full py-3 text-base rounded-full bg-brandDark text-white">
              Finalizar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
