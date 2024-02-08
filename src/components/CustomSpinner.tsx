import { Spinner } from "flowbite-react";

export const CustomSpinner = () => {
  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="text-center">
        <Spinner size="xl" aria-label="Center-aligned spinner example" /> Cargando informaci&oacute;n
      </div>
    </div>
  );
};
