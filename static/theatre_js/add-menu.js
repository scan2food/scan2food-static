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

var selected_food_id = "";

// function to hit the post request
async function PostRequest(url, data) {
    csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data),
    })
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

const add_url = document.getElementById('item-form').action

var all_images = [];

function OpenAddItem(id) {
    document.getElementById('id_catogary').value = id;
    document.getElementById('id_name').value = "";
    document.getElementById('id_food_image').value = '';
    document.getElementById('id_price').value = "";
    document.getElementById('id_description').value = "";
    document.getElementById('id_priority_number').value = "";

    document.getElementById('item-form').action = add_url;

}

function EditItem(id, button, food_id) {
    document.getElementById('item-form').action = `${add_url}/${food_id}`
    document.getElementById('id_catogary').value = id;
    div = button.parentElement.parentElement.parentElement;
    food_type = div.getElementsByClassName('food-type')[0].classList.value;
    food_name = div.getElementsByClassName('food-name')[0].innerText
    food_price = div.getElementsByClassName('food-price')[0].innerText;
    food_description = div.getElementsByClassName('food-description')[0].innerText;
    priority_number = div.getElementsByClassName('priority-number')[0].innerText

    food_type = food_type.replaceAll('-icon food-type', '')
    console.log(food_type)

    document.getElementById('id_food_type').value = food_type;
    document.getElementById('id_name').value = food_name
    document.getElementById('id_price').value = food_price;
    document.getElementById('id_description').value = food_description;
    document.getElementById('id_priority_number').value = priority_number;

    document.getElementById('sell-for-mrp').setAttribute('item-id', food_id);

}

function DeleteItem(id) {
    document.getElementById('deleted-item-id').value = id;
    $("#deleteItem").modal('show');
}

function deleteCategory(id) {
    document.getElementById('delete-category-form').action = `/theatre/delete-food-category/${id}`
    $("#deleteCategory").modal("show");
}

async function openImagePopUp(img, id, food_name) {
    // get all images from api
    if (all_images.length == 0) {
        // get all images
        let url = `/theatre/api/get-all-images`

        // galery div
        let modal = document.getElementById('imageModal');
        let galery = modal.getElementsByClassName('modal-body')[0];
        let div = document.createElement('div');
        div.setAttribute('class', 'row');

        let images = await getRequest(url);
        all_images = images['images'];

        for (let i = 0; i < all_images.length; i++) {
            let img_src = all_images[i];
            div.innerHTML += `<div class="col-3">
            <img src="${img_src}" class="img-thumbnail" alt="image" onclick="UploadImage(this)">
            </div>
            `
            galery.appendChild(div);
        }

    }
    selected_food_id = id;
    
    document.getElementById('imageModalLabel').innerText = `Select Image from galery for ${food_name}`;
    // show pupup
    $('#imageModal').modal('show');
}

async function UploadImage(img) {
    food_id = selected_food_id
    old_food_image = document.getElementById(`food-id-${food_id}`)
    // hit upload image api
    let url = `/theatre/api/upload-food-image`
    let upload_data = {
        'food_id': food_id,
        'image_url': img.src
    }
    console.l
    data = await PostRequest(url, upload_data);
    
    if (data['message'] == 'Image Uploaded') {
        // update image
        old_food_image.src = img.src;
    }
    else {
        alert(data['message']);
    }

    $('#imageModal').modal('hide');
}

async function sellOnMrp(button) {
    let item_id = button.getAttribute('item-id');
    let url = `/theatre/api/sell-on-mrp/${item_id}`;
    let update_status = await getRequest(url);
    showToast(update_status.type, update_status.message);
}