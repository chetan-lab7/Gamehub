// Initialize background animation and event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundAnimation();
    setupEventListeners();
    initAllGames();
    
    // Set current date and user
    document.querySelectorAll('.update-date').forEach(el => {
        el.textContent = "2025-05-19 04:46:02";
    });
    
    document.querySelectorAll('.username').forEach(el => {
        el.textContent = "chetan-lab7";
    });
});

// Create background animation with game-themed particles
function initBackgroundAnimation() {
    const bg = document.getElementById('background-animation');
    if (!bg) return;
    
    const gameIcons = ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🚀', '👾', '🏆', '💎', '⚔️', '🛡️', '🔮'];
    const particleCount = window.innerWidth < 600 ? 15 : 30;
    
    bg.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'game-particle';
        particle.textContent = gameIcons[Math.floor(Math.random() * gameIcons.length)];
        particle.style.fontSize = `${Math.random() * 20 + 10}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation
        const duration = Math.random() * 60 + 30;
        particle.style.animation = `floating ${duration}s infinite`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        bg.appendChild(particle);
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    const homeBtn = document.getElementById('home-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    
    if (homeBtn) homeBtn.addEventListener('click', () => showSection('game-selection'));
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => showSection('leaderboard'));
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => showSection('game-selection'));
    });
    
    // Game card buttons
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            showSection(gameId);
        });
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    // Success modal buttons
    const closeModalBtn = document.querySelector('.close-modal');
    const playAgainBtn = document.getElementById('play-again-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            closeModal();
            showSection('game-selection');
        });
    }
    
    // Game over modal buttons
    const gameOverModal = document.getElementById('game-over-modal');
    if (gameOverModal) {
        const gameOverCloseBtn = gameOverModal.querySelector('.close-modal');
        const tryAgainBtn = document.getElementById('try-again-btn');
        const gameOverMenuBtn = document.getElementById('game-over-menu-btn');
        
        if (gameOverCloseBtn) {
            gameOverCloseBtn.addEventListener('click', () => {
                gameOverModal.style.display = 'none';
            });
        }
        
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', () => {
                gameOverModal.style.display = 'none';
                if (window.currentGame === 'space-shooter') {
                    initSpaceShooter();
                }
            });
        }
        
        if (gameOverMenuBtn) {
            gameOverMenuBtn.addEventListener('click', () => {
                gameOverModal.style.display = 'none';
                showSection('game-selection');
            });
        }
    }
    
    // Leaderboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            showLeaderboard(gameId);
        });
    });
}

// Initialize all games
function initAllGames() {
    initRockPaperScissors();
    initNumberGuessing();
    initDiceRoller();
    initMemoryMatch();
    initSpaceShooter();
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active-section');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (sectionId === 'game-selection' && document.getElementById('home-btn')) {
        document.getElementById('home-btn').classList.add('active');
    } else if (sectionId === 'leaderboard' && document.getElementById('leaderboard-btn')) {
        document.getElementById('leaderboard-btn').classList.add('active');
    }
    
    // Store current game
    window.currentGame = sectionId;
    
    // Special handling for space shooter
    if (sectionId === 'space-shooter') {
        if (window.spaceAnimationFrame) {
            cancelAnimationFrame(window.spaceAnimationFrame);
        }
        initSpaceShooter();
    }
}

// Show a specific leaderboard
function showLeaderboard(gameId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTabBtn = document.querySelector(`.tab-btn[data-game="${gameId}"]`);
    if (activeTabBtn) activeTabBtn.classList.add('active');
    
    // Show selected leaderboard
    document.querySelectorAll('.leaderboard-table').forEach(table => {
        table.classList.remove('active-table');
    });
    
    // Special case for space-shooter
    const tableId = gameId === 'space-shooter' ? 'space-leaderboard' : `${gameId}-leaderboard`;
    const leaderboardTable = document.getElementById(tableId);
    if (leaderboardTable) {
        leaderboardTable.classList.add('active-table');
    }
}

// Show success modal
function showModal(title, message) {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modal = document.getElementById('success-modal');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modal) modal.style.display = 'flex';
}

// Show game over modal
function showGameOverModal(message, score) {
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScore = document.getElementById('final-score');
    const modal = document.getElementById('game-over-modal');
    
    if (gameOverMessage) gameOverMessage.textContent = message;
    if (finalScore) finalScore.textContent = score;
    if (modal) modal.style.display = 'flex';
}

// Close success modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.style.display = 'none';
}

// Play again functionality
function playAgain() {
    closeModal();
    const gameId = window.currentGame;
    
    switch(gameId) {
        case 'rock-paper-scissors':
            resetRPS();
            break;
        case 'number-guess':
            resetNumberGame();
            break;
        case 'memory-match':
            resetMemoryGame();
            break;
        case 'space-shooter':
            initSpaceShooter();
            break;
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const root = document.documentElement;
    const theme = getComputedStyle(root).getPropertyValue('--gradient-start').trim();
    
    if (theme === '#0f0f1a') {
        // Switch to light theme
        root.style.setProperty('--gradient-start', '#e0e0e0');
        root.style.setProperty('--gradient-end', '#f5f5f5');
        root.style.setProperty('--background-dark', '#ffffff');
        root.style.setProperty('--background-light', '#f0f0f0');
        root.style.setProperty('--text-light', '#333333');
        root.style.setProperty('--text-gray', '#666666');
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--background-mid', '#d1d1e0');
        document.querySelector('.theme-toggle i').className = 'fas fa-sun';
    } else {
        // Switch to dark theme
        root.style.setProperty('--gradient-start', '#0f0f1a');
        root.style.setProperty('--gradient-end', '#16213e');
        root.style.setProperty('--background-dark', '#0f0f1a');
        root.style.setProperty('--background-mid', '#1a1a2e');
        root.style.setProperty('--background-light', '#16213e');
        root.style.setProperty('--text-light', '#f8f9fa');
        root.style.setProperty('--text-gray', '#a0a0a0');
        root.style.setProperty('--card-bg', 'rgba(30, 30, 60, 0.7)');
        document.querySelector('.theme-toggle i').className = 'fas fa-moon';
    }
}

// Rock Paper Scissors Game
function initRockPaperScissors() {
    // Preload hand images - using local images from images folder
    preloadRPSImages();
    
    // Initialize player and computer hands
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    
    // Add a start button to the game area
    const gameArea = document.querySelector('.rps-area');
    if (gameArea) {
        const controls = document.querySelector('.controls');
        
        // Check if start button already exists
        let startButton = document.getElementById('start-rps');
        
        if (!startButton) {
            // Create a start button
            startButton = document.createElement('button');
            startButton.id = 'start-rps';
            startButton.className = 'action-btn';
            startButton.innerHTML = '<i class="fas fa-play"></i> Start Game';
            
            // Insert the start button before the controls
            if (controls) {
                gameArea.insertBefore(startButton, controls);
            } else {
                gameArea.appendChild(startButton);
            }
        }
        
        // Hide the choice buttons initially
        if (controls) controls.style.display = 'none';
        
        // Add event listener to the start button
        startButton.addEventListener('click', function() {
            // Hide the start button
            this.style.display = 'none';
            
            // Start the countdown
            startRPSCountdown();
        });
    }
    
    if (playerHand && computerHand) {
        // Use the local rock.png image instead of online URL
        playerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
        computerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
        
        // Set up choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(button => {
            // Remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new event listener
            newButton.addEventListener('click', function() {
                const playerChoice = this.getAttribute('data-choice');
                playRPSWithChoice(playerChoice);
            });
        });
    }
}

// Preload images to avoid glitches - using local images
function preloadRPSImages() {
    const images = [
        'images/rock.png',    // Rock
        'images/paper.png',   // Paper
        'images/scissor.png'  // Scissors
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Start the RPS countdown animation
function startRPSCountdown() {
    const countdownContainer = document.getElementById('countdown-container');
    const countdown = document.getElementById('countdown');
    const countdownText = document.querySelector('.countdown-text');
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    
    if (!countdownContainer || !countdown || !countdownText || !playerHand || !computerHand) return;
    
    // Show countdown
    countdownContainer.classList.add('active');
    
    // Reset hands - use the local rock.png image
    playerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
    computerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
    
    // Add shaking animation to hands
    playerHand.classList.add('rock-animation');
    computerHand.classList.add('rock-animation');
    
    // Start countdown
    let count = 3;
    countdown.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdown.textContent = count;
            // Restart the animation
            playerHand.classList.remove('rock-animation');
            computerHand.classList.remove('rock-animation');
            void playerHand.offsetWidth; // Force reflow to restart animation
            void computerHand.offsetWidth;
            playerHand.classList.add('rock-animation');
            computerHand.classList.add('rock-animation');
        } else if (count === 0) {
            countdown.textContent = 'Choose!';
            countdownText.textContent = 'Make your selection!';
            
            // Show choice buttons
            const controls = document.querySelector('.controls');
            if (controls) controls.style.display = 'flex';
            
            // Stop the hand animation
            playerHand.classList.remove('rock-animation');
            computerHand.classList.remove('rock-animation');
            
            // Hide countdown after a short delay
            setTimeout(() => {
                countdownContainer.classList.remove('active');
                countdownText.textContent = 'Ready...';
            }, 1000);
        }
    }, 1000);
    
    // Clear interval if countdown reaches 0
    setTimeout(() => {
        clearInterval(countdownInterval);
    }, 4000);
}

// Play RPS with the chosen option
function playRPSWithChoice(playerChoice) {
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    
    if (!playerHand || !computerHand) return;
    
    // Update player hand image - with local images
    updateHandImage(playerHand, playerChoice);
    
    // Computer makes a choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    // Start the shoot animation (3, 2, 1, Shoot!)
    const countdownContainer = document.getElementById('countdown-container');
    const countdown = document.getElementById('countdown');
    const countdownText = document.querySelector('.countdown-text');
    
    if (countdownContainer && countdown && countdownText) {
        // Hide choice buttons during animation
        const controls = document.querySelector('.controls');
        if (controls) controls.style.display = 'none';
        
        // Show countdown
        countdownContainer.classList.add('active');
        countdown.textContent = "Shoot!";
        countdownText.textContent = "Result...";
        
        // Add rocking animation to hands
        playerHand.classList.add('rock-animation');
        computerHand.classList.add('rock-animation');
        
        // After animation, show the results
        setTimeout(() => {
            // Stop animation
            playerHand.classList.remove('rock-animation');
            computerHand.classList.remove('rock-animation');
            
            // Update hand images
            updateHandImage(playerHand, playerChoice);
            updateHandImage(computerHand, computerChoice);
            
            // Hide countdown
            countdownContainer.classList.remove('active');
            
            // Determine the winner
            playRPS(playerChoice, computerChoice);
            
            // Show the start button again
            const startButton = document.getElementById('start-rps');
            if (startButton) {
                setTimeout(() => {
                    startButton.style.display = 'block';
                }, 2000);
            }
        }, 1500);
    } else {
        // Fallback if countdown elements don't exist
        updateHandImage(computerHand, computerChoice);
        playRPS(playerChoice, computerChoice);
    }
}

function updateHandImage(handElement, choice) {
    if (!handElement) return;
    
    const img = document.createElement('img');
    
    // Use local image files from the images folder
    switch(choice) {
        case 'rock':
            img.src = 'images/rock.png';
            img.alt = 'Rock hand';
            handElement.className = 'hand';
            break;
        case 'paper':
            img.src = 'images/paper.png';
            img.alt = 'Paper hand';
            handElement.className = 'hand paper-animation';
            break;
        case 'scissors':
            img.src = 'images/scissor.png';
            img.alt = 'Scissors hand';
            handElement.className = 'hand scissors-animation';
            break;
    }
    
    handElement.innerHTML = '';
    handElement.appendChild(img);
}

function playRPS(playerChoice, computerChoice) {
    // Update choice displays
    updateChoiceDisplay('player-choice', playerChoice);
    updateChoiceDisplay('computer-choice', computerChoice);
    
    // Determine winner
    const result = getWinner(playerChoice, computerChoice);
    const resultMessage = document.getElementById('result-message');
    
    if (!resultMessage) return;
    
    // Reset classes
    const playerChoiceEl = document.getElementById('player-choice');
    const computerChoiceEl = document.getElementById('computer-choice');
    
    if (playerChoiceEl) playerChoiceEl.classList.remove('winner', 'loser');
    if (computerChoiceEl) computerChoiceEl.classList.remove('winner', 'loser');
    
    // Update message and score
    let rpsScore = parseInt(document.getElementById('rps-score').textContent || '0');
    
    if (result === 'win') {
        resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}.`;
        resultMessage.style.color = 'var(--success-color)';
        if (playerChoiceEl) playerChoiceEl.classList.add('winner');
        if (computerChoiceEl) computerChoiceEl.classList.add('loser');
        rpsScore++;
        
        // Add winner effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('#player-choice', 
                {scale: 1}, 
                {scale: 1.2, duration: 0.5, ease: "elastic.out(1, 0.3)", yoyo: true, repeat: 1}
            );
        }
    } else if (result === 'lose') {
        resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}.`;
        resultMessage.style.color = 'var(--danger-color)';
        if (playerChoiceEl) playerChoiceEl.classList.add('loser');
        if (computerChoiceEl) computerChoiceEl.classList.add('winner');
        
        // Add winner effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('#computer-choice', 
                {scale: 1}, 
                {scale: 1.2, duration: 0.5, ease: "elastic.out(1, 0.3)", yoyo: true, repeat: 1}
            );
        }
    } else {
        resultMessage.textContent = `It's a tie! Both chose ${playerChoice}.`;
        resultMessage.style.color = 'var(--warning-color)';
        
        // Add tie effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(['#player-choice', '#computer-choice'], 
                {y: 0}, 
                {y: -10, duration: 0.3, yoyo: true, repeat: 1}
            );
        }
    }
    
    const scoreElement = document.getElementById('rps-score');
    if (scoreElement) scoreElement.textContent = rpsScore.toString();
    
    // Check for milestone
    if (rpsScore > 0 && rpsScore % 5 === 0) {
        showModal('Achievement Unlocked!', `You've reached ${rpsScore} wins! Keep going!`);
    }
}

