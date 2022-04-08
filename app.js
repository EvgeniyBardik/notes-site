import { updateCategoriesList, swicher } from './src/views.js';
const init = () => {
    swicher('active')
    updateCategoriesList()
}
init()