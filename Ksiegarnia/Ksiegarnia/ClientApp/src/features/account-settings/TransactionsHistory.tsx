import { Grid, IconButton, Pagination, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Transaction from "../../models/api/transaction";
import TransactionService from "../../services/TransactionService";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Ebook from "../../models/api/ebook";
import EbookService from "../../services/EbookService";
import Image from "../../components/Image";
import Rate from "../../components/EbookRate";
import { UserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";
import React from "react";
import PagedResponse from "../../models/api/pagedResponse";
import AccountSettings from "../../pages/AccountSettings";

const TransactionsHistory = () => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    handleSearchTransactions();
  }, [page]);

  if (!userId) {
    return <Loading />;
  }

  const handleSearchTransactions = () => {
    TransactionService.getUserTransactions(userId, page, pageSize)
      .then((response) => {
        const data: PagedResponse = response.data;
        const newTransactions: Transaction[] = data.result;
        setTransactions(newTransactions);
        setNumberOfPages(data.number_of_pages);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
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
    <AccountSettings title="Historia zamówień">
      <Grid item container direction="column" rowGap={8}>
        {transactions.length > 0 ? (
          <React.Fragment>
            {numberOfPages > 1 && <CustomPagination />}
            <Grid item container direction="column" rowGap={6}>
              {transactions.map((transaction: Transaction, index: number) => (
                <TransactionRow
                  key={transaction.id}
                  index={(page - 1) * pageSize + (index + 1)}
                  transaction={transaction}
                  ebooks={transaction.books}
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
      </Grid>
    </AccountSettings>
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
    .reduce((a: number, b: number) => a + b, 0);

  console.log(transaction);

  return (
    <Grid item container direction="column">
      <Grid
        item
        className="transaction-row"
        container
        alignItems="center"
        justifyContent="center"
        padding={4}
        marginTop={-2}
        border="1px solid #0A3F5C"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Grid
          item
          xs={11}
          flexGrow={1}
          container
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography variant="h6">Zamówienie nr. {props.index},</Typography>
          <Typography variant="h6">
            Łączna kwota: {transactionAmout.toFixed(2)} zł,
          </Typography>
          <Typography variant="h6">
            Data: {new Date(transaction.date).toLocaleDateString()},
          </Typography>
          <Typography variant="h6">
            Liczba ebooków: {transaction.books.length}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton style={{ color: "white" }}>
            {!isOpen ? (
              <ArrowDropDown fontSize="large" />
            ) : (
              <ArrowDropUp fontSize="large" />
            )}
          </IconButton>
        </Grid>
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
      paddingBottom={4}
      justifyContent="space-between"
      borderBottom="1px solid silver"
      rowGap={4}
    >
      <Grid item xs={12} md={9} container columnGap={3} rowGap={3}>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          container
          justifyContent="center"
          height="260px"
        >
          <Image
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={8}
          md={5}
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
          {ebook.prize.toFixed(2)} zł
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TransactionsHistory;
