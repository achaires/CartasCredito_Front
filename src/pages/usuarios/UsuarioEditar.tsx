import { useAddUserMutation, useGetEmpresasQuery, useGetRolesQuery, useLazyGetUserByIdQuery, useUpdateUserMutation } from "@/apis";
import { AdminBreadcrumbs, AdminLoadingActivity, AdminPageHeader } from "@/components";
import { useAppDispatch } from "@/store";
import { addToast } from "@/store/uiSlice";
import { apiHost } from "@/utils/apiConfig";
import { faCircleArrowLeft, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button as FButton, Checkbox, Label, Textarea, TextInput, Select } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

/** Form Validation Schema */
const validationSchema = z.object({
  /* UserName: z.string().min(1), */
  Name: z.string().min(3),
  LastName: z.string().min(3),
  Email: z.string().min(3),
  PhoneNumber: z.string().optional().nullable(),
  Notes: z.string().optional().nullable(),
  RolId: z.string(),
  //Empresas: z.array(z.object({id: z.number()})).optional().nullable(),
});
/* .refine((data) => /^\w+(\.\w+)*$/.test(data.UserName), {
    message: "Utilice solo letras, números y punto",
    path: ["UserName"],
  }); */

type ValidationSchema = z.infer<typeof validationSchema>;

