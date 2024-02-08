import { useAddPagoComisionMutation, useAddPagoMutation, useGetMonedasQuery, useUpdatePagoMutation } from "@/apis";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import numeral from "numeral";
import { ICartaCreditoComision } from "@/interfaces";
import { useConvertirMutation } from "@/apis/conversionMonedaApi";
import { useGetTipoCambiosQuery } from "@/apis/tipoCambioApi";

type Props = {
  cartaComision: ICartaCreditoComision;
  cartaMonedaId: number;
  show: boolean;
  handleClose: () => void;
    monto: number;
    comisionMonedaId: number;
};

export const CartaComisionPagoModal = ({ show, cartaComision, cartaMonedaId, monto, handleClose, comisionMonedaId }: Props) => {
    const [monedaId, setMonedaId] = useState(comisionMonedaId);
  const [tipoCambio, setTipoCambio] = useState(0);
  const [fechaPago, setFechaPago] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useAppDispatch();

  const [addPagoComision, { isLoading, isSuccess, isError, data }] = useAddPagoComisionMutation();
  const [convertirMoneda, { data: conversionRes, isLoading: conversionIsLoading }] = useConvertirMutation();
    const { data: monedas } = useGetMonedasQuery();
    const { data: tiposDeCambio, isLoading: cargandoTipoCambio } = useGetTipoCambiosQuery();



    /*useEffect(() => {
        //setMonedaId(comisionMonedaId);
        console.log(monedaId, monedas);
        if (monedaId > 0 && monedas && fechaPago.startDate !== null) {
            let selMoneda = monedas.find((i) => i.Id === monedaId);

            if (selMoneda) {

            }


        } else {

            //
        }
    }, [monedaId, monedas, fechaPago]);*/

    useEffect(() => {
        if (tiposDeCambio) {
            let abbr = "";
            if (monedas != undefined) {
                for (var i = 0; i < monedas.length; i++) {
                    if (monedas[i].Id == monedaId) {
                        abbr = monedas[i].Abbr;
                    }
                }
            }

            let newAmount = Number(0);
            if (abbr != "" && tiposDeCambio != undefined) {
                for (var i = 0; i < tiposDeCambio.length; i++) {
                    if (tiposDeCambio[i].MonedaOriginal == abbr) {
                        newAmount = tiposDeCambio[i].Conversion;
                    }
                }
            }

            setTipoCambio(Number(newAmount.toFixed(2)));
        }
    }, [tiposDeCambio]);


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

      // @ts-ignore
    const _handleCambioMoneda = (monedaNueva) => {
        console.log(monedaNueva);
        setMonedaId(Number(monedaNueva));

        let abbr = "";
        console.log("abr: ",abbr);
        if (monedas != undefined) {
            for (var i = 0; i < monedas.length; i++) {
                if (monedas[i].Id == monedaNueva) {
                    abbr = monedas[i].Abbr;
                }
            }
        }

        console.log("abr res: ", abbr);
        let newAmount = Number(0);
        if (abbr != "" && tiposDeCambio != undefined) {
            for (var i = 0; i < tiposDeCambio.length; i++) {
                if (tiposDeCambio[i].MonedaOriginal == abbr) {
                    newAmount = tiposDeCambio[i].Conversion;
                }
            }
        }

        console.log("amount: ", newAmount);
        setTipoCambio(Number(newAmount.toFixed(2)));
    };

  const _handleTipoCambioChange = (newValue: string) => {
    let newAmount = Number(newValue);
    setTipoCambio(Number(newAmount.toFixed(2)));
    };

    /*onChange={(e) => setMonedaId(Number(e.target.value))}*/
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
                                  <Select value={monedaId} onChange={(e) => _handleCambioMoneda(e.target.value)}>
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
                                  <TextInput type="number" value={tipoCambio} onChange={(e) => _handleTipoCambioChange(e.target.value)} disabled />
                </div>
              </div>
              <div className="mb-4">
                <Label value="Cantidad a Pagar" />
                <TextInput type="text" value={numeral(monto).format("$0,0.00")} disabled />
              </div>
              <div className="mb-4">
                <Label value="Fecha de Pago" />
                <Datepicker displayFormat="DD/MM/YYYY" value={fechaPago} onChange={_handleDateChange} showFooter={false} asSingle />
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
