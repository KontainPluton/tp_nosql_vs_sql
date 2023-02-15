let dropdownTable = document.getElementById("dropdown-table");
let dropdownBatch = document.getElementById("dropdown-batch");
let inputNumberInsert = document.getElementById("input-number-insert");
let responseInput = document.getElementById("response-time");
let buttonSend = document.getElementById("button-send");
let buttonPurge = document.getElementById("button-purge");

let table = "";
let insertQuantity = 0;
let batchQuantity = 1;

dropdownTable.addEventListener("click", function(event) {
    console.log("dropdown-table clicked");
    console.log(event.target);
    table = event.target.id.split("-")[2];
});

dropdownBatch.addEventListener("click", function(event) {
    console.log("dropdown-batch clicked");
    console.log(event.target);
    batchQuantity = parseInt(event.target.id.split("-")[2]);
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