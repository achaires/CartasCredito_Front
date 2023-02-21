import { useAddBancoMutation, useLazyGetBancoQuery, useUpdateBancoMutation } from "@/apis/bancosApi";
import { useAddContactoMutation } from "@/apis/contactosApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { IContactoInsert } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faBank, faCircleArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type TContactoFormData = {
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Telefono: string;
  Celular: string;
  Email: string;
  Fax: string;
  Descripcion: string;
};

type TInsertFormData = {
  Nombre: string;
  TotalLinea: number;
  Descripcion: string;
  Contactos: Array<IContactoInsert>;
};

export const BancoAgregar = () => {
  const nav = useNavigate();
  const routeParams = useParams();

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<TInsertFormData>();

  const dispatch = useAppDispatch();

  const [getBancoDetalle, { isSuccess: bancoDetalleSuccess, isError: bancoDetalleError }] = useLazyGetBancoQuery();
  const [addModel, { data: addModelData, isSuccess: isAddModelSuccess, isLoading: isAddModelLoading, isError: isAddModelError, error: addModelError }] = useAddBancoMutation();
  const [updateModel, { data: updModelData, isSuccess: isUpdModelSuccess, isLoading: isUpdModelLoading, isError: isUpdModelError, error: updModelError }] =
    useUpdateBancoMutation();
  const [addContacto, { error: addContactoError, data: rspContacto, isSuccess: addContactSuccess }] = useAddContactoMutation();

  const [editId, setEditId] = useState(0);
  const [verb, setVerb] = useState<"Agregar" | "Editar">("Agregar");

  useEffect(() => {
    if (isAddModelSuccess) {
      dispatch(addToast({ message: "Registro agregado correctamente", title: "Registro agregado", type: "success" }));
    }
  }, [addModelData, isAddModelSuccess, isAddModelLoading, isAddModelError, addModelError, addContactSuccess]);

  const _handleBack = () => {
    nav("/catalogos/bancos");
  };

  const _handleSubmit = handleSubmit((formData) => {
    if (editId > 0) {
      updateModel({ ...formData, Id: editId })
        .unwrap()
        .then((rsp) => {
          if (rsp.DataInt && rsp.DataInt > 0) {
            if (formData.Contactos[0].Nombre && formData.Contactos[0].ApellidoPaterno) {
              addContacto({
                ...formData.Contactos[0],
                ModelNombre: "Bancos",
                ModelId: rsp.DataInt,
              });
            }

            if (formData.Contactos[1].Nombre && formData.Contactos[1].ApellidoPaterno) {
              addContacto({ ...formData.Contactos[1], ModelNombre: "Bancos", ModelId: rsp.DataInt });
            }
          }
        });
    } else {
      addModel({ Nombre: formData.Nombre, Descripcion: formData.Descripcion, TotalLinea: formData.TotalLinea })
        .unwrap()
        .then((rsp) => {
          if (rsp.DataInt && rsp.DataInt > 0) {
            if (formData.Contactos[0].Nombre && formData.Contactos[0].ApellidoPaterno) {
              addContacto({
                ...formData.Contactos[0],
                ModelNombre: "Bancos",
                ModelId: rsp.DataInt,
              });
            }

            if (formData.Contactos[1].Nombre && formData.Contactos[1].ApellidoPaterno) {
              addContacto({ ...formData.Contactos[1], ModelNombre: "Bancos", ModelId: rsp.DataInt });
            }
          }
        })
        .then(() => {
          nav("/catalogos/bancos");
        });
    }
  });

  useEffect(() => {
    if (routeParams.bancoId) {
      setEditId(Number(routeParams.bancoId));
      setVerb("Editar");
      getBancoDetalle(Number(routeParams.bancoId))
        .unwrap()
        .then((rsp) => {
          setValue("Nombre", rsp.Nombre);
          setValue("TotalLinea", rsp.TotalLinea);
          setValue("Descripcion", rsp.Descripcion);
          if (rsp.Contactos) {
            setValue("Contactos", rsp.Contactos);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {
      setEditId(0);
      setVerb("Agregar");
    };
  }, [routeParams]);

  /* const _handleSubmit = () => {
    if (nombre.length < 2) dispatch(addToast({ message: "Ingrese un nombre válido", title: "Error", type: "error" }));

    addModel({
      Nombre: nombre,
      TotalLinea: totalLinea,
      Descripcion: descripcion,
    });
  }; */

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Bancos", href: "/catalogos/bancos" },
              { name: verb, href: `#` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Bancos" subtitle={verb} icon={faBank} />
        </div>

        <div className="mb-6">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
        </div>

        <div className="mb-6">
          <form onSubmit={_handleSubmit}>
            <div className="md:grid md:grid-cols-12 md:gap-6 mb-6">
              <div className="md:col-span-6">
                <div className="mb-2">
                  <Label htmlFor="nombre" value="Nombre" />
                  <TextInput id="nombre" type="text" placeholder="Ingrese el nombre para el nuevo registro" required={true} {...register("Nombre")} />
                </div>

                <div className="mb-2">
                  <Label htmlFor="totalLinea" value="Total Línea" />
                  <TextInput id="totalLinea" type="number" placeholder="Ingrese el total de línea de crédito" required={true} {...register("TotalLinea")} />
                </div>
              </div>
              <div className="md:col-span-6">
                <div>
                  <Label htmlFor="descripcion" value="Descripción" />
                  <Textarea {...register("Descripcion")} id="descripcion" placeholder="" required={false} rows={4} />
                </div>
              </div>
            </div>
            <hr />
            <div className="my-6">
              <h4 className="text-sm font-medium mb-6">CONTACTOS</h4>
              <div className="mb-6">
                <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                  <div className="md:col-span-4">
                    <Label value="Nombre (s)" />
                    <TextInput {...register(`Contactos.${0}.Nombre`)} />
                  </div>
                  <div className="md:col-span-4">
                    <Label value="Apellido Paterno" />
                    <TextInput {...register(`Contactos.${0}.ApellidoPaterno`)} />
                  </div>
                  <div className="md:col-span-4">
                    <Label value="Apellido Materno" />
                    <TextInput {...register(`Contactos.${0}.ApellidoMaterno`)} />
                  </div>
                </div>
                <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                  <div className="md:col-span-3">
                    <Label value="Email" />
                    <TextInput {...register(`Contactos.${0}.Email`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Celular" />
                    <TextInput {...register(`Contactos.${0}.Celular`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Teléfono" />
                    <TextInput {...register(`Contactos.${0}.Telefono`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Fax" />
                    <TextInput {...register(`Contactos.${0}.Fax`)} />
                  </div>
                </div>
                <div>
                  <Label value="Notas" />
                  <Textarea placeholder="" required={false} rows={4} {...register(`Contactos.${0}.Descripcion`)} />
                </div>
              </div>
              <div className="mb-6">
                <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                  <div className="md:col-span-4">
                    <Label value="Nombre (s)" />
                    <TextInput {...register(`Contactos.${1}.Nombre`)} />
                  </div>
                  <div className="md:col-span-4">
                    <Label value="Apellido Paterno" />
                    <TextInput {...register(`Contactos.${1}.ApellidoPaterno`)} />
                  </div>
                  <div className="md:col-span-4">
                    <Label value="Apellido Materno" />
                    <TextInput {...register(`Contactos.${1}.ApellidoMaterno`)} />
                  </div>
                </div>
                <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                  <div className="md:col-span-3">
                    <Label value="Email" />
                    <TextInput {...register(`Contactos.${1}.Email`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Celular" />
                    <TextInput {...register(`Contactos.${1}.Celular`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Teléfono" />
                    <TextInput {...register(`Contactos.${1}.Telefono`)} />
                  </div>
                  <div className="md:col-span-3">
                    <Label value="Fax" />
                    <TextInput {...register(`Contactos.${1}.Fax`)} />
                  </div>
                </div>
                <div>
                  <Label value="Notas" />
                  <Textarea placeholder="" required={false} rows={4} {...register(`Contactos.${1}.Descripcion`)} />
                </div>
              </div>
            </div>
            <div>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
