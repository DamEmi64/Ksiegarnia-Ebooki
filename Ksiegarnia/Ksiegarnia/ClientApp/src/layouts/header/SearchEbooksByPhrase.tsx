﻿import { Search } from "@mui/icons-material";
import { TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchEbooksByPhrase = () => {

  const [searchParams] = useSearchParams()
  const queryParamSearchPhrase = searchParams.get("phrase")
  
  const [ebooksSearchPhrase, setEbooksSearchPhrase] = useState<string>(queryParamSearchPhrase ? queryParamSearchPhrase : "")

  const navigate = useNavigate()
  
  return (
    <TextField
      className="inputRounded"
      placeholder="Wpisz zagadnienie, tytuł lub autora"
      fullWidth
      onChange={(event: any) => setEbooksSearchPhrase(event.target.value)}
      value={ebooksSearchPhrase}
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => navigate(`/ebooks${ebooksSearchPhrase ? `?phrase=${ebooksSearchPhrase}` : ""}`)}>
            <Search />
          </IconButton>
        ),
      }}
    />
  );
};

export default SearchEbooksByPhrase;
