document.addEventListener("DOMContentLoaded", function() {
    // Get references to the elements
    const startButton = document.getElementById("start-button");
    const statusLight = document.getElementById("status-light");
    const goesDisplay = document.getElementById("goes-display");
    const recordDisplay = document.getElementById("record-display");
    const buttons = document.querySelectorAll(".button");

    // Variables to store game state
    let sequence = [];
    let playerSequence = [];
    let sequenceIndex = 0;
    let gameSpeed = 1000; // Initial speed
    let intervalId;
    let goes = 0;
    let record = 0;

    // Function to switch the status light color from red to green and vice versa
    function switchStatusLight(color) {
        statusLight.classList.remove("red", "greenlight");
        statusLight.classList.add(color);
    }

    // Function to start the game
    function startGame() {
        goes = 0;
        goesDisplay.textContent = goes;
        sequence = [];
        playerSequence = [];
        sequenceIndex = 0;
        gameSpeed = 1000;
        switchStatusLight("greenlight");
        setTimeout(() => {
            generateSignal();
            playSequence();
        }, 3000); // Start sequence after 3 seconds
    }

    // Function to generate a random signal
    function generateSignal() {
        const randomIndex = Math.floor(Math.random() * 4);
        sequence.push(randomIndex);
    }

    // Function to play the sequence of signals
    function playSequence() {
        sequenceIndex = 0;
        intervalId = setInterval(() => {
            const signal = sequence[sequenceIndex];
            flashButton(signal);
            sequenceIndex++;
            if (sequenceIndex >= sequence.length) {
                clearInterval(intervalId);
                playerSequence = [];
            }
        }, gameSpeed);
    }

    // Function to flash a button based on the signal
    function flashButton(signal) {
        buttons[signal].classList.add("active");
        setTimeout(() => {
            buttons[signal].classList.remove("active");
        }, 300); // Duration of the flash in milliseconds
    }

    // Function to handle player input
    function handleInput(signal) {
        playerSequence.push(signal);
        flashButton(signal); // Flash the button when clicked
        if (playerSequence.length === sequence.length) {
            if (JSON.stringify(playerSequence) === JSON.stringify(sequence)) {
                goes++;
                goesDisplay.textContent = goes;
                if (goes > record) {
                    record = goes;
                    recordDisplay.textContent = record;
                }
                if (goes === 5 || goes === 9 || goes === 13) {
                    gameSpeed -= 100; // Speed up the game
                }
                setTimeout(() => {
                    generateSignal();
                    playSequence();
                }, 1000); // Add a delay before the next sequence starts
            } else {
                endGame();
            }
        }
    }

    // Function to end the game
    function endGame() {
        switchStatusLight("red");
        clearInterval(intervalId);
        setTimeout(() => {
            switchStatusLight("");
            goesDisplay.textContent = goes;
            playerSequence = [];
            goes = 0;
            goesDisplay.textContent = goes;
            recordDisplay.textContent = record;
        }, 2000);
    }

    // Event listener for the START button click
    startButton.addEventListener("click", startGame);

    // Event listeners for button clicks
    buttons.forEach((button, index) => {
        button.addEventListener("click", function() {
            handleInput(index);
        });
    });
});



