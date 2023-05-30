import { IPFETipoCambio } from "@/interfaces";
import { Modal, Label, TextInput, Button } from "flowbite-react";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface Props {
  monedaId: number;
  moneda: string;
  show: boolean;
  handleClose: () => void;
  handleSubmit: (tipoCambio: IPFETipoCambio) => void;
}

export const PFETIpoCambioModal = ({ show, handleClose, handleSubmit, monedaId, moneda }: Props) => {
  const [pa, setPa] = useState(0);
  const [pa1, setPa1] = useState(0);
  const [pa2, setPa2] = useState(0);

  const _submit = () => {
    let newTipoCambio = {
      MonedaId: monedaId,
      PA: pa,
      PA1: pa1,
      PA2: pa2,
    };

    handleSubmit(newTipoCambio);
  };

  return (
    <Modal dismissible show={show} onClose={handleClose} size="lg">
      <Modal.Header>Tipo de Cambio</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <form className="md:grid md:gap-4 md:grid-cols-12">
            <div className="mb-4 md:col-span-4">
              <Label value="PA" />
              <TextInput type="number" onChange={(e) => setPa(Number(e.target.value))} value={pa} />
            </div>
            <div className="mb-4 md:col-span-4">
              <Label value="PA+1" />
              <TextInput type="number" onChange={(e) => setPa1(Number(e.target.value))} value={pa1} />
            </div>
            <div className="mb-4 md:col-span-4">
              <Label value="PA+2" />
              <TextInput type="number" onChange={(e) => setPa2(Number(e.target.value))} value={pa2} />
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
  );
};
