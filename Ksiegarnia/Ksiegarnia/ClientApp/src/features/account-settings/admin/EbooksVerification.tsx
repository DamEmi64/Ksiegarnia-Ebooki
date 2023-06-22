import { Grid, TextField, IconButton, Box, Typography } from "@mui/material";
import { GridColDef, DataGrid, GridRowParams, plPL, GridPaginationModel } from "@mui/x-data-grid";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserDTO from "../../../models/api/userDTO";
import AccountSettings from "../../../pages/AccountSettings";
import UserService from "../../../services/UserService";
import { Search } from "@mui/icons-material";
import Ebook from "../../../models/api/ebook";
import EbookService from "../../../services/EbookService";
import { EbookSortOptions } from "../../../models/ebookSortOptions";
import PagedResponse from "../../../models/api/pagedResponse";
import { EbookAcceptance } from "../../../models/api/ebookAcceptance";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Tytuł",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "genre",
    headerName: "Kategoria",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <>{params.value.name}</>
    ),
  },
  {
    field: "author",
    headerName: "Autor",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => (
      <>{params.value.nick}</>
    ),
  },
];

const EbooksVerification = () => {
  const [ebooks, setEbooks] = React.useState<Ebook[]>([]);

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 5
  })

  const [numberOfEbooks, setNumberOfEbooks] = React.useState<number>(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    handleSearch()
  }, [paginationModel.page])

  const handleSearch = () => {
    EbookService.search({
      ebookSearchCriteria: {
        verificationType: EbookAcceptance.Verifing
      },
      sort: EbookSortOptions.DescByDate,
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    }).then((response) => {
      const pagedResponse: PagedResponse = response.data
      setNumberOfEbooks(pagedResponse.all)
      setEbooks(pagedResponse.result);
    });
  };

  return (
    <AccountSettings title="Weryfikacja ebooków">
      <Grid item container justifyContent="center" marginTop={-1}>
        <Grid item xs={12} lg={10} container>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={ebooks}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: paginationModel
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableColumnMenu
              pageSizeOptions={[paginationModel.pageSize]}
              paginationModel={paginationModel}
              paginationMode="server"
              rowCount={numberOfEbooks}
              onPaginationModelChange={setPaginationModel}
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

export default EbooksVerification;
