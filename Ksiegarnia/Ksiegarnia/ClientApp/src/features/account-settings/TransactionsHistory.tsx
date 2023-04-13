import {
  Grid,
  IconButton,
  Pagination,
  Stack,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Transaction from "../../models/api/transaction";
import TransactionService from "../../services/TransactionService";
import {
  ArrowDropDown,
  ArrowDropUp,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import Ebook from "../../models/api/ebook";
import EbookService from "../../services/EbookService";

const mockedTransactions: Transaction[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    dateTime: "2023-04-13T20:49:54.898Z",
    books: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string",
        },
        description: "string",
        pageNumber: 0,
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string",
        },
        picture: "string",
        prize: 0,
      },
    ],
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    dateTime: "2023-04-13T20:49:54.898Z",
    books: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string",
        },
        description: "string",
        pageNumber: 0,
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string",
        },
        picture: "string",
        prize: 0,
      },
    ],
  },
];

const TransactionsHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    TransactionService.getUserTransactions("1")
    .then((response) => {
      //setTransactions(response.data)
    });
  }, []);

  const CustomPagination = () => {
    return (
      <Stack alignItems="center">
        <Pagination count={10} color="primary" shape="rounded" size="large" />
      </Stack>
    );
  };

  return (
    <Grid item marginTop={-2} container direction="column" rowGap={8}>
      <CustomPagination />
      <Grid item container direction="column" rowGap={6}>
        {mockedTransactions.map((transaction: Transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </Grid>
      <CustomPagination />
    </Grid>
  );
};

const TransactionRow = (props: { transaction: Transaction }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const transaction: Transaction = props.transaction;

  return (
    <Grid item container direction="column">
      <Grid
        item
        className="transaction-row"
        container
        justifyContent="space-evenly"
        alignItems="center"
        padding={4}
        marginTop={-2}
        border="1px solid #0A3F5C"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Typography variant="h6">Zamówienie nr. {transaction.id},</Typography>
        <Typography variant="h6">kwota: 30 zł,</Typography>
        <Typography variant="h6">data: {transaction.dateTime},</Typography>
        <Typography variant="h6">
          liczba ebooków: {transaction.books.length}
        </Typography>
        <IconButton style={{ color: "white" }}>
          {!isOpen ? (
            <ArrowDropDown fontSize="large" />
          ) : (
            <ArrowDropUp fontSize="large" />
          )}
        </IconButton>
      </Grid>
      {isOpen && (
        <Grid
          item
          container
          direction="column"
          border="1px solid #0A3F5C"
          borderTop={0}
        >
          {transaction.books.map((ebook: Ebook) => (
            <TransactionEbookView key={ebook.id} ebook={ebook} />
          ))}
        </Grid>
      )}
    </Grid>
  );
};

const TransactionEbookView = (props: { ebook: Ebook }) => {
  return (
    <Typography
      variant="h6"
      marginLeft={2}
      padding={6}
      borderBottom="1px solid silver"
    >
      {props.ebook.title}
    </Typography>
  );
};

export default TransactionsHistory;
