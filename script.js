/**? Elements/Variables */
const addCardText = document.getElementById('add-card-text');
const addCardBtn = document.getElementById('add-card-btn');

const hamburger = document.querySelector('.hamburger');
const wrapper = document.querySelector('.wrapper');
const sidebar = document.querySelector('.sidebar');
const displayArea = document.querySelector('.display-area');

document.addEventListener('DOMContentLoaded', () => {
    
    const addCardBtn = document.getElementById('add-card-btn');
    const addCardText = document.getElementById('add-card-text');
    const cardContainer = document.querySelector('.card-container');
    const noCardsMessage = document.getElementById('no-cards-message');

    if (!addCardBtn || !addCardText || !cardContainer || !noCardsMessage) {
        console.error('One or more elements not found');
        return;
    }

    checkNoCards();

    function saveCardsToLocalStorage(cards) {
        localStorage.setItem('cards', JSON.stringify(cards));
    }

    function loadCardsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('cards')) || [];
    }

    function createCardElement(cardText) {
        const card = document.createElement('div');
        card.classList.add('card');

        const bg = document.createElement('div');
        bg.classList.add('bg');

        const blob = document.createElement('div');
        blob.classList.add('blob');

        const h5 = document.createElement('h5');
        h5.classList.add('mx-2');
        h5.style.textTransform = 'capitalize';
        h5.textContent = cardText;

        bg.appendChild(h5);
        card.appendChild(bg);
        card.appendChild(blob);

        return card;
    }

    function renderCards(cards) {
        cardContainer.innerHTML = '';
        cards.forEach(cardText => {
            const cardElement = createCardElement(cardText);
            cardContainer.appendChild(cardElement);
        });
        checkNoCards();
    }

    function addCard(cardText) {
        const cards = loadCardsFromLocalStorage();
        cards.push(cardText);
        saveCardsToLocalStorage(cards);
        renderCards(cards);
    }    

    function checkNoCards() {
        const cards = loadCardsFromLocalStorage();
        if (cards.length === 0) {
            console.log('no cards')
            noCardsMessage.style.display = 'block';
        } else {
            noCardsMessage.style.display = 'none';
        }
    }

    addCardBtn.addEventListener('click', () => {
        const cardText = addCardText.value.trim();
        if (cardText) {
            addCard(cardText);
            addCardText.value = '';
        } else {
            alert('Please enter a card title.');
        }
    });

    // Initial load of cards from local storage
    renderCards(loadCardsFromLocalStorage());
    checkNoCards();
  
});


addCardBtn.addEventListener("click", function() {
    console.log(addCardText.value)
})

hamburger.addEventListener("click", function() {
    //wrapper.classList.toggle('collapse')
    sidebar.classList.toggle('collapse');
    // displayArea.classList.toggle('collapse')
    // alert('hamburger')
})