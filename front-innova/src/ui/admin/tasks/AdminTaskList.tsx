"use client";
import { CustomForm, Field } from "@/components/CustmoForm";
import CustomActionsButtons from "@/components/CustomActionsButtons";
import CustomDataGrid from "@/components/CustomDataGrid";
import CustomModal from "@/components/CustomModal";
import { Session } from "@/interfaces/auth/auth.interface";
import { ButtonProps } from "@/interfaces/components/customActionsButtons.interface";
import { Row } from "@/interfaces/components/customDataGrid.interface";
import { Project } from "@/interfaces/project/project.interface";
import { Task } from "@/interfaces/task/task.interface";
import { User } from "@/interfaces/user/user.interface";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";
import { userService } from "@/services/user.service";
import { Create, Delete } from "@mui/icons-material";
import { Box, MenuItem, Select } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "name", headerName: "Nombre", width: 180 },
  { field: "description", headerName: "Descripcion", width: 280 },
  {
    field: "status",
    headerName: "Estado",
    width: 160,
    renderCell: (params) => (
      <Box
        sx={{
          backgroundColor:
            params.value === "Pendiente"
              ? "#f87171"
              : params.value === "Completada"
              ? "#4ade80"
              : "#facc15",
          color: "#000",
          textAlign: "center",
          width: "100%",
          borderRadius: "4px",
          padding: "4px",
        }}
      >
        {params.value}
      </Box>
    ),
  },
  { field: "user", headerName: "Usuario asignado", width: 140 },
  { field: "project", headerName: "Proyecto", width: 140 },
];


