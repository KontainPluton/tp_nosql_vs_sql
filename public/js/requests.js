let switchDatabse = document.getElementById("switch-database");
let databaseLabel = document.getElementById("database-label");

let textareaJson = document.getElementById("textarea-json");
let responseInput = document.getElementById("response-time");

let depthRequest1 = document.getElementById("input-depht-request-1");
let usernameRequest1 = document.getElementById("input-username-request-1");
let buttonRequest1 = document.getElementById("button-request-1");

let depthRequest2 = document.getElementById("input-depht-request-2");
let usernameRequest2 = document.getElementById("input-username-request-2");
let productRequest2 = document.getElementById("input-product-request-2");
let buttonRequest2 = document.getElementById("button-request-2");

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

buttonRequest1.addEventListener("click", function(event) {
    console.log("button-request-1 clicked");
 
    if (depthRequest1.value === "" || depthRequest1.value === null || depthRequest1.value === undefined) {
        alert("Please enter a depth");
        return;
    }
    let depth = parseInt(depthRequest1.value);
    if (depth <= 0) {
        alert("Please enter a depth (>=1)");
        return;
    }

    if (usernameRequest1.value === "" || usernameRequest1.value === null || usernameRequest1.value === undefined) {
        alert("Please enter a username");
        return;
    }
 
    fetch(`http://localhost:3000/api/generate/listProduct?depth=${depth}&username=${usernameRequest1.value}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json()
        .then((data) => {
            textareaJson.textContent = JSON.stringify(data.result, null, "\t");
            responseInput.textContent = data.time;
    }));
 });

 buttonRequest2.addEventListener("click", function(event) {
    console.log("button-request-2 clicked");
 
    if (depthRequest2.value === "" || depthRequest2.value === null || depthRequest2.value === undefined) {
        alert("Please enter a depth");
        return;
    }
    let depth = parseInt(depthRequest2.value);
    if (depth <= 0) {
        alert("Please enter a depth (>=1)");
        return;
    }

    if (usernameRequest2.value === "" || usernameRequest2.value === null || usernameRequest2.value === undefined) {
        alert("Please enter a username");
        return;
    }
 
    if (productRequest2.value === "" || productRequest2.value === null || productRequest2.value === undefined) {
        alert("Please enter a reference");
        return;
    }

    fetch(`http://localhost:3000/api/generate/listOfAProduct?depth=${depth}&username=${usernameRequest2.value}&reference=${productRequest2.value}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json()
        .then((data) => {
            textareaJson.textContent = JSON.stringify(data.result, null, "\t");
            responseInput.textContent = data.time;
    }));
 });