function updateChoiceDisplay(elementId, choice) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    const icon = document.createElement('i');
    
    switch(choice) {
        case 'rock':
            icon.className = 'fas fa-hand-rock';
            break;
        case 'paper':
            icon.className = 'fas fa-hand-paper';
            break;
        case 'scissors':
            icon.className = 'fas fa-hand-scissors';
            break;
        default:
            icon.className = 'fas fa-question';
    }
    
    element.appendChild(icon);
}

function getWinner(player, computer) {
    if (player === computer) return 'tie';
    
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'scissors' && computer === 'paper') ||
        (player === 'paper' && computer === 'rock')
    ) {
        return 'win';
    }
    
    return 'lose';
}

function resetRPS() {
    // Reset hands - use the local rock.png image
    const playerHand = document.getElementById('player-hand');
    const computerHand = document.getElementById('computer-hand');
    
    if (playerHand) playerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
    if (computerHand) computerHand.innerHTML = '<img src="images/rock.png" alt="Rock hand">';
    
    // Reset choice icons
    const playerChoice = document.getElementById('player-choice');
    const computerChoice = document.getElementById('computer-choice');
    const resultMessage = document.getElementById('result-message');
    
    if (playerChoice) playerChoice.innerHTML = '<i class="fas fa-question"></i>';
    if (computerChoice) computerChoice.innerHTML = '<i class="fas fa-question"></i>';
    if (resultMessage) {
        resultMessage.textContent = 'Choose your move!';
        resultMessage.style.color = 'var(--text-light)';
    }
    
    if (playerChoice) playerChoice.classList.remove('winner', 'loser');
    if (computerChoice) computerChoice.classList.remove('winner', 'loser');
    
    // Hide countdown if visible
    const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) countdownContainer.classList.remove('active');
    
    // Show start button, hide controls
    const startButton = document.getElementById('start-rps');
    const controls = document.querySelector('.controls');
    
    if (startButton) startButton.style.display = 'block';
    if (controls) controls.style.display = 'none';
}

