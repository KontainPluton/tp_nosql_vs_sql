let switchDatabse = document.getElementById("switch-database");
let databaseLabel = document.getElementById("database-label");

let depthRequest1 = document.getElementById("input-depht-request-1");
let usernameRequest1 = document.getElementById("input-username-request-1");
let buttonRequest1 = document.getElementById("button-request-1");

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
            console.log(data);
    }));
 });