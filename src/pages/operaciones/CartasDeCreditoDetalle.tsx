import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const CartasDeCreditoDetalle = () => {
  const routeParams = useParams();

  useEffect(() => {}, [routeParams]);

  return <div>CartasDeCreditoDetalle {routeParams.cartaCreditoId}</div>;
};
