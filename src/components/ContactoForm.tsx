import { useAddContactoMutation, useUpdateContactoMutation } from "@/apis/contactosApi";
import { IContactoInsert } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { Card, Label, TextInput, Textarea, Button } from "flowbite-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  EditId?: number | null;
  ModelNombre: string;
  ModelId?: number | null;
  onCancel: () => void;
};

export const ContactoForm = ({ EditId, ModelNombre, ModelId, onCancel }: Props) => {
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IContactoInsert>();

  const dispatch = useAppDispatch();

  const [addContacto, { error: addContactoError, data: rspContacto, isSuccess: addContactoSuccess }] = useAddContactoMutation();
  const [updateContacto, { error: updContactoError, data: rspUpdContacto, isSuccess: updContactoSuccess }] = useUpdateContactoMutation();

  useEffect(() => {
    if (addContactoSuccess) {
      dispatch(addToast({ message: "Registro agregado correctamente", title: "Registro agregado", type: "success" }));
      onCancel();
    }
  }, [addContactoSuccess]);

  useEffect(() => {
    if (updContactoSuccess) {
      dispatch(addToast({ message: "Registro actualizado correctamente", title: "Registro actualizado", type: "success" }));
      onCancel();
    }
  }, [updContactoSuccess]);

  const _handleSubmit = handleSubmit((formData) => {
    if (ModelId && ModelId > 0) {
      if (EditId && EditId > 0) {
        updateContacto({ ...formData, Id: EditId });
      } else {
        addContacto({ ...formData, ModelNombre, ModelId });
      }
    }
  });

  return (
    <Card className="mb-6">
      <form method="POST" onSubmit={_handleSubmit}>
        <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
          <div className="md:col-span-4">
            <Label value="Nombre (s)" />
            <TextInput {...register("Nombre")} />
          </div>
          <div className="md:col-span-4">
            <Label value="Apellido Paterno" />
            <TextInput {...register("ApellidoPaterno")} />
          </div>
          <div className="md:col-span-4">
            <Label value="Apellido Materno" />
            <TextInput {...register("ApellidoMaterno")} />
          </div>
        </div>
        <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
          <div className="md:col-span-3">
            <Label value="Email" />
            <TextInput {...register("Email")} />
          </div>
          <div className="md:col-span-3">
            <Label value="Celular" />
            <TextInput {...register("Celular")} />
          </div>
          <div className="md:col-span-3">
            <Label value="Teléfono" />
            <TextInput {...register("Telefono")} />
          </div>
          <div className="md:col-span-3">
            <Label value="Fax" />
            <TextInput {...register("Fax")} />
          </div>
        </div>
        <div className="mb-2">
          <Label value="Notas" />
          <Textarea placeholder="" required={false} rows={4} {...register("Descripcion")} />
        </div>
        <div className="md:flex md:items-center md:justify-start md:gap-2">
          <Button onClick={onCancel} color="dark" size="xs">
            Cancelar
          </Button>
          <Button type="submit" size="xs">
            Guardar Contacto
          </Button>
        </div>
      </form>
    </Card>
  );
};
