const coctailNameFilterElement = document.querySelector('#coctail-name-filter'),
	categorySelectElement = document.querySelector('#category-select'),
	glassSelectElement = document.querySelector('#glass-type-select'),
	ingredientSelectElement = document.querySelector('#ingredient-select'),
	dynamicDrinksElement = document.querySelector('.drinks'),
	buttonSearch = document.querySelector('#search'),
	buttonImLucky = document.querySelector('#im-lucky'),
	alcoholSelectElement = document.querySelector('#alcohol-select'),
	alphabetFilterElement = document.querySelector('#alphabet')
const modal = document.querySelector('.modal-bg')
const selectValues = {},
	drinksArray = [],
	alphabetArray = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	]
 
async function fillSelectElements() {
	// const startTime = new Date();
	const allUrls = [
		'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list',
		'https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list',
		'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list',
		'https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list',
	]
 
	const allPromises = allUrls.map(url =>
		fetch(url).then(response => response.json()),
	)
	const allValues = await Promise.all(allPromises)
 
	const [allCategories, allGlasses, allIngredients, alcoholicFilter] = allValues
 
	selectValues.categories = allCategories.drinks.map(
		categoryObj => categoryObj.strCategory,
	)
	selectValues.glasses = allGlasses.drinks.map(glass => glass.strGlass)
	selectValues.ingredients = allIngredients.drinks.map(
		ingredient => ingredient.strIngredient1,
	)
	selectValues.alcoholicFilter = alcoholicFilter.drinks.map(
		alcoholCategory => alcoholCategory.strAlcoholic,
	)
 
	fillCategorySelect(allCategories.drinks, categorySelectElement, 'strCategory')
	fillCategorySelect(allGlasses.drinks, glassSelectElement, 'strGlass')
	fillCategorySelect(
		allIngredients.drinks,
		ingredientSelectElement,
		'strIngredient1',
	)
	fillCategorySelect(
		alcoholicFilter.drinks,
		alcoholSelectElement,
		'strAlcoholic',
	)
}
 
function fillCategorySelect(properties, selectElement, strFieldName) {
	let dynamicHTML = ''
	for (const property of properties) {
		dynamicHTML += `<option>${property[strFieldName]}</option>`
		// categoriesArray.push(property.strCategory);
	}
	selectElement.innerHTML += dynamicHTML
	// console.log(categoriesArray);
}
 
