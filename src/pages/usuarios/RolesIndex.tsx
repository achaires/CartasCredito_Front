import { useGetRolesQuery, useToggleRoleMutation } from "@/apis";
import { AdminBreadcrumbs, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { apiHost } from "@/utils/apiConfig";
import { faPencil, faPlusCircle, faShieldHalved, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataGrid, { Column, Export, HeaderFilter, Paging, SearchPanel, Selection } from "devextreme-react/data-grid";
import { ColumnCellTemplateData } from "devextreme/ui/data_grid";
import { Tooltip, Button as FButton, ToggleSwitch } from "flowbite-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const txtsExport = {
  exportAll: "Exportar Todo",
  exportSelectedRows: "Exportar Selección",
  exportTo: "Exportar A",
};

export const RolesIndex = () => {
  const nav = useNavigate();

  /** API CALLS */
  const { data: catalogoData, isLoading, error } = useGetRolesQuery();
  const [toggleModelo, { data: toggleRsp, isSuccess: toggleSuccess }] = useToggleRoleMutation();

  /** ACTION DISPATCHER */
  const dispatch = useAppDispatch();

  /* EVENT HANDLERS */
  const _handleToggleActivo = useCallback((modelId: string) => {
    toggleModelo(modelId);
  }, []);

  const _handleEdit = useCallback((modelId: string) => {
    nav(`/roles/editar/${modelId}`);
  }, []);

  /** MISC */
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

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs links={[{ name: "Roles", href: `${apiHost}/#/roles` }]} />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Roles" icon={faShieldHalved} />
        </div>

        <div className="mb-6">
          <FButton
            size="xs"
            onClick={() => {
              nav("/roles/agregar");
            }}>
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar
          </FButton>
        </div>

        <div className="mb-6">
          <DataGrid showBorders={true} showColumnLines={true} showRowLines={true} keyExpr="Id" dataSource={catalogoData}>
            <Paging defaultPageSize={10} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Export enabled={true} texts={txtsExport} allowExportSelectedData={true} />
            <Column dataField="Name" />
            <Column caption="" cellRender={_toggleCellComponent} width={200} alignment="center" allowExporting={false} />
            <Column caption="" cellRender={_editCellComponent} width={60} alignment="center" allowExporting={false} />
          </DataGrid>
        </div>
      </div>
    </>
  );
};
