const canvas = document.getElementById('canvas');

const app = new PIXI.Application({
    view: canvas,
    width: window.innerWidth,
    height: window.innerHeight
});

const { stage, view, ticker, renderer } = app;

document.body.appendChild(view);

let getElement = (input) => document.getElementById(input);

class Game {
    constructor() {

        this.p1 = new Game.Player(1);
        this.p2 = new Game.Player(2);
        this.p3 = new Game.Player(3);
        this.p4 = new Game.Player(4);

        this.currentPlayer = 1;
        this.currentPlayerCounter = getElement('currentTurn');

        this.playingCards = new Game.Deck();

        //getElement('hit').onclick = function () { console.log('5') };
        //getElement('stand').onclick;
    }

    onPlayerHit() {
        this['p' + this.currentPlayer].addCard(this.playingCards.getTop());
        if (Deck.handValue(this['p' + this.currentPlayer].hand) >= 21) {
            this.onPlayerStand();
        }
    }

    onPlayerStand() {
        if (this.currentPlayer == 4) this.currentPlayer = 0;
        this.currentPlayer += 1;
        this.currentPlayerCounter.innerHTML = this.currentPlayer;
    }

    static Player = class {
        constructor(number) {
            this.playerNum = number;
            this.totalCash = 500;
            this.totalCashCounter = getElement('p' + this.playerNum + 'TotalWallet');
            this.currentBid = 0;
            this.currentBidCounter = getElement('p' + this.playerNum + 'CurrentBet');
            this.hand = [];
            this.handDisplay = getElement('p' + this.playerNum + 'Cards');

            this.update();
        }

        update() {
            this.totalCashCounter.innerHTML = '$' + this.totalCash;
            this.currentBidCounter.innerHTML = '$' + this.currentBid;
            let cards = "";
            for (let c of this.hand) {
                cards += c;
            }
            this.handDisplay.innerHTML = cards;
        }

        addCard(card) {
            this.hand.push(card);
            this.update();
        }
    }

    static Deck = class {
        static NORMALDECK = [
            'A♦',
            '2♦',
            '3♦',
            '4♦',
            '5♦',
            '6♦',
            '7♦',
            '8♦',
            '9♦',
            '10♦',
            'J♦',
            'Q♦',
            'K♦',
            'A♠',
            '2♠',
            '3♠',
            '4♠',
            '5♠',
            '6♠',
            '7♠',
            '8♠',
            '9♠',
            '10♠',
            'J♠',
            'Q♠',
            'K♠',
            'A♥',
            '2♥',
            '3♥',
            '4♥',
            '5♥',
            '6♥',
            '7♥',
            '8♥',
            '9♥',
            '10♥',
            'J♥',
            'Q♥',
            'K♥',
            'A♣',
            '2♣',
            '3♣',
            '4♣',
            '5♣',
            '6♣',
            '7♣',
            '8♣',
            '9♣',
            '10♣',
            'J♣',
            'Q♣',
            'K♣'
        ];

        static handValue(hand) {
            let value = 0;
            for (let c of hand) {
                value += c;
            }
            return value;
        }

        static cardValue(card) {
            let id = card[0]
            switch (id) {
                case "2":
                    return 2
                case "3":
                    return 3
                case "4":
                    return 4
                case "5":
                    return 5
                case "6":
                    return 6
                case "7":
                    return 7
                case "8":
                    return 8
                case "9":
                    return 9
                case "10":
                    return 10
                case "J":
                    return 10
                case "Q":
                    return 10
                case "K":
                    return 10
                case "A":
                    return 1
            }
        }
        constructor() {
            this.cards = Game.Deck.NORMALDECK;
            this.scramble();
        }

        getTop() {
            return this.cards.pop();
        }

        scramble() {
            let length = this.cards.length;
            let temp = this.cards;
            this.cards = []
            for (let i = 0; i < length; i++) {
                this.cards.push(temp[Math.floor(Math.random() * temp.length)]);
            }
        }
    }
}

let G = new Game();

hitButton = function () {
    G.onPlayerHit()
}

standButton = function () {
    G.onPlayerStand()
}