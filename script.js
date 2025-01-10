console.log("hello");
alert("Welcome to blackjack");
const dealButton = document.getElementById("deal-btn");
const hitButton = document.getElementById("hit-btn");
const standButton = document.getElementById("stand-btn");
const resetButton = document.getElementById("reset-btn");
dealButton.addEventListener("click", () => {createDeck(); initialdeal(); isStand = false;})
hitButton.addEventListener("click", () => {hit();})
standButton.addEventListener("click", () => {stand();})
resetButton.addEventListener("click", () => {reset();})
const suites= ["hearts", "diamonds", "clubs", "spades"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
let deck = [];
let player = [];
let dealer = [];
let isStand = false;
let playerScore = 0;
let dealerScore = 0;

function createDeck() {
    deck = [];
    for (let i = 0; i < suites.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({
                suit: suites[i],
                value: values[j]
            });
        }
    }
    shuffleDeck();
}
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function initialdeal() {
    player.push(deck.pop(),deck.pop());
    dealer.push(deck.pop(),deck.pop());
    console.log("players hand: ", player);
    console.log("dealer hand: ", dealer);

    const playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = "";
    for (let i = 0; i < player.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="images/${player[i].value}_of_${player[i].suit}.png" alt="${player[i].suit}">${player[i].value}`;
        playerCards.appendChild(card);
    }
    const dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = "";
    // first dealer card
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<img src="images/${dealer[0].value}_of_${dealer[0].suit}.png" alt="${dealer[0].suit}">${dealer[0].value}`;
    dealerCards.appendChild(card);
    // hidden card
    const hiddenCard = document.createElement("div");
    hiddenCard.classList.add("card");
    hiddenCard.innerHTML = `<img src="images/cardback.png" alt="Hidden card">hole card`;
    //hiddenCard.id = "hidden-dealer-card"; // Add an ID to make it easy to reveal later
    dealerCards.appendChild(hiddenCard);

    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    calculateScore();
}
function calculateScore() {
    playerScore = 0;
    dealerScore = 0;
    let playerAces = 0;
    for (let i = 0; i < player.length; i++) {
        if (player[i].value === "ace") {
            playerScore += 11;
            playerAces++;
        }
        else if (player[i].value === "king" || player[i].value === "queen" || player[i].value === "jack")
        {
            playerScore += 10;
        } else {
            playerScore += parseInt(player[i].value);
        }
    }
    for (let i = 0; i < dealer.length; i++) {
        if (dealer[i].value === "ace") {
            dealerScore += 11;
        } else if (dealer[i].value === "king" || dealer[i].value === "queen" || dealer[i].value === "jack") {
            dealerScore += 10;
        } else {
            dealerScore += parseInt(dealer[i].value);
        }
        if(!isStand) {
            break;
        }
    }
    while (playerScore > 21 && playerAces > 0) {
        playerScore -= 10;
        playerAces--;
    }

    const playerScoreElement = document.getElementById("player-score").textContent = 'Score: ' + playerScore;
    const dealerScoreElement = document.getElementById("dealer-score").textContent = 'Score: ' + dealerScore;
    result();
}
function hit() {
    player.push(deck.pop());
    const playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = "";
    for (let i = 0; i < player.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="images/${player[i].value}_of_${player[i].suit}.png" alt="${player[i].suit}">${player[i].value}`;
        playerCards.appendChild(card);
    }
    calculateScore();
    result();
}

function reset() {
    player = [];
    dealer = [];
    const playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = ""; // Clear all child elements
    const dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = ""; // Clear all child elements
    document.getElementById("player-score").textContent = 'Score: 0';
    document.getElementById("dealer-score").textContent = 'Score: 0';
    deck = [];
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
}

function stand() {
    isStand = true;
    // reveals the cards of the dealer
    const dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = "";
    for (let i = 0; i < dealer.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="images/${dealer[i].value}_of_${dealer[i].suit}.png" alt="${dealer[i].suit}">${dealer[i].value}`;
        dealerCards.appendChild(card);
    }
    calculateScore();
    result();
    while (isStand) { // while the dealer is able to draw he will until return
        dealer.push(deck.pop());
        const dealerCards = document.getElementById("dealer-cards");
        dealerCards.innerHTML = "";
        for (let i = 0; i < dealer.length; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `<img src="images/${dealer[i].value}_of_${dealer[i].suit}.png" alt="${dealer[i].suit}">${dealer[i].value}`;
            dealerCards.appendChild(card);
        }
        calculateScore();
        result();
    }
}
function result() {
    if (playerScore > 21) {
        showPopup("You busted, Dealer wins!");
        isStand = false;
        return;
    }
    if (playerScore === 21) {
        showPopup("Blackjack! You win!");
        isStand = false;
        return;
    }
    if (dealerScore === 21) {
        showPopup("Dealer has Blackjack! You lose!");
        isStand = false;
        return;
    }
    if (isStand && dealerScore > playerScore && dealerScore < 22) {
        isStand = false;
        showPopup("Dealer wins!");
        return;
    }
    if (isStand && dealerScore === playerScore) {
        isStand = false;
        showPopup("Dealer matched your score, Dealer wins!");
        return;
    }
    if (isStand && dealerScore > 22) {
        isStand = false;
        showPopup("Dealer Busted, You Win!");
        return;
    }
}

    function showPopup(message) {
        const popup = document.getElementById("result-popup");
        const popupMessage = document.getElementById("popup-message");
        const closePopupButton = document.getElementById("close-popup");

        // Set message and show the popup
        popupMessage.textContent = message;
        popup.classList.remove("hidden");

        // Close the popup when the button is clicked
        closePopupButton.addEventListener("click", () => {
            popup.classList.add("hidden");
        });
    }




