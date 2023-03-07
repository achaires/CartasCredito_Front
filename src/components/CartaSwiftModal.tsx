import { useAddSwiftNumCartaMutation } from "@/apis/cartasCreditoApi";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  cartaCreditoId: string;
  show: boolean;
  handleClose: () => void;
};

export const CartaSwiftModal = ({ cartaCreditoId, show, handleClose }: Props) => {
  const [addSwift, { isLoading, data, isSuccess, isError }] = useAddSwiftNumCartaMutation();
  const [files, setFiles] = useState<FileList | null>(null);
  const [numCarta, setNumCarta] = useState("");

  const dispatch = useAppDispatch();

  const _submitSwift = () => {
    if (numCarta !== "" && numCarta.length > 4 && files !== null) {
      addSwift({ NumCarta: numCarta, SwiftFile: files, CartaCreditoId: cartaCreditoId });
    } else {
      dispatch(
        addToast({
          title: "Información",
          type: "error",
          message: "Ingrese número de carta y archivo swift",
        })
      );
    }
  };

  useEffect(() => {
    if (isSuccess && data?.DataInt === 1) {
      dispatch(
        addToast({
          title: "Información",
          type: "success",
          message: "Archivo swift adjuntado correctamente",
        })
      );

      handleClose();
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

  return (
    <>
      <Modal dismissible show={show} onClose={handleClose}>
        <Modal.Header>Adjuntar Swift y Número de Carta</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
              <div className="mb-4">
                <Label value="Número de Carta" />
                <TextInput onChange={(e) => setNumCarta(e.target.value)} value={numCarta} />
              </div>
              <div>
                <Label value="Archivo" />
                <FileInput
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={_submitSwift}>Aceptar</Button>
          <Button color="gray" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
