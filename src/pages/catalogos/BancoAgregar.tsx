import { useAddBancoMutation, useLazyGetBancoQuery, useUpdateBancoMutation } from "@/apis/bancosApi";
import { useAddContactoMutation, useToggleContactoMutation } from "@/apis/contactosApi";
import { AdminBreadcrumbs, AdminPageHeader, ContactoForm } from "@/components";
import { IContactoInsert } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faBank, faCircleArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Label, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type TInsertFormData = {
  Nombre: string;
  TotalLinea: number;
  Descripcion: string;
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

  const [getBancoDetalle, { data: bancoDetalle, isSuccess: bancoDetalleSuccess, isError: bancoDetalleError }] = useLazyGetBancoQuery();
  const [addModel, { data: addModelData, isSuccess: isAddModelSuccess, isLoading: isAddModelLoading, isError: isAddModelError, error: addModelError }] = useAddBancoMutation();
  const [updateModel, { data: updModelData, isSuccess: isUpdModelSuccess, isLoading: isUpdModelLoading, isError: isUpdModelError, error: updModelError }] =
    useUpdateBancoMutation();
  const [toggleContacto] = useToggleContactoMutation();

  const [editId, setEditId] = useState(0);
  const [verb, setVerb] = useState<"Agregar" | "Editar">("Agregar");
  const [showAddContactForm, setShowAddContactForm] = useState(false);

  useEffect(() => {
    if (isAddModelSuccess) {
      dispatch(addToast({ message: "Registro agregado correctamente", title: "Registro agregado", type: "success" }));
      _handleBack();
    }

    if (isUpdModelSuccess) {
      dispatch(addToast({ message: "Registro actualizado correctamente", title: "Registro actualizado", type: "success" }));
      _handleBack();
    }
  }, [addModelData, isAddModelSuccess, isUpdModelSuccess, isAddModelLoading, isAddModelError, addModelError]);

  const _handleBack = () => {
    nav("/catalogos/bancos");
  };

  const _handleSubmit = handleSubmit((formData) => {
    if (editId > 0) {
      updateModel({ ...formData, Id: editId });
    } else {
      addModel({ Nombre: formData.Nombre, Descripcion: formData.Descripcion, TotalLinea: formData.TotalLinea });
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
            <div className="mb-6 md:flex">
              <Button className="bg-brandDark hover:bg-brandPrimary" type="submit">
                Guardar
              </Button>
            </div>
          </form>
          {bancoDetalle && bancoDetalle.Id > 0 && (
            <>
              <hr />
              <div className="my-6">
                <h4 className="text-sm font-medium mb-2">CONTACTOS</h4>
                <Button size="xs" color="dark" className="mb-6" onClick={(e) => setShowAddContactForm(true)}>
                  Agregar Contacto
                </Button>
                {showAddContactForm && (
                  <ContactoForm
                    ModelNombre="Bancos"
                    ModelId={bancoDetalle?.Id}
                    onCancel={() => {
                      setShowAddContactForm(false);
                    }}
                  />
                )}

                {bancoDetalle &&
                  bancoDetalle.Contactos &&
                  bancoDetalle.Contactos.length > 0 &&
                  bancoDetalle.Contactos.filter((c) => c.Activo).map((item, index) => (
                    <Card key={index.toString()} className="mb-6">
                      <div>
                        <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                          <div className="md:col-span-4">
                            <Label value="Nombre (s)" />
                            <TextInput defaultValue={item.Nombre ? item.Nombre : ""} disabled />
                          </div>
                          <div className="md:col-span-4">
                            <Label value="Apellido Paterno" />
                            <TextInput defaultValue={item.ApellidoPaterno ? item.ApellidoPaterno : ""} disabled />
                          </div>
                          <div className="md:col-span-4">
                            <Label value="Apellido Materno" />
                            <TextInput defaultValue={item.ApellidoMaterno ? item.ApellidoMaterno : ""} disabled />
                          </div>
                        </div>
                        <div className="md:grid md:grid-cols-12 md:gap-6 mb-2">
                          <div className="md:col-span-3">
                            <Label value="Email" />
                            <TextInput defaultValue={item.Email ? item.Email : ""} disabled />
                          </div>
                          <div className="md:col-span-3">
                            <Label value="Celular" />
                            <TextInput defaultValue={item.Celular ? item.Celular : ""} disabled />
                          </div>
                          <div className="md:col-span-3">
                            <Label value="Teléfono" />
                            <TextInput defaultValue={item.Telefono ? item.Telefono : ""} disabled />
                          </div>
                          <div className="md:col-span-3">
                            <Label value="Fax" />
                            <TextInput defaultValue={item.Fax ? item.Fax : ""} disabled />
                          </div>
                        </div>
                        <div className="mb-2">
                          <Label value="Notas" />
                          <Textarea defaultValue={item.Descripcion} required={false} rows={4} disabled className="text-sm" />
                        </div>
                        <div>
                          <Button color="failure" size="xs" onClick={(e) => toggleContacto(item.Id)}>
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