const AdminTaskList = () => {
  const { data: session } = useSession() as unknown as Session;
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({
    name: "",
    description: "",
    status: "",
    userId: 0,
    projectId: 0,
  });
  const [userOptions, setUserOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const token = session?.user?.token;

  const handleGetTasks = async () => {
    if (!token) return;
    const response = await taskService.getTasks(token);
    if (response) {
      const formattedTasks =
        response?.data?.map((task: Task) => ({
          ...task,
          project: task.project?.name || "",
          user: task.user?.name || "",
        })) || [];
      setRows(formattedTasks);

      handleToast("Tareas cargadas correctamente", "success");
      return;
    }
    handleToast("Error al cargar las tareas", "error");
  };

  const handleGetUsers = async () => {
    if (!token) return;
    const response = await userService.getUsersByRole("usuario", token);
    if (response) {
      setUserOptions(
        response?.data?.map((user: User) => ({
          value: user.id,
          label: user.name,
        })) || []
      );
      return handleToast("Usuarios cargados correctamente", "success");
    }
    return handleToast("Error al cargar los usuarios", "error");
  };

  const handleGetProjects = async () => {
    if (!token) return;
    const response = await projectService.getProjects(token);
    if (response) {
      setProjectOptions(
        response?.data?.map((project: Project) => ({
          value: project.id,
          label: project.name,
        })) || []
      );
      return handleToast("Proyectos cargados correctamente", "success");
    }
    return handleToast("Error al cargar los proyectos", "error");
  };

  const handleUpdateTasks = async (id: number, newStatus: string) => {
    if (!token) return;
    const response = await taskService.updateTask(
      {
        id,
        status: newStatus,
      },
      token
    );
    if (response) {
      handleToast("Estado actualizado correctamente", "success");
      return handleGetTasks();
    }
    return handleToast("Error al actualizar el estado", "error");
  };

  const handleDeleteTasks = async () => {
    if (selectedRows.length === 0 || !token) return;
    await taskService.DeleteVariousTasks(selectedRows, token);
    handleToast("Tareas eliminadas correctamente", "success");
    handleGetTasks();
    setSelectedRows([]);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    handleGetUsers();
    handleGetProjects();
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleSubmitCreateTask = async () => {
    if (!token) return;
    const response = await taskService.createTask(formData as Task, token);
    if (response) {
      handleGetTasks();
      handleCloseModal();
      setFormData({});
      return handleToast("Tarea creada correctamente", "success");
    }
    return handleToast("Error al crear la tarea", "error");
  };

  const handleToast = (message: string, type: "success" | "error") => {
    enqueueSnackbar(message, { variant: type, autoHideDuration: 3000 });
  };

  useEffect(() => {
    if (token) {
      handleGetTasks();
    }
  }, [token]);

  const actionsButtons: ButtonProps[] = [
    {
      startIcon: <Create />,
      color: "success",
      variant: "contained",
      onClick: handleOpenModal,
      buttonText: "Crear Tarea",
    },
    {
      startIcon: <Delete />,
      color: "error",
      variant: "contained",
      onClick: handleDeleteTasks,
      buttonText: "Eliminar",
    },
  ];

  const fields = [
    {
      label: "Nombre",
      type: "text",
      required: true,
      value: formData.name || "",
      setValue: (value: string) => {
        setFormData({ ...formData, name: value });
      },
    },
    {
      label: "Descripcion",
      type: "text",
      required: true,
      value: formData.description || "",
      setValue: (value: string) =>
        setFormData({ ...formData, description: value }),
    },
    {
      label: "Estado",
      type: "select",
      value: formData.status || "",
      setValue: (value: string) => setFormData({ ...formData, status: value }),
      options: [
        { value: "", label: "Seleccione un estado" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "En Proceso", label: "En Proceso" },
        { value: "Completada", label: "Completada" },
      ],
      required: true,
    },
    {
      label: "Usuario asignado",
      type: "select",
      value: formData.userId || 0,
      setValue: (value: number) => setFormData({ ...formData, userId: value }),
      options: userOptions,
      required: true,
    },
    {
      label: "Proyecto",
      type: "select",
      options: projectOptions,
      required: true,
      value: formData.projectId || 0,
      setValue: (value: number) =>
        setFormData({ ...formData, projectId: value }),
    },
  ];

  const addStatusSelectToColumns = (
    columns: GridColDef[],
    onStatusChange: (id: number, newStatus: string) => void
  ): GridColDef[] => {
    return columns.map((col) => {
      if (col.field === "status") {
        return {
          ...col,
          renderCell: (params) => (
            <Select
              value={params.value}
              variant="standard"
              className="border-none outline-none ring-0 focus:ring-0 selection:border-none"
              onChange={(e) =>
                onStatusChange(params.row.id, e.target.value as string)
              }
              fullWidth
            >
              <MenuItem
                value="Pendiente"
              >
                Pendiente
              </MenuItem>
              <MenuItem
                value="En Proceso"
              >
                En Proceso
              </MenuItem>
              <MenuItem
                value="Completada"
              >
                Completada
              </MenuItem>
            </Select>
          ),
        };
      }
      return col;
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    handleUpdateTasks(id, newStatus);

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, status: newStatus } : row
      )
    );
  };

  return (
    <main className="h-full overflow-hidden flex items-center justify-center">
      <div>
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "end",
            paddingBlock: "5px",
          }}
        >
          <CustomActionsButtons
            buttons={actionsButtons}
            spacing={2}
            direction="row"
            height={50}
          />
        </Box>
        <CustomDataGrid
          rows={rows}
          columns={addStatusSelectToColumns(columns, handleStatusChange)}
          pageSizeOptions={[5, 10, 15, 25]}
          onSelectionChange={setSelectedRows}
          selectType="single"
          width={1030}
        />
      </div>
      <CustomModal
        height="560px"
        width="440px"
        isOpen={isOpenModal}
        onClose={handleCloseModal}
      >
        <CustomForm
          fields={fields as Field[]}
          title="Crear Tarea"
          textButton="Crear"
          handleClose={handleCloseModal}
          handleSubmitCreateCustom={handleSubmitCreateTask}
        />
      </CustomModal>
    </main>
  );
};

export default AdminTaskList;
