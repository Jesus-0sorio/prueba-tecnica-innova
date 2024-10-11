"use client";
import CustomActionsButtons from "@/components/CustomActionsButtons";
import CustomDataGrid from "@/components/CustomDataGrid";
import CustomSelect from "@/components/CustomSelect";
import { Session } from "@/interfaces/auth/auth.interface";
import { ButtonProps } from "@/interfaces/components/customActionsButtons.interface";
import { Row } from "@/interfaces/components/customDataGrid.interface";
import { Task } from "@/interfaces/task/task.interface";
import { taskService } from "@/services/task.service";
import { Delete, Update } from "@mui/icons-material";
import { Box, MenuItem, Select } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const statusClasses = {
  Pendiente: "bg-red-500 text-white text-center",
  Completada: "bg-green-500 text-white text-center",
  "En Proceso": "bg-yellow-500 text-white text-center",
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "name", headerName: "Nombre", width: 180 },
  { field: "description", headerName: "Descripcion", width: 280 },
  {
    field: "status",
    headerName: "Estado",
    width: 160,
    cellClassName: (params) => {
      const value = params.value as string;
      return statusClasses[value as keyof typeof statusClasses] || "";
    },
  },
  { field: "project", headerName: "Proyecto", width: 190 },
];

const optionsSelect = [
  { value: "", label: "Todos" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "En Proceso", label: "En Proceso" },
  { value: "Completada", label: "Completada" },
];

const UserTaskList = () => {
  const { data: session } = useSession() as unknown as Session;
  const [rows, setRows] = useState<Row[]>([]);
  const [statusSelect, setStatusSelect] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const token = session?.user?.token;

  const handleGetTasks = async () => {
    if (!token) return;
    const response = await taskService.getMyTasks({ token });
    if (response) {
      const formattedTasks = response.data.map((task: Task) => ({
        ...task,
        project: task.project?.name || "",
      }));
      setRows(formattedTasks);
      handleToast("Tareas cargadas correctamente", "success");
      return;
    }
    handleToast("Error al cargar las tareas", "error");
  };

  const handleUpdateTasks = async () => {
    if (!statusSelect || selectedRows.length === 0 || !token) return;

    const updatedTasks = selectedRows
      .map((id) => {
        const task = rows.find((row) => row.id === id);
        if (!task) return null;
        return { ...task, status: statusSelect } as Task;
      })
      .filter((task): task is Task => task !== null);

    const response = await taskService.updateVariousTasks(updatedTasks, token);
    handleToast(
      response ? "Estado actualizado correctamente" : "Error al actualizar",
      response ? "success" : "error"
    );
    if (response) handleGetTasks();
  };

  const handleUpdateTask = async (id: number, newStatus: string) => {
    if (!token) return;
    const response = await taskService.updateTask(
      { id, status: newStatus },
      token
    );

    handleToast(
      response ? "Estado actualizado correctamente" : "Error al actualizar",
      response ? "success" : "error"
    );

    if (response) handleGetTasks();
  };

  const handleDeleteTasks = async () => {
    if (selectedRows.length === 0 || !token) return;
    await taskService.DeleteVariousTasks(selectedRows, token);
    handleGetTasks();
    setSelectedRows([]);
    handleToast("Tareas eliminadas correctamente", "success");
  };

  const actionsButtons: ButtonProps[] = [
    {
      startIcon: <Update />,
      color: "primary",
      variant: "contained",
      onClick: handleUpdateTasks,
      buttonText: "Actualizar Estado",
    },
    {
      startIcon: <Delete />,
      color: "error",
      variant: "contained",
      onClick: handleDeleteTasks,
      buttonText: "Eliminar",
    },
  ];

  useEffect(() => {
    if (token) handleGetTasks();
  }, [token]);

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
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En Proceso">En Proceso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
            </Select>
          ),
        };
      }
      return col;
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    handleUpdateTask(id, newStatus);

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, status: newStatus } : row
      )
    );
  };
  const handleToast = (message: string, type: "success" | "error") => {
    enqueueSnackbar(message, { variant: type, autoHideDuration: 3000 });
  };

  return (
    <main className="h-full flex items-center justify-center">
      <div>
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <CustomSelect
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.target.value)}
            options={optionsSelect}
            variant="standard"
            label="Seleccione el nuevo estado"
            styles={{
              width: "250px",
            }}
          />
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
          selectType="multiple"
        />
      </div>
    </main>
  );
};

export default UserTaskList;
