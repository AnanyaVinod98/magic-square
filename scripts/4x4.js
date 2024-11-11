document.addEventListener("DOMContentLoaded", function() {
    const magicSum = 34;
    const gridContainer = document.getElementById("grid");
    const numbersContainer = document.getElementById("numbers");

    // Generate 16 cells for the 4x4 grid
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.id = `cell${i}`;
        gridContainer.appendChild(cell);
    }

    // Generate draggable numbers from 1 to 16
    for (let i = 1; i <= 16; i++) {
        const number = document.createElement("div");
        number.classList.add("number");
        number.id = `num${i}`;
        number.draggable = true;
        number.textContent = i;
        numbersContainer.appendChild(number);

        // Add drag event listeners to numbers
        number.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text", event.target.id);
        });
    }

    // Add drop event listeners to grid cells for swapping
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.addEventListener("dragover", function(event) {
            event.preventDefault();
        });

        cell.addEventListener("drop", function(event) {
            event.preventDefault();
            const draggedElementId = event.dataTransfer.getData("text");
            const draggedElement = document.getElementById(draggedElementId);
            
            // Swap if cell has a child, else place dragged element
            if (cell.hasChildNodes()) {
                const existingChild = cell.firstChild;
                draggedElement.parentNode.appendChild(existingChild);
            }
            cell.appendChild(draggedElement);
        });
    });

    // Check if the grid forms a correct magic square
    document.getElementById("checkButton").addEventListener("click", function() {
        if (checkMagicSquare()) {
            showSuccessModal();
            showFeedbackMessage("Congratulations! You have completed the magic square.", "successMessage");
        } else {
            showFeedbackMessage("Oops! Try again.", "tryAgainMessage");
        }
    });

    // Reset button functionality
    document.getElementById("resetButton").addEventListener("click", function() {
        resetGame();
    });

    // Check if all rows, columns, and diagonals sum to 65
    function checkMagicSquare() {
        const cells = Array.from(document.querySelectorAll(".cell"));
        const rows = [
            [cells[0], cells[1], cells[2], cells[3]],
            [cells[4], cells[5], cells[6], cells[7]],
            [cells[8], cells[9], cells[10], cells[11]],
            [cells[12], cells[13], cells[14], cells[15]]
        ];

        const columns = [
            [cells[0], cells[4], cells[8], cells[12]],
            [cells[1], cells[5], cells[9], cells[13]],
            [cells[2], cells[6], cells[10], cells[14]],
            [cells[3], cells[7], cells[11], cells[15]]
        ];

        const diagonals = [
            [cells[0], cells[5], cells[10], cells[15]],
            [cells[3], cells[6], cells[9], cells[12]]
        ];

        return checkSum(rows, magicSum) && checkSum(columns, magicSum) && checkSum(diagonals, magicSum);
    }

    // Check if a set of arrays has each element summing to the magic sum
    function checkSum(arrays, sum) {
        return arrays.every(array => {
            const cellSum = array.reduce((acc, cell) => acc + parseInt(cell.firstChild?.textContent || 0), 0);
            return cellSum === sum;
        });
    }

    // Reset the game
    function resetGame() {
        // Clear all cells
        cells.forEach(cell => {
            if (cell.firstChild) {
                numbersContainer.appendChild(cell.firstChild);
            }
        });
        
        // Clear feedback message
        showFeedbackMessage("", "");
    }

    // Show feedback message below the Check button
    function showFeedbackMessage(message, messageClass) {
        const feedbackMessage = document.getElementById("feedbackMessage");
        feedbackMessage.textContent = message;
        feedbackMessage.style.display = "block";
        feedbackMessage.className = messageClass;
    }

    // Show the success modal
    function showSuccessModal() {
        const modal = document.getElementById("successModal");
        modal.style.display = "block";
    }

    // Close the success modal
    function closeModal() {
        const modal = document.getElementById("successModal");
        modal.style.display = "none";
    }

    // Next level button event
    document.getElementById("nextLevelButton").addEventListener("click", function() {
        closeModal();
        resetGame();
    });
});