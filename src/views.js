import { getCategory, contentPreview, iconName, countActive, countArchive, dates, deleteNote, loadNotes, loadCategories, recordNote, activeSwitchNote, updateNote } from './controllers.js';

const header1 = document.querySelector('.items-list')
const formPlace = document.querySelector('.for-form')
const header2 = document.querySelector('.categories-list')

const activeButton = document.querySelector('.header2__switch-active')
const archivedButton = document.querySelector('.header2__switch-archived')
const buttonCreate = document.querySelector('.button-create')
buttonCreate.addEventListener('click', (e) => buttonCreateHandler(e))
activeButton.addEventListener('click', () => swicher('active'))
archivedButton.addEventListener('click', () => swicher('archived'))

// Notes Template
const createNote = (note) => {
    header1.insertAdjacentHTML("beforeEnd", `
        <div class="item" data-id=${note.id}>
            <div class="item__ico"><i class="material-icons">${iconName(note.category)}</i></div>
            <div class="item__name">${note.name}</div>
            <div class="item__created">${note.created}</div>
            <div class="item__category">${getCategory(note.category)}</div>
            <div class="item__content">${contentPreview(note.content)}</div>
            <div class="item__dates">${dates(note.content)}</div>
            <button class="item__edit"><i class="material-icons">create</i></button>
            <button class="item__active"><i class="material-icons">archive</i></button>
            <button class="item__delete"><i class="material-icons">delete</i></button>
        </div>
      `);
    addEventListeners()
}

// Statistics Template
const updateCategoriesList = () => {
    header2.replaceChildren()
    const categories = loadCategories()
    categories.forEach(category => {
        header2.insertAdjacentHTML("beforeEnd", `
        <div class="item2">
            <div class="item2__ico"><i class="material-icons">${iconName(category.id)}</i></div>
            <div class="item2__category">${category.name}</div>
            <div class="item2__active">${countActive(category.id)}</div>
            <div class="item2__archived">${countArchive(category.id)}</div>
        </div>
      `)
    })
}

// Form Template
const getSelect = () => {
    const categories = loadCategories()
    const options = categories.reduce((options, category) => (
        options + `<option value="${category.id}">${category.name}</option>`), '')
    return options
}

const showForm = () => {
    formPlace.insertAdjacentHTML("beforeBegin", `
        <form class="form-note">
            <h1 class="form-note__title">Create Note</h1>
            <div class="form-note__label1">Name:</div>
            <input class="form-note__name">
            <div class="form-note__label2">Category:</div>
            <select class="form-note__select">
                ${getSelect()}
            </select>
            <div class="form-note__label3">Content:</div>
            <textarea class="form-note__content"  cols=35, rows=10 ></textarea>
            <div class="form-note__checkboxdiv">
                <input class="form-note__checkbox" type=checkbox checked>
                <span class="form-note__label4">Active</span>           
            </div>
            <div>
                <input class="form-note__button1" type=submit value="Create">
                <input class="form-note__button2" type=reset value="Cancel">
            </div>
        </form>
      `);
}
// Create Function
const buttonCreateHandler = (e) => {
    header1.replaceChildren()
    buttonCreate.classList.add('hidden')
    showForm()
    const noteAdd = document.querySelector('.form-note');
    const elementPosition = noteAdd.getBoundingClientRect().top;
    const offsetPosition = elementPosition - 20;
    window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
    })
    const buttonOk = noteAdd.querySelector('.form-note__button1')
    buttonOk.addEventListener('click', (e) => {
        const noteEdit = document.querySelector('.form-note')
        e.preventDefault()
        const name = noteEdit.querySelector('.form-note__name').value
        const category = noteEdit.querySelector('.form-note__select').value
        const content = noteEdit.querySelector('.form-note__content').value
        const checkbox = noteEdit.querySelector('.form-note__checkbox').checked
        if (name === '') {
            alert('Enter note name')
        } else {
            recordNote(name, category, content, checkbox)
            noteAdd.remove()
            updateNotes('active')
            updateCategoriesList()
            buttonCreate.classList.remove('hidden')
        }
    }
    )
    const buttonCancel = noteAdd.querySelector('.form-note__button2')
    buttonCancel.addEventListener('click', (e) => {
        e.preventDefault()
        noteAdd.remove()
        updateNotes('active')
        updateCategoriesList()
        buttonCreate.classList.remove('hidden')
    }
    )
}

