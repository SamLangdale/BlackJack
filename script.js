console.log("hello");
alert("Welcome to blackjack");
const dealButton = document.getElementById("deal-btn");
const hitButton = document.getElementById("hit-btn");
const standButton = document.getElementById("stand-btn");
dealButton.addEventListener("click", () => {createDeck(); initialdeal(); isStand = false;})
hitButton.addEventListener("click", () => {hit();})
standButton.addEventListener("click", () => {stand();})
const suites= ["hearts", "diamonds", "clubs", "spades"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
let deck = [];
let player = [];
let dealer = [];
let isStand = false;

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
    for (let i = 0; i < dealer.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="images/${dealer[i].value}_of_${dealer[i].suit}.png" alt="${dealer[i].suit}">${dealer[i].value}`;
        dealerCards.appendChild(card);
    }
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    calculateScore();
}
function calculateScore() {
    let playerScore = 0;
    let dealerScore = 0;
    let playerAces = 0;
    let dealerAces = 0;
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
            dealerAces++;
        } else if (dealer[i].value === "king" || dealer[i].value === "queen" || dealer[i].value === "jack") {
            dealerScore += 10;
        } else {
            dealerScore += parseInt(dealer[i].value);
        }
    }
        while (dealerScore > 21 && dealerAces > 0) {
                dealerScore -= 10;
                dealerAces--;
            }
        if(dealerScore > 21) {
            alert("Dealer busted, You win!");
            playAgain();
            isStand = false;
            return;
        }
            while (playerScore > 21 && playerAces > 0) {
                playerScore -= 10;
                playerAces--;
            }
        if(playerScore > 21) {
            alert("You busted, Dealer wins!");
            playAgain();
            isStand = false;
            return;
        }
        if(playerScore === 21) {
            alert("Blackjack! You win!");
            playAgain();
            isStand = false;
            return;
        }
        if(dealerScore === 21) {
            alert("Dealer has Blackjack! You lose!");
            playAgain();
            isStand = false;
            return;
        }
        if(isStand && dealerScore > playerScore) {
            isStand = false;
            alert("Dealer wins!");
            playAgain();
            return;
        }
    const playerScoreElement = document.getElementById("player-score").textContent = 'Score: ' + playerScore;
    const dealerScoreElement = document.getElementById("dealer-score").textContent = 'Score: ' + dealerScore;
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
    while (isStand) {
        dealer.push(deck.pop());
        const dealerCards = document.getElementById("dealer-cards");
        dealerCards.innerHTML = "";
        for (let i = 0; i < dealer.length; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `<img src="images/${dealer[i].suit}.png" alt="${dealer[i].suit}">${dealer[i].value}`;
            dealerCards.appendChild(card);
        }
        calculateScore();
    }
}
function playAgain() {
    if (confirm("Do you want to play again?")) {
        reset();
        }
        else {
            alert("Thanks for playing!");
            reset();
        }

}
