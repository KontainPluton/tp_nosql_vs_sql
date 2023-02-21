let switchDatabse = document.getElementById("switch-database");
let databaseLabel = document.getElementById("database-label");
let dropdownTable = document.getElementById("dropdown-table");
let dropDownTableTitle = document.getElementById("dropdown-table-title");
let dropdownBatch = document.getElementById("dropdown-batch");
let dropdownBatchTitle = document.getElementById("dropdown-batch-title");
let inputNumberInsert = document.getElementById("input-number-insert");
let responseInput = document.getElementById("response-time");
let buttonSend = document.getElementById("button-send");
let buttonPurge = document.getElementById("button-purge");

let table = "";
let insertQuantity = 0;
let batchQuantity = 1;

// init switch database
fetch('http://localhost:3000/api/database', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(async (response) => await response.json())
    .then((data) => {
        if (data.database === "neo4j") {
            switchDatabse.checked = true;
            databaseLabel.textContent = "neo4j";
        }
        else {
            switchDatabse.checked = false;
            databaseLabel.textContent = "postgres";
        }
});

switchDatabse.addEventListener("change", function(event) {
    let database;
    if (event.target.checked) {
        database = "neo4j";
    }
    else {
        database = "postgres";
    }

    fetch('http://localhost:3000/api/database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            database: database
        })
    })
        .then(async (response) => {
            console.log(await response.text());
            databaseLabel.textContent = database;
        })
        .catch((error) => {
            console.error(error);
            databaseLabel.textContent = "Erreur";
        });
});

dropdownTable.addEventListener("click", function(event) {
    table = event.target.id.split("-")[2];
    dropDownTableTitle.textContent = table.charAt(0).toUpperCase() + table.slice(1);;
});

dropdownBatch.addEventListener("click", function(event) {
    batchQuantity = parseInt(event.target.id.split("-")[2]);
    dropdownBatchTitle.textContent = batchQuantity;
});

buttonSend.addEventListener("click", function(event) {
   console.log("button-send clicked");
   if (table === "") {
       alert("Please select a table");
       return;
   }

   insertQuantity = parseInt(inputNumberInsert.value);
   if (insertQuantity < 0) {
       alert("Please enter a valid quantity to insert");
       return;
   }

   fetch('http://localhost:3000/api/generate', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
           table: table,
           insertQuantity: insertQuantity,
           batchQuantity: batchQuantity
       })
   })
       .then((response) => response.json()
           .then((data) => {
               responseInput.textContent = data.time;
           }));
});

buttonPurge.addEventListener("click", function(event) {
    if (table === "") {
        alert("Please select a table");
        return;
    }

    fetch('http://localhost:3000/api/generate', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            table: table
        })
    })
        .then((response) => response.json()
            .then((data) => {
                responseInput.textContent = "Purge : " + data.response;
            }));
});