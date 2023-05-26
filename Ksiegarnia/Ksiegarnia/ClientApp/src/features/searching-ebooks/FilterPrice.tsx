import { Grid, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterPrice = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

  const [searchParams, setSearchParams] = useSearchParams()

  const handleChange = (event: Event, newValue: number | number[]) => {
    const newPriceRange: number[] = newValue as number[]
    setPriceRange(newPriceRange);
    searchParams.set("minPrice", newPriceRange[0].toString())
    searchParams.set("maxPrice", newPriceRange[1].toString())
    setSearchParams(searchParams)
  };

  return (
    <Grid item container rowGap={1} marginTop={2}>
      <Typography variant="h6">Cena</Typography>
      <Slider
        color="secondary"
        getAriaLabel={() => "Filtrowanie ceny"}
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        max={100}
        disableSwap
        style={{marginLeft: 10, marginRight: 10}}
      />
      <Typography variant="h6" width="100%" textAlign="center">Od {priceRange[0]} zł do {priceRange[1]} zł</Typography>
    </Grid>
  );
};

export default FilterPrice;
