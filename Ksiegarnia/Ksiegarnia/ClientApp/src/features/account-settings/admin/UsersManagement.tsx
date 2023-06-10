import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import React from "react";
import UserService from "../../../services/UserService";
import UserDTO from "../../../models/api/userDTO";
import { Search } from "@mui/icons-material";
import { GridColDef, DataGrid, GridRowParams, plPL } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AccountSettings from "../../../pages/AccountSettings";

const columns: GridColDef[] = [
  {
    field: "nick",
    headerName: "Nick",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "firstName",
    headerName: "Imię",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "lastName",
    headerName: "Nazwisko",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "email",
    headerName: "E-mail",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

const UsersManagement = () => {
  const [users, setUsers] = React.useState<UserDTO[]>([]);
  const [phrase, setPhrase] = React.useState<string>("");

  const navigate = useNavigate();

  const handleSearch = () => {
    UserService.search(phrase).then((response) => {
      setUsers(response.data);
    });
  };

  return (
    <AccountSettings title="Dane Użytkowników">
      <Grid item container justifyContent="center" marginTop={-1}>
        <Grid item xs={12} lg={10} container rowGap={3}>
          <TextField
            fullWidth
            placeholder="Wpisz nick autora (min. 3 znaki)"
            value={phrase}
            onChange={(event: any) => setPhrase(event.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              ),
            }}
          />
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableColumnMenu
              pageSizeOptions={[5]}
              localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
              onRowClick={(params: GridRowParams) => {
                navigate(params.row.id);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </AccountSettings>
  );
};

export default UsersManagement;
