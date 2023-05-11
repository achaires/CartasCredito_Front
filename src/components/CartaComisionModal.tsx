import { useAddCartaCreditoComisionMutation, useGetComisionesQuery, useGetMonedasQuery } from "@/apis";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

type Props = {
  cartaCreditoId: string;
  cartaBancoId: number;
  show: boolean;
  handleClose: () => void;
};

export const CartaComisionModal = ({ cartaCreditoId, show, cartaBancoId, handleClose }: Props) => {
  const [monto, setMonto] = useState(0);
  const [monedaId, setMonedaId] = useState(0);
  const [comisionId, setComisionId] = useState(0);
  const [numReferencia, setNumReferencia] = useState(0);

  const [fechaCargo, setFechaCargo] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useAppDispatch();

  const [addCartaComision, { isLoading, isSuccess, isError, data }] = useAddCartaCreditoComisionMutation();

  const { data: comisiones } = useGetComisionesQuery();
  const { data: monedas } = useGetMonedasQuery();

  const _submit = () => {
    if (monto < 1 || comisionId < 1 || monedaId < 1 || fechaCargo.startDate === null) {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: "Ingrese monto y fecha de vencimiento",
        })
      );

      return;
    }

    addCartaComision({
      CartaCreditoId: cartaCreditoId,
      FechaCargo: fechaCargo.startDate ? fechaCargo.startDate : "",
      Monto: monto,
      MonedaId: monedaId,
      ComisionId: comisionId,
      NumReferencia: numReferencia,
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      if (data.DataInt && data.DataInt > 0) {
        dispatch(
          addToast({
            title: "Información",
            type: "success",
            message: "Comisión agregada correctamente",
          })
        );

        setFechaCargo({ startDate: null, endDate: null });
        setMonto(0);
        setMonedaId(0);
        setComisionId(0);

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
    setFechaCargo(newValue);
  };

  const _handleMontoChange = (newValue: string) => {
    let newAmount = Number(newValue);
    setMonto(Number(newAmount.toFixed(2)));
  };

  return (
    <>
      <Modal dismissible show={show} onClose={handleClose} size="xl">
        <Modal.Header>Agregar Comision</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
              <div className="md:flex md:items-center md:gap-2">
                <div className="mb-4 w-1/34">
                  <Label value="Fecha de Cargo" />
                  <Datepicker displayFormat="YYYY-MM-DD" value={fechaCargo} onChange={_handleDateChange} showFooter={false} asSingle />
                </div>
                <div className="mb-4 w-2/3">
                  <Label value="Comision" />
                  <Select onChange={(e) => setComisionId(Number(e.target.value))} value={comisionId}>
                    <option value={0}>Seleccione Opción</option>
                    {comisiones &&
                      comisiones
                        .filter((com) => com.BancoId === cartaBancoId)
                        .map((item, index) => (
                          <option value={item.Id} key={index.toString()}>
                            {item.Nombre}
                          </option>
                        ))}
                  </Select>
                </div>
              </div>
              <div className="md:flex md:items-center md:gap-2">
                <div className="mb-4 flex-1">
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
                <div className="mb-4 flex-1">
                  <Label value="Monto" />
                  <TextInput type="number" onChange={(e) => _handleMontoChange(e.target.value)} value={monto} />
                </div>
                <div className="mb-4 flex-1">
                  <Label value="No. Referencia" />
                  <TextInput type="number" onChange={(e) => setNumReferencia(Number(e.target.value))} value={numReferencia} />
                </div>
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
