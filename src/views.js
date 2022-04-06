import { createElement } from './helper.js';
import { getCategory, contPrev, getIco, countActive, countArchive, dates, deleteNote, loadNotes, loadCategories, recordNote, actSwitchNote, updateNote } from './controllers.js';

const header1 = document.querySelector('.items-list')
const formPlace = document.querySelector('.for-form')
const header2 = document.querySelector('.cat-list')

const actBtn = document.querySelector('.header2__switch-act')
const arcBtn = document.querySelector('.header2__switch-arc')
const buttonCreate = document.querySelector('.btn-create')

buttonCreate.addEventListener('click', (e) => bntCreateHandler(e))
actBtn.addEventListener('click', () => swicher('active'))
arcBtn.addEventListener('click', () => swicher('archived'))

const getSelect = () => {
    const noteSelect = createElement('select', { className: 'form-note__select' });
    for (let cat of loadCategories()) {
        const noteOption = createElement('option', { value: `${cat.id}` }, `${cat.name}`);
        noteSelect.appendChild(noteOption)
    }
    return noteSelect
}

const showForm = () => {
    const noteTitle = createElement('h1', { className: 'form-note__title' }, 'Create Note');
    const noteLabel1 = createElement('div', { className: 'form-note__label1' }, 'Name:');
    const noteName = createElement('input', { className: 'form-note__name' });
    const noteLabel2 = createElement('div', { className: 'form-note__label2' }, 'Category:');
    const noteLabel3 = createElement('div', { className: 'form-note__label3' }, 'Content:');
    const noteContent = createElement('textarea', { className: 'form-note__content', cols: '35', rows: '10' });
    const noteCheckBox = createElement('input', { className: 'form-note__checkbox', type: 'checkbox', checked: 'true' });
    const noteLabel4 = createElement('span', { className: 'form-note__label4' }, 'Active');
    const noteCheckboxDiv = createElement('div', { className: 'form-note__checkboxdiv' }, noteCheckBox, noteLabel4);
    const noteBtnOk = createElement('input', { className: 'form-note__button1', type: 'submit', value: 'Create' });
    const noteBtnCancel = createElement('input', { className: 'form-note__button2', type: 'reset', value: 'Cancel' });
    const noteDivBtn = createElement('div', {}, noteBtnOk, noteBtnCancel)
    const noteForm = createElement('form', { className: 'form-note' }, noteTitle, noteLabel1, noteName, noteLabel2, getSelect(), noteLabel3, noteContent, noteCheckboxDiv, noteDivBtn);

    return noteForm
}

const clearNotesViews = () => {
    while (header1.firstChild) {
        header1.removeChild(header1.firstChild);
    }
}

const bntCreateHandler = (e) => {
    clearNotesViews()
    buttonCreate.classList.add('hidden')

    formPlace.appendChild(showForm())

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
            updNotes('active')
            updCatList()
            buttonCreate.classList.remove('hidden')
        }
    }
    )
    const buttonCancel = noteAdd.querySelector('.form-note__button2')
    buttonCancel.addEventListener('click', (e) => {
        e.preventDefault()
        noteAdd.remove()
        updNotes('active')
        updCatList()
        buttonCreate.classList.remove('hidden')
    }
    )
}

function swicher(status) {
    if (status === 'active') {
        actBtn.classList.add('active')
        arcBtn.classList.remove('active')
        updNotes('active')
    }
    if (status === 'archived') {
        arcBtn.classList.add('active')
        actBtn.classList.remove('active')
        updNotes('archived')
    }

}

const handleEditBtn = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = noteDiv['data-id']

    buttonCreate.classList.add('hidden')
    if (document.querySelector('.form-note')) {
        document.querySelector('.form-note').remove()
        document.querySelector('.hidden').classList.remove('hidden')
    }
    noteDiv.classList.add('hidden')
    formPlace.appendChild(showForm())
    const noteEdit = document.querySelector('.form-note');
    const elementPosition = noteEdit.getBoundingClientRect().top;
    const offsetPosition = elementPosition - 20;
    window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
    })
    const note = loadNotes().find(note => note.id === id)
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
            noteDiv.querySelector('.material-icons').replaceWith(getIco(category))
            noteDiv.querySelector('.item__name').innerHTML = name
            noteDiv.querySelector('.item__category').innerHTML = getCategory(category)
            noteDiv.querySelector('.item__content').innerHTML = contPrev(content)
            noteDiv.querySelector('.item__dates').innerHTML = dates(content)
            noteDiv.classList.remove('hidden')
            updCatList()
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

