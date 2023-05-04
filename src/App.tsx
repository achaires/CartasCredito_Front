import "devextreme/dist/css/dx.light.css";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import {
  AgentesAduanales,
  BancoAgregar,
  BancoComisiones,
  Bancos,
  Comisiones,
  Compradores,
  Divisiones,
  Empresas,
  LineasDeCredito,
  ListaDocumentos,
  Monedas,
  Proveedores,
  Proyectos,
  TiposDeActivo,
  TiposDeCobertura,
} from "./pages/catalogos";
import {
  Bitacora,
  CartaCreditoEnmiendasHistorial,
  CartaCreditoImprimir,
  CartasCreditoComisiones,
  CartasCreditoEnmiendas,
  CartasDeCredito,
  CartasDeCreditoDetalle,
  CartasDeCreditoPagos,
  PFE,
} from "./pages/operaciones";
import NuevaCartaComercial from "./pages/operaciones/crear/NuevaCartaComercial";
import { NuevaCartaStandBy } from "./pages/operaciones/crear/NuevaCartaStandBy";
import { Recover } from "./pages/Recover";
import { RolesIndex } from "./pages/usuarios/RolesIndex";
import { UsuariosIndex } from "./pages/usuarios/UsuariosIndex";
import { useAppDispatch, useAppSelector } from "./store";
import { ReportesDiseno, ReportesIndex, ReportesSabana } from "./pages/reportes";
import { RoleAgregar, RoleEditar, UsuarioAgregar, UsuarioEditar } from "./pages/usuarios";
import { Login } from "./pages/Login";
import { DashboardIndex } from "./pages/dashboard/DashboardIndex";
import { useLazyGetCurrentUserQuery } from "./apis";
import { authIsLoading, loggedIn, loggedOut, storeAccessToken } from "./store/authSlice";
import { AdminLoadingActivity } from "./components";
import { BitacoraIndex } from "./pages/bitacora/BitacoraIndex";

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/recuperar-contrasena",
    element: <Recover />,
  },
  {
    path: "/imprimir/cartas-de-credito/:cartaCreditoId",
    element: <CartaCreditoImprimir />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardIndex />,
      },
      {
        path: "/usuarios",
        element: <UsuariosIndex />,
      },
      {
        path: "/roles",
        element: <RolesIndex />,
      },
      {
        path: "/catalogos",
        children: [
          {
            path: "divisiones",
            element: <Divisiones />,
          },
          {
            path: "empresas",
            element: <Empresas />,
          },
          {
            path: "proveedores",
            element: <Proveedores />,
          },
          {
            path: "compradores",
            element: <Compradores />,
          },
          {
            path: "bancos",
            children: [
              {
                index: true,
                element: <Bancos />,
              },
              {
                path: "agregar",
                element: <BancoAgregar />,
              },
              {
                path: "editar/:bancoId",
                element: <BancoAgregar />,
              },
              {
                path: "comisiones/:bancoId",
                element: <BancoComisiones />,
              },
            ],
          },
          {
            path: "comisiones",
            element: <Comisiones />,
          },
          {
            path: "monedas",
            element: <Monedas />,
          },
          {
            path: "lineas-de-credito",
            element: <LineasDeCredito />,
          },
          {
            path: "proyectos",
            element: <Proyectos />,
          },
          {
            path: "agentes-aduanales",
            element: <AgentesAduanales />,
          },
          {
            path: "listado-de-documentos",
            element: <ListaDocumentos />,
          },
          {
            path: "tipos-de-activo",
            element: <TiposDeActivo />,
          },
          {
            path: "tipos-de-cobertura",
            element: <TiposDeCobertura />,
          },
        ],
      },
      {
        path: "/operaciones",
        children: [
          {
            path: "cartas-de-credito",
            children: [
              {
                index: true,
                element: <CartasDeCredito />,
              },
              {
                path: ":cartaCreditoId",
                children: [
                  {
                    index: true,
                    element: <CartasDeCreditoDetalle />,
                  },
                  {
                    path: "pagos",
                    element: <CartasDeCreditoPagos />,
                  },
                  {
                    path: "comisiones",
                    element: <CartasCreditoComisiones />,
                  },
                  {
                    path: "enmiendas/historial",
                    element: <CartaCreditoEnmiendasHistorial />,
                  },
                  {
                    path: "enmiendas",
                    element: <CartasCreditoEnmiendas />,
                  },
                ],
              },
              {
                path: "nueva-carta-comercial",
                element: <NuevaCartaComercial />,
              },
              {
                path: "nueva-carta-standby",
                element: <NuevaCartaStandBy />,
              },
            ],
          },
          {
            path: "pfe",
            element: <PFE />,
          },
        ],
      },
      {
        path: "reportes",
        children: [
          {
            index: true,
            element: <ReportesSabana />,
          },
          {
            path: "diseno",
            element: <ReportesDiseno />,
          },
        ],
      },
      {
        path: "usuarios",
        children: [
          {
            children: [
              {
                index: true,
                element: <UsuariosIndex />,
              },
              {
                path: "agregar",
                element: <UsuarioAgregar />,
              },
              {
                path: "editar/:userId",
                element: <UsuarioEditar />,
              },
            ],
          },
        ],
      },
      {
        path: "bitacora",
        children: [
          {
            children: [
              {
                index: true,
                element: <Bitacora />,
              },
            ],
          },
        ],
      },
      {
        path: "roles",
        children: [
          {
            children: [
              {
                index: true,
                element: <RolesIndex />,
              },
              {
                path: "agregar",
                element: <RoleAgregar />,
              },
              {
                path: "editar/:roleId",
                element: <RoleEditar />,
              },
            ],
          },
        ],
      },
      {
        path: "bitacora",
        children: [
          {
            children: [
              {
                index: true,
                element: <BitacoraIndex />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function InnerApp() {
  const ui = useAppSelector((s) => s.ui);

  useEffect(() => {
    if (ui.toasts.length > 0) {
      let firstEl = ui.toasts[0];
      if (firstEl.type === "success") {
        toast.success(firstEl.message, { duration: 6000, position: "top-right" });
      } else if (firstEl.type === "error") {
        toast.error(firstEl.message, { duration: 6000, position: "top-right" });
      }
    }
  }, [ui]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  const authState = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    const bootstrapAsync = async () => {
      // 1. Checar si existe token
      // 2. Si existe, confirmar que funciona
      // 3. Actualizar el state con el token e info de usuario
      try {
        let storedAccessToken = localStorage.getItem("accessToken");

        if (storedAccessToken) {
          dispatch(storeAccessToken(storedAccessToken as string));

          let currentUser = (await getCurrentUser()).data;

          if (currentUser && currentUser.Activo) {
            dispatch(loggedIn(currentUser));
          } else {
            localStorage.removeItem("accessToken");
            dispatch(loggedOut());
          }
        }
      } catch (err) {
        console.log(err);
        localStorage.removeItem("accessToken");
        dispatch(loggedOut());
      }

      dispatch(authIsLoading(false));
    };

    bootstrapAsync();
  }, []);

  /* console.log(`Bootstrap App`);
  console.log(`-- Auth State`);
  console.log(authState); */

  if (authState.isLoading) {
    return <AdminLoadingActivity />;
  }

  return (
    <>
      <InnerApp />
    </>
  );
}

export default App;
