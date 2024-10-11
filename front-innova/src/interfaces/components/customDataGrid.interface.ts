import { GridColDef } from "@mui/x-data-grid";

export interface Row {
  [key: string]: string | number;
}

export interface CustomDataGridProps {
  rows: Row[];
  columns: GridColDef[];
  pageSizeOptions?: number[];
  height?: number;
  width?: number;
  onSelectionChange?: (selection: number[]) => void;
  selectType?: "single" | "multiple";
}
