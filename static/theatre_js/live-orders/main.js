// All Sounds
let audio = new Audio('/static/sound/notification.wav');

function playAudio() {
    while (true) {
        try {
            audio.play();
            break;
        }
        catch (error) {
            console.log(e)
            continue;
        }
    }
}

let order_received_audio = new Audio('/static/sound/order_received.wav')

function playOrderAudio() {
    while (true) {
        try {
            order_received_audio.play()
            break;
        }
        catch (error) {
            console.log(error);
            continue;
        }
    }
}

let simple_audio = new Audio('/static/sound/no-sound.mp3')

function simpleAudioPlay() {
    while (true) {
        try {
            simple_audio.play()
            break;
        }
        catch (error) {
            continue;
        }
    }
}



const worker = new Worker('/static/theatre_js/live-orders/worker.js')

const theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

function get_all_orders() {
    task = { task_name: 'get-all-orders', theatre_id: theatre_id }
    worker.postMessage(task);
}

function runWebSocket() {
    let socket_url;

    if (window.location.href.includes('https')) {
        socket_url = `wss://${window.location.host}/ws/all-seat-datasocket/`
    }
    else {
        socket_url = `ws://${window.location.host}/ws/all-seat-datasocket/`
    }

    task = { task_name: 'start-websocket', socket_url: socket_url }
    worker.postMessage(task)

}


// Parse payment_time to Date
function parsePaymentTime(str) {
    const [datePart, timePart] = str.split('|');
    return new Date(`${datePart} ${timePart}`);
}

// RENDER THE SINGLE ORDER ON UI
function renderSingleOrder(order) {
    // get all seats UL
    const all_seats = document.getElementById('all-seats');
    // create the seat LI
    const li = document.createElement('li');
    // adding the class and id
    li.setAttribute('class', 'nav-item py-2 ')
    li.setAttribute('id', `seat-id-${order.seat_id}`)

    const seen_status = order.is_shown

    var visible_class = "badge bg-danger blinking"
    var visible_text = "Not Seen"
    if (seen_status) {
        visible_class = "badge bg-success"
        visible_text = "Seen"
    }

    const li_html = `
                    <a href="#" class="d-flex align-items-center text-start mx-3 ms-0" id="order-id-${order.order_id}">
                    
                        <div class="shadow p-3 brdr-left-2px">

                            <h6 class="mt-n1 mb-0 theatre-name-label border-bottom pb-2 mb-2">
                                ${order.hall_name}, ${order.seat_name}
                                <span class="${visible_class}">
                                    ${visible_text}
                                </span>

                            </h6>

                            <p class="mb-0 text-muted small">Amount : 
                                <span>
                                    ₹<strong class="text-primary fw-bold order-amount">${order.amount}</strong>
                                </span>
                            </p>
                            <p class="mb-0 text-muted small">Order Time:
                                <strong class="text-primary fw-bold order-time-label">${order.payment_time.split('|')[1]}</strong>
                            </p>
                            <p class="mb-0 text-muted small d-none">Pending Time:
                                <strong class="text-primary fw-bold timer">
                                    
                                </strong>
                            </p>

                        </div>
                    </a>
    `
    li.innerHTML = li_html;
    all_seats.appendChild(li);

    li.addEventListener('click', async function () {
        await openOrderProfile(order.seat_id);

        document.getElementById('orderPopUpLabel').innerText = `${order.hall_name}, ${order.seat_name}`;

        $("#orderPopUp").modal('show');
    })

    const paymentDate = parsePaymentTime(order.payment_time);
    const maxTime = order.max_time * 60; // in seconds

    const timerSpan = li.querySelector('.timer');

    const intervalId = setInterval(() => {
        const now = new Date();
        let elapsed = Math.floor((now - paymentDate) / 1000); // in seconds
        let remaining = maxTime - elapsed;

        if (remaining <= 0) {
            timerSpan.textContent = "Time Up";
            clearInterval(intervalId);

            // get the a tag
            const a_tag = li.getElementsByTagName('a')[0];
            a_tag.classList.add('blinking');
            return;
        }

        const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
        const secs = (remaining % 60).toString().padStart(2, '0');

        timerSpan.textContent = `${mins}:${secs}`;
    }, 1000);


}

// MAKE THE ORDER SEEN
function make_order_seen(seat_id) {
    const s_id = `seat-id-${seat_id}`;
    const seat = document.getElementById(s_id);

    const badge = seat.getElementsByClassName('badge')[0];
    badge.setAttribute('class', 'badge bg-success');
    badge.innerText = 'Seen'
}

worker.onmessage = (e) => {
    const task = e.data;
    const task_name = task.task_name;

    if (task_name === 'render-single-order') {
        const order = task.order;
        // Render the Order on UI;
        renderSingleOrder(order);
    }

    else if (task_name === 'make-order-seen') {
        const seat_id = task.seat_id;
        // update the ui of seen id
        make_order_seen(seat_id);
    }

    else if (task_name === 'order-deliverd') {
        const seat_id = task.seat_id;
        const complete_id = `seat-id-${seat_id}`;

        const seat = document.getElementById(complete_id);
        seat.remove();
    }

    // for the sound
    else if (task_name === 'play-sound') {
        const sound_name = task.sound_name;
        if (sound_name === 'normal') {
            simpleAudioPlay();
        }

        else if (sound_name === 'new-order-arived') {
            playOrderAudio()
        }

        else if (sound_name === 'Delivered') {
            playAudio();
        }
    }

}

runWebSocket()

get_all_orders();