const handleActBtn = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = noteDiv['data-id']
    header1.removeChild(noteDiv)
    actSwitchNote(id)
    updCatList()
}

const handleDelBtn = (event) => {
    const noteDiv = event.target.parentNode.parentNode
    const id = noteDiv['data-id']
    header1.removeChild(noteDiv)
    deleteNote(id)
}

const addEventListeners = (item) => {

    const itemBtnEdit = item.querySelector('.item__edit')
    const itemBtnAct = item.querySelector('.item__act')
    const itemBtnDel = item.querySelector('.item__del')
    const itemContent = item.querySelector('.item__content')

    itemBtnEdit.addEventListener('click', handleEditBtn)
    itemBtnAct.addEventListener('click', handleActBtn)
    itemBtnDel.addEventListener('click', handleDelBtn)
    itemContent.addEventListener('click', handleContent)

    return item
}

const handleContent = (e) => {
    const noteDiv = e.target.parentNode
    const id = noteDiv['data-id']
    const note = loadNotes().find(note => note.id === id)
    e.target.classList.toggle('full')
    if (e.target.classList.contains('full')) {
        e.target.innerHTML = note.content
    } else {
        e.target.innerHTML = contPrev(note.content)
    }

}

const createNote = (note) => {
    const itemIco = createElement('div', { className: 'item__ico' }, getIco(note.category));
    const itemName = createElement('div', { className: 'item__name' }, note.name);
    const itemCreated = createElement('div', { className: 'item__created' }, note.created);
    const itemCategory = createElement('div', { className: 'item__category' }, getCategory(note.category));
    const itemContent = createElement('div', { className: 'item__content' }, contPrev(note.content));
    const itemDates = createElement('div', { className: 'item__dates' }, dates(note.content));
    const itemBtnEditIco = createElement('i', { className: 'material-icons' }, 'create');
    const itemBtnEdit = createElement('button', { className: 'item__edit' }, itemBtnEditIco);
    const itemBtnActIco = createElement('i', { className: 'material-icons' }, 'archive');
    const itemBtnAct = createElement('button', { className: 'item__act' }, itemBtnActIco);
    const itemBtnDelIco = createElement('i', { className: 'material-icons' }, 'delete');
    const itemBtnDel = createElement('button', { className: 'item__del' }, itemBtnDelIco);
    const itemDiv = createElement('div', { className: 'item', 'data-id': note.id }, itemIco, itemName, itemCreated, itemCategory, itemContent, itemDates, itemBtnEdit, itemBtnAct, itemBtnDel);

    return addEventListeners(itemDiv)

}

const updNotes = (status) => {
    clearNotesViews()
    if (formPlace.firstChild) {
        formPlace.removeChild(formPlace.firstChild);
        buttonCreate.classList.remove('hidden')
    }
    const notes = loadNotes(status)
    if (notes.length > 0) {
        for (let note of notes) {
            const noteItem = createNote(note)
            header1.appendChild(noteItem)
        }
    }
}


const updCatList = () => {
    while (header2.firstChild) {
        header2.removeChild(header2.firstChild);
    }
    const categories = loadCategories()
    for (let category of categories) {
        const itemIco = createElement('div', { className: 'item2__ico' }, getIco(category.id));
        const itemCategory = createElement('div', { className: 'item2__category' }, category.name);
        const itemActive = createElement('div', { className: 'item2__active' }, countActive(category.id));
        const itemArchived = createElement('div', { className: 'item2__archived' }, countArchive(category.id));
        const itemDiv = createElement('div', { className: 'item2' }, itemIco, itemCategory, itemActive, itemArchived);
        header2.appendChild(itemDiv)
    }
}
export { updNotes, updCatList, swicher }