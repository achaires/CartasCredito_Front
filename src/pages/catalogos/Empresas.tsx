import { useGetDivisionesQuery } from "@/apis/divisionesApi";
import { useAddEmpresaMutation, useGetEmpresasQuery, useToggleEmpresaMutation, useUpdateEmpresaMutation } from "@/apis/empresasApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faBuilding, faPencil, faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Select, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const Empresas = () => {
  const { data: divisiones } = useGetDivisionesQuery();
  const { data: empresas, isLoading, error } = useGetEmpresasQuery();
  const [addEmpresa, { isLoading: isAdding, error: addError, data: rsp }] = useAddEmpresaMutation();
  const [toggleEmpresa, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleEmpresaMutation();
  const [updateEmpresa, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateEmpresaMutation();

  const dispatch = useAppDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const [divisionId, setDivisionId] = useState(1);
  const [nombre, setNombre] = useState("");
  const [rfc, setRfc] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const _reset = useCallback(() => {
        setEditId(0);
        setDivisionId(0);
        setNombre("");
        setRfc("");
        setDescripcion("");
    }, []);

    const _handleShowModal = useCallback(() => {
        _reset();
    setShowAddForm(true);
  }, [showAddForm]);

  const _handleHideModal = useCallback(() => {
    setShowAddForm(false);
  }, [showAddForm]);

  const _handleToggleActivo = useCallback((modelId: number) => {
    toggleEmpresa(modelId);
  }, []);

  const _handleEdit = (modelId: number) => {
    let editModel = empresas?.find((i) => i.Id === modelId);

    if (editModel) {
      setEditId(editModel.Id);
      setDivisionId(editModel.DivisionId);
      setNombre(editModel.Nombre);
      setRfc(editModel.RFC);
      setDescripcion(editModel.Descripcion);
      setShowAddForm(true);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

  const _handleSubmit = useCallback(() => {
    if (nombre.length < 1) {
      dispatch(addToast({ title: "Ocurrió un Error", message: "Ingrese el nombre de la empresa", type: "error" }));
      return;
    }

    if (divisionId < 1) {
      dispatch(addToast({ title: "Ocurrió un Error", message: "Seleccione división", type: "error" }));
      return;
    }

    if (editId > 0) {
      updateEmpresa({ Id: editId, DivisionId: divisionId, Nombre: nombre, RFC: rfc, Descripcion: descripcion });
    } else {
      addEmpresa({ DivisionId: divisionId, Nombre: nombre, RFC: rfc, Descripcion: descripcion });
    }
  }, [editId, divisionId, nombre, rfc, descripcion]);

  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Empresa agregada con éxito", type: "success" }));
      setNombre("");
      setRfc("");
      setDivisionId(0);
      setDescripcion("");
      setEditId(0);
      setShowAddForm(false);
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Empresa actualizada con éxito", type: "success" }));
      setNombre("");
      setDescripcion("");
      setRfc("");
      setDivisionId(0);
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
    [divisiones, empresas]
  );

  const _editCellComponent = useCallback(
    (rowData: ColumnCellTemplateData) => {
      return (
        <Tooltip content="Editar">
          <Button color="dark" size="sm" onClick={(e) => _handleEdit(rowData.data.Id)}>
            <FontAwesomeIcon icon={faPencil} />
          </Button>
        </Tooltip>
      );
    },
    [divisiones, empresas]
  );

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Empresas", href: `${apiHost}/#/catalogos/empresas` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Empresas" icon={faBuilding} />
        </div>

        <div className="mb-6">
          <Button size="xs" onClick={_handleShowModal}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </Button>
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={empresas}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="Nombre" />
            <Column dataField="Division" />
            <Column dataField="RFC" />
                      <Column dataField="Activo" caption="" cellRender={_toggleCellComponent} width={200} alignment="center" allowExporting={false} defaultSortIndex={0} defaultSortOrder="desc" />
            <Column caption="" cellRender={_editCellComponent} width={60} alignment="center" allowExporting={false} />
          </DataGrid>
        </div>

        <Modal show={showAddForm} size="md" onClose={_handleHideModal} dismissible={true}>
          <Modal.Header>Agregar Empresa</Modal.Header>
          <Modal.Body>
            <div className="mb-4">
                          <Label htmlFor="divisionId" value="División *" />
              <Select
                id="divisionId"
                required={true}
                value={divisionId}
                onChange={(e) => {
                  setDivisionId(Number(e.target.value));
                }}>
                <option value={0}>Seleccione Opción</option>
                {divisiones
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
                          <Label htmlFor="nombre" value="Nombre *" />
              <TextInput id="nombre" type="text" placeholder="Ingrese el nombre de la empresa" required={true} onChange={(e) => setNombre(e.target.value)} value={nombre} />
            </div>

            <div className="mb-4">
                          <Label htmlFor="rfc" value="RFC *" />
              <TextInput id="rfc" type="text" placeholder="Ingrese el rfc de la empresa" required={true} onChange={(e) => setRfc(e.target.value)} value={rfc} />
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
