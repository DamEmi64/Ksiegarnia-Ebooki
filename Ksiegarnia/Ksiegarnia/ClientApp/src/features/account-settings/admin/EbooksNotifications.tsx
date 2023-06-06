import { Grid, TextField, IconButton, Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridTreeNodeWithRender,
  plPL,
} from "@mui/x-data-grid";
import React from "react";
import { useNavigate } from "react-router-dom";
import EbookNotification from "../../../models/api/ebookNotification";
import AdminService from "../../../services/AdminService";

const columns: GridColDef[] = [
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "user",
    headerName: "Autor",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <Typography variant="h5">
        {params.value.nick}
      </Typography>
    ),
  },
  {
    field: "creationDate",
    headerName: "Utworzono",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "statusChangeDate",
    headerName: "Aktualizacja",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

const EbooksNotifications = () => {
  const [ebooksNotifications, setEbooksNotifications] = React.useState<
    EbookNotification[]
  >([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    AdminService.getAllNotifications()
    .then((response) => {
        setEbooksNotifications(response.data)
    })
  }, [])

  return (
    <Grid item container justifyContent="center" marginTop={-1}>
      <Grid item xs={12} lg={10} container>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={ebooksNotifications}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
            pageSizeOptions={[10]}
            localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
            onRowClick={(params: GridRowParams) => {
              navigate(params.row.id);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EbooksNotifications;
