let loaderBox = document.getElementById("loader-box");

let switchDatabse = document.getElementById("switch-database");
let databaseLabel = document.getElementById("database-label");
let dropdownTable = document.getElementById("dropdown-table");
let dropDownTableTitle = document.getElementById("dropdown-table-title");
let dropdownBatch = document.getElementById("dropdown-batch");
let dropdownBatchTitle = document.getElementById("dropdown-batch-title");
let inputNumberInsert = document.getElementById("input-number-insert");
let responseInput = document.getElementById("response-time");
let buttonSend = document.getElementById("button-send");
let buttonCount = document.getElementById("button-count");
let buttonPurge = document.getElementById("button-purge");
let buttonGenerateTpData = document.getElementById("button-generate-tp-data");
let buttonGenerateTestData = document.getElementById("button-generate-test-data");

let table = "";
let insertQuantity = 0;
let batchQuantity = 1;

function toggleLoader() {

    if (loaderBox.style.display === "none") {
        loaderBox.style.display = "block";
    }
    else {
        loaderBox.style.display = "none";
    }
}

toggleLoader();

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

    toggleLoader();
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
            toggleLoader();
            console.log(await response.text());
            databaseLabel.textContent = database;
        })
        .catch((error) => {
            toggleLoader();
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

    toggleLoader();
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
               toggleLoader();
               responseInput.textContent = data.time;
           }));
});

buttonCount.addEventListener("click", function(event) {
    if (table === "") {
        alert("Please select a table");
        return;
    }

    toggleLoader();
    fetch('http://localhost:3000/api/count?table=' + table, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (response) => {
            toggleLoader();
            let data = await response.text();
            responseInput.textContent = "Count : " + data;
        });
});

buttonPurge.addEventListener("click", function(event) {
    if (table === "") {
        alert("Please select a table");
        return;
    }

    toggleLoader();
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
                toggleLoader();
                responseInput.textContent = "Purge : " + data.response;
            }));
});

buttonGenerateTpData.addEventListener("click", function(event) {

    toggleLoader();
    fetch('http://localhost:3000/api/generate/tpData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json()
            .then((data) => {
                toggleLoader();
                let total = 0;
                data.times.forEach((time) => {
                    total += time;
                });
                responseInput.textContent = total + " ms";
            }));
});

buttonGenerateTestData.addEventListener("click", function(event) {
    toggleLoader();
    fetch('http://localhost:3000/api/generate/testData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json()
            .then((data) => {
                toggleLoader();
                responseInput.textContent = data.response;
            }));
});