import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AdminLoadingActivity } from "./components";
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
import { DashboardIndex } from "./pages/dashboard/DashboardIndex";
import { Login } from "./pages/Login";
import { CartasDeCredito, PFE } from "./pages/operaciones";
import NuevaCartaComercial from "./pages/operaciones/crear/NuevaCartaComercial";
import { NuevaCartaStandBy } from "./pages/operaciones/crear/NuevaCartaStandBy";
import { Recover } from "./pages/Recover";
import { RolesIndex } from "./pages/usuarios/RolesIndex";
import { UsuariosIndex } from "./pages/usuarios/UsuariosIndex";
import { useAppSelector } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    //element: <Login />,
    element: <DashboardIndex />,
  },
  {
    path: "/recuperar-contrasena",
    element: <Recover />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        index: true,
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
  return (
    <>
      <InnerApp />
    </>
  );
}

export default App;
