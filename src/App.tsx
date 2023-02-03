import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