export const UsuarioEditar = () => {
  const nav = useNavigate();
  const routeParams = useParams();

  /** COMPONENT STATE */
  const [empresas, setEmpresas] = useState<Array<number>>([]);

  /** ACTION DISPATCHER */
  const dispatch = useAppDispatch();

  /** API Calls */
  const { data: catEmpresas } = useGetEmpresasQuery();
  const { data: catRoles } = useGetRolesQuery();
  const [getUserById, { data: userDetail, isLoading: getUserIsLoading, isSuccess: getUserSuccess, isError: getUserError }] = useLazyGetUserByIdQuery();
  const [updateModel, { isLoading: isUpdating, isSuccess: isUpdated, isError: isUpdatingError, data: isUpdatedData }] = useUpdateUserMutation();

  /** Form Setup */
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors: formErrors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  /** EVENT HANDLERS */
  const _handleBack = () => {
    nav("/usuarios");
  };

  const _handleSubmit = handleSubmit((formData) => {
    if (userDetail && userDetail.Id) {
      updateModel({
        ...formData,
        Id: userDetail.Id,
        Empresas: empresas,
      });
    }
  });

  const _handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newEmpresas = [...empresas];
      let empresaId = Number(e.target.value);

      if (e.target.checked) {
        newEmpresas.push(empresaId);
      } else {
        let rmIndex = newEmpresas.findIndex((empId) => empId === empresaId);
        newEmpresas.splice(rmIndex, 1);
      }

      setEmpresas(newEmpresas);
    },
    [empresas]
  );

  /** EFFECT HOOKS */
  useEffect(() => {
    if (routeParams && routeParams.userId) {
      getUserById(routeParams.userId);
    }
  }, [routeParams]);

  useEffect(() => {
    if (userDetail && userDetail.Profile) {
      setValue("Email", userDetail.Email);
      setValue("PhoneNumber", userDetail.PhoneNumber);
      setValue("Name", userDetail.Profile.Name ? userDetail.Profile.Name : "");
      setValue("LastName", userDetail.Profile.LastName ? userDetail.Profile.LastName : "");
      setValue("Notes", userDetail.Profile.Notes ? userDetail.Profile.Notes : "");
      setValue("RolId", userDetail.RoleId ? userDetail.RoleId : "");

      var newEmpresas = [];

      if (userDetail.Empresas && userDetail.Empresas.length > 0) {
        for (var empItem in userDetail.Empresas) {
          newEmpresas.push(userDetail.Empresas[empItem].Id);
        }

        setEmpresas(newEmpresas);
      }
      //setValue("DisplayName",userDetail.Profile.DisplayName ? userDetail.Profile.DisplayName : '');
    }
  }, [userDetail]);

  useEffect(() => {
    if (isUpdatingError) {
      dispatch(
        addToast({
          title: "Información",
          message: "Ocurrió un error interno. Verifique los datos e intente nuévamente.",
          type: "error",
        })
      );
    }

    if (isUpdated) {
      if (isUpdated && isUpdatedData) {
        if (isUpdatedData.DataInt === 1) {
          dispatch(
            addToast({
              title: "Información",
              message: "Se actualizó el usuario correctamente",
              type: "success",
            })
          );

          nav(`/usuarios`);
        } else {
          dispatch(
            addToast({
              title: "Información",
              message: isUpdatedData.Errors && isUpdatedData.Errors.length > 0 ? isUpdatedData.Errors[0] : "Ocurrió un error",
              type: "error",
            })
          );
        }
      }
    }
  }, [isUpdating, isUpdated, isUpdatingError, isUpdatedData]);

  if (getUserIsLoading) {
    return <AdminLoadingActivity />;
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <AdminBreadcrumbs
            links={[
              { name: "Usuarios", href: `${apiHost}/#/usuarios` },
              { name: "Editar", href: `#` },
            ]}
          />
        </div>

        <div className="mb-6">
          <AdminPageHeader title="Editar Usuario" subtitle={userDetail ? userDetail.UserName : ""} icon={faUserShield} />
        </div>

        <div className="mb-6">
          <FButton outline color="dark" size="xs" onClick={_handleBack}>
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Regresar
          </FButton>
        </div>

        <div className="mb-6">
          <form onSubmit={_handleSubmit}>
            <div className="md:grid md:grid-cols-12 md:gap-4">
              <div className="md:col-span-8 md:grid md:grid-cols-12 md:gap-4">
                <div className="md:col-span-4">
                  <Label value="Nombre" />
                  <TextInput {...register("Name")} color={formErrors.Name ? "failure" : "gray"} helperText={formErrors.Name?.message} />
                </div>
                <div className="md:col-span-4">
                  <Label value="Apellidos" />
                  <TextInput {...register("LastName")} color={formErrors.LastName ? "failure" : "gray"} helperText={formErrors.LastName?.message} />
                </div>
                <div className="md:col-span-4">
                  <Label value="Rol" />
                  <Select {...register("RolId")}>
                    <option value="">Seleccione</option>
                    {catRoles &&
                      catRoles.map((item, index) => (
                        <option key={index.toString()} value={item.Id}>
                          {item.Name}
                        </option>
                      ))}
                  </Select>
                </div>
                <div className="md:col-span-6">
                  <Label value="Email" />
                  <TextInput {...register("Email")} type="email" color={formErrors.Email ? "failure" : "gray"} helperText={formErrors.Email?.message} />
                </div>
                <div className="md:col-span-6">
                  <Label value="Teléfono" />
                  <TextInput {...register("PhoneNumber")} color={formErrors.PhoneNumber ? "failure" : "gray"} helperText={formErrors.PhoneNumber?.message} />
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="">
                  <Label value="Notas" />
                  <Textarea rows={8} {...register("Notes")} />
                </div>
              </div>

              {catEmpresas &&
                catEmpresas.length > 0 &&
                catEmpresas
                  .filter((i) => i.Activo)
                  .map((item, index) => {
                    return (
                      <div className="md:col-span-4 flex items-center justify-start gap-2" key={index.toString()}>
                        <Checkbox id={`empresa-${item.Id}`} onChange={_handleCheckboxChange} value={item.Id} checked={empresas.find((i) => i === item.Id) ? true : false} />
                        <Label htmlFor={`empresa-${item.Id}`}>{item.Nombre}</Label>
                      </div>
                    );
                  })}
            </div>

            <div className="mt-4">
              <FButton type="submit">Guardar</FButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
