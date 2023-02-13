import { useAddAgenteAduanalMutation, useGetAgentesAduanalesQuery, useToggleAgenteAduanalMutation, useUpdateAgenteAduanalMutation } from "@/apis/agentesAduanalesApi";
import { useAddContactoMutation, useUpdateContactoMutation } from "@/apis/contactosApi";
import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faPencil, faPerson, faPersonBooth, faPersonMilitaryPointing, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Select, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type TContactoFormData = {
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  Telefono: string;
  Email: string;
  Fax: string;
};

type TInsertFormData = {
  EmpresaId: number;
  Nombre: string;
  Descripcion: string;
  Contacto: TContactoFormData;
};

export const AgentesAduanales = () => {
  /* FORM SETUP */
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<TInsertFormData>();

  /* API CALLS */
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catalogoData, isLoading, error } = useGetAgentesAduanalesQuery();
  const [addModelo, { isLoading: isAdding, error: addError, data: rsp }] = useAddAgenteAduanalMutation();
  const [updateModelo, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateAgenteAduanalMutation();
  const [toggleModelo, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleAgenteAduanalMutation();
  const [addContacto, { error: addContactoError, data: rspContacto }] = useAddContactoMutation();
  const [updateContacto] = useUpdateContactoMutation();

  /* ACTIONS DISPATCHER */
  const dispatch = useAppDispatch();

  /* STATES */
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(0);

  /* EVENT HANDLERS */
  const _handleShowModal = useCallback(() => {
    setShowAddForm(true);
  }, [showAddForm]);

  const _handleHideModal = useCallback(() => {
    setShowAddForm(false);
  }, [showAddForm]);

  const _handleToggleActivo = useCallback((modelId: number) => {
    toggleModelo(modelId);
  }, []);

  const _handleEdit = (modelId: number) => {
    let editModel = catalogoData?.find((i) => i.Id === modelId);

    if (editModel) {
      setEditId(editModel.Id);
      setValue("Nombre", editModel.Nombre);
      setValue("EmpresaId", editModel.EmpresaId);
      setValue("Descripcion", editModel.Descripcion);
      if (editModel.Contacto) {
        setValue("Contacto", editModel.Contacto as TContactoFormData);
      }
      setShowAddForm(true);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleSubmit = handleSubmit((formData) => {
    if (editId > 0) {
      let editModel = catalogoData?.find((i) => i.Id === editId);

      updateModelo({ Id: editId, Nombre: formData.Nombre, Descripcion: formData.Descripcion, EmpresaId: formData.EmpresaId })
        .unwrap()
        .then((rsp) => {
          if (rsp.DataInt && rsp.DataInt > 0) {
            console.log(`Update contacto ${editModel}`);
            if (editModel && editModel.Contacto && editModel.Contacto.Id) {
              updateContacto({
                Id: editModel.Contacto?.Id,
                Nombre: formData.Contacto.Nombre,
                ApellidoPaterno: formData.Contacto.ApellidoPaterno,
                ApellidoMaterno: formData.Contacto.ApellidoMaterno,
                Telefono: formData.Contacto.Telefono,
                Email: formData.Contacto.Email,
                Fax: formData.Contacto.Fax,
              });
            } else {
              addContacto({
                ModelId: rsp.DataInt,
                ModelNombre: "AgenteAduanal",
                Nombre: formData.Contacto.Nombre,
                ApellidoPaterno: formData.Contacto.ApellidoPaterno,
                ApellidoMaterno: formData.Contacto.ApellidoMaterno,
                Telefono: formData.Contacto.Telefono,
                Email: formData.Contacto.Email,
                Fax: formData.Contacto.Fax,
              });
            }
          }
        });
    } else {
      addModelo({ Nombre: formData.Nombre, Descripcion: formData.Descripcion, EmpresaId: formData.EmpresaId })
        .unwrap()
        .then((rsp) => {
          if (rsp.DataInt && rsp.DataInt > 0) {
            addContacto({
              ModelId: rsp.DataInt,
              ModelNombre: "AgenteAduanal",
              Nombre: formData.Contacto.Nombre,
              ApellidoPaterno: formData.Contacto.ApellidoPaterno,
              ApellidoMaterno: formData.Contacto.ApellidoMaterno,
              Telefono: formData.Contacto.Telefono,
              Email: formData.Contacto.Email,
              Fax: formData.Contacto.Fax,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  /* EFFECT HOOKS */
  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro agregado con éxito", type: "success" }));
      reset();
      setShowAddForm(false);
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro actualizado con éxito", type: "success" }));
      reset();
      setEditId(0);
      setShowAddForm(false);
    }

    if (rsp && rsp.DataInt !== null && rsp.DataInt === 0) {
      if (rsp.Errors && rsp.Errors[0]) {
        dispatch(addToast({ title: "Ocurrió un Error", message: rsp.Errors[0], type: "error" }));
      }
    }

    if (addError) {
      console.error(addError);
      dispatch(addToast({ title: "Error", message: "Ocurrió un error al agregar", type: "success" }));
    }
  }, [rsp, addError, updateRsp]);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Agentes Aduanales", href: "/catalogos/agentesaduanales" },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Agentes Aduanales" icon={faPersonMilitaryPointing} />
        </div>

        <div className="mb-6">
          <Button size="xs" onClick={_handleShowModal}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </Button>
        </div>

        <div className="mb-6">
          <Table>
            <Table.Head>
              <Table.HeadCell>Agente Aduanal</Table.HeadCell>
              <Table.HeadCell>Dirección</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {catalogoData &&
                catalogoData.map((item, index) => {
                  return (
                    <Table.Row key={index.toString()}>
                      <Table.Cell className="">{item.Nombre}</Table.Cell>
                      <Table.Cell>{item.Descripcion}</Table.Cell>
                      <Table.Cell align="right" className="flex flex-wrap items-center gap-2">
                        <Tooltip content="Editar">
                          <Button color="dark" size="sm" onClick={(e) => _handleEdit(item.Id)}>
                            <FontAwesomeIcon icon={faPencil} />
                          </Button>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell>
                        <ToggleSwitch
                          checked={item.Activo}
                          label="Activo"
                          onChange={(e) => {
                            _handleToggleActivo(item.Id);
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </div>

        <Modal show={showAddForm} size="4xl" onClose={_handleHideModal} dismissible={true}>
          <Modal.Header>Agregar Registro</Modal.Header>
          <form onSubmit={_handleSubmit}>
            <Modal.Body>
              <Label value="INFORMACIÓN" className="opacity-60" />
              <div className="md:grid md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <div className="mb-2">
                    <Label htmlFor="empresaId" value="Empresa" />
                    <Select id="empresaId" required={true} {...register("EmpresaId")}>
                      <option value={0}>Seleccione opción</option>
                      {catEmpresas
                        ?.filter((d) => d.Activo)
                        .map((item, index) => {
                          return (
                            <option key={index.toString()} value={item.Id}>
                              {item.Nombre}
                            </option>
                          );
                        })}
                    </Select>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="nombre" value="Nombre" />
                    <TextInput id="nombre" type="text" placeholder="Ingrese el nombre para el nuevo elemento" required={true} {...register("Nombre")} />
                  </div>
                </div>
                <div className="md:col-span-6">
                  <div>
                    <Label htmlFor="direccion" value="Dirección" />
                    <Textarea id="direccion" placeholder="" required={false} rows={4} {...register("Descripcion")} />
                  </div>
                </div>
              </div>

              <hr className="my-2" />

              <Label value="CONTACTO" className="opacity-60" />

              <div className="md:grid md:grid-cols-12 md:gap-4">
                <div className="md:col-span-4">
                  <Label htmlFor="nombre" value="Nombre" />
                  <TextInput type="text" required {...register("Contacto.Nombre")} />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="ApellidoPaterno" value="Apellido Paterno" />
                  <TextInput type="text" required {...register("Contacto.ApellidoPaterno")} />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="ApellidoMaterno" value="Apellido Materno" />
                  <TextInput type="text" required {...register("Contacto.ApellidoMaterno")} />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="Telefono" value="Teléfono" />
                  <TextInput type="text" required {...register("Contacto.Telefono")} />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="Email" value="Email" />
                  <TextInput type="text" {...register("Contacto.Email")} />
                </div>
                <div className="md:col-span-4">
                  <Label htmlFor="Fax" value="Fax" />
                  <TextInput type="text" {...register("Contacto.Fax")} />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Guardar</Button>
              <Button color="failure" onClick={_handleHideModal}>
                Cancelar
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
};
