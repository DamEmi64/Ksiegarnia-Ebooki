import {
  Grid,
  IconButton,
  Pagination,
  Stack,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
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
import { UserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";
import React from "react";
import PagedResponse from "../../models/api/pagedResponse";

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
          age: 18
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
          age: 18
        },
        picture: "string",
        prize: 0,
      },
    ],
  },
];

const TransactionsHistory = () => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    handleSearchTransactions();
    EbookService.search({}, undefined, 1, 10)
    .then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
    });
  }, [page]);

  if (!userId) {
    return <Loading />;
  }

  const handleSearchTransactions = () => {
    TransactionService.getUserTransactions(userId, userId, page, pageSize)
    .then((response) => {
      const data: PagedResponse = response.data;
      const newTransactions: Transaction[] = data.result;
      setTransactions(newTransactions);
      setNumberOfPages(data.number_of_pages);
    });
  };

  const CustomPagination = () => {
    return (
      <Stack alignItems="center">
        <Pagination
          page={page}
          count={numberOfPages}
          onChange={(event: any, newPage: number) => setPage(newPage)}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Stack>
    );
  };

  return (
    <Grid item marginTop={-2} container direction="column" rowGap={8}>
      {mockedTransactions.length > 0 ? (
        <React.Fragment>
          {numberOfPages > 1 && <CustomPagination />}
          <Grid item container direction="column" rowGap={6}>
            {mockedTransactions.map((transaction: Transaction, index: number) => (
              <TransactionRow
                key={transaction.id}
                index={index + 1}
                transaction={transaction}
                ebooks={ebooks}
              />
            ))}
          </Grid>
          {numberOfPages > 1 && <CustomPagination />}
        </React.Fragment>
      ) : (
        <Typography variant="h5" textAlign="center">
          Brak zamówień
        </Typography>
      )}
      {numberOfPages > 1 && <CustomPagination />}
    </Grid>
  );
};

const TransactionRow = (props: {
  transaction: Transaction;
  ebooks: Ebook[];
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const transaction: Transaction = props.transaction;

  const transactionAmout: number = transaction.books
    .map((ebook: Ebook) => ebook.prize)
    .reduce((a: number, b: number) => a + b, 0)

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
        <Typography variant="h6">Zamówienie nr. {props.index},</Typography>
        <Typography variant="h6">Łączna kwota: {transactionAmout} zł,</Typography>
        <Typography variant="h6">Data: {new Date(transaction.dateTime).toLocaleDateString()},</Typography>
        <Typography variant="h6">
          Liczba ebooków: {transaction.books.length}
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
          <Image
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          container
          direction="column"
          justifyContent="space-between"
        >
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
        <Typography variant="h4" textAlign="center">
          {ebook.prize} zł
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TransactionsHistory;