async function getAllDrinks() {
	const categoryDrinksUrls = []
	for (const category of selectValues.categories) {
		let dynamicUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(
			' ',
			'_',
		)}`
		categoryDrinksUrls.push(dynamicUrl)
	}
	const allPromises = categoryDrinksUrls.map(url =>
		fetch(url).then(response => response.json()),
	)
	const allValues = await Promise.all(allPromises)
	allValues.forEach(value => drinksArray.push(...value.drinks))
}
 
function generateDrinksHTML(drinks) {
	let dynamicHTML = ''
 
	if (drinks === 'Not found') {
		return alert('Drinks not found')
	}
 
	for (let drink of drinks) {
		dynamicHTML += `<div class="drink" onclick="openModal(${drink.idDrink})">
		<img
			src="${drink.strDrinkThumb}"
			alt=""
		/>
		<h2 class="drink-title">${drink.strDrink}</h2>
	</div>`
	}
	dynamicDrinksElement.innerHTML = dynamicHTML
}
async function filter() {
	const searchValue = coctailNameFilterElement.value,
		category = categorySelectElement.value,
		glass = glassSelectElement.value,
		ingredient = ingredientSelectElement.value
	alcohol = alcoholSelectElement.value
	let filteredArray = [...drinksArray]

 // localStorage issaugojimas
	window.localStorage.setItem('searchValue', JSON.stringify(searchValue))
	window.localStorage.setItem(
		'category',
		JSON.stringify(categorySelectElement.selectedIndex),
	)
	window.localStorage.setItem(
		'glass',
		JSON.stringify(glassSelectElement.selectedIndex),
	)
	window.localStorage.setItem(
		'ingredient',
		JSON.stringify(ingredientSelectElement.selectedIndex),
	)
	window.localStorage.setItem(
		'alcohol',
		JSON.stringify(alcoholSelectElement.selectedIndex),
	)
 
	if (searchValue) {
		filteredArray = filteredArray.filter(drinkObj =>
			drinkObj.strDrink.toLowerCase().includes(searchValue.toLowerCase()),
		)
	}
	if (category !== 'Pasirinkite kategoriją') {
		const promise = await fetch(
			`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(
				' ',
				'_',
			)}`,
		)
		const drinksOfCategory = await promise.json()
		filteredArray = filteredArray.filter(drink =>
			drinksOfCategory.drinks.some(
				drinkOfCategory => drink.idDrink === drinkOfCategory.idDrink,
			),
		)
	}
	if (glass !== 'Pasirinkite stiklinės tipą') {
		const promise = await fetch(
			`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${glass.replaceAll(
				' ',
				'_',
			)}`,
		)
		const drinksOfGlass = await promise.json()
		filteredArray = filteredArray.filter(drink =>
			drinksOfGlass.drinks.some(
				drinkOfGlass => drink.idDrink === drinkOfGlass.idDrink,
			),
		)
	}
	if (ingredient !== 'Pasirinkite ingridientą') {
		const promise = await fetch(
			`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient.replaceAll(
				'_',
				'_',
			)}`,
		)
		const drinksOfIngredient = await promise.json()
		filteredArray = filteredArray.filter(drink =>
			drinksOfIngredient.drinks.some(
				drinkOfIngredient => drink.idDrink === drinkOfIngredient.idDrink,
			),
		)
	}
	if (alcohol !== 'Pasirinkite alkoholio tipą') {
		const promise = await fetch(
			`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcohol.replaceAll(
				'_',
				'_',
			)}`,
		)
		const typesOfAlcohol = await promise.json()
		filteredArray = filteredArray.filter(drink =>
			typesOfAlcohol.drinks.some(
				typeOfAlcohol => drink.idDrink === typeOfAlcohol.idDrink,
			),
		)
	}
 
	generateDrinksHTML(filteredArray)
}
 
async function initialization() {
 
	// 1. selectu uzpildymas
	await fillSelectElements()
	await getAllDrinks()
	generateDrinksHTML(drinksArray)
	
	// Tikrina ar yra localStorage itemai ir istraukia jeigu yra.
	if (window.localStorage.getItem('searchValue')) {
		coctailNameFilterElement.value = JSON.parse(
			window.localStorage.getItem('searchValue'),
		)
	}
 
	if (window.localStorage.getItem('category')) {
		categorySelectElement.selectedIndex = JSON.parse(
			window.localStorage.getItem('category'),
		)
	}
 
	if (window.localStorage.getItem('glass')) {
		glassSelectElement.selectedIndex = JSON.parse(
			window.localStorage.getItem('glass'),
		)
	}
 
	if (window.localStorage.getItem('ingredient')) {
		ingredientSelectElement.selectedIndex = JSON.parse(
			window.localStorage.getItem('ingredient'),
		)
	}
 
	if (window.localStorage.getItem('alcohol')) {
		alcoholSelectElement.selectedIndex = JSON.parse(
			window.localStorage.getItem('alcohol'),
		)
	}
 
	filter()
 
	alphabetArray.forEach(letter => {
		const button = createAlphabetFilterButtons(letter)
		alphabetFilterElement.appendChild(button)
	})
	createAlphabetFilterButtons()
	console.log(drinksArray)
	buttonSearch.addEventListener('click', filter)
	// 2. dinaminis gerimu atvaizdavimas
 
	buttonImLucky.addEventListener('click', getRandomDrink)
}
 
async function openModal(id) {
	modal.style.display = 'flex'
	// console.log()
	const promise = await fetch(
		`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`,
	)
 
	const response = await promise.json()
	const drink = response.drinks[0]
 
	document.querySelector('.modal-img').src = drink.strDrinkThumb
	document.querySelector('#modal-category').innerText = drink.strCategory
	document.querySelector('#modal-alcohol').innerText = drink.strAlcoholic
 
	console.log(drink)
}
function closeModal() {
	modal.style.display = 'none'
}
 
// Man sekasi mygtukas
async function getRandomDrink() {
	const promise = await fetch(
		`https://www.thecocktaildb.com/api/json/v1/1/random.php`,
	)
 
	const response = await promise.json()
	generateDrinksHTML(response.drinks)
}
// Filtravimas pagal pirmas abeceles raides
function createAlphabetFilterButtons(letter) {
	const newButton = document.createElement('button')
	newButton.innerHTML = letter
	newButton.className = 'alphabetButton'
 
	newButton.addEventListener('click', async () => {
		const promise = await fetch(
			`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`,
		)
		const response = await promise.json()
 
		if (!response.drinks) return generateDrinksHTML('Not found')
		generateDrinksHTML(response.drinks)
	})
 
	return newButton
}
 
document.querySelector('.modal-close-button').onclick = closeModal
 
initialization()