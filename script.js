const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
// async/await promises 
const fetchAllPlayers = async () => {
    try {
        //fetch() method to access all players using the default Web API called "response"
        const response = await fetch(`${APIURL}players`);
        //next, we parse "response" with the .json() method and turn "response" to 
        //an object with keys/values and called it "result"
        const result = await response.json();
        //console.log to show "result"
        console.log(result);
        console.log("this is the object of players");
        //returns "result" to be used later (example: to render players on the web page)
        return result;
    } catch (err) {
        //catch any errors along with a message (in this case, fetchAllPlayers () method)
        console.error('Uh oh, trouble fetching players!', err);
    }
};

//function to fetch a single player using the key:id (playerId)
const fetchSinglePlayer = async (playerId) => {
    try {
        //same as fetchAllPlayers except only fetching one player "playerId"
        const response = await fetch(`${APIURL}players/${playerId}`);
        const result = await response.json();
        console.log(result);
        console.log('this is the single player result');
        return result;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(
            `${APIURL}players`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    name: `${playerObj.name}`,
                    breed: `${playerObj.breed}`,
                    imageUrl:`${playerObj.imageUrl}`,
                }),
            }
        );
    const result = await response.json();
    console.log(result);
    fetchAllPlayers();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    console.log(playerId);
    try {
        const response = await fetch(`${APIURL}players/${playerId}`, {
            method: 'DELETE',
        });
        const player = await response.json();
        console.log(player);
        fetchAllPlayers();
        window.location.reload();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and 
 * creates a string of HTML for each
 * player, then adds that string to a larger string of 
 * HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to 
 * the DOM. 
 * 
 * It also adds event listeners to the buttons in each 
 * player card. 
 * 
 * The event listeners are for the "See details" and 
 * "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` 
 * function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` 
 * function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are 
 * defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

const renderSinglePlayerById = async (playerId) => {
    try{
        //access single Player stats
        const players = await fetchAllPlayers();
        const singlePlayer = await fetchSinglePlayer(playerId);
        console.log(`${singlePlayer}`);
        //remove current contents of player container
        playerContainer.innerHTML = '';
        //create a div to contain the details elements
        const singlePlayerElement = document.createElement('div');
        //give singlePlayerElement (div) an id and class
        singlePlayerElement.classList.add('singlePlayer');
        singlePlayerElement.setAttribute('id', `${singlePlayer.data.player.id}`);
        singlePlayerElement.innerHTML = `
        <img src=${singlePlayer.data.player.imageUrl} id='singleImage'>
        <h2 id=detailsBG>Name: ${singlePlayer.data.player.name}</h2>
        <p id=detailsBG>Breed: ${singlePlayer.data.player.breed}</p>
        <p id=detailsBG>Cohart ID: ${singlePlayer.data.player.cohortId}</p>
        <p id=detailsBG>Player ID: ${singlePlayer.data.player.id}</p>
        <p id=detailsBG>Status: ${singlePlayer.data.player.status}</p>
        <p id=detailsBG>Team: ${singlePlayer.data.player.team}</p>
        <p id=detailsBG>Team ID: ${singlePlayer.data.player.teamId}</p>
        <button class="close-button">Close</button>
        `;
        
        playerContainer.appendChild(singlePlayerElement);
        console.log('single player elements added');
        // add event listener to close button
        const closeButton = singlePlayerElement.querySelector('.close-button');
        closeButton.addEventListener('click', async (event) => {
            event.preventDefault();
            //playerContainer.remove(singlePlayerElement);
          
          //renderAllPlayers(players);
          renderAllPlayers(players);
          console.log(players);
          console.log("renderAllPlayers(players) should have ran?")
        });
    }catch (err){
        console.error('Uh oh, trouble rendering players!', err);
    }
}
const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.data.players.forEach((player) => {
            console.log(`${player.name}`);
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.setAttribute('id', `${player.id}`);
            playerElement.innerHTML = `
                <h2 id=detailsBG>Name: ${player.name}</h2>
                <p id=detailsBG>Breed: ${player.breed}</p>
                <img src=${player.imageUrl} id="image">
                <button class='details-button' data-id="${player.id}">See Details</button>
                <button class='delete-button' data-id="${player.id}">Delete</button>
            `;

        playerContainer.appendChild(playerElement);
        console.log("player element added to player container");

        const detailsButton = playerElement.querySelector('.details-button');
        detailsButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log(player.id);
            renderSinglePlayerById(player.id);
        });

        const deleteButton = playerElement.querySelector('.delete-button');
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            removePlayer(player.id);
        });
        
    });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        let newPlayerForm = `
        <form>
        <label class= "color" for="name">Name</label>
        <input class= "input" type="text" id="name" name="name" placeholder="Name">
        <label class= "color" for="breed">Breed</label>
        <input class= "input" type="text" id="breed" name="breed" placeholder="Breed">
        <label class= "color" for="imageUrl">Image URL</label>
        <input class= "input" type="text" id="imageUrl" name="imageUrl" placeholder="Image URL">
        <button type="submit">Add Player</button>
        </form>
        `;
        newPlayerFormContainer.innerHTML = newPlayerForm;

        let form = newPlayerFormContainer.querySelector('form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            let playerData = {
                name: form.name.value,
                breed: form.breed.value,
                imageUrl: form.imageUrl.value,
            };

            await addNewPlayer(playerData)

        })

        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();
