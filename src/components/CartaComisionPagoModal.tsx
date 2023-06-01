import { useAddPagoComisionMutation, useAddPagoMutation, useGetMonedasQuery, useUpdatePagoMutation } from "@/apis";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import numeral from "numeral";
import { ICartaCreditoComision } from "@/interfaces";
import { useConvertirMutation } from "@/apis/conversionMonedaApi";

type Props = {
  cartaComision: ICartaCreditoComision;
  cartaMonedaId: number;
  show: boolean;
  handleClose: () => void;
  monto: number;
};

export const CartaComisionPagoModal = ({ show, cartaComision, cartaMonedaId, monto, handleClose }: Props) => {
  const [monedaId, setMonedaId] = useState(0);
  const [tipoCambio, setTipoCambio] = useState(0);
  const [fechaPago, setFechaPago] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useAppDispatch();

  const [addPagoComision, { isLoading, isSuccess, isError, data }] = useAddPagoComisionMutation();
  const [convertirMoneda, { data: conversionRes, isLoading: conversionIsLoading }] = useConvertirMutation();
  const { data: monedas } = useGetMonedasQuery();

  useEffect(() => {
    if (monedaId > 0 && monedas && fechaPago.startDate !== null) {
      let selMoneda = monedas.find((i) => i.Id === monedaId);

      if (selMoneda) {
        // consultar conversión
        // let date = new Date(2022, 3, 1);
        let date = new Date();
        convertirMoneda({
          Fecha: fechaPago.startDate,
          MonedaInput: cartaMonedaId,
          MonedaOutput: selMoneda.Id,
        });
      }
    }
  }, [monedaId, monedas, fechaPago]);

  useEffect(() => {
    if (conversionRes) {
      if (conversionRes.Flag && conversionRes.DataDecimal) {
        setTipoCambio(conversionRes.DataDecimal);
      } else {
        setTipoCambio(0);
      }
    }
  }, [conversionRes]);

  const _submit = () => {
    if (!fechaPago.startDate) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: "Ingrese fecha de pago",
        })
      );

      return;
    }

    addPagoComision({
      CartaCreditoId: cartaComision.CartaCreditoId,
      FechaPago: fechaPago.startDate ? fechaPago.startDate : "",
      MontoPago: monto,
      ComisionId: cartaComision.Id,
      MonedaId: monedaId,
      TipoCambio: tipoCambio,
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      if (data.DataInt && data.DataInt > 0) {
        dispatch(
          addToast({
            title: "Información",
            type: "success",
            message: "Pago agregado correctamente",
          })
        );

        setFechaPago({ startDate: null, endDate: null });

        handleClose();
      } else {
        dispatch(
          addToast({
            title: "Información",
            type: "error",
            message: data.Errors && data.Errors[0] ? data.Errors[0] : "Ocurrió un error desconocido",
          })
        );
      }
    }

    if (isError && data && data.Errors) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: data.Errors[0],
        })
      );
    }
  }, [isSuccess, data, isError]);

  // @ts-ignore
  const _handleDateChange = (newValue) => {
    setFechaPago(newValue);
  };

  const _handleTipoCambioChange = (newValue: string) => {
    let newAmount = Number(newValue);
    setTipoCambio(Number(newAmount.toFixed(2)));
  };

  return (
    <>
      <Modal dismissible show={show} onClose={handleClose} size="md">
        <Modal.Header>Registro de Pago Manual</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
              <div className="flex items-center justify-center gap-2">
                <div className="mb-4">
                  <Label value="Moneda" />
                  <Select onChange={(e) => setMonedaId(Number(e.target.value))} value={monedaId}>
                    <option value={0}>Seleccione Opción</option>
                    {monedas &&
                      monedas.map((item, index) => (
                        <option value={item.Id} key={index.toString()}>
                          {item.Nombre}
                        </option>
                      ))}
                  </Select>
                </div>
                <div className="mb-4">
                  <Label value="Tipo de Cambio" />
                  <TextInput type="number" value={tipoCambio} onChange={(e) => _handleTipoCambioChange(e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <Label value="Cantidad a Pagar" />
                <TextInput type="text" value={numeral(monto).format("$0,0.00")} disabled />
              </div>
              <div className="mb-4">
                <Label value="Fecha de Pago" />
                <Datepicker displayFormat="dd/MM/yyyy" value={fechaPago} onChange={_handleDateChange} showFooter={false} asSingle />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={_submit}>Aceptar</Button>
          <Button color="gray" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
