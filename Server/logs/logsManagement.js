const fs = require("fs");

function addLog(err, origin, functionWhereErrOccurred) {
  // adiciona o log ao ficheiro indicado com a data atual do erro, em que função o erro sucedeu, a mensagem de erro e o ficheiro de onde a função addLog foi chamada
  let destinationFile;

  switch (origin) {
    case "database":
      destinationFile = "./logs/databaseErrLogs.json";
      break;

    case "emails":
      destinationFile = "./logs/emailsErrLogs.json";
      break;

    case "server":
      destinationFile = "./logs/serverErrLogs.json";
      break;

    case "endpoint":
      destinationFile = "./logs/endpointsErrLogs.json";
      break;
  }

  const currentDate = new Date();

  const logObject = {
    originFile: origin + ".js",
    time: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}`,
    function: functionWhereErrOccurred,
    mensagem: err,
  };

  const logJSON = JSON.stringify(logObject);

  // Salva o log no arquivo correspondente
  fs.appendFileSync(destinationFile, logJSON + "\n");
}

module.exports = {
  addLog,
};