// Number Guessing Game
function initNumberGuessing() {
    // Initialize game state
    window.numberGame = {
        secretNumber: Math.floor(Math.random() * 100) + 1,
        attempts: 0,
        minRange: 1,
        maxRange: 100,
        lastGuess: null
    };
    
    // Set up event listeners
    const guessBtn = document.getElementById('guess-btn');
    const newGameBtn = document.getElementById('new-number-game');
    const numberInput = document.getElementById('number-input');
    
    if (guessBtn) {
        // Remove existing event listeners
        const newBtn = guessBtn.cloneNode(true);
        guessBtn.parentNode.replaceChild(newBtn, guessBtn);
        newBtn.addEventListener('click', makeGuess);
    }
    
    if (numberInput) {
        // Remove existing event listeners
        const newInput = numberInput.cloneNode(true);
        numberInput.parentNode.replaceChild(newInput, numberInput);
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') makeGuess();
        });
        newInput.focus();
    }
    
    if (newGameBtn) {
        // Remove existing event listeners
        const newBtn = newGameBtn.cloneNode(true);
        newGameBtn.parentNode.replaceChild(newBtn, newGameBtn);
        newBtn.addEventListener('click', resetNumberGame);
    }
    
    // Update UI
    updateNumberUI();
}

function makeGuess() {
    if (!window.numberGame) return;
    
    const game = window.numberGame;
    const guessInput = document.getElementById('number-input');
    const guessMessage = document.getElementById('guess-message');
    const guessHint = document.getElementById('guess-hint');
    const guessAttempts = document.getElementById('guess-attempts');
    
    if (!guessInput || !guessMessage) return;
    
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < game.minRange || guess > game.maxRange) {
        guessMessage.textContent = `Please enter a valid number between ${game.minRange} and ${game.maxRange}.`;
        guessMessage.style.color = 'var(--danger-color)';
        return;
    }
    
    game.attempts++;
    game.lastGuess = guess;
    
    if (guessAttempts) guessAttempts.textContent = game.attempts.toString();
    
    if (guess === game.secretNumber) {
        guessMessage.textContent = `Congratulations! You guessed the number ${game.secretNumber}!`;
        guessMessage.style.color = 'var(--success-color)';
        if (guessHint) guessHint.textContent = 'You won!';
        
        // Update range visual
        const currentMarker = document.querySelector('.range-marker.current');
        if (currentMarker) {
            currentMarker.textContent = guess;
            if (typeof gsap !== 'undefined') {
                gsap.to(currentMarker, {
                    left: `${(guess - 1) / 99 * 100}%`,
                    backgroundColor: 'var(--success-color)', 
                    duration: 1,
                    ease: "elastic.out(1, 0.5)"
                });
            } else {
                currentMarker.style.left = `${(guess - 1) / 99 * 100}%`;
                currentMarker.style.backgroundColor = 'var(--success-color)';
            }
        }
        
        showModal('You Won!', `You guessed the number ${game.secretNumber} in ${game.attempts} attempts!`);
    } else {
        // Provide hint and update range
        if (guess < game.secretNumber) {
            guessMessage.textContent = 'Too low! Try a higher number.';
            guessMessage.style.color = 'var(--warning-color)';
            game.minRange = Math.max(game.minRange, guess + 1);
        } else {
            guessMessage.textContent = 'Too high! Try a lower number.';
            guessMessage.style.color = 'var(--warning-color)';
            game.maxRange = Math.min(game.maxRange, guess - 1);
        }
        
        // Additional hint based on distance
        const distance = Math.abs(guess - game.secretNumber);
        if (guessHint) {
            if (distance <= 5) {
                guessHint.textContent = "You're very close!";
            } else if (distance <= 10) {
                guessHint.textContent = "You're getting warm!";
            } else if (distance <= 20) {
                guessHint.textContent = "You're in the ballpark.";
            } else {
                guessHint.textContent = "You're still far away.";
            }
        }
        
        updateRangeVisual();
    }
    
    if (guessInput) {
        guessInput.value = '';
        guessInput.focus();
    }
}

