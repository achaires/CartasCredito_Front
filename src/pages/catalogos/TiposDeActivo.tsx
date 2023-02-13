import { useAddTipoActivoMutation, useGetTiposActivoQuery, useToggleTipoActivoMutation, useUpdateTipoActivoMutation } from "@/apis/tiposActivoApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { faPencil, faPlusCircle, faRectangleList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Select, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";

export const TiposDeActivo = () => {
  const { data: catalogoData, isLoading, error } = useGetTiposActivoQuery();
  const [addModelo, { isLoading: isAdding, error: addError, data: rsp }] = useAddTipoActivoMutation();
  const [updateModelo, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateTipoActivoMutation();
  const [toggleModelo, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleTipoActivoMutation();

  const dispatch = useAppDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [responsable, setResponsable] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const _reset = useCallback(() => {
    setEditId(0);
    setNombre("");
    setDescripcion("");
    setResponsable("");
  }, [editId, nombre, descripcion, responsable]);

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
      setNombre(editModel.Nombre);
      setDescripcion(editModel.Descripcion);
      setResponsable(editModel.Responsable);
      setShowAddForm(true);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleSubmit = useCallback(() => {
    if (nombre.length < 1) {
      dispatch(addToast({ title: "Ocurrió un Error", message: "Ingrese el nombre del elemento", type: "error" }));
      return;
    }

    if (editId > 0) {
      updateModelo({ Id: editId, Nombre: nombre, Descripcion: descripcion, Responsable: responsable });
    } else {
      addModelo({ Nombre: nombre, Descripcion: descripcion, Responsable: responsable });
    }
  }, [editId, nombre, descripcion, responsable]);

  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro agregado con éxito", type: "success" }));
      _reset();
      setShowAddForm(false);
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro actualizado con éxito", type: "success" }));
      _reset();
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
              { name: "Tipos de Activo", href: "/catalogos/tipos-de-activo" },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Tipos de Activo" icon={faRectangleList} />
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
              <Table.HeadCell>Tipo Activo</Table.HeadCell>
              <Table.HeadCell>Responsable</Table.HeadCell>
              <Table.HeadCell>Descripción</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {catalogoData &&
                catalogoData.map((item, index) => {
                  return (
                    <Table.Row key={index.toString()}>
                      <Table.Cell className="">{item.Nombre}</Table.Cell>
                      <Table.Cell>{item.Responsable}</Table.Cell>
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

        <Modal show={showAddForm} size="md" onClose={_handleHideModal} dismissible={true}>
          <Modal.Header>Agregar Registro</Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <Label htmlFor="nombre" value="Nombre" />
              <TextInput
                id="nombre"
                type="text"
                placeholder="Ingrese el nombre para el nuevo elemento"
                required={true}
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="responsable" value="Responsable" />
              <TextInput
                id="responsable"
                type="text"
                placeholder="Ingrese el nombre para el nuevo elemento"
                required={true}
                onChange={(e) => setResponsable(e.target.value)}
                value={responsable}
              />
            </div>

            <div>
              <Label htmlFor="descripcion" value="Descripción" />
              <Textarea id="descripcion" placeholder="" required={false} rows={5} onChange={(e) => setDescripcion(e.target.value)} value={descripcion} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={_handleSubmit}>Guardar</Button>
            <Button color="failure" onClick={_handleHideModal}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
