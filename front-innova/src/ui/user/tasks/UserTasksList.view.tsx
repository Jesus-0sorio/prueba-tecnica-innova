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
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
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
    }
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
    if (response) handleGetTasks();
  };

  const handleDeleteTasks = async () => {
    if (selectedRows.length === 0 || !token) return;
    await taskService.DeleteVariousTasks(selectedRows, token);
    handleGetTasks();
    setSelectedRows([]);
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
            label="Estado"
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
          columns={columns}
          pageSizeOptions={[5, 10, 15, 25]}
          onSelectionChange={setSelectedRows}
          selectType="multiple"
        />
      </div>
    </main>
  );
};

export default UserTaskList;