function updateRangeVisual() {
    if (!window.numberGame) return;
    
    const game = window.numberGame;
    
    // Update range markers
    const lowMarker = document.querySelector('.range-marker.low');
    const highMarker = document.querySelector('.range-marker.high');
    const currentMarker = document.querySelector('.range-marker.current');
    
    if (lowMarker) lowMarker.textContent = game.minRange;
    if (highMarker) highMarker.textContent = game.maxRange;
    
    if (currentMarker) {
        currentMarker.textContent = game.lastGuess || '?';
        
        if (game.lastGuess) {
            // Position based on guess relative to current range
            const percentage = (game.lastGuess - 1) / 99 * 100;
            if (typeof gsap !== 'undefined') {
                gsap.to(currentMarker, {
                    left: `${percentage}%`,
                    duration: 1,
                    ease: "back.out(1.7)"
                });
            } else {
                currentMarker.style.left = `${percentage}%`;
            }
        } else {
            // Default position
            currentMarker.style.left = '50%';
        }
    }
}

function resetNumberGame() {
    // Reset the game state
    window.numberGame = {
        secretNumber: Math.floor(Math.random() * 100) + 1,
        attempts: 0,
        minRange: 1,
        maxRange: 100,
        lastGuess: null
    };
    
    // Update UI elements
    const guessAttempts = document.getElementById('guess-attempts');
    const numberInput = document.getElementById('number-input');
    const guessMessage = document.getElementById('guess-message');
    const guessHint = document.getElementById('guess-hint');
    
    if (guessAttempts) guessAttempts.textContent = '0';
    if (numberInput) {
        numberInput.value = '';
        numberInput.focus();
    }
    if (guessMessage) {
        guessMessage.textContent = 'Enter a number and click Guess!';
        guessMessage.style.color = 'var(--text-light)';
    }
    if (guessHint) guessHint.textContent = 'No hints yet...';
    
    // Reset visualization
    const currentMarker = document.querySelector('.range-marker.current');
    const lowMarker = document.querySelector('.range-marker.low');
    const highMarker = document.querySelector('.range-marker.high');
    
    if (currentMarker) {
        currentMarker.textContent = '?';
        if (typeof gsap !== 'undefined') {
            gsap.to(currentMarker, {
                left: '50%',
                backgroundColor: 'var(--primary-color)',
                duration: 0.5
            });
        } else {
            currentMarker.style.left = '50%';
            currentMarker.style.backgroundColor = 'var(--primary-color)';
        }
    }
    
    if (lowMarker) lowMarker.textContent = '1';
    if (highMarker) highMarker.textContent = '100';
}

function updateNumberUI() {
    resetNumberGame();
}

// Dice Roller Game
function initDiceRoller() {
    const rollBtn = document.getElementById('roll-dice');
    const diceCount = document.getElementById('dice-count');
    
    if (rollBtn) {
        // Remove existing event listeners
        const newBtn = rollBtn.cloneNode(true);
        rollBtn.parentNode.replaceChild(newBtn, rollBtn);
        newBtn.addEventListener('click', rollDice);
    }
    
    if (diceCount) {
        // Remove existing event listeners
        const newSelect = diceCount.cloneNode(true);
        diceCount.parentNode.replaceChild(newSelect, diceCount);
        newSelect.addEventListener('change', updateDiceCount);
    }
    
    // Initialize with 2 dice
    updateDiceCount();
}

function updateDiceCount() {
    const diceCountEl = document.getElementById('dice-count');
    if (!diceCountEl) return;
    
    const diceCount = parseInt(diceCountEl.value) || 2;
    const diceContainer = document.getElementById('dice-container');
    if (!diceContainer) return;
    
    // Clear existing dice
    diceContainer.innerHTML = '';
    
    // Add new dice
    for (let i = 1; i <= diceCount; i++) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.id = `dice-${i}`;
        
        const diceFace = document.createElement('div');
        diceFace.className = 'dice-face';
        
        // Add a single dot (will be updated when rolled)
        const dot = document.createElement('div');
        dot.className = 'dice-dot';
        diceFace.appendChild(dot);
        
        dice.appendChild(diceFace);
        diceContainer.appendChild(dice);
    }
}

function rollDice() {
    const diceCountEl = document.getElementById('dice-count');
    if (!diceCountEl) return;
    
    const diceCount = parseInt(diceCountEl.value) || 2;
    const rollBtn = document.getElementById('roll-dice');
    const diceSum = document.getElementById('dice-sum');
    let total = 0;
    
    // Disable roll button during animation
    if (rollBtn) rollBtn.disabled = true;
    
    // Roll each dice with animation
    for (let i = 1; i <= diceCount; i++) {
        const dice = document.getElementById(`dice-${i}`);
        if (!dice) continue;
        
        // Random value
        const value = Math.floor(Math.random() * 6) + 1;
        total += value;
        
        // Add rolling animation
        if (typeof gsap !== 'undefined') {
            // GSAP animation
            gsap.to(dice, {
                rotationX: `random(360, 720)`,
                rotationY: `random(360, 720)`,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => {
                    // Update dice face
                    const diceFace = dice.querySelector('.dice-face');
                    if (diceFace) {
                        diceFace.innerHTML = '';
                        createDiceDots(diceFace, value);
                    }
                    
                    // Reset rotation after animation
                    gsap.set(dice, {rotationX: 0, rotationY: 0});
                }
            });
        } else {
            // Fallback animation using CSS
            dice.classList.add('rolling');
            
            setTimeout(() => {
                dice.classList.remove('rolling');
                const diceFace = dice.querySelector('.dice-face');
                if (diceFace) {
                    diceFace.innerHTML = '';
                    createDiceDots(diceFace, value);
                }
            }, 1500);
        }
    }
    
    // Update total after all dice have rolled
    setTimeout(() => {
        if (diceSum) diceSum.textContent = total.toString();
        
        // Animate total
        if (typeof gsap !== 'undefined' && diceSum) {
            gsap.fromTo(diceSum, 
                {scale: 1.5, color: 'white'}, 
                {scale: 1, color: 'var(--accent-color)', duration: 0.5}
            );
        }
        
        // Enable roll button
        if (rollBtn) rollBtn.disabled = false;
    }, 1800);
}

