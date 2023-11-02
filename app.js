const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = "";

// Principal Component Event
form.addEventListener('submit', addItem);

// Clear all Items Event
clearBtn.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', setupItem);

// Principal Component
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
        createListEvent(id, value);

        container.classList.add('show-container');

        displayAlert('Produto adicionado à lista', 'success');

        addtoLocalStorage(id, value);

        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Produto trocado', 'success');
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else {
        displayAlert('Adicionar Produto', 'danger');
    }
}

// FUNCTIONS

// Alert Parametrization Component
function displayAlert(text, action) {
    alert.innerHTML = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function () {
        alert.innerHTML = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// Clear All Items Function
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    items.forEach(function (item) {
        list.removeChild(item);
    });
    container.classList.remove('show-container');

    displayAlert('Produtos excluídos da lista', 'danger');

    setBackToDefault();

    localStorage.removeItem('list')
}

// Delete Function
function deleteItem(e) {
    const singleElement = e.currentTarget.parentElement.parentElement;
    const id = singleElement.dataset.id;
    list.removeChild(singleElement);

    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }

    displayAlert('Produto excluído', 'danger');
    setBackToDefault();

    removeFromLocalStorage(id);
}
// Edit Function
function editItem(e) {
    const singleElement = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = singleElement.dataset.id;
    submitBtn.textContent = 'Editar';
}
// Default 
function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'Adicionar';
}

// ***** LOCAL STORAGE *****
function addtoLocalStorage(id, value) {
    const groceries = { id, value };
    let items = getLocalStorage();
    items.push(groceries);
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

/*localStorage.setItem('orange',JSON.stringify(['item','item2']));
const oranges = JSON.parse(localStorage.getItem('orange'));
console.log(oranges);
localStorage.removeItem('orange');*/

function setupItem() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListEvent(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

function createListEvent(id, value) {
    const element = document.createElement('article');

    element.classList.add('grocery-item');

    const attr = document.createAttribute('data-id');

    attr.value = id;

    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="del-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`
    const deleteBtn = element.querySelector('.del-btn');
    deleteBtn.addEventListener('click', deleteItem);

    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    list.appendChild(element);
}

const year = document.querySelector('.year');
year.innerHTML = new Date().getFullYear();