localStorage.clear()

let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

async function getRequest(url) {
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            return data;

        })
        .catch(function (error) {
            console.error('Error:', error);
            throw new Error('Failed to fetch data');
        });
}

let menu_data = {}
async function loadMenu() {
    let menu_api_url = `/theatre/api/all-menu/${theatre_id}`;
    menu_data = await getRequest(menu_api_url);

    for (let i = 0; i < menu_data.length; i++) {
        let data = menu_data[i];

        if (i === 0) {
            showFoodItems(data, true);
        }
        else {
            showFoodItems(data, false);
        }
    }

}

function showFoodItems(category_data, is_active) {

    // creating all food view
    let foodContent = document.getElementById('food-item-content');
    let div = document.createElement('div');
    div.setAttribute('id', `food-category-${category_data.id}`);
    if (is_active) {
        div.setAttribute('class', 'tab-pane fade show active')
    }
    else {
        div.setAttribute('class', 'tab-pane fade')
    }


    // /////////////////////////////////////////////////////////////////////////////////////
    // New code start for new food view
    let window_location = window.location.href;
    // if (window_location.includes('menu')) {
    let menu_footer = document.getElementById('food-category-list');
    let li = document.createElement('li');
    li.setAttribute('class', 'nav-item col-lg-2 col col-md-2 category-type-column');

    let col = document.createElement('a');

    col.setAttribute('href', `#food-category-${category_data.id}`);
    col.setAttribute('data-bs-toggle', "pill");
    if (is_active == true) {
        col.setAttribute('class', 'active show');
    }
    else {
        col.setAttribute('class', 'col-lg-2 col col-md-2 category-type-column');
    }

    let html_data = '';

    if (window_location.includes('menu')) {
        html_data = `<div class="category-card-link">
                <div class="category-type-card">
                    <div class="category-type-img-wrapper">
                        <img src="${category_data.category_image}" alt="" class=" category-type-img">
                    </div>
                    <div class="category-type-name  text-white p-2">
                        <p class="mb-0">${category_data.name}</p>
                    </div>
                </div>
                </div>`
    }
    else {
        html_data = ``;
    }

    col.innerHTML = html_data;
    li.appendChild(col);
    menu_footer.appendChild(li);

    // }

    // New code ends here

    let new_div = document.createElement('div');
    new_div.setAttribute('class', 'row g-3 mb-3')

    let food_items = category_data.items
    for (let i = 0; i < food_items.length; i++) {
        let item_data = food_items[i];
        let food_card = document.createElement('div');
        food_card.setAttribute('class', 'col-lg-6 col-sm-6');
        food_card.setAttribute('id', `food-id-${item_data.item_id}`)

        let food_card_html = `
                                            <div class="d-flex align-items-center menu-item my-food-card">
                                                <img class="flex-shrink-0 img-fluid rounded menu-img"
                                                    src="${item_data.food_image}" alt="" style="width: 80px;">
                                                <div class="w-100 d-flex flex-column text-start ps-4">
                                                    <span class="item-pk" style="display: none;">${item_data.item_id}</span>
                                                    <h5 class="d-flex justify-content-start border-bottom pb-2">
                                                        <span class="${item_data.food_type}-icon item-type"></span><span
                                                            class="item-name">${item_data.name}</span>
                                                        <span class="text-primary float-end ms-auto">₹<span
                                                                class="item-price">${item_data.price}</span></span>
                                                    </h5>
                                                    <small class="fst-italic item-description">
                                                        ${item_data.description}
                                                    </small>
                                                    <div class="row align-items-center justify-content-between mt-2">
                                                        <div class="col-lg-6 col-md-6 col-12 add-box">
                                                            <button class="add-to-cart btn btn-primary"
                                                                onclick="addToCart(this)">Add <i
                                                                    class="fas fa-cart-plus"></i></button>
                                                        </div>
                                                        <div class="row d-none remove-box">

                                                            <div class="col-lg-6 col-md-6 col-6">
                                                                <div class="quantity-controls" style="display: flex;">
                                                                    <button class="minus btn btn-primary"
                                                                        onclick="DecreseQuantity(this)">-</button>
                                                                    <span class="quantity">1</span>
                                                                    <button class="plus btn btn-primary"
                                                                        onclick="IncreseQuantity(this)">+</button>
                                                                </div>
                                                            </div>
                                                            <div
                                                                class="col-lg-6 col-md-6 col-6 text-md-end text-lg-end p-sm-0">
                                                                <button onclick="removeItem(this)"
                                                                    class="remove-from-cart btn text-primary text-capitalize p-sm-0"><i
                                                                        class="fas fa-trash me-2"></i>Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
        `

        food_card.innerHTML = food_card_html;
        new_div.appendChild(food_card);
    }
    div.appendChild(new_div);
    foodContent.appendChild(div);
}

loadMenu()

