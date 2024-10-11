"use client";

import { CustomForm, Field } from "@/components/CustmoForm";
import CustomActionsButtons from "@/components/CustomActionsButtons";
import CustomDataGrid from "@/components/CustomDataGrid";
import CustomModal from "@/components/CustomModal";
import { Session } from "@/interfaces/auth/auth.interface";
import { ButtonProps } from "@/interfaces/components/customActionsButtons.interface";
import { Row } from "@/interfaces/components/customDataGrid.interface";
import { Project } from "@/interfaces/project/project.interface";
import { User } from "@/interfaces/user/user.interface";
import { projectService } from "@/services/project.service";
import { userService } from "@/services/user.service";
import { Create, Delete } from "@mui/icons-material";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

type FormData = {
  name: string;
  description: string;
  initial_date: Dayjs | null;
  final_date: Dayjs | null;
  userId: number;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "name", headerName: "Nombre", width: 180 },
  { field: "description", headerName: "Descripcion", width: 280 },
  {
    field: "initial_date",
    headerName: "Fecha de inicio",
    width: 160,
  },
  {
    field: "final_date",
    headerName: "Fecha de finalizacion",
    width: 160,
  },
  { field: "user", headerName: "Usuario asignado", width: 160 },
];

const AdminProjectList = () => {
  const { data: session } = useSession() as unknown as Session;
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isOpenModalProject, setIsOpenModalProject] = useState(false);
  const [usersOptions, setUsersOptions] = useState([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    initial_date: null,
    final_date: null,
    userId: 0,
  });
  const token = session?.user?.token;

  const handleGetProject = async () => {
    if (!token) return;
    const response = await projectService.getProjects(token);
    if (response) {
      const formattedProjects = response?.data?.map((project: Project) => ({
        ...project,
        user: project.user?.name || "",
      })) || [];
      setRows(formattedProjects);
    }
  };

  const handleGeyUsersByRole = async () => {
    if (!token) return;
    const response = await userService.getUsersByRole("usuario", token);
    if (response) {
      const formattedUsers = response.data.map((user: User) => ({
        value: user.id,
        label: user.name,
      }));
      setUsersOptions(formattedUsers);
    }
  };

  const handleChangeIsOpenModalProject = () => {
    setIsOpenModalProject(true);
    handleGeyUsersByRole();
  };

  const handleCloseModalProject = () => {
    setIsOpenModalProject(false);
  };

  const handleSubmitCreateProject = async () => {
    if (!token) return;

    if (
      !formData.name ||
      !formData.description ||
      !formData.initial_date ||
      !formData.final_date ||
      formData.userId === 0
    ) {
      toastAlert("Todos los campos son requeridos", "error");
      return;
    }

    const response = await projectService.createProject(
      {
        name: formData.name,
        description: formData.description,
        initial_date: formData.initial_date?.format("YYYY-MM-DD") as string,
        final_date: formData.final_date?.format("YYYY-MM-DD") as string,
        userId: formData.userId,
      },
      token
    );
    if (response) {
      setFormData({
        name: "",
        description: "",
        initial_date: null,
        final_date: null,
        userId: 0,
      });
      handleGetProject();
      handleCloseModalProject();
      return toastAlert("Proyecto creado correctamente", "success");
    }
    return toastAlert("No se pudo crear el proyecto", "error");
  };

  const handleDeleteProject = async () => {
    if (!token) return;
    const response = await projectService.deleteProject(selectedRows[0], token);
    if (response) {
      handleGetProject();
      return toastAlert("Proyecto eliminado correctamente", "success");
    }

    return toastAlert("No se pudo eliminar el proyecto", "error");
  };

  const toastAlert = (text: string, type: "success" | "error") => {
    enqueueSnackbar(text, {
      variant: type,
      autoHideDuration: 3000,
    });
  };

  const actionsButtons: ButtonProps[] = [
    {
      color: "primary",
      startIcon: <Create />,
      buttonText: "Crear Proyecto",
      onClick: handleChangeIsOpenModalProject,
      variant: "contained",
    },
    {
      color: "error",
      startIcon: <Delete />,
      buttonText: "Eliminar Proyecto",
      onClick: handleDeleteProject,
      variant: "contained",
    },
  ];

  const fields = [
    {
      label: "Nombre",
      type: "text",
      required: true,
      value: formData.name,
      setValue: (value: string) => setFormData({ ...formData, name: value }),
    },
    {
      label: "Descripcion",
      type: "text",
      required: true,
      value: formData.description,
      setValue: (value: string) =>
        setFormData({ ...formData, description: value }),
    },
    {
      label: "Fecha de inicio",
      type: "date",
      required: true,
      minDate: dayjs(new Date()),
      value: formData.initial_date,
      setValue: (value: Dayjs) =>
        setFormData({ ...formData, initial_date: value }),
    },
    {
      label: "Fecha de finalizacion",
      type: "date",
      minDate: formData.initial_date || undefined,
      disabled: !formData.initial_date,
      required: true,
      value: formData.final_date,
      setValue: (value: Dayjs) =>
        setFormData({ ...formData, final_date: value }),
    },
    {
      label: "Usuario asignado",
      type: "select",
      required: true,
      value: formData.userId,
      setValue: (value: number) => setFormData({ ...formData, userId: value }),
      options: usersOptions,
    },
  ];

  useEffect(() => {
    if (token) handleGetProject();
  }, [token]);

  return (
    <main className="h-full flex items-center justify-center">
      <div>
        <Box 
          component="div"
          sx={
            {
              display: "flex",
              justifyContent: "end",
              marginBottom: 2
            }
          }
        >
          <CustomActionsButtons
            buttons={actionsButtons}
            spacing={2}
            direction="row"
            height={40}
          />
        </Box>
        <CustomDataGrid
          columns={columns}
          rows={rows}
          onSelectionChange={setSelectedRows}
          selectType="single"
          width={1030}
        />
      </div>

      <CustomModal
        isOpen={isOpenModalProject}
        onClose={handleCloseModalProject}
        width="400px"
        height="570px"
      >
        <CustomForm
          fields={fields as Field[]}
          title="Crear Proyecto"
          textButton="Crear"
          handleClose={handleCloseModalProject}
          handleSubmitCreateCustom={handleSubmitCreateProject}

        />
      </CustomModal>
    </main>
  );
};

export default AdminProjectList;
