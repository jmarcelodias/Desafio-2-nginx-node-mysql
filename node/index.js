const express = require("express");
const app = express();
const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const mysql = require("mysql");

app.get("/", (req, res) => {
  IncluirPessoas(res);
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});

async function IncluirPessoas(res) {
  const connection = mysql.createConnection(config);
  connection.connect((error) => {
    if (error) {
      console.log(`Erro ao conectar no banco: ${error}`);
      res.status(500).send("Erro ao conectar no banco.");
      return;
    }

    console.log("Conectado no banco com sucesso!");
  });

  const namesToInsert = [
    { name: 'Joao Marcelo Dias' },
    { name: 'Julia Dias' },
    { name: 'Ana Saad' },
  ];

  const SQLQUERY = `INSERT INTO people(name) values ?`;

  connection.query(SQLQUERY, [namesToInsert.map(item => [item.name])], (error, _results) => {
    if (error) {
      console.log(`Erro ao incluir pessoa: ${error}`);
      res.status(500).send("Erro ao incluir pessoa.");
      return;
    }

    console.log(`Pessoa incluida com sucesso!`);
    getAll(res, connection);
  });
}

function getAll(res, connection) {
  const SQLQUERY = `SELECT * FROM people`;
  connection.query(SQLQUERY, (error, _results, _fields) => {
    if (error) {
      console.log(`Erro ao buscar pessoas: ${error}`);
      res.status(500).send("Erro ao buscar pessoas.");
      return;
    }

    let names = _results.map((result) => result.id + " - " + result.name).join(",<Br/>");
    res.send(`<h1>Full Cycle Rocks!</h1><br/><p>Names:<br/>${names}</p>`);

  });

  connection.end();
}
