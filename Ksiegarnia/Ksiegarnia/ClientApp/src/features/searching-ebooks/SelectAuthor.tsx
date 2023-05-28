import { Close, Search } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserService from "../../services/UserService";

interface BasicUserData {
  firstName: string;
  lastName: string;
  nick: string;
}

const SelectAuthor = () => {
  const [authors, setAuthors] = useState<BasicUserData[]>([]);

  const [authorPhrase, setAuthorPhrase] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (authorPhrase.length < 3) {
      return;
    }

    UserService.search(authorPhrase)
    .then((response) => {
      setAuthors(response.data);
    });
  }, [authorPhrase]);

  const handleSelectAuthor = (value: string) => {
    const newAuthorPhrase: string = value;

    if (!newAuthorPhrase) {
      if (searchParams.get("phrase")) {
        searchParams.delete("phrase");
      }
    } else {
      searchParams.set("phrase", newAuthorPhrase);
    }

    setAuthorPhrase(newAuthorPhrase);

    setSearchParams(searchParams);
  };

  return (
    <Grid item>
      <Typography variant="h6" marginBottom={1}>
        Autor
      </Typography>
      <TextField
        placeholder="Min. 3 znaki"
        value={authorPhrase}
        onChange={(event: any) => setAuthorPhrase(event.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <React.Fragment>
              {authorPhrase.length > 1 ? (
                <IconButton onClick={() => handleSelectAuthor("")}>
                  <Close />
                </IconButton>
              ) : (
                <IconButton>
                  <Search />
                </IconButton>
              )}
            </React.Fragment>
          ),
        }}
      />
      <List style={{ maxHeight: 120, overflow: "auto" }}>
        {authors.map((author: BasicUserData, index: number) => (
          <ListItem
            key={index}
            className="pointer hover-red"
            onClick={() => handleSelectAuthor(author.nick)}
          >
            {author.firstName} {author.lastName}
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default SelectAuthor;
