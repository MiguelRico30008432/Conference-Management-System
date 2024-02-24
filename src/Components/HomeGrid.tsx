import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import CardEvent from "./Card";

export default function HomeGrid() {
  const [cards, setCards] = useState([]);

  const data = {
    title: "Shrimp and Chorizo Paella",
    date: "September 14, 2016",
    avatarChar: "MR",
    image: "/static/images/cards/paella.jpg",
    imageAlt: "alt image",
    footerText: "Texto no fundo",
    hiddentTextTitle: "Título",
    hiddenText1: "Eu sou um texto escondido1",
    hiddenText2: "Eu sou um texto escondido2",
    hiddenText3: "Eu sou um texto escondido3",
  };

  function addCard() {
    const newCard = [...cards, []];
    setCards(newCard);
  }

  function renderCards() {
    return cards.map((card, index) => (
      <Grow key={index} in={true} timeout={100}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardContent>
              <CardEvent data={data} />
            </CardContent>
          </Card>
        </Grid>
      </Grow>
    ));
  }

  return (
    <>
      <Button onClick={addCard} variant="contained" color="primary">
        Adicionar Card
      </Button>

      <Grid container spacing={2}>
        {renderCards()}
      </Grid>
    </>
  );
}
