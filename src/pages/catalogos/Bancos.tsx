import { useAddBancoMutation, useGetBancosQuery, useToggleBancoMutation, useUpdateBancoMutation } from "@/apis/bancosApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faBank, faFileInvoice, faPencil, faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as FButton, Label, Modal, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

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
      updateModel({ Id: editId, Nombre: nombre, Descripcion: descripcion });
    } else {
      addModel({ Nombre: nombre, Descripcion: descripcion });
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

  const _comisionesCellComponent = useCallback(
    (rowData: ColumnCellTemplateData) => {
      return (
        <FButton onClick={() => _handleEditComisiones(rowData.data.Id)} size="xs">
          Comisiones
        </FButton>
      );
    },
    [catalogoData]
  );

  const _toggleCellComponent = useCallback(
    (rowData: ColumnCellTemplateData) => {
      return (
        <ToggleSwitch
          label={rowData.data.Activo ? "Activo" : "Inactivo"}
          checked={rowData.data.Activo}
          onChange={(e) => {
            _handleToggleActivo(rowData.data.Id);
          }}
        />
      );
    },
    [catalogoData]
  );

  const _editCellComponent = useCallback(
    (rowData: ColumnCellTemplateData) => {
      return (
        <Tooltip content="Editar">
          <FButton color="dark" size="sm" onClick={(e) => _handleEdit(rowData.data.Id)}>
            <FontAwesomeIcon icon={faPencil} />
          </FButton>
        </Tooltip>
      );
    },
    [catalogoData]
  );

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
          <FButton
            size="xs"
            onClick={() => {
              nav("/catalogos/bancos/agregar");
            }}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </FButton>
        </div>

        <div className="my-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={catalogoData}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="Nombre" />
            <Column dataField="TotalLinea" format="currency" dataType="number" />
            <Column caption="" cellRender={_comisionesCellComponent} width={140} alignment="center" allowExporting={false} />
            <Column caption="" cellRender={_toggleCellComponent} width={200} alignment="center" allowExporting={false} />
            <Column caption="" cellRender={_editCellComponent} width={60} alignment="center" allowExporting={false} />
          </DataGrid>
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

            <div>
              <Label htmlFor="descripcion" value="Descripción" />
              <Textarea id="descripcion" placeholder="" required={false} rows={5} onChange={(e) => setDescripcion(e.target.value)} value={descripcion} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <FButton onClick={_handleSubmit}>Guardar</FButton>
            <FButton color="failure" onClick={_handleHideModal}>
              Cancelar
            </FButton>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
