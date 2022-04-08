import { Notes, Categories } from './models.js';

const getCategory = (noteId) => {
    const catName = Categories.find((cat) => cat.id === noteId)
    return catName.name
}

const contentPreview = (content) => {
    if (content.length > 15) {
        return content.slice(0, 15) + '...'
    }
    else {
        return content
    }
}

const iconName = (categoryId) => {
    if (categoryId === 1) {
        return 'local_grocery_store'
    }
    if (categoryId === 2) {
        return 'lightbulb_outline'
    }
    if (categoryId === 3) {
        return 'help_outline'
    } else {
        return 'info_outline'
    }
}


const countActive = (categoryId) => {
    return Notes.filter(notes => notes.active === true && notes.category === categoryId).length
}

const countArchive = (categoryId) => {
    return Notes.filter(notes => notes.active === false && notes.category === categoryId).length
}

const dates = (text) => {
    const result = text.match(/\d+\/\d+\/\d+/g) || []
    return result.join(', ')
}

const getDateCreated = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    const date = new Date()
    return date.toLocaleString("en-US", options)
}


const deleteNote = (noteIdDel) => {
    const index = Notes.findIndex(note => note.id == noteIdDel)
    Notes.splice(index, 1)
}

const loadNotes = (param) => {
    if (param == 'active') {
        return Notes.filter((note) => note.active === true)
    } else if (param == 'archived') {
        return Notes.filter((note) => note.active === false)
    } else return Notes
}
const getFreeId = () => {
    const oldIds = []
    Notes.forEach(element => oldIds.push(element.id));
    let i = 0
    while (i < Number.MAX_SAFE_INTEGER) {
        if (!oldIds.includes(i)) {
            break;
        }
        i++;
    }
    return i
}


const recordNote = (name, category, content, active) => {
    const note = {
        id: getFreeId(),
        name: name,
        created: getDateCreated(),
        content: content,
        category: Number(category),
        active: active
    }
    Notes.push(note)
}

const activeSwitchNote = (switchId) => {
    const index = Notes.findIndex(note => note.id == switchId)
    Notes[index].active = !Notes[index].active
}

const updateNote = (id, name, category, content, checkbox) => {
    const index = Notes.findIndex(note => note.id === +id)
    Notes[index].name = name
    Notes[index].category = category
    Notes[index].content = content
    Notes[index].active = checkbox
}

const loadCategories = () => Categories


export { getCategory, contentPreview, countActive, countArchive, dates, getDateCreated, deleteNote, loadNotes, loadCategories, recordNote, activeSwitchNote, updateNote, iconName }