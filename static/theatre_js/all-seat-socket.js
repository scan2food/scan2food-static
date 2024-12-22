let socket_url;

if (window.location.href.includes('https')) {
    socket_url = `wss://${window.location.host}/ws/all-seat-datasocket/`
}
else {
    socket_url = `ws://${window.location.host}/ws/all-seat-datasocket/`
}

const sendNotification = (message) => {
    Notification.requestPermission().then(perm => {
        if (perm === 'denied') {
            console.error('Please allow notifications to receive notifications');
        }
        else if (perm === 'granted') {
            new Notification(message);
        }
    })
}

function RunWebSocket() {

    let allSeatSocket = new WebSocket(socket_url)
    
    allSeatSocket.onmessage = (e) => {
        let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)
    
        let eventData = JSON.parse(e.data)
        let updated_data = JSON.parse(eventData.updated_table_data);
        
    
        let order_theatre_id = updated_data.theatre_id
        if (order_theatre_id == theatre_id) {
    
            let seat_id = `seat-${updated_data.seat_id}`;
            let seat = document.getElementById(seat_id)
    
            let payment_panding = updated_data.payment_panding;
    
            if (payment_panding === false) {
                seat.setAttribute('class', 'seat paymentreceived');
                showToast(updated_data.type, updated_data.message);
                sendNotification('Notification', {
                    body: updated_data.message
                });
            }
    
            let order_status = updated_data.is_vacent
            if (order_status == true) {
                seat.setAttribute('class', 'seat')
            }
    
            showOrderData()
        }
    
    }

    allSeatSocket.onclose = (e) => {
        RunWebSocket()
    }
}

RunWebSocket()
// allSeatSocket.onclose = (e) => {

//     try {
//         allSeatSocket = new WebSocket(socket_url);

//         allSeatSocket.onmessage = (e) => {
//             let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

//             let eventData = JSON.parse(e.data)
//             let updated_data = JSON.parse(eventData.updated_table_data);

//             let order_theatre_id = updated_data.theatre_id
//             if (order_theatre_id == theatre_id) {

//                 let seat_id = `seat-${updated_data.seat_id}`;
//                 let seat = document.getElementById(seat_id)

//                 let seat_status = updated_data.is_vacent

//                 if (seat_status === true) {
//                     seat.setAttribute('class', 'seat')
//                 }
//                 else {

//                     let payment_panding = updated_data.payment_panding;
//                     if (payment_panding === false) {
//                         seat.setAttribute('class', 'seat paymentreceived')
//                         showToast('bg-success', `New Order Come From ${updated_data.seat_name}`)
//                     }
//                 }
//                 showOrderData()

//             }

//         }

//     }
//     catch (error) {
//         console.log(error)
//     }

// }