function createDiceDots(diceFace, value) {
    if (!diceFace) return;
    
    // Position of dots for each value (1-6)
    const dotPositions = {
        1: [{row: 2, col: 2}],
        2: [{row: 1, col: 1}, {row: 3, col: 3}],
        3: [{row: 1, col: 1}, {row: 2, col: 2}, {row: 3, col: 3}],
        4: [{row: 1, col: 1}, {row: 1, col: 3}, {row: 3, col: 1}, {row: 3, col: 3}],
        5: [{row: 1, col: 1}, {row: 1, col: 3}, {row: 2, col: 2}, {row: 3, col: 1}, {row: 3, col: 3}],
        6: [{row: 1, col: 1}, {row: 1, col: 3}, {row: 2, col: 1}, {row: 2, col: 3}, {row: 3, col: 1}, {row: 3, col: 3}]
    };
    
    // Create dots with animation
    dotPositions[value].forEach((pos, index) => {
        const dot = document.createElement('div');
        dot.className = 'dice-dot';
        dot.style.gridRow = pos.row;
        dot.style.gridColumn = pos.col;
        
        if (typeof gsap !== 'undefined') {
            // Use GSAP for animation
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0)';
            diceFace.appendChild(dot);
            
            setTimeout(() => {
                gsap.to(dot, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }, index * 50);
        } else {
            // Fallback standard animation
            diceFace.appendChild(dot);
        }
    });
}

// Memory Match Game
function initMemoryMatch() {
    const newGameBtn = document.getElementById('new-memory-game');
    
    if (newGameBtn) {
        // Remove existing event listeners
        const newBtn = newGameBtn.cloneNode(true);
        newGameBtn.parentNode.replaceChild(newBtn, newGameBtn);
        newBtn.addEventListener('click', resetMemoryGame);
    }
    
    resetMemoryGame();
}

function resetMemoryGame() {
    // Reset timer if it exists
    if (window.memoryTimer) {
        clearInterval(window.memoryTimer);
    }
    
    // Initialize game state
    window.memoryState = {
        flippedCards: [],
        locked: false,
        moves: 0,
        matches: 0,
        score: 0,
        level: parseInt(document.getElementById('memory-level')?.textContent || '1'),
        timeLeft: 60 // Base time in seconds
    };
    
    const state = window.memoryState;
    
    // Add more time for higher levels
    state.timeLeft = 60 + (state.level - 1) * 15;
    
    // Update UI elements
    const memoryLevel = document.getElementById('memory-level');
    const memoryScore = document.getElementById('memory-score');
    const memoryMoves = document.getElementById('memory-moves');
    const memoryMessage = document.getElementById('memory-message');
    const memoryGrid = document.getElementById('memory-grid');
    
    if (memoryLevel) memoryLevel.textContent = state.level.toString();
    if (memoryScore) memoryScore.textContent = '0';
    if (memoryMoves) memoryMoves.textContent = '0';
    if (memoryMessage) {
        memoryMessage.textContent = 'Match the pairs of cards!';
        memoryMessage.style.color = 'var(--text-light)';
    }
    
    // Reset timer
    const timerBar = document.getElementById('memory-timer');
    if (timerBar) timerBar.style.width = '100%';
    startMemoryTimer();
    
    // Clear the grid
    if (!memoryGrid) return;
    memoryGrid.innerHTML = '';
    
    // Create cards based on level
    const gridSize = state.level < 3 ? 4 : 6;
    const totalPairs = Math.pow(gridSize, 2) / 2;
    
    // Set grid template
    memoryGrid.style.gridTemplateColumns = `repeat(${state.level < 3 ? 4 : 6}, 1fr)`;
    
    // Generate pairs
    const symbols = ['😀', '😎', '🚀', '🌟', '🎮', '🎯', '🏆', '🎲', '🎭', '🎨', '🎵', '🎬', '📱', '💻', '🌈', '🍕', '🍦', '🍩'];
    const cards = [];
    
    // Select symbols based on level
    const levelSymbols = symbols.slice(0, totalPairs);
    
    // Create pairs
    levelSymbols.forEach(symbol => {
        cards.push({ symbol, matched: false });
        cards.push({ symbol, matched: false });
    });
    
    // Shuffle cards
    shuffleArray(cards);
    
    // Create card elements with staggered animation
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index.toString();
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.innerHTML = '<i class="fas fa-question"></i>';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = card.symbol;
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        
        // Start with card hidden
        if (typeof gsap !== 'undefined') {
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'scale(0.5)';
        }
        
        memoryGrid.appendChild(cardElement);
        
        // Add click event
        cardElement.addEventListener('click', () => flipCard(cardElement, index, cards));
        
        // Animate card appearance
        if (typeof gsap !== 'undefined') {
            setTimeout(() => {
                gsap.to(cardElement, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            }, index * 50);
        }
    });
}

function startMemoryTimer() {
    if (!window.memoryState) return;
    
    const state = window.memoryState;
    const timerBar = document.getElementById('memory-timer');
    const timerDuration = state.timeLeft * 1000; // Convert to milliseconds
    
    if (!timerBar) return;
    
    // Clear any existing timer
    if (window.memoryTimer) clearInterval(window.memoryTimer);
    
    // Reset timer width
    timerBar.style.width = '100%';
    
    const startTime = Date.now();
    window.memoryTimer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const percentRemaining = 100 - (elapsedTime / timerDuration * 100);
        
        if (percentRemaining <= 0) {
            // Time's up
            clearInterval(window.memoryTimer);
            timerBar.style.width = '0%';
            
            // Only end game if not all matches found
            if (state.matches < document.querySelectorAll('.memory-card').length / 2) {
                endMemoryGame(false);
            }
        } else {
            timerBar.style.width = `${percentRemaining}%`;
            
            // Change color as time decreases
            if (percentRemaining < 20) {
                timerBar.style.background = 'var(--danger-color)';
            } else if (percentRemaining < 50) {
                timerBar.style.background = 'var(--warning-color)';
            }
        }
    }, 100);
}

function endMemoryGame(success) {
    if (!window.memoryState) return;
    
    const state = window.memoryState;
    
    if (success) {
        showModal('Level Completed!', `You completed level ${state.level} with a score of ${state.score}!`);
        
        // Prepare next level
        state.level++;
        state.matches = 0;
        
        const memoryLevel = document.getElementById('memory-level');
        if (memoryLevel) memoryLevel.textContent = state.level.toString();
        
        // Reset the game with more cards after delay
        setTimeout(resetMemoryGame, 1500);
    } else {
        showModal('Time\'s Up!', `You found ${state.matches} matches with a score of ${state.score}. Try again!`);
    }
    
    // Disable clicking on cards
    state.locked = true;
}

