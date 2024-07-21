/**? Elements/Variables */
const addCardText = document.getElementById('add-card-text');
const addCardBtn = document.getElementById('add-card-btn');

const hamburger = document.querySelector('.hamburger');
const wrapper = document.querySelector('.wrapper');
const sidebar = document.querySelector('.sidebar');
const displayArea = document.querySelector('.display-area');

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        addBoardBtn: document.getElementById('add-board-btn'),
        addBoardText: document.getElementById('add-board-text'),
        boardsList: document.getElementById('boards-list'),
        addCardBtn: document.getElementById('add-card-btn'),
        addCardText: document.getElementById('add-card-text'),
        cardContainer: document.querySelector('.card-container'),
        noCardsMessage: document.getElementById('no-cards-message'),
        boardTitleHeader: document.getElementById('board-title-header'),
        deleteBoardBtn : document.getElementById('delete-board-btn')
    };

    const missingElements = Object.entries(elements)
        .filter(([key, value]) => !value && key !== 'boardTitleHeader')
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('The following elements were not found:', missingElements.join(', '));
        return;
    }

    let activeBoard = null;

    function saveBoardsToLocalStorage(boards) {
        localStorage.setItem('boards', JSON.stringify(boards));
    }

    function loadBoardsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('boards')) || [];
    }

    function createBoardElement(board) {
        const boardElement = document.createElement('div');
        boardElement.classList.add('board-card');
        boardElement.innerHTML = `
            <div class="img"></div>
            <div class="textBox">
                <div class="textContent">
                    <p class="h1">${board.title}</p>
                </div>
            </div>
        `;
        boardElement.addEventListener('click', () => selectBoard(board));
        return boardElement;
    }

    function renderBoards(boards) {
        elements.boardsList.innerHTML = '';
        boards.forEach(board => {
            if (board && board.title) {
                const boardElement = createBoardElement(board);
                elements.boardsList.appendChild(boardElement);
            }
        });
    }

    function addBoard(boardTitle) {
        const boards = loadBoardsFromLocalStorage();
        const newBoard = { title: boardTitle, cards: [] };
        boards.push(newBoard);
        saveBoardsToLocalStorage(boards);
        renderBoards(boards);
    }

    function selectBoard(board) {
        const boards = loadBoardsFromLocalStorage();
        activeBoard = boards.find(b => b.title === board.title) || board;
        if (elements.boardTitleHeader) {
            elements.boardTitleHeader.textContent = board.title;
        }
        renderCards(activeBoard.cards || []);
    }

    function createCardElement(cardText, tasks=[], index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="bg">
                <div class="tasks-header">            
                    <h5 class="mx-2" style="text-transform: capitalize;">${cardText}</h5>
                    <div class="menuToggle">
                        <input class="checkbox" type="checkbox" id="toggle-${index}">
                        <label class="toggle" for="toggle-${index}">
                            <div class="bar bar--top"></div>
                            <div class="bar bar--middle"></div>
                            <div class="bar bar--bottom"></div>
                        </label>
                        <div class="dropdown-menu">
                            <button class="dropdown-item delete-card">Delete</button>
                            <button class="dropdown-item clear-tasks">Clear Tasks</button>
                        </div>
                    </div>
                </div>
                <ul class="task-list">
                ${tasks.map((task,taskIndex) => `
                    <li draggable="true" data-card-index="${index}" data-task-index="${taskIndex}">
                        ${task}
                        <span class="task-icons">
                                <i class="fa-solid fa-pencil edit-task" data-task-index="${taskIndex}"></i>
                                <i class="fa-solid fa-trash delete-task" data-task-index="${taskIndex}"></i>
                        </span>
                    </li>
                `).join('')}
                </ul>
                <div class="add-task">
                    <div class="task-input">
                        <input
                            class="to-do-input"
                            placeholder="Your Tasks"
                            name="text"
                            type="text"
                            autocomplete="off"
                        />
                        <div class="todo-line">&nbsp;</div>
                    </div>
                    <button class="task-input add-task-button"> <svg height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path></svg></button>
                </div>
            </div>
            <div class="blob"></div>
        `;

        const addTaskButton = card.querySelector('.add-task-button');
        const taskInput = card.querySelector('.to-do-input');
        const taskList = card.querySelector('.task-list');

        const checkbox = card.querySelector('.checkbox');
        const dropdownMenu = card.querySelector('.dropdown-menu');
        const deleteButton = card.querySelector('.delete-card');
        const clearButton = card.querySelector('.clear-tasks');
    
        addTaskButton.addEventListener('click', () => addTask(cardText, taskInput, taskList));
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(cardText, taskInput, taskList);
            }
        });

        checkbox.addEventListener('change', () => {
            dropdownMenu.style.display = checkbox.checked ? 'block' : 'none';
        });
    
        deleteButton.addEventListener('click', () => {
            // Implement delete card functionality
            console.log('Delete card');
            const cardIndex = Array.from(card.parentNode.children).indexOf(card);
            deleteCard(cardIndex);
        });
    
        clearButton.addEventListener('click', () => {
            // Implement clear tasks functionality
            console.log('Clear tasks');
            const cardIndex = Array.from(card.parentNode.children).indexOf(card);
            clearTasks(cardIndex);
        });

         // Add event listeners for edit and delete task buttons
        // taskList.addEventListener('click', (e) => {
        //     if (e.target.classList.contains('delete-task')) {
        //         const taskIndex = e.target.dataset.taskIndex;
        //         deleteTask(index, taskIndex);
        //     } else if (e.target.classList.contains('edit-task')) {
        //         const taskIndex = e.target.dataset.taskIndex;
        //         editTask(index, taskIndex);
        //     }
        // });
        taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-task')) {
                const taskIndex = e.target.closest('li').dataset.taskIndex;
                deleteTask(index, parseInt(taskIndex));
            } else if (e.target.classList.contains('edit-task')) {
                const taskIndex = e.target.closest('li').dataset.taskIndex;
                editTask(index, parseInt(taskIndex));
            }
        });

         // Add drag and drop event listeners
        taskList.addEventListener('dragstart', dragStart);
        taskList.addEventListener('dragend', dragEnd);
        card.addEventListener('dragover', dragOver);
        card.addEventListener('drop', drop);

        return card;
    }

    function renderCards(cards) {
        elements.cardContainer.innerHTML = '';
        cards.forEach((card,index) => {
            const cardElement = createCardElement(card.text, card.tasks || [], index);
            elements.cardContainer.appendChild(cardElement);
        });
        checkNoCards();
    }

    function addCard(cardText) {
        if (!activeBoard) {
            alert('Please select a board first.');
            return;
        }
        const boards = loadBoardsFromLocalStorage();
        const boardIndex = boards.findIndex(board => board.title === activeBoard.title);
        if (boardIndex !== -1) {
            if (!boards[boardIndex].cards) {
                boards[boardIndex].cards = [];
            }
            boards[boardIndex].cards.push({ text: cardText, tasks: [] });
            activeBoard = boards[boardIndex]; // Update the active board
        } else {
            console.error('Active board not found in localStorage');
            return;
        }
        saveBoardsToLocalStorage(boards);
        renderCards(activeBoard.cards);
    }    

    function addTask(cardText, taskInput, taskList) {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement('li');
            const cardIndex = Array.from(taskList.closest('.card').parentNode.children).indexOf(taskList.closest('.card'));
            const taskIndex = taskList.children.length;

            li.draggable = true;
            li.dataset.cardIndex = cardIndex;
            li.dataset.taskIndex = taskIndex;

            li.innerHTML = `
            ${taskText}
            <span class="task-icons">
                <i class="fa-solid fa-pencil edit-task" data-task-index="${taskIndex}"></i>
                <i class="fa-solid fa-trash delete-task" data-task-index="${taskIndex}"></i>
            </span>
            `;

            li.textContent = taskText;
            taskList.appendChild(li);
            taskInput.value = '';
    
            // Update the board in local storage
            const boards = loadBoardsFromLocalStorage();
            const updatedBoards = boards.map(board => {
                if (board.title === activeBoard.title) {
                    const cardIndex = board.cards.findIndex(card => card.text === cardText);
                    if (cardIndex !== -1) {
                        if (!board.cards[cardIndex].tasks) {
                            board.cards[cardIndex].tasks = [];
                        }
                        board.cards[cardIndex].tasks.push(taskText);
                    }
                }
                return board;
            });
            saveBoardsToLocalStorage(updatedBoards);
            activeBoard = updatedBoards.find(board => board.title === activeBoard.title);
              // Re-render the entire card
            const cardElement = createCardElement(cardText, activeBoard.cards[cardIndex].tasks, cardIndex);
            taskList.closest('.card').replaceWith(cardElement);

            // Clear the input
            taskInput.value = '';
        }
    }

    function deleteBoard() {
        if (!activeBoard) {
            alert('Please select a board first.');
            return;
        }
        const boardTitle = activeBoard.title;
        let boards = loadBoardsFromLocalStorage();
        boards = boards.filter(board => board.title !== activeBoard.title);
        saveBoardsToLocalStorage(boards);
        activeBoard = null;
        elements.boardTitleHeader.textContent = '';
        renderBoards(boards);
        renderCards([]);
        alert(`Board "${boardTitle}" has been deleted.`);
    }

    function checkNoCards() {
        if (activeBoard && activeBoard.cards.length === 0) {
            elements.noCardsMessage.style.display = 'block';
        } else {
            elements.noCardsMessage.style.display = 'none';
        }
    }

    function deleteCard (index) {
         // Remove the card from the activeBoard.cards array
        activeBoard.cards.splice(index, 1);
        // Update localStorage
        updateLocalStorage();
        // Re-render the cards
        renderCards(activeBoard.cards);
    }

    function clearTasks (index) {
        // Remove the tasks from the activeBoard.cards[index].tasks array
        // Clear the tasks for the specific card
        activeBoard.cards[index].tasks = [];
        // Update localStorage
        updateLocalStorage();
        // Re-render the cards
        renderCards(activeBoard.cards);
    }

    function deleteTask(cardIndex, taskIndex) {
        activeBoard.cards[cardIndex].tasks.splice(taskIndex, 1);
        updateLocalStorage();
        renderCards(activeBoard.cards);
    }
    
    function editTask(cardIndex, taskIndex) {
        const currentTask = activeBoard.cards[cardIndex].tasks[taskIndex];
        const newTask = prompt('Edit task:', currentTask);
        if (newTask !== null && newTask.trim() !== '') {
            activeBoard.cards[cardIndex].tasks[taskIndex] = newTask.trim();
            updateLocalStorage();
            renderCards(activeBoard.cards);
        }
    }

    function updateLocalStorage() {
        const boards = loadBoardsFromLocalStorage();
        const updatedBoards = boards.map(board => 
            board.title === activeBoard.title ? activeBoard : board
        );
        saveBoardsToLocalStorage(updatedBoards);
    }

    //Drag & Drop Function 
    let draggedItem = null;

    function dragStart(e) {
        draggedItem = e.target.closest('li');
        setTimeout(() => (draggedItem.style.display = 'none'), 0);
    }

    function dragEnd(e) {
        setTimeout(() => {
            draggedItem.style.display = 'block';
            draggedItem = null;
        }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        if (draggedItem) {
            const sourceCardIndex = parseInt(draggedItem.dataset.cardIndex);
            const sourceTaskIndex = parseInt(draggedItem.dataset.taskIndex);
            const targetCard = e.target.closest('.card');
            const targetCardIndex = Array.from(targetCard.parentNode.children).indexOf(targetCard);
    
            // Move the task from source card to target card
            const task = activeBoard.cards[sourceCardIndex].tasks.splice(sourceTaskIndex, 1)[0];
            activeBoard.cards[targetCardIndex].tasks.push(task);
    
            updateLocalStorage();
            renderCards(activeBoard.cards);
        }
    }

    elements.addBoardBtn.addEventListener('click', () => {
        const boardTitle = elements.addBoardText.value.trim();
        if (boardTitle) {
            addBoard(boardTitle);
            elements.addBoardText.value = '';
        } else {
            alert('Please enter a board title.');
        }
    });

    elements.addCardBtn.addEventListener('click', () => {
        if (!activeBoard) {
            alert('Please select a board first.');
            return;
        }
        const cardText = elements.addCardText.value.trim();
        if (cardText) {
            addCard(cardText);
            elements.addCardText.value = '';
        } else {
            alert('Please enter a card title.');
        }
    });

    elements.deleteBoardBtn.addEventListener('click', deleteBoard);

   

 

    // Initial setup
    renderBoards(loadBoardsFromLocalStorage());
    if (elements.boardTitleHeader) {
        elements.boardTitleHeader.textContent = '';  // Clear the initial header text
    }
});


addCardBtn.addEventListener("click", function() {
    console.log(addCardText.value)
})


//SideNav
hamburger.addEventListener("click", function() {
    //wrapper.classList.toggle('collapse')
    sidebar.classList.toggle('collapse');
   
    displayArea.classList.toggle('expanded')
    // alert('hamburger')
})