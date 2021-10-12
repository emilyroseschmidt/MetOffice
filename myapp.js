const { request } = require("express");
const express = require("express");
const got = require("got");

const app = express();
const port = 3000;

app.get("/forecast/:location", (req, res) => {
  got
    .get(
      "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=819423df-a8c7-444c-86b2-823250d59464"
    )
    .json()

    .then((metOfficeResponse) => {
      const listLocations = metOfficeResponse.Locations.Location;

      //create a function that returns only the value i (name of city) when city = city input from url

      let locationID = "";
      for (let i = 0; i < listLocations.length; i++) {
        if (
          req.params.location.toLowerCase() ===
          listLocations[i].name.toLowerCase()
        )
          locationID = listLocations[i].id;
      }

      return got
        .get(
          "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/" +
            locationID +
            "?res=3hourly&key=819423df-a8c7-444c-86b2-823250d59464"
        )
        .json();
    })

    .then((resultsOfQuery) => {
      const forecastDetails =
        resultsOfQuery.SiteRep.DV.Location.Period[0].Rep[0];
      const forecastFinal = {
        feelsLike: forecastDetails.F,
        windGust: forecastDetails.G,
      };

      res.send(forecastFinal);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