function flipCard(card, index, cardsArray) {
    if (!window.memoryState || !card) return;
    
    const state = window.memoryState;
    
    // Don't allow flipping if locked, already matched, or already flipped
    if (state.locked || 
        !cardsArray || 
        !cardsArray[index] || 
        cardsArray[index].matched || 
        state.flippedCards.includes(index)) {
        return;
    }
    
    // Flip the card with animation
    const cardInner = card.querySelector('.card-inner');
    if (cardInner) {
        if (typeof gsap !== 'undefined') {
            gsap.to(cardInner, {
                rotationY: 180,
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            cardInner.style.transform = 'rotateY(180deg)';
        }
    }
    
    card.classList.add('flipped');
    state.flippedCards.push(index);
    
    // Check if we have a pair flipped
    if (state.flippedCards.length === 2) {
        state.locked = true;
        state.moves++;
        
        const movesElement = document.getElementById('memory-moves');
        if (movesElement) movesElement.textContent = state.moves.toString();
        
        const firstCardIndex = state.flippedCards[0];
        const secondCardIndex = state.flippedCards[1];
        
        // Check if symbols match
        if (cardsArray[firstCardIndex].symbol === cardsArray[secondCardIndex].symbol) {
            // Match found
            cardsArray[firstCardIndex].matched = true;
            cardsArray[secondCardIndex].matched = true;
            state.matches++;
            state.score += 10 * state.level;
            
            const scoreElement = document.getElementById('memory-score');
            if (scoreElement) scoreElement.textContent = state.score.toString();
            
            // Add matched class for visual feedback
            setTimeout(() => {
                const firstCard = document.querySelector(`.memory-card[data-index="${firstCardIndex}"]`);
                const secondCard = document.querySelector(`.memory-card[data-index="${secondCardIndex}"]`);
                
                if (firstCard) firstCard.classList.add('matched');
                if (secondCard) secondCard.classList.add('matched');
                
                // Animate matched cards
                if (typeof gsap !== 'undefined' && firstCard && secondCard) {
                    gsap.to([firstCard, secondCard], {
                        y: -10,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }, 500);
            
            // Reset for next pair
            state.flippedCards = [];
            state.locked = false;
            
            // Update message
            const memoryMessage = document.getElementById('memory-message');
            if (memoryMessage) {
                memoryMessage.textContent = 'Great job! Found a match!';
                memoryMessage.style.color = 'var(--success-color)';
            }
            
            // Check for level completion
            const totalPairs = cardsArray.length / 2;
            if (state.matches === totalPairs) {
                // Stop timer
                if (window.memoryTimer) clearInterval(window.memoryTimer);
                
                // Level completed
                endMemoryGame(true);
            }
        } else {
            // No match
            setTimeout(() => {
                const firstCard = document.querySelector(`.memory-card[data-index="${firstCardIndex}"]`);
                const secondCard = document.querySelector(`.memory-card[data-index="${secondCardIndex}"]`);
                
                // Flip back with animation
                if (firstCard && secondCard) {
                    const firstCardInner = firstCard.querySelector('.card-inner');
                    const secondCardInner = secondCard.querySelector('.card-inner');
                    
                    if (typeof gsap !== 'undefined' && firstCardInner && secondCardInner) {
                        gsap.to([firstCardInner, secondCardInner], {
                            rotationY: 0,
                            duration: 0.5,
                            ease: "power2.in"
                        });
                    } else {
                        if (firstCardInner) firstCardInner.style.transform = 'rotateY(0)';
                        if (secondCardInner) secondCardInner.style.transform = 'rotateY(0)';
                    }
                    
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                }
                
                // Reset for next try
                state.flippedCards = [];
                state.locked = false;
                
                // Update message
                const memoryMessage = document.getElementById('memory-message');
                if (memoryMessage) {
                    memoryMessage.textContent = 'Try again!';
                    memoryMessage.style.color = 'var(--warning-color)';
                }
            }, 1000);
        }
    }
}

// Space Shooter Game
function initSpaceShooter() {
    // Cancel any existing animation frame
    if (window.spaceAnimationFrame) {
        cancelAnimationFrame(window.spaceAnimationFrame);
    }
    
    // Initialize canvas and game objects
    const canvas = document.getElementById('game-canvas');
    const startBtn = document.getElementById('start-shooter-game');
    const gameControls = document.getElementById('game-controls');
    const shooterMessage = document.getElementById('shooter-message');
    
    if (!canvas) return;
    
    // Make sure canvas dimensions are properly set
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    
    // Set up start button
    if (startBtn) {
        // Remove existing event listeners
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.addEventListener('click', startSpaceShooterGame);
    }
    
    // Define game constants and variables
    window.spaceGame = {
        canvas: canvas,
        ctx: ctx,
        ship: null,
        asteroids: [],
        bullets: [],
        explosions: [], // Array to store explosion animations
        stars: [],
        gameOver: false,
        score: 0,
        lives: 3,
        level: 1,
        lastTime: 0,
        lastAsteroidTime: 0, // Track when the last asteroid was spawned
        keys: {},
        touchControls: {
            left: false,
            right: false,
            fire: false
        },
        shipVisible: true,
        asteroidSpawnRate: 3000, // Milliseconds between asteroid spawns
        minAsteroidCount: 5 // Minimum number of asteroids on screen
    };
    
    // Keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Touch controls for mobile devices
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Create initial stars background
    createStars();
    
    // Show game instructions
    drawInstructionsScreen();
    
    // Reset score and lives display
    const scoreElement = document.getElementById('shooter-score');
    const livesElement = document.getElementById('shooter-lives');
    
    if (scoreElement) scoreElement.textContent = '0';
    if (livesElement) livesElement.textContent = '3';
    
    // Show starting UI
    if (gameControls) gameControls.style.display = 'flex';
    if (shooterMessage) {
        shooterMessage.textContent = 'Press Start to play!';
        shooterMessage.style.color = 'var(--text-light)';
    }
}

function handleKeyDown(e) {
    if (!window.spaceGame) return;
    
    window.spaceGame.keys[e.code] = true;
    
    // Space bar for shooting
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        fireBullet();
    }
}

function handleKeyUp(e) {
    if (!window.spaceGame) return;
    
    window.spaceGame.keys[e.code] = false;
}

function handleTouch(e) {
    e.preventDefault();
    if (!window.spaceGame || !window.spaceGame.canvas) return;
    
    const canvas = window.spaceGame.canvas;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    
    // Divide screen into three areas
    const leftArea = canvas.width * 0.33;
    const rightArea = canvas.width * 0.66;
    
    if (x < leftArea) {
        window.spaceGame.touchControls.left = true;
        window.spaceGame.touchControls.right = false;
    } else if (x > rightArea) {
        window.spaceGame.touchControls.right = true;
        window.spaceGame.touchControls.left = false;
    } else {
        // Middle area for firing
        window.spaceGame.touchControls.left = false;
        window.spaceGame.touchControls.right = false;
        fireBullet();
    }
}

function handleTouchEnd() {
    if (!window.spaceGame) return;
    
    window.spaceGame.touchControls.left = false;
    window.spaceGame.touchControls.right = false;
}

function createStars() {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    game.stars = [];
    
    // Create stars for background
    for (let i = 0; i < 100; i++) {
        game.stars.push({
            x: Math.random() * game.canvas.width,
            y: Math.random() * game.canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 1
        });
    }
}

function drawInstructionsScreen() {
    if (!window.spaceGame || !window.spaceGame.ctx || !window.spaceGame.canvas) return;
    
    const game = window.spaceGame;
    const ctx = game.ctx;
    const canvas = game.canvas;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawStars();
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = '30px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE SHOOTER', canvas.width / 2, canvas.height / 3);
    
    // Draw instructions
    ctx.font = '16px Poppins, sans-serif';
    ctx.fillText('Use arrow keys or tap sides to move', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Space or tap center to shoot', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('Destroy asteroids to earn points', canvas.width / 2, canvas.height / 2 + 60);
    
    // Draw start prompt
    ctx.font = '20px Orbitron, sans-serif';
    ctx.fillStyle = '#6c5ce7';
    ctx.fillText('Press START to play', canvas.width / 2, canvas.height * 3/4);
    
    // Draw flickering arrow
    const now = Date.now();
    if (Math.floor(now / 500) % 2 === 0) {
        ctx.fillText('↓', canvas.width / 2, canvas.height * 3/4 + 30);
    }
    
    // Request animation frame for blinking effect
    window.spaceAnimationFrame = requestAnimationFrame(drawInstructionsScreen);
}

function startSpaceShooterGame() {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    // Stop the instruction screen animation
    if (window.spaceAnimationFrame) {
        cancelAnimationFrame(window.spaceAnimationFrame);
    }
    
    // Reset game state
    game.asteroids = [];
    game.bullets = [];
    game.explosions = [];
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.gameOver = false;
    game.shipVisible = true;
    game.lastAsteroidTime = Date.now();
    game.asteroidSpawnRate = 3000;
    
    // Update UI
    const scoreElement = document.getElementById('shooter-score');
    const livesElement = document.getElementById('shooter-lives');
    const messageElement = document.getElementById('shooter-message');
    const controlsElement = document.getElementById('game-controls');
    
    if (scoreElement) scoreElement.textContent = '0';
    if (livesElement) livesElement.textContent = '3';
    if (messageElement) {
        messageElement.textContent = 'Game started! Destroy the asteroids!';
        messageElement.style.color = 'var(--success-color)';
    }
    
    // Hide start button and controls
    if (controlsElement) controlsElement.style.display = 'none';
    
    // Create player ship
    game.ship = {
        x: game.canvas.width / 2,
        y: game.canvas.height - 50,
        width: 30,
        height: 40,
        speed: 5
    };
    
    // Create initial asteroids
    createAsteroids(game.minAsteroidCount + game.level);
    
    // Start game loop
    game.lastTime = performance.now();
    gameLoop(game.lastTime);
}

function createAsteroids(count) {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    for (let i = 0; i < count; i++) {
        const asteroid = {
            x: Math.random() * game.canvas.width,
            y: -50 - Math.random() * 100,
            size: Math.random() * 20 + 20,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 + 1,
            rotation: 0,
            rotationSpeed: Math.random() * 0.05 - 0.025
        };
        game.asteroids.push(asteroid);
    }
}

function createExplosion(x, y, size) {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    // Create a new explosion
    game.explosions.push({
        x: x,
        y: y,
        size: size,
        radius: 1, // Start small
        maxRadius: size * 1.5, // Max explosion size
        alpha: 1, // Full opacity
        growing: true
    });
}

function fireBullet() {
    if (!window.spaceGame || window.spaceGame.gameOver || !window.spaceGame.ship) return;
    
    const game = window.spaceGame;
    
    // Add bullet
    game.bullets.push({
        x: game.ship.x + game.ship.width / 2,
        y: game.ship.y,
        width: 4,
        height: 12,
        speed: 10
    });
}

function gameLoop(timestamp) {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    // Calculate delta time for smooth animations
    const deltaTime = timestamp - game.lastTime;
    game.lastTime = timestamp;
    
    // Update game state
    update(deltaTime);
    
    // Render the game
    render();
    
    // Continue loop if game not over
    if (!game.gameOver) {
        window.spaceAnimationFrame = requestAnimationFrame(gameLoop);
    } else {
        // Show game over
        showGameOverScreen();
    }
}

function update(deltaTime) {
    if (!window.spaceGame || window.spaceGame.gameOver) return;
    
    const game = window.spaceGame;
    const currentTime = Date.now();
    
    // Move ship based on keys or touch
    const shipSpeed = game.ship.speed * (deltaTime / 16); // Normalize for frame rate
    
    if ((game.keys['ArrowLeft'] || game.keys['KeyA'] || game.touchControls.left) && game.ship.x > 0) {
        game.ship.x -= shipSpeed;
    }
    if ((game.keys['ArrowRight'] || game.keys['KeyD'] || game.touchControls.right) && game.ship.x < game.canvas.width - game.ship.width) {
        game.ship.x += shipSpeed;
    }
    
    // Update bullets
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        bullet.y -= bullet.speed * (deltaTime / 16);
        
        // Remove bullets that are off screen
        if (bullet.y < 0) {
            game.bullets.splice(i, 1);
        }
    }
    
    // Check if we need to spawn more asteroids
    if (currentTime - game.lastAsteroidTime > game.asteroidSpawnRate && game.asteroids.length < game.minAsteroidCount + game.level) {
        createAsteroids(1 + Math.floor(game.level / 3)); // Increase spawn count based on level
        game.lastAsteroidTime = currentTime;
        
        // Gradually decrease spawn rate as game progresses to increase difficulty
        game.asteroidSpawnRate = Math.max(500, 3000 - game.level * 200);
    }
    
    // Update asteroids
    for (let i = game.asteroids.length - 1; i >= 0; i--) {
        const asteroid = game.asteroids[i];
        asteroid.y += asteroid.speedY * (deltaTime / 16);
        asteroid.x += asteroid.speedX * (deltaTime / 16);
        asteroid.rotation += asteroid.rotationSpeed * (deltaTime / 16);
        
        // Check if asteroid is off screen
        if (asteroid.y > game.canvas.height + asteroid.size) {
            game.asteroids.splice(i, 1);
        }
        
        // Check collision with ship
        if (checkCollision(game.ship, asteroid) && game.shipVisible) {
            game.lives--;
            
            // Update UI
            const livesElement = document.getElementById('shooter-lives');
            if (livesElement) livesElement.textContent = game.lives.toString();
            
            // Create explosion at asteroid location
            createExplosion(asteroid.x, asteroid.y, asteroid.size);
            
            // Remove asteroid
            game.asteroids.splice(i, 1);
            
            // Check game over
            if (game.lives <= 0) {
                game.gameOver = true;
                return;
            }
            
            // Flash ship for feedback
            flashShip();
            
            // Continue to next asteroid
            continue;
        }
        
        // Check collision with bullets
        for (let j = game.bullets.length - 1; j >= 0; j--) {
            const bullet = game.bullets[j];
            
            if (checkCollision(bullet, asteroid)) {
                // Add score
                game.score += 10;
                
                // Update UI
                const scoreElement = document.getElementById('shooter-score');
                if (scoreElement) scoreElement.textContent = game.score.toString();
                
                // Create explosion at asteroid location
                createExplosion(asteroid.x, asteroid.y, asteroid.size);
                
                // Remove bullet and asteroid
                game.bullets.splice(j, 1);
                game.asteroids.splice(i, 1);
                
                // Level up when reaching score thresholds
                if (game.score > 0 && game.score % 100 === 0) {
                    game.level++;
                    
                    // Show level up message
                    const messageElement = document.getElementById('shooter-message');
                    if (messageElement) {
                        messageElement.textContent = `Level ${game.level}! Asteroids are faster!`;
                        messageElement.style.color = 'var(--accent-color)';
                        
                        // Clear message after a few seconds
                        setTimeout(() => {
                            if (messageElement && !game.gameOver) {
                                messageElement.textContent = 'Destroy the asteroids!';
                                messageElement.style.color = 'var(--success-color)';
                            }
                        }, 3000);
                    }
                }
                
                break;
            }
        }
    }
    
    // Update explosions
    for (let i = game.explosions.length - 1; i >= 0; i--) {
        const explosion = game.explosions[i];
        
        if (explosion.growing) {
            // Expanding phase
            explosion.radius += deltaTime / 30;
            
            if (explosion.radius >= explosion.maxRadius) {
                explosion.growing = false;
            }
        } else {
            // Fading phase
            explosion.alpha -= deltaTime / 500;
            
            // Remove explosion when faded out
            if (explosion.alpha <= 0) {
                game.explosions.splice(i, 1);
            }
        }
    }
    
    // Move stars for parallax effect
    updateStars(deltaTime);
}

function updateStars(deltaTime) {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    for (let i = 0; i < game.stars.length; i++) {
        const star = game.stars[i];
        star.y += star.speed * (deltaTime / 16);
        
        // Reset stars that go off screen
        if (star.y > game.canvas.height) {
            star.y = 0;
            star.x = Math.random() * game.canvas.width;
        }
    }
}

function checkCollision(obj1, obj2) {
    // Skip collision if either object doesn't exist
    if (!obj1 || !obj2) return false;
    
    // For ship and bullets (rectangles)
    if (obj1.width && obj1.height) {
        // For asteroids (circles)
        if (obj2.size) {
            // Circle-rectangle collision
            const distX = Math.abs(obj2.x - (obj1.x + obj1.width / 2));
            const distY = Math.abs(obj2.y - (obj1.y + obj1.height / 2));
            
            if (distX > (obj1.width / 2 + obj2.size / 2)) return false;
            if (distY > (obj1.height / 2 + obj2.size / 2)) return false;
            
            if (distX <= (obj1.width / 2)) return true;
            if (distY <= (obj1.height / 2)) return true;
            
            const dx = distX - obj1.width / 2;
            const dy = distY - obj1.height / 2;
            return (dx * dx + dy * dy <= (obj2.size * obj2.size / 4));
        }
    }
    
    return false;
}

function flashShip() {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    game.shipVisible = false;
    
    // Flash ship 3 times
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        game.shipVisible = !game.shipVisible;
        flashCount++;
        
        if (flashCount >= 6) {
            clearInterval(flashInterval);
            game.shipVisible = true;
        }
    }, 200);
}

function render() {
    if (!window.spaceGame || !window.spaceGame.ctx || !window.spaceGame.canvas) return;
    
    const game = window.spaceGame;
    const ctx = game.ctx;
    const canvas = game.canvas;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawStars();
    
    // Draw ship
    if (game.ship && game.shipVisible) {
        ctx.fillStyle = '#6c5ce7';
        ctx.beginPath();
        ctx.moveTo(game.ship.x + game.ship.width / 2, game.ship.y);
        ctx.lineTo(game.ship.x, game.ship.y + game.ship.height);
        ctx.lineTo(game.ship.x + game.ship.width, game.ship.y + game.ship.height);
        ctx.closePath();
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a29bfe';
        
        // Engine flame
        ctx.fillStyle = '#fd79a8';
        ctx.beginPath();
        ctx.moveTo(game.ship.x + game.ship.width / 2 - 5, game.ship.y + game.ship.height);
        ctx.lineTo(game.ship.x + game.ship.width / 2, game.ship.y + game.ship.height + 10 + Math.random() * 5);
        ctx.lineTo(game.ship.x + game.ship.width / 2 + 5, game.ship.y + game.ship.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
    
    // Draw bullets
    ctx.fillStyle = '#00cec9';
    game.bullets.forEach(bullet => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00cec9';
        ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });
    
    // Draw asteroids
    game.asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#636e72';
        ctx.fill();
        
        // Add some detail to the asteroids
        ctx.beginPath();
        const craterSize = asteroid.size / 5;
        ctx.arc(asteroid.size / 4, -asteroid.size / 4, craterSize, 0, Math.PI * 2);
        ctx.fillStyle = '#2d3436';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-asteroid.size / 5, asteroid.size / 5, craterSize * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#2d3436';
        ctx.fill();
        
        ctx.restore();
    });
    
    // Draw explosions
    game.explosions.forEach(explosion => {
        const gradient = ctx.createRadialGradient(
            explosion.x, explosion.y, explosion.radius / 4,
            explosion.x, explosion.y, explosion.radius
        );
        
        gradient.addColorStop(0, `rgba(253, 121, 168, ${explosion.alpha})`);
        gradient.addColorStop(0.4, `rgba(253, 203, 110, ${explosion.alpha * 0.8})`);
        gradient.addColorStop(1, `rgba(108, 92, 231, ${explosion.alpha * 0.1})`);
        
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    });
    
    // Draw debug info
    if (window.debugMode) {
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Asteroids: ${game.asteroids.length}`, 10, 20);
        ctx.fillText(`Bullets: ${game.bullets.length}`, 10, 40);
        ctx.fillText(`Explosions: ${game.explosions.length}`, 10, 60);
        ctx.fillText(`Level: ${game.level}`, 10, 80);
        ctx.fillText(`Spawn Rate: ${game.asteroidSpawnRate}ms`, 10, 100);
    }
}

function drawStars() {
    if (!window.spaceGame || !window.spaceGame.ctx) return;
    
    const game = window.spaceGame;
    const ctx = game.ctx;
    
    game.stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function showGameOverScreen() {
    if (!window.spaceGame) return;
    
    const game = window.spaceGame;
    
    // Display game over message
    const messageElement = document.getElementById('shooter-message');
    const controlsElement = document.getElementById('game-controls');
    const startBtn = document.getElementById('start-shooter-game');
    
    if (messageElement) messageElement.textContent = 'Game Over!';
    if (controlsElement) controlsElement.style.display = 'flex';
    if (startBtn) {
        startBtn.style.display = 'block';
        startBtn.textContent = 'Play Again';
    }
    
    // Show game over modal
    showGameOverModal('Your ship was destroyed!', game.score);
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}