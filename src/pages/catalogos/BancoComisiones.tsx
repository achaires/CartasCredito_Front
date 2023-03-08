import { useAddComisionMutation, useGetComisionesQuery, useToggleComisionMutation, useUpdateComisionMutation } from "@/apis/comisionesApi";
import { useGetTiposComisionQuery } from "@/apis/tiposComisionApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { IBanco, IComisionInsert, IComisionUpdate } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faBank, faCircleArrowLeft, faListCheck, faPencil, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Select, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const BancoComisiones = () => {
  const routeParams = useParams();
  const nav = useNavigate();

  /* FORM SETUP */
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IComisionInsert | IComisionUpdate>();

  /* API CALLS */
  const { data: catalogoTiposComision } = useGetTiposComisionQuery();
  const { data: catalogoData, isLoading, error } = useGetComisionesQuery();
  const [addModelo, { isLoading: isAdding, error: addError, data: rsp }] = useAddComisionMutation();
  const [updateModelo, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateComisionMutation();
  const [toggleModelo, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleComisionMutation();

  /* ACTIONS DISPATCHER */
  const dispatch = useAppDispatch();

  /* STATES */
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const [currentBanco, setCurrentBanco] = useState<IBanco>();

  /* EVENT HANDLERS */
  const _handleBack = useCallback(() => {
    nav("/catalogos/bancos");
  }, []);

  const _handleShowModal = useCallback(() => {
    setShowAddForm(true);
  }, [showAddForm]);

  const _handleHideModal = useCallback(() => {
    setShowAddForm(false);
    reset();
    setEditId(0);
  }, [showAddForm]);

  const _handleToggleActivo = useCallback((modelId: number) => {
    toggleModelo(modelId);
  }, []);

  const _handleEdit = (modelId: number) => {
    let editModel = catalogoData?.find((i) => i.Id === modelId);

    if (editModel) {
      setEditId(editModel.Id);
      setValue("BancoId", editModel.BancoId);
      setValue("TipoComisionId", editModel.TipoComisionId);
      setValue("Nombre", editModel.Nombre);
      setValue("Descripcion", editModel.Descripcion);
      setValue("Costo", editModel.Costo);
      setValue("SwiftApertura", editModel.SwiftApertura);
      setValue("SwiftOtro", editModel.SwiftOtro);
      setValue("PorcentajeIVA", editModel.PorcentajeIVA);

      setShowAddForm(true);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleSubmit = handleSubmit((formData) => {
    if (editId > 0) {
      updateModelo({ ...formData, Id: editId });
    } else {
      addModelo({ ...formData, BancoId: Number(routeParams.bancoId) });
    }
  });

  /* EFFECT HOOKS */
  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro agregado con éxito", type: "success" }));
      _handleHideModal();
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro actualizado con éxito", type: "success" }));
      _handleHideModal();
    }

    if (rsp && rsp.DataInt !== null && rsp.DataInt === 0) {
      if (rsp.Errors && rsp.Errors[0]) {
        dispatch(addToast({ title: "Ocurrió un Error", message: rsp.Errors[0], type: "error" }));
      }
    }

    if (addError) {
      console.error(addError);
      dispatch(addToast({ title: "Error", message: "Ocurrió un error al agregar", type: "error" }));
    }
  }, [rsp, addError, updateRsp]);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Bancos", href: `${apiHost}/catalogos/bancos` },
              { name: "Comisiones", href: "#" },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Bancos" subtitle="Comisiones" icon={faBank} />
        </div>

        <div className="md:flex md:items-center md:gap-4 mb-6">
          <Button outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </Button>
          <Button size="xs" onClick={_handleShowModal}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </Button>
        </div>

        <div className="mb-6">
          <Table>
            <Table.Head>
              <Table.HeadCell>Comisión</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {catalogoData &&
                catalogoData
                  .filter((i) => i.BancoId === Number(routeParams.bancoId))
                  .map((item, index) => {
                    return (
                      <Table.Row key={index.toString()}>
                        <Table.Cell className="">{item.Nombre}</Table.Cell>
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
              <div className="md:grid md:grid-cols-12 md:gap-4 mb-4">
                <div className="md:col-span-6">
                  <Label htmlFor="nombre" value="Nombre" />
                  <TextInput type="text" placeholder="Ingrese el nombre para el nuevo elemento" required={true} {...register("Nombre")} />
                </div>
                <div className="md:col-span-6">
                  <Label value="Tipo Comisión" />
                  <Select {...register("TipoComisionId")}>
                    <option value={0}>Seleccione</option>
                    {catalogoTiposComision &&
                      catalogoTiposComision
                        .filter((tc) => tc.Activo)
                        .map((item, index) => (
                          <option value={item.Id} key={index.toString()}>
                            {item.Nombre}
                          </option>
                        ))}
                  </Select>
                </div>
              </div>
              <div className="md:grid md:grid-cols-12 md:gap-4 mb-4">
                <div className="md:col-span-6">
                  <Label value="Costo" />
                  <TextInput type="number" {...register("Costo")} />
                </div>
                <div className="md:col-span-6">
                  <Label value="Porcentaje IVA" />
                  <TextInput min={0.0} max={100} type="number" {...register("PorcentajeIVA")} />
                </div>
                <div className="md:col-span-6">
                  <Label value="Swift Apertura" />
                  <TextInput type="text" {...register("SwiftApertura")} />
                </div>
                <div className="md:col-span-6">
                  <Label value="Otro Swift" />
                  <TextInput type="text" {...register("SwiftOtro")} />
                </div>
              </div>
              <div>
                <Label htmlFor="descripcion" value="Descripción" />
                <Textarea id="descripcion" placeholder="" required={false} rows={4} {...register("Descripcion")} />
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
