import { useGetEmpresasQuery } from "@/apis/empresasApi";
import { useAddProyectoMutation, useGetProyectosQuery, useToggleProyectoMutation, useUpdateProyectoMutation } from "@/apis/proyectosApi";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { IProyectoInsert, IProyectoUpdate } from "@/interfaces";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faListCheck, faPencil, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Label, Modal, Select, Table, Textarea, TextInput, ToggleSwitch, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const Proyectos = () => {
  /* FORM SETUP */
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IProyectoInsert | IProyectoUpdate>();

  /* API CALLS */
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catalogoData, isLoading, error } = useGetProyectosQuery();
  const [addModelo, { isLoading: isAdding, error: addError, data: rsp }] = useAddProyectoMutation();
  const [updateModelo, { data: updateRsp, isSuccess: updateSuccess }] = useUpdateProyectoMutation();
  const [toggleModelo, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleProyectoMutation();

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
    reset();
    setEditId(0);
  }, [showAddForm]);

  const _handleToggleActivo = useCallback((modelId: number) => {
    toggleModelo(modelId);
  }, []);

  const _handleEdit = (modelId: number) => {
    let editModel = catalogoData?.find((i) => i.Id === modelId);

      if (editModel) {
          console.log(editModel);
      setEditId(editModel.Id);
      setValue("EmpresaId", editModel.EmpresaId);
      setValue("Nombre", editModel.Nombre);
      setValue("Descripcion", editModel.Descripcion);
          setValue("FechaApertura", editModel.FechaAperturaStr);
          setValue("FechaCierre", editModel.FechaCierreStr);
          setValue("FechaAperturaStr", editModel.FechaAperturaStr);
          setValue("FechaCierreStr", editModel.FechaCierreStr);

      setShowAddForm(true);
    } else {
      dispatch(addToast({ title: "Ocurrió un Error", message: "No se encuentra el elemento", type: "error" }));
    }
  };

    const _handleSubmit = handleSubmit((formData) => {

        if (formData.FechaAperturaStr == "") {
            dispatch(addToast({ title: "Ocurrió un Error", message: "Ingresa una fecha de apertura válida", type: "error" }));
            return;
        }
        if (formData.FechaCierreStr == "") {
            dispatch(addToast({ title: "Ocurrió un Error", message: "Ingresa una fecha de cierre válida", type: "error" }));
            return;
        }

        formData.FechaApertura = formData.FechaAperturaStr;
        formData.FechaCierre = formData.FechaCierreStr;
        if (editId > 0) {
          updateModelo({ ...formData, Id: editId });
        } else {
          addModelo(formData);
        }
  });

  /* EFFECT HOOKS */
  useEffect(() => {
    if (rsp && rsp.DataInt !== null && rsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro agregado con éxito", type: "success" }));
        _handleHideModal();
        return;
    }

    if (updateRsp && updateRsp.DataInt !== null && updateRsp.DataInt > 0) {
      dispatch(addToast({ title: "Éxito", message: "Registro actualizado con éxito", type: "success" }));
        _handleHideModal();
        return;
    }

    if (rsp && rsp.DataInt !== null && rsp.DataInt === 0) {
      if (rsp.Errors && rsp.Errors[0]) {
          dispatch(addToast({ title: "Ocurrió un Error", message: rsp.Errors[0], type: "error" }));
          return;
      }
    }

    if (addError) {
      console.error(addError);
        dispatch(addToast({ title: "Error", message: "Ocurrió un error al agregar", type: "error" }));
        return;
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
    [catalogoData, catEmpresas]
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
    [catalogoData, catEmpresas]
  );

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Catálogos", href: "#" },
              { name: "Proyectos", href: `${apiHost}/#/catalogos/proyectos` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Proyectos" icon={faListCheck} />
        </div>

        <div className="mb-6">
          <Button size="xs" onClick={_handleShowModal}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </Button>
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={catalogoData}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="Nombre" />
            <Column dataField="FechaApertura" dataType="datetime" />
                      <Column dataField="FechaCierre" dataType="datetime" />
                      <Column dataField="Activo" caption="" cellRender={_toggleCellComponent} width={200} alignment="center" allowExporting={false} defaultSortIndex={0} defaultSortOrder="desc" />
            <Column caption="" cellRender={_editCellComponent} width={60} alignment="center" allowExporting={false} />
          </DataGrid>
        </div>

        <Modal show={showAddForm} size="4xl" onClose={_handleHideModal} dismissible={true}>
          <Modal.Header>Agregar Registro</Modal.Header>
          <form onSubmit={_handleSubmit}>
            <Modal.Body>
              <div className="mb-4">
                <Label htmlFor="nombre" value="Nombre" />
                <TextInput id="nombre" type="text" placeholder="Ingrese el nombre para el nuevo elemento" required={true} {...register("Nombre")} />
              </div>
              <div className="md:grid md:grid-cols-12 md:gap-4">
                <div className="md:col-span-4">
                                  <Label htmlFor="empresaId" value="Empresa *" />
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
                <div className="md:col-span-4">
                                  <Label value="Fecha Apertura *" />
                                  <TextInput type="date" {...register("FechaAperturaStr")} />
                </div>
                <div className="md:col-span-4">
                                  <Label value="Fecha Cierre *" />
                  <TextInput type="date" {...register("FechaCierreStr")} />
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
