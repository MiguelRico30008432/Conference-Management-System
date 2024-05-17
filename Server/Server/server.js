require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("https");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.options("*", cors());
app.use(express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let registeredAdverts = 0;
let currentDate = new Date();

setInterval(() => {
  currentDate = new Date();

  callAPI();
  console.log(`Api called: ${registeredAdverts}`);
}, 3600000);

async function callAPI() {
  const options = {
    method: "GET",
    hostname: "idealista7.p.rapidapi.com",
    port: null,
    path: "/listhomes?order=lowestprice&operation=rent&locationId=0-EU-PT-11-06&maxItems=40&locationName=Lisboa&numPage=1&location=pt&locale=pt&maxPrice=1100&minSize=40&bedrooms0=false&bedrooms1=true&bedrooms2=true&bedrooms3=true&bedrooms4=true&sinceDate=T",
    headers: {
      "X-RapidAPI-Key": "e3e622aea3mshc0d22589918910fp1f84c2jsn24f15ee2adff",
      "X-RapidAPI-Host": "idealista7.p.rapidapi.com",
    },
  };

  const req = await http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      const jsonString = body.toString();
      const jsonObject = JSON.parse(jsonString);
      processData(jsonObject);
    });
  });

  req.end();
}

function processData(data) {
  if (data.elementList.length > registeredAdverts) {
    let emailText =
      "<table border='1'><tr><th>ID da casa</th><th>URL</th><th>Foto</th><th>Tamanho (m2)</th><th>Nº Quartos</th><th>Nº Casas de banho</th><th>Munícipio</th><th>Morada</th><th>Preço</th></tr>";
    for (item of data.elementList) {
      console.log(`url: ${item.url}`);
      console.log(`ID da casa: ${item.propertyCode}`);
      console.log(`Tamanho (m2): ${item.size}`);
      console.log(`Nº Quartos: ${item.rooms}`);
      console.log(`Nº Casas de banho: ${item.bathrooms}`);
      console.log(`Morada: ${item.address}`);
      console.log(`Munícipio: ${item.municipality}`);
      console.log(`Preço: ${item.price}`);
      console.log(" ");
      emailText += `<tr><td>${item.propertyCode}</td><td><a href="${item.url}">Abrir link</a></td><td><img src="${item.thumbnail}" width="200" height="200"></td><td>${item.size}</td><td>${item.rooms}</td><td>${item.bathrooms}</td><td>${item.municipality}</td><td>${item.address}</td><td>${item.price}</td></tr>`;
    }
    emailText += "</table>";

    sendEmail(emailText);
    registeredAdverts = data.elementList.length;
  }
}

function sendEmail(emailText) {
  try {
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAILFROM,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILFROM,
      to: "miguelrr314@gmail.com, martimduarteferreira@hotmail.com",
      subject: `Foram encontradas novas casas no Idealista no dia ${currentDate.toLocaleDateString()}`,
      text: "",
      html: emailText,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("Email error: " + error);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  callAPI();
});
