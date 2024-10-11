import { CustomDataGridProps } from "@/interfaces/components/customDataGrid.interface";
import { Paper } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";



const CustomDataGrid = ({
  rows,
  columns,
  pageSizeOptions = [5, 10, 20, 30],
  height = 480,
  width = 950,	
  onSelectionChange,
  selectType,
}: CustomDataGridProps) => {
  return (
    <Paper sx={{ height, width }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: pageSizeOptions[0] } },
        }} 
        pagination
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={selectType === "multiple"}
        disableMultipleRowSelection={selectType === "single"}
        onRowSelectionModelChange={
          (newSelection) => onSelectionChange?.(newSelection as number[])
        }
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default CustomDataGrid;
