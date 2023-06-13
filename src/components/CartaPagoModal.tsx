import { useAddPagoMutation } from "@/apis";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

type Props = {
  cartaCreditoId: string;
  show: boolean;
  handleClose: () => void;
};

export const CartaPagoModal = ({ cartaCreditoId, show, handleClose }: Props) => {
  const [monto, setMonto] = useState(0);
  const [numFactura, setNumFactura] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useAppDispatch();

  const [addPago, { isLoading, isSuccess, isError, data }] = useAddPagoMutation();

  const _submit = () => {
    if (monto < 1) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: "Ingrese monto y fecha de vencimiento",
        })
      );

      return;
    }

    addPago({
      CartaCreditoId: cartaCreditoId,
      FechaVencimiento: fechaVencimiento.startDate ? fechaVencimiento.startDate : "",
      MontoPago: monto,
      NumeroFactura: numFactura,
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

        setFechaVencimiento({ startDate: null, endDate: null });
        setMonto(0);
        setNumFactura("");

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
    setFechaVencimiento(newValue);
  };

  return (
    <>
      <Modal dismissible show={show} onClose={handleClose} size="md">
        <Modal.Header>Agregar Nuevo Pago</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
              <div className="mb-4">
                <Label value="Fecha de Vencimiento" />
                <Datepicker displayFormat="DD/MM/YYYY" value={fechaVencimiento} onChange={_handleDateChange} showFooter={false} asSingle />
              </div>
              <div className="mb-4">
                <Label value="Monto" />
                <TextInput type="number" onChange={(e) => setMonto(Number(e.target.value))} value={monto} />
              </div>
              <div className="mb-4">
                <Label value="Número de Factura" />
                <TextInput type="text" onChange={(e) => setNumFactura(e.target.value)} value={numFactura} />
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
