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
import Image from "../../components/Image";
import Rate from "../../components/Rate";

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
  const [ebooks, setEbooks] = useState<Ebook[]>([])

  useEffect(() => {
    TransactionService.getUserTransactions("1").then((response) => {
      //setTransactions(response.data)
    });
    EbookService.search({}, undefined, 0, 6)
    .then((response) => {
      setEbooks(response.data.result)
    })
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
          <TransactionRow key={transaction.id} transaction={transaction} ebooks={ebooks}/>
        ))}
      </Grid>
      <CustomPagination />
    </Grid>
  );
};

const TransactionRow = (props: { transaction: Transaction, ebooks: Ebook[] }) => {
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
          {props.ebooks.map((ebook: Ebook) => (
            <TransactionEbookView key={ebook.id} ebook={ebook} />
          ))}
        </Grid>
      )}
    </Grid>
  );
};

const TransactionEbookView = (props: { ebook: Ebook }) => {
  const ebook = props.ebook;

  return (
    <Grid
      item
      container
      padding={6}
      justifyContent="space-between"
      borderBottom="1px solid silver"
    >
      <Grid item xs={9} container columnGap={4}>
        <Grid item height="260px">
          <Image alt={ebook.title} src={ebook.picture} style={{maxWidth: "100%", width: "auto", height: "100%"}}/>
        </Grid>
        <Grid item xs={8} container direction="column" justifyContent="space-between">
          <Grid item container direction="column" rowGap={1}>
            <Typography variant="h4" fontWeight="bold">
              {ebook.title}
            </Typography>
            <Typography variant="h6">
              {ebook.author.firstName + " " + ebook.author.lastName}
            </Typography>
          </Grid>
          <Grid item container direction="column" rowGap={1}>
            <Typography variant="h6" fontWeight="bold">
              {ebook.genre.name}
            </Typography>
            <Rate value={5} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item alignSelf="end">
        <Typography variant="h4" textAlign="center">{ebook.prize} zł</Typography>
      </Grid>
    </Grid>
  );
};

export default TransactionsHistory;
