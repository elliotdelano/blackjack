// const canvas = document.getElementById('canvas');

// const app = new PIXI.Application({
//     view: canvas,
//     width: window.innerWidth,
//     height: window.innerHeight
// });

// const { stage, view, ticker, renderer } = app;

// document.body.appendChild(view);

let getElement = (input) => document.getElementById(input);

class Game {
    constructor() {
        this.playerCount = 4;
        this.dealer = new Game.Player(0);

        this.p1 = new Game.Player(1);
        this.p2 = new Game.Player(2);
        this.p3 = new Game.Player(3);
        this.p4 = new Game.Player(4);

        this.currentPlayer = 1;
        this.currentPlayerCounter = getElement('currentTurn');

        this.playingCards = new Game.Deck();

        this.hasBets = false;
        this.turnsOver = false;

        //getElement('hit').onclick = function () { console.log('5') };
        //getElement('stand').onclick;
    }

    onPlayerHit() {
        if(!this.hasBets) return;
        if(this.turnsOver) return;

        let v = Game.Deck.handValue(this['p' + this.currentPlayer].hand);
        if (v >= 21) {
            this.onPlayerStand();
            return;
        }
        this['p' + this.currentPlayer].addCard(this.playingCards.getTop());
        v = Game.Deck.handValue(this['p' + this.currentPlayer].hand);
        console.log(v);
        if (v >= 21) {
            this.onPlayerStand();
        }
    }

    update() {
        this.currentPlayerCounter.innerHTML = this.currentPlayer;
    }

    onPlayerStand() {
        if(!this.hasBets) return;
        if (this.currentPlayer == 4) {
            this.turnsOver = true;
            this.dealDealerDeals();
        } else {
            this.currentPlayer += 1;
        }
        
        
        this.update()
    }

    firstHand() {
        this.dealer.addCard(this.playingCards.getTop());
        for(let i = 0; i < this.playerCount; i++) {
            this['p' + (i+1)].addCard(this.playingCards.getTop());
            this['p' + (i+1)].addCard(this.playingCards.getTop());
        }
    }

    onPlaceBet() {
        if(this.hasBets) return;
        let amount = getElement("betInput").value;
        if(this['p' + this.currentPlayer].totalCash == 0) this['p' + this.currentPlayer].totalCash = 500;
        if(amount > this['p' + this.currentPlayer].totalCash || amount < 10) return;
        this['p' + this.currentPlayer].placeBet(amount);
        if(this.currentPlayer == 4) {
            this.currentPlayer = 1;
            this.hasBets = true;
            this.firstHand()
            this.update();
            return;
        }
        this.currentPlayer++;
        this.update();
    }

    dealDealerDeals() {
        if(Game.Deck.handValue(this.dealer.hand) < 17) {
            this.dealer.addCard(this.playingCards.getTop());
        }

        if(Game.Deck.handValue(this.dealer.hand) < 17) {
            this.dealDealerDeals();
        } else {
            this.roundEnd();
        }
    }

    roundEnd() {
        this.currentPlayer = 1;
        let dealerValue = Game.Deck.handValue(this.dealer.hand);
        console.log(dealerValue);
        if(dealerValue > 21) {
            for(let i = 0; i < this.playerCount; i++) {
                this['p' + (i+1)].win();
            }
        } else {
            for(let i = 0; i < this.playerCount; i++) {
                let pHand = Game.Deck.handValue(this['p' + (i+1)].hand); 
                if(pHand > 21) {
                    this['p' + (i+1)].lose();
                }
                else if (pHand > dealerValue) {
                    this['p' + (i+1)].win();
                } else {
                    this['p' + (i+1)].lose();
                }
            }
        }

        this.dealer.hand = [];
        this.dealer.update();
        this.hasBets = false;
        this.turnsOver = false;
        this.playingCards = new Game.Deck();
    }

    static Player = class {
        constructor(number) {
            this.playerNum = number;
            this.totalCash = 500;
            this.currentBid = 0;
            this.hand = [];
            this.handDisplay = getElement('p' + this.playerNum + 'Cards');
            if(this.playerNum != 0) {
                this.currentBidCounter = getElement('p' + this.playerNum + 'CurrentBet');
                this.totalCashCounter = getElement('p' + this.playerNum + 'TotalWallet');
            }
            this.update();
        }

        update() {
            if(this.playerNum != 0) {
                this.totalCashCounter.innerHTML = '$' + this.totalCash;
                this.currentBidCounter.innerHTML = '$' + this.currentBid;
            }
            
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

        placeBet(amount) {
            this.totalCash -= amount;
            this.currentBid = amount;
            this.update();
        }

        win() {
            console.dir(this);
            console.log(" Won!");
            this.totalCash += this.currentBid*2;
            this.currentBid = 0;
            this.hand = [];
            this.update();
        }

        lose() {
            this.currentBid = 0;
            this.hand = [];
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
                value += Game.Deck.cardValue(c);
            }
            return value;
        }

        static cardValue(card) {
            let id = card[0]
            if(id == "1") id = "10";
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

betButton = function () {
    G.onPlaceBet()
}