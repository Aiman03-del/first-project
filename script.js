
const recipeCategoriesContainer = document.getElementById('recipe-list');
const loader = document.getElementById('loader');
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const searchResult = document.getElementById('meal-result')

const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
recipeCategoriesContainer.addEventListener('click', getCategoryRecipe)
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Category
function fetchAllRecipeCategories() {
    loader.style.display = 'block';

    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            // console.log(data.categories);
            let html = "";
            let categories = data.categories;
            categories.forEach(category => {
                // console.log(category.idCategory);
                html += `
                    <div class = "category-item" data-id = "${category.idCategory}">
                        <div class = "category-img">
                            <img src = "${category.strCategoryThumb}" alt = "food">
                        </div>
                        <div class = "category-description">
                        <h3>${category.strCategory}</h3> 
                        <a href="#" class = "recipe-btn1">Get Recipe</a>
                        </div>
                    </div>
                `;
                // <p>${category.strCategoryDescription}</p>
            })
            loader.style.display = 'none';
            recipeCategoriesContainer.innerHTML = html;
        })


} fetchAllRecipeCategories();






// get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    // loading 
    loader.style.display = 'block';
    recipeCategoriesContainer.style.display = 'none';
    searchResult.style.display = 'none';
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
                });
                mealList.classList.remove('notFound');
                showRecipeResult();

            }
            else {
                alert("Sorry, we didn't find any meal!");
                mealList.classList.add('notFound');
            }

            loader.style.display = 'none';
            mealList.innerHTML = html;
        });
}

// display block
function showRecipeResult() {
    recipeCategoriesContainer.style.display = 'none';
    searchResult.style.display = 'block';
}

// get recipe of the Category

function getCategoryRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn1')) {
        let categoryItem = e.target.parentElement.parentElement;
        // console.log(categoryItem);
        fetch(`https://www.themealdb.com/api/json/v1/1/categories.php?i=${categoryItem.dataset.id}`)
            .then(response => response.json())
            .then(data => categoryRecipeModal(data.categories))
    }
}
// category Recipe Modal
function categoryRecipeModal(category) {
    category = category[0];
    console.log(category);
    let html = `
    <h2 class = "recipe-title">${category.strCategory}</h2>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${category.strCategoryDescription}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${category.strCategoryThumb}" alt = "">
        </div>
    `

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

}
// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal) {
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}