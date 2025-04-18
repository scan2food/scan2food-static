// function for get request
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


let socket_url;

const selected_theatre_id = document.getElementById('selected-theatre-id').value;

// load all theatres
async function loadAllTheatres() {
    const all_theatre_url = `/theatre/api/get-all-theatres`
    all_theatres = await getRequest(all_theatre_url);
    all_theatres = all_theatres.all_theatres;

    const sel = document.getElementById('selected-theatre');
    // create the select in the order
    for (let i = 0; i < all_theatres.length; i++) {
        const theatre_detail = all_theatres[i];
        const opt = document.createElement('option');
        opt.setAttribute('value', theatre_detail.theatre_id);
        opt.innerText = theatre_detail.name
        sel.appendChild(opt);
    }

    sel.value = selected_theatre_id;

}

loadAllTheatres()

let audio = new Audio('https://guru-sevak-singh.github.io/scan2food-static/static/sound/notification.wav');
let order_received_audio = new Audio('https://guru-sevak-singh.github.io/scan2food-static/static/sound/order_received.wav')
if (window.location.href.includes('https')) {
    socket_url = `wss://${window.location.host}/ws/all-seat-datasocket/`
}
else {
    socket_url = `ws://${window.location.host}/ws/all-seat-datasocket/`
}

const sendNotification = (notification_title, message) => {
    Notification.requestPermission().then(perm => {
        if (perm === 'denied') {
            console.error('Please allow notifications to receive notifications');
        }
        else if (perm === 'granted') {
            let notify = new Notification(notification_title, {
                body: message,
                icon: 'https://guru-sevak-singh.github.io/scan2food-static/static/assets/images/brand/Scan2FoodFabIcon.png',
                vibrate: [200, 100, 200],
            });
        }
    })
}

function RunWebSocket() {

    let allSeatSocket = new WebSocket(socket_url)

    allSeatSocket.onmessage = (e) => {

        let eventData = JSON.parse(e.data)
        let updated_data = JSON.parse(eventData.updated_table_data);

        let payment_panding = updated_data.payment_panding;

        if (payment_panding === false) {
            try {
                const msg = updated_data.message.split("%0A%0A")[0];
                showToast(updated_data.type, msg);
            }
            catch {
                showToast(updated_data.type, updated_data.message);
            }

            sendNotification('Order Received', updated_data.message);
            console.log('updated data====>', updated_data);

        }
        else if (payment_panding === true && updated_data.is_vacent === false) {
            showToast(updated_data.type, updated_data.message);
            sendNotification('Order Received Payment Pending', updated_data.message);

        }

        let order_status = updated_data.is_vacent

        if (order_status == true) {
            audio.play();
        }

        else {
            order_received_audio.play();
        }

        showOrderData();
    }

    allSeatSocket.onclose = (e) => {
        RunWebSocket();
    }
}

RunWebSocket();

function makeWhatsappUrl() {
    whatsappNumbers = document.getElementsByClassName('whatsapp-numbers');
    for (let i = 0; i < whatsappNumbers.length; i++) {
        td = whatsappNumbers[i]
        phone_numbers = td.innerText.split(',');
        td.innerText = ""
        // run the loop 2 time and create the url for whatsapp reply message
        for (let num = 0; num < phone_numbers.length; num ++) {
            let a = document.createElement('a')
            a.innerText = `${phone_numbers[num]} , `
            a.href = `https://web.whatsapp.com/send?phone=${phone_numbers[num]}`
            a.target = "_blank"
            td.appendChild(a);
        }
    }
}

makeWhatsappUrl()