// Swicher for Statistics & Notes Uptater
function swicher(status) {
    if (status === 'active') {
        activeButton.classList.add('active')
        archivedButton.classList.remove('active')
        updateNotes('active')
    }
    if (status === 'archived') {
        archivedButton.classList.add('active')
        activeButton.classList.remove('active')
        updateNotes('archived')
    }

}

// Edit Function
const handleEditButton = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = +noteDiv.getAttribute('data-id')

    buttonCreate.classList.add('hidden')
    if (document.querySelector('.form-note')) {
        document.querySelector('.form-note').remove()
        document.querySelector('.hidden').classList.remove('hidden')
    }
    noteDiv.classList.add('hidden')
    showForm()
    const noteEdit = document.querySelector('.form-note');
    const elementPosition = noteEdit.getBoundingClientRect().top;
    const offsetPosition = elementPosition - 20;
    window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
    })
    const note = loadNotes().find(note => note.id === +id)
    noteEdit.querySelector('.form-note__name').value = note.name
    noteEdit.querySelector('.form-note__select').value = note.category
    noteEdit.querySelector('.form-note__content').value = note.content
    noteEdit.querySelector('.form-note__checkbox').checked = note.active
    noteEdit.querySelector('.form-note__title').innerHTML = 'Edit note'
    noteEdit.querySelector('.form-note__button1').value = 'Save'

    const buttonOk = noteEdit.querySelector('.form-note__button1')
    buttonOk.addEventListener('click', (e) => {
        e.preventDefault()
        const name = noteEdit.querySelector('.form-note__name').value
        const category = Number(noteEdit.querySelector('.form-note__select').value)
        const content = noteEdit.querySelector('.form-note__content').value
        const checkbox = noteEdit.querySelector('.form-note__checkbox').checked
        if (name === '') {
            alert('Enter note name')
        } else {
            updateNote(id, name, category, content, checkbox)
            noteEdit.remove()
            noteDiv.querySelector('.material-icons').innerHTML = iconName(note.category)
            noteDiv.querySelector('.item__name').innerHTML = name
            noteDiv.querySelector('.item__category').innerHTML = getCategory(category)
            noteDiv.querySelector('.item__content').innerHTML = contentPreview(content)
            noteDiv.querySelector('.item__dates').innerHTML = dates(content)
            note.active ? swicher('active') : swicher('archived')
            updateCategoriesList()
            buttonCreate.classList.remove('hidden')
        }
    }
    )
    const buttonCancel = noteEdit.querySelector('.form-note__button2')
    buttonCancel.addEventListener('click', (e) => {
        e.preventDefault()
        noteEdit.remove()
        buttonCreate.classList.remove('hidden')
        noteDiv.classList.remove('hidden')
    }
    )
}

// Swicher between Active/Archived status
const handleActiveButton = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = noteDiv.getAttribute('data-id')
    header1.removeChild(noteDiv)
    activeSwitchNote(id)
    updateCategoriesList()
}

// Delete Function
const handleDeleteButton = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = noteDiv.getAttribute('data-id')
    header1.removeChild(noteDiv)
    deleteNote(id)
    updateCategoriesList()
}
// Listners for Notes buttons
const addEventListeners = () => {
    const noteElement = header1.lastElementChild
    const itemButtonEdit = noteElement.querySelector('.item__edit')
    const itemButtonActive = noteElement.querySelector('.item__active')
    const itemButtonDelete = noteElement.querySelector('.item__delete')
    const itemContent = noteElement.querySelector('.item__content')

    itemButtonEdit.addEventListener('click', handleEditButton)
    itemButtonActive.addEventListener('click', handleActiveButton)
    itemButtonDelete.addEventListener('click', handleDeleteButton)
    itemContent.addEventListener('click', handleContent)
}
// Updeter for note list
const updateNotes = (status) => {
    header1.replaceChildren()
    buttonCreate.classList.remove('hidden')
    const notes = loadNotes(status)
    notes.forEach(note => createNote(note))
}

// Function for detailed/reduced view of content
const handleContent = (e) => {
    const noteDiv = e.target.parentNode
    const id = noteDiv.getAttribute('data-id')
    const note = loadNotes().find(note => note.id === +id)
    e.target.classList.toggle('full')
    if (e.target.classList.contains('full')) {
        e.target.innerHTML = note.content
    } else {
        e.target.innerHTML = contentPreview(note.content)
    }

}



export { updateNotes, updateCategoriesList, swicher }