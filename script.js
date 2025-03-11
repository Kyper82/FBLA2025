//Assign variables with corresponding html elements
const inputField = document.getElementById('userInput');
const mainContent = document.getElementById('mainContent');
const titleContent = document.getElementById('titleWrapper');
const stylesheet = document.getElementById('stylesheet');
const splineBG = document.getElementById('splineBG');
//declare all variables
let eventActive = false; // determines if going through an event or not
let whichEvent = -1; // determines recession or boom
let chapterOne = false;
let readyForEventEffects = false;
let gameChapter = 0;
let moveOnEvent = false; // Used for invalid inputs -> if false notify
let possibleStock = [1.27, 0.91, 1.21, 2.94]; 
let possibleCrypto = [0.59, 0.33, 2.42, 2.22]; 

// gameState object containing multiple properties for handling actions
const gameState = {
    capital: 10000,
    portfolio: {
        stock: 0,
        crypto: 0,
        savings: 0
    },
    eventInvestment: null,
    knowledge: "Basic",
    currentInvestment: null,
    moveOn: false,
    action: null
};

mainContent.style.display = "none";
// Event listener for userInput
document.addEventListener('DOMContentLoaded', (event) => {
    inputField.addEventListener('keypress', function(event) {
        const userInput = inputField.value.trim().toLowerCase();
        if(event.key === 'Enter') { 
            event.preventDefault(); //prevents default behavior i.e. submitting/clicking something
            inputField.value = '';
            if(userInput === 'start') {
                inputField.setAttribute('placeholder', 'Type response here');
                titleContent.style.display = "none";
                stylesheet.href = "gameStyle.css";
                splineBG.style.display = "none";
                mainContent.style.display = "inline-block";
                handleIntro();
            // Alerts for all the functions
            } else if(userInput == 'help') {
                help();
            } else if(userInput == 'stats') {
                stats();
            } else if(userInput == 'stop') {
                stop();
            // Endgame
            } else if(gameChapter >= 3) {
                handleEndGame();
            // Only goes through if it's an event
            } else if(userInput == 'proceed' && readyForEventEffects == true) {
                gameState.capital+=10000;
                let text = ``;
                if(whichEvent === 0) {
                    text =
                    `
                    The cryptocurrency boom is over! Crypto all over the world has risen by 50%, and stocks by 10%.
                    \nYou've also just recieved $10,000 more in capital.
                    \nWhat would you like to do now?
                    \nBuy more investments
                    \nSell your investments
                    \nProceed
                    \nPlease type "buy", "sell", or "proceed" (remember you can type "stats" at any point to check your portfolio)
                    `;
                } else if(whichEvent === 1) {
                    text =
                    `
                    The recession is over! Stocks all over the world have fallen by 30%, and crypto by 10%. Fortunately, savings have remained safe.
                    \nYou've also recieved $10,000 more in capital.
                    \nWhat would you like to do now?
                    \nBuy more investments
                    \nSell your investments
                    \nProceed
                    \nPlease type "buy", "sell", or "proceed" (remember you can type "stats" at any point to check your portfolio)
                    `;
                }
                
                typeText(text);
                updateEvent();
                readyForEventEffects = false; 
            } else if(userInput == 'continue' && chapterOne == false) {
                const text = 
                `
                    You sit at your desk, staring at the computer screen. The markets have just opened, and several options are available to you.
                    \n
                    \nStock Market: Research and invest in high-tech stocks (riskier but high potential returns)
                    \nCryptocurrency: Invest in a volatile cryptocurrency (extremely high risk and reward)
                    \nSavings Account: Open a savings account and earn a modest interest rate (low risk, low return)
                    \nFast Forward: Continue through the year(if you don't invest, all the money will go into savings)
                    \n
                    \nAny money not input these options will go directly into savings account
                    \nPlease type "1", "2", "3", or "4"
                `;
                typeText(text);
            } else if(eventActive && gameChapter <= 4) {
                mainContent.innerHTML =
                `
                <p>Another whirlwind year has left your portfolio buzzing with activity.</p>
                <p>Another year means $10,000 more in capital as well!</p>
                <p>What would you like to do next?</p>
                <ul>
                    <li>Buy more investments</li>
                    <li>Sell your investments</li>
                    <li>Proceed with your current holdings</li>
                </ul>
                <p>Type "buy," "sell," or "proceed" to make your choice. you can also type "stats" to check your portfolio.</p>
                `;
                handleRestGame(userInput);
            } else if (gameChapter == 0) {
                handleFirstGame(userInput);
            } else {
                alert("Invalid Response!");
            }
            
        }
    });
});
// Introduction
function handleIntro() {
    inputField.style.display = "none";
    // runs the text through typeTextCB which differs due to callback
    let text = 
    `
        In this high-stakes game, you'll step into the shoes of an ambitious investor, armed with a modest capital and a few years to grow your wealth. \n
        The market is unpredictable, opportunities are fleeting, and the pressure is on. Every decision you make will influence your financial journey, but time is your most critical asset. \n
        Will you build your fortune, or will the volatile market pull you under before you reach your goals? ‣ ‣ ‣
    `;
    typeTextCB(mainContent, text, 25, () => {
        inputField.style.display = "none";
        //This callback runs after the first typing animation finishes
        text = 
        `
        You are given $10,000 to begin your journey. You have a diverse set of tools at your disposal to manage, invest, and grow your capital. But beware: every decision carries risk, and the market will react to your choices.
        \n
        \nType "continue" to continue, "help" for help, "stats" to see your stats, or "stop" to stop the game
        `;
        //Hides input field until it's done
        typeTextCB(mainContent, text, 15, () => {
            inputField.style.display = "flex";
        });
    });
    
}
// Provides a list of possible commands and plot
function help(){
    alert("You are an investor aiming to maximize your financial gains. Type your responses in the text box according to the prompts. \nType 'stats' to pull up your stats. \nType 'stop' to stop.");
    
}
// Provides stats
function stats(){
    const networth = gameState.capital + gameState.portfolio.stock + gameState.portfolio.crypto + gameState.portfolio.savings;
    if(networth< 10000) {
        gameState.knowledge = "Noobie";
    } else if(networth> 70000) {
        gameState.knowledge = "Pro";
    } else if(networth> 50000) {
        gameState.knowledge = "Amateur";
    } else {
        gameState.knowledge = "Basic";
    }
    alert(
        `Portfolio: ` +
        `Stock: $${gameState.portfolio.stock}, ` +
        `Crypto: $${gameState.portfolio.crypto}, ` +
        `Savings: $${gameState.portfolio.savings}\n` +
        `Finance Knowledge: ${gameState.knowledge}\n` + 
        `Capital: $${gameState.capital}`

    );
}
//alerts user, changes inner html, and hides userinput
function stop() {
    alert("Game stopped, thanks for playing!")
    mainContent.innerHTML = "Game Stopped."
    inputField.style.display = "none";
}
//first part of game function
function handleFirstGame(input) {
    // Uses a switch case

    if ((gameState.currentInvestment === null) && (!gameState.moveOn)) {
        // Investment selection phase
        switch (input) {
            case "1": {
                gameState.currentInvestment = "stock";
                mainContent.innerHTML = 
                `
                <p> You’ve decided on the tech stock sector. How much would you like to invest?</p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.currentInvestment)]} in ${gameState.currentInvestment}</p>
                <p>Please enter a numerical value:</p>
                `;
                break;
            }
            case "2": {
                gameState.currentInvestment = "crypto";
                mainContent.innerHTML = 
                `
                <p>You decide to invest in a volatile cryptocurrency. How much do you want to invest?<p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.currentInvestment)]} in ${gameState.currentInvestment}</p>
                <p>Please enter a numerical value:</p>
                `;
                break;
            }
            case "3": {
                gameState.currentInvestment = "savings";
                mainContent.innerHTML = 
                `
                <p>You open a high-yield savings account. How much do you want to deposit?<p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.currentInvestment)]} in ${gameState.currentInvestment}</p>
                <p>Please enter a numerical value:</p>
                `;
                break;
            }
            case "4": {
                chapterOne = true;
                eventActive = true;
                if (gameState.capital > 0) {
                    gameState.portfolio.savings += gameState.capital; // Add remaining capital to savings
                    gameState.capital = 0; // Reset capital to 0
                    yearlyUpdate();
                    gameState.moveOn = true; 
                } else if (gameState.capital === 0) {
                    yearlyUpdate();
                    gameState.moveOn = true; 
                }
                // Generating random event
                const randomNum = Math.floor(Math.random() * 2);
                if(randomNum === 0) {
                    mainContent.innerHTML = 
                    `
                        <p>A year has passed, and all remaining capital has been moved into savings.</p>
                        <p>Savings: $${gameState.portfolio.savings}</p>
                        <p>Type "stats" to see the changes to your investments.</p>

                        <p>You've also received an additional $10,000 in capital. Exciting news has just emerged about a potential cryptocurrency boom. Historically, such booms lead to skyrocketing crypto values as investors flood the market, eager to capitalize on the high returns.</p>
                        <p>How would you like to adjust your portfolio to take advantage of this opportunity?</p>
                        <ul>
                            <li>Buy more investments</li>
                            <li>Sell your investments</li>
                            <li>Proceed</li>
                        </ul>
                        <p>Please type "buy", "sell", or "proceed"(remember you can type "stats" at any point to check your portfolio)</p>
  
                    `;
                    whichEvent = 0;
                } else if(randomNum === 1) {
                    mainContent.innerHTML = 
                    `
                        <p>A year has passed, and all remaining capital has been moved into savings.</p>
                        <p>Savings: $${gameState.portfolio.savings}</p>
                        <p>Type "stats" to see the changes to your investments.</p>

                        <p>You've also received an additional $10,000 in capital. However, troubling news has emerged about a potential recession. Historically, recessions lead to declining asset values as investors pull out of riskier investments. How would you like to adjust your portfolio in light of this news?</p>
                        <ul>
                            <li>Buy more investments</li>
                            <li>Sell your investments</li>
                            <li>Proceed</li>
                        </ul>
                        <p>Please type "buy", "sell", or "proceed"(remember you can type "stats" at any point to check your portfolio)</p>
  
                    `;
                    whichEvent = 1;
                }
                readyForEventEffects = true;
                gameChapter++;
                gameState.capital += 10000;
                break;
            }
            // For invalid inputs
            default:
                if (!gameState.moveOn) {
                    alert("Invalid Response!");
                }
                break;
        }
    } else {
        // Amount input phase
        const amt = parseFloat(input);
        if (isNaN(amt)) {
            alert("Please enter a valid number.");
            gameState.currentInvestment = null; 
            return;
        }
        if (amt > gameState.capital) {
            alert("You don't have enough capital. You only have $" + gameState.capital + " capital.");
            gameState.currentInvestment = null; 
            return;
        }
        gameState.portfolio[gameState.currentInvestment] += amt; // Update portfolio
        gameState.capital -= amt; // Deduct from capital
        mainContent.innerHTML =
        `
            <p>You now have $${gameState.portfolio[gameState.currentInvestment]} in ${gameState.currentInvestment}. Your capital is now $${gameState.capital}.</p>
            <ol>
                <li>Stock Market: Research and invest in high-tech stocks (riskier but high potential returns)</li>
                <li>Cryptocurrency: Invest in a volatile cryptocurrency (extremely high risk and reward)</li>
                <li>Savings Account: Open a savings account and earn a modest interest rate (low risk, low return)</li>
                <li>Fast Forward: Continue through the year (if you don't invest, all the money will go into savings)</li>
            </ol>
            <p>Any money not input these options will go directly into savings account</p>
            <p>Please type "1", "2", "3", or "4"</p>
        `;
        // Reset current investment
        gameState.currentInvestment = null; 
    } 
}
//Updates the values yearly using real data
function yearlyUpdate() {
    //completely random
    let highYieldSavings = 1.04;
    //update savings
    gameState.portfolio.savings = Math.floor(gameState.portfolio.savings * highYieldSavings);

    // Update stock if investment exists
    if (gameState.portfolio.stock > 0) {
        gameState.portfolio.stock = Math.floor(gameState.portfolio.stock * possibleStock[Math.floor(Math.random() * 4)]);
    }

    // Update crypto if investment exists
    if (gameState.portfolio.crypto > 0) {
        gameState.portfolio.crypto = Math.floor(gameState.portfolio.crypto * possibleCrypto[Math.floor(Math.random() * 4)]);
    }
}
//Base function for the rest of the game - not effected by event
function handleRestGame(option) {
    // Gets action - buy, sell, proceed
    if (gameState.action === null) {
        switch(option) {
            case "buy": {
                gameState.action = "buy";
                mainContent.innerHTML = 
                `
                <p>You have chosen to buy more investments</p>
                <p>Which would you like to buy?</p>
                <ol>
                    <li>Stocks</li>
                    <li>Crypto</li>
                    <li>Savings</li>
                </ol>
                <p>Please type "1", "2", "3" (remember you can type "stats" at any point to check your portfolio)</p>
                `;
                break;
            }
            case "sell": {
                gameState.action = "sell";
                mainContent.innerHTML = 
                `
                <p>You have chosen to sell more investments</p>
                <p>Which would you like to sell?</p>
                <ol>
                    <li>Stocks</li>
                    <li>Crypto</li>
                    <li>Savings</li>
                </ol>
                <p>Please type "1", "2", "3" (remember you can type "stats" at any point to check your portfolio)</p>
                `;
                break;
            }
            case "proceed": {
                if (gameState.capital > 0) {
                    gameState.portfolio.savings += gameState.capital;
                    gameState.capital = 0;
                    mainContent.innerHTML = `
                        <p>Your capital has been safely tucked away into your savings account.</p>
                        <p>Savings: $${gameState.portfolio.savings}</p>
                        <p>Ready to see what the next year holds? </p>
                        <p>Type "next" to continue or "stats" to check your portfolio.</p>
                    `;
                    moveOnEvent = true;
                } else if (gameState.capital === 0) {
                    mainContent.innerHTML = `
                        <p>Your investments are about to undergo wild changes.</p>
                        <p>Ready to see what the next year holds? </p>
                        <p>Type "next" to continue or "stats" to check your portfolio.</p>
                    `;
                    moveOnEvent = true;
                }
                gameChapter++;
                yearlyUpdate();
                gameState.capital+=10000;
                break;
            }
            default: {
                if (!moveOnEvent) {
                    alert("Invalid response");
                }
                break;
            }
        }
    // gets investment to either sell or buy
    } else if (gameState.eventInvestment === null) {
        switch(option) {
            case "1": {
                gameState.eventInvestment = "stock";
                mainContent.innerHTML =
                `
                <p>You've selected ${gameState.eventInvestment}</p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.eventInvestment)]} in ${gameState.eventInvestment}</p>
                <p>How much would you like to ${gameState.action}?</p>
                `;
                break;
            }
            case "2": {
                gameState.eventInvestment = "crypto";
                mainContent.innerHTML =
                `
                <p>You've selected ${gameState.eventInvestment}</p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.eventInvestment)]} in ${gameState.eventInvestment}</p>
                <p>How much would you like to ${gameState.action}?</p>
                `;
                break;
            }
            case "3": {
                gameState.eventInvestment = "savings";
                mainContent.innerHTML =
                `
                <p>You've selected ${gameState.eventInvestment}</p>
                <p> You have $${gameState.capital} capital </p>
                <p> You have $${gameState.portfolio[(gameState.eventInvestment)]} in ${gameState.eventInvestment}</p>
                <p>How much would you like to ${gameState.action}?</p>
                `;
                break;
            }
            default: {
                if (!moveOnEvent) {
                    alert("Invalid response");
                }
                break;
            }
        }
    } else if (gameState.action === "buy") {
        const amt = parseFloat(option);
        if (isNaN(amt)) {
            alert("Please enter a valid number.");
            gameState.eventInvestment = null;
            gameState.action = null;
            return;
        }
        if (amt > gameState.capital) {
            alert("You don't have enough capital. You only have $" + gameState.capital + " capital.");
            gameState.eventInvestment = null;
            gameState.action = null;
            return;
        }
        gameState.portfolio[gameState.eventInvestment] += amt; // Update portfolio
        gameState.capital -= amt; // Deduct from capital
        mainContent.innerHTML =
        `
            <p>You now have $${gameState.portfolio[gameState.eventInvestment]} in ${gameState.eventInvestment}. Your capital is now $${gameState.capital}.</p>
            <p>What would you like to do now?</p>
                <ul>
                    <li>Buy more investments</li>
                    <li>Sell your investments</li>
                    <li>Proceed</li>
                </ul>
            <p>Please type "buy", "sell", or "proceed" (remember you can type "stats" at any point to check your portfolio)</p>
        `;
        // Reset current investment and action
        gameState.eventInvestment = null;
        gameState.action = null;
    } else if(gameState.action === "sell") {
        const amt = parseFloat(option);
        if (isNaN(amt)) {
            alert("Please enter a valid number.");
            gameState.eventInvestment = null;
            gameState.action = null;
            return;
        }
        if (amt > gameState.portfolio[gameState.eventInvestment]) {
            alert("You don't have enough capital. You only have $" + gameState.portfolio[gameState.eventInvestment] + " in " + gameState.eventInvestment);
            gameState.eventInvestment = null;
            gameState.action = null;
            return;
        }
        gameState.portfolio[gameState.eventInvestment] -= amt; // Remove from portfolio
        gameState.capital += amt; // Add into capital
        mainContent.innerHTML =
        `
            <p>You now have $${gameState.portfolio[gameState.eventInvestment]} in ${gameState.eventInvestment}. Your capital is now $${gameState.capital}.</p>
            <p>What would you like to do now?</p>
                <ul>
                    <li>Buy more investments</li>
                    <li>Sell your investments</li>
                    <li>Proceed</li>
                </ul>
            <p>Please type "buy", "sell", or "proceed" (remember you can type "stats" at any point to check your portfolio)</p>
        `;
        // Reset current investment and action
        gameState.eventInvestment = null;
        gameState.action = null;
    }
}
//Function for the last part of the game - reads stats
function handleEndGame() {
    yearlyUpdate();
    const networth = gameState.capital + gameState.portfolio.stock + gameState.portfolio.crypto + gameState.portfolio.savings;
    let finalNetworth = networth;

    if(networth >= 70000) {
        finalNetworth += 10000;
    }

    if(networth < 20000) {
        gameState.knowledge = "Noobie";
    } else if(finalNetworth > 90000) {
        gameState.knowledge = "Pro";
    } else if(finalNetworth > 55000) {
        gameState.knowledge = "Amateur";
    } else {
        gameState.knowledge = "Basic";
    }
    
    gameState.capital = 0;
    let text = "";
    if(finalNetworth >= 70000) {
        text = `
        Great job reaching the finish line! You're a natural trader!
        \nYou were given $50,000 in capital, and managed to make $${finalNetworth - 50000}
        \nAs a result, you've been given a bonus of $10,000 dollars!
        \nLet's take a look at your final stats:
        \nPortfolio:
        \nStock: $${gameState.portfolio.stock}
        \nCrypto: $${gameState.portfolio.crypto}
        \nSavings: $${gameState.portfolio.savings}
        \nFinance Knowledge: ${gameState.knowledge} 
        \nCapital: $${gameState.capital}
        \nThank you for playing and putting your trading skills to the test!
        `;
    } else if(finalNetworth >= 50000) {
        text = `
        Great job reaching the finish line! Trading turned out to be quite the challenge, didn't it? 
        \nYou were given $50,000 in capital, and managed to make $${finalNetworth - 50000}. Fair effort!
        \nAs a result of this, you've been asked to try again to better your earnings (Reload to play again).
        \nLet's take a look at your final stats:
        \nPortfolio:
        \nStock: $${gameState.portfolio.stock}
        \nCrypto: $${gameState.portfolio.crypto}
        \nSavings: $${gameState.portfolio.savings}
        \nFinance Knowledge: ${gameState.knowledge} 
        \nCapital: $${gameState.capital}
        \nThank you for playing and putting your trading skills to the test!
        `;
    } else {
        text = `
        You reached the finish line, but your investments didn't go quite as planned. You were given $50,000 in capital, but unfortunately resulting made a loss of $${50000 - finalNetworth} and ended with $${finalNetworth}. 
        \nAs a consequence, you've been fired!
        \nLet's take a look at your final stats:
        \nPortfolio:
        \nStock: $${gameState.portfolio.stock}
        \nCrypto: $${gameState.portfolio.crypto}
        \nSavings: $${gameState.portfolio.savings}
        \nFinance Knowledge: ${gameState.knowledge} 
        \nCapital: $${gameState.capital}
        \nThank you for playing and putting your trading skills to the test!
        `;
    }

    typeTextCB(mainContent, text, 15, () => {
        inputField.style.display = "none";
    });
}
//hardcoded values for the event 
function updateEvent() {
    if(whichEvent == 0) {
        gameState.portfolio.crypto = Math.floor(gameState.portfolio.crypto*1.5);
        gameState.portfolio.stock = Math.floor(gameState.portfolio.stock*1.1);
        gameState.portfolio.savings = Math.floor(gameState.portfolio.savings*1.04);
    } else if(whichEvent == 1) {
        gameState.portfolio.crypto = Math.floor(gameState.portfolio.crypto*0.9);
        gameState.portfolio.stock = Math.floor(gameState.portfolio.stock*0.7);
        gameState.portfolio.savings = Math.floor(gameState.portfolio.savings*1.04);
    }
}
//Typing function for only the intro, as here are multiple and callback is needed
function typeTextCB(element, text, speed =15, callback) {
    let i = 0;
    element.innerHTML = ""; // Clear the element's content
    inputField.style.display = "none";

    function type() {
        
        if (i < text.length) {// Acts as a pseudo-while loop
            if (text.charAt(i) === "\n") { //if \n is a character seen in the text add a line break(<br>)
                if(i !== 0) {
                    mainContent.innerHTML += "<br>";
                }
            } else { //otherwise add the text 
                mainContent.innerHTML += text.charAt(i);
            }

            i++;

            if (text.charAt(i - 1) == "." || text.charAt(i - 1) == "?") {
                setTimeout(type, 250); // Introduce a delay after a period
            } else if(text.charAt(i-1)== "‣") {
                setTimeout(type, 2000);
            } else {
                setTimeout(type, speed);
            }
        } else {
            // Call the callback function if it exists
            if (callback) callback();
            
        }
    
    }
    type();
}
//Typing for all others
function typeText(text) {
    let i = 0; //initializes i as the current letter of the word
    mainContent.innerHTML = ""; // Clear the element's content
    inputField.style.display = "none"; // Hide the input field

    function type() {
        if (i < text.length) {
            if (text.charAt(i) === "\n") { // breaks line if i === \n
                if(i !== 0) {
                    mainContent.innerHTML += "<br>";
                }
            } else { //otherwise add i to maincontent
                mainContent.innerHTML += text.charAt(i);
            }
            
            i++; // Increment `i` here to avoid infinite loop

            //add delays for specific characters
            let delay = 15; //default speed of 20ms
            if (i > 0) {
                if (text.charAt(i - 1) === "." || text.charAt(i - 1) === "?") {
                    delay = 250; // 250ms delay after a period or question mark
                } else if (text.charAt(i - 1) === "‣") {
                    delay = 1250; // 1250ms delay after a "‣" character
                }
            }

            setTimeout(type, delay); //use the calculated delay
        } else {
            inputField.style.display = "flex"; // show the input field when done
        }
    }

    type(); // Start the typing animation
}



