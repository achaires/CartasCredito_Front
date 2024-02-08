import { useAddPagoMutation, useUpdatePagoMutation } from "@/apis";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import numeral from "numeral";

type Props = {
  pagoId: number;
  show: boolean;
  handleClose: () => void;
  setMonto: (nuevoMonto: number) => void;
  monto: number;
  moneda: string;
};

export const CartaPagoManualModal = ({ pagoId, show, monto, moneda, handleClose, setMonto }: Props) => {
  const [fechaPago, setFechaPago] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useAppDispatch();

  const [updatePago, { isLoading, isSuccess, isError, data }] = useUpdatePagoMutation();

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

    updatePago({
      Id: pagoId,
      Estatus: 3,
      FechaPago: fechaPago.startDate ? fechaPago.startDate : "",
      Monto: monto,
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

  const _handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(Number(e.target.value));
  };

  return (
    <>
      <Modal dismissible show={show} onClose={handleClose} size="md">
        <Modal.Header>Registro de Pago Manual</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
              <div className="mb-4">
                <strong>Moneda:</strong> {moneda}
              </div>
              <div className="mb-4">
                              <Label value="Fecha de Pago" />
                              <Datepicker displayFormat="DD/MM/YYYY" popoverDirection="down" containerClassName="customDatepicker" value={fechaPago} onChange={_handleDateChange} showFooter={false} asSingle />
              </div>
              <div className="mb-4">
                <Label value="Monto" />
                <TextInput type="text" value={monto} onChange={_handleMontoChange} />
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
