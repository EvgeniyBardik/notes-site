import { updNotes, updCatList, swicher } from './src/views.js';
const init = () => {
    updNotes('active')
    swicher('active')
    updCatList()
}
init()