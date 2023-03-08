import { useAddBancoMutation, useGetBancosQuery, useToggleBancoMutation, useUpdateBancoMutation } from "@/apis/bancosApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faBank, faFileInvoice, faPencil, faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Bancos = () => {
  const nav = useNavigate();

  const { data: catalogoData, isLoading, error } = useGetBancosQuery();
  const [addModel, { isLoading: isAdding, error: addError, data: rsp }] = useAddBancoMutation();
  const [updateModel, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateBancoMutation();
  const [toggleModel, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleBancoMutation();

  const dispatch = useAppDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [totalLinea, setTotalLinea] = useState(0);

  const _handleShowModal = useCallback(() => {
    setShowAddForm(true);
  }, [showAddForm]);

  const _handleHideModal = useCallback(() => {
    setShowAddForm(false);
  }, [showAddForm]);

  const _handleToggleActivo = useCallback((modelId: number) => {
    toggleModel(modelId);
  }, []);

  const _handleEdit = (modelId: number) => {
    let editModel = catalogoData?.find((i) => i.Id === modelId);

    if (editModel) {
      nav(`/catalogos/bancos/editar/${editModel.Id}`);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleEditComisiones = (modelId: number) => {
    let editModel = catalogoData?.find((i) => i.Id === modelId);

    if (editModel) {
      nav(`/catalogos/bancos/comisiones/${editModel.Id}`);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleSubmit = useCallback(() => {
    if (nombre.length < 1) {
      dispatch(addToast({ title: "Ocurrió un Error", message: "Ingrese el nombre del nuevo registro", type: "error" }));
      return;
    }

    if (editId > 0) {
      updateModel({ Id: editId, Nombre: nombre, Descripcion: descripcion, TotalLinea: totalLinea });
    } else {
      addModel({ Nombre: nombre, Descripcion: descripcion, TotalLinea: totalLinea });
    }
  }, [editId, nombre, descripcion, totalLinea]);

  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro agregado con éxito", type: "success" }));
      setNombre("");
      setDescripcion("");
      setTotalLinea(0);
      setEditId(0);
      setShowAddForm(false);
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro actualizado con éxito", type: "success" }));
      setNombre("");
      setDescripcion("");
      setTotalLinea(0);
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
              { name: "Bancos", href: `${apiHost}/#/catalogos/bancos` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Bancos" icon={faBank} />
        </div>

        <div className="mb-6">
          <Button
            size="xs"
            onClick={() => {
              nav("/catalogos/bancos/agregar");
            }}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </Button>
        </div>

        <div className="my-6">
          <Table>
            <Table.Head>
              <Table.HeadCell>Banco</Table.HeadCell>
              <Table.HeadCell>Total Línea</Table.HeadCell>
              <Table.HeadCell>Comisiones</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {catalogoData &&
                catalogoData.map((item, index) => {
                  return (
                    <Table.Row key={index.toString()}>
                      <Table.Cell className="">{item.Nombre}</Table.Cell>
                      <Table.Cell>{item.TotalLinea}</Table.Cell>
                      <Table.Cell>
                        <Tooltip content="Comisiones">
                          <Button color="dark" size="sm" onClick={(e) => _handleEditComisiones(item.Id)}>
                            <FontAwesomeIcon icon={faFileInvoice} />
                          </Button>
                        </Tooltip>
                      </Table.Cell>
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
                placeholder="Ingrese el nombre para el nuevo registro"
                required={true}
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="totalLinea" value="Total Línea" />
              <TextInput
                id="totalLinea"
                type="number"
                placeholder="Ingrese el total de línea de crédito"
                required={true}
                onChange={(e) => setTotalLinea(Number(e.target.value))}
                value={totalLinea}
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
