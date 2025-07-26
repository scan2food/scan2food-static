// get all orders

var all_order_data = {};

function saveOrderData(order_data) {
    const theatre_id = order_data.theatre_id;
    if (!all_order_data[`theatre-id-${theatre_id}`]) {
        all_order_data[`theatre-id-${theatre_id}`] = {
            theatre_id: theatre_id,
            theatre_name: order_data.theatre_name,
            orders: [],
            last_order_time: order_data.payment_time,
        };
    }
    all_order_data[`theatre-id-${theatre_id}`].orders.push(order_data);

    const orders = all_order_data[`theatre-id-${theatre_id}`].orders
    const sorted_data = orders.sort((a,b) => b.payment_time - a.payment_time)

    all_order_data[`theatre-id-${theatre_id}`].orders = sorted_data;
    const task = { 'task': 'add-order', 'order_data': order_data }
    postMessage(task)

}

function removeOrderData(order_id, theatre_id) {
    const theatre_key = `theatre-id-${theatre_id}`;
    if (Object.keys(all_order_data).includes(theatre_key)) {
        // filter out the order with the given order_id;
        const orders = all_order_data[theatre_key].orders;
        const new_orders = orders.filter(order => order.id !== order_id);
        
        const sorted_data = new_orders.sort((a,b) => b.payment_time - a.payment_time);

        all_order_data[theatre_key].orders = sorted_data;

        const order_count = sorted_data.length;

        let last_order_time

        if (order_count === 0) {
            // remove the theatre
            delete all_order_data[theatre_key]
            last_order_time = 0;
        }
        else {
            last_order_time = sorted_data[0].payment_time
        }
        const task = {task: 'update-deleted-order', order_count: order_count, last_order_time: last_order_time, theatre_id : theatre_id };
        postMessage(task);
    }


}


function getAllOrders() {
    // sse url
    const sse_url = '/theatre/api/all-orders-sse?order-status=Success&selected-theatre=&page=&seat-status=Vacent';
    const eventSource = new EventSource(sse_url);

    eventSource.onmessage = (e) => {

        try {
            const order_data = JSON.parse(e.data);
            // save the order data in a variable so that it can use again
            saveOrderData(order_data);
        }
        catch (error) {
            console.log('error....\n =>', error)
        }
    }

    eventSource.onerror = (e) => {
        eventSource.close();
        postMessage({ name: 'error', message: 'SSE connection closed due to error.', data: [] });
    };
}


function updateSeenOrder(order_id, theatre_id) {
    const theatre_key = `theatre-id-${theatre_id}`;
    if (Object.keys(all_order_data).includes(theatre_key)) {
        let orders = all_order_data[theatre_key].orders;
        let new_orders = []
        const order_count = orders.length;

        let seen_orders = 0
        for (let i = 0; i < orders.length; i++){
            const element = orders[i];
            new_orders.push(element);
            if (element.id == order_id) {
                element.view_status = true;
            }

            if (element.view_status == false) {
                seen_orders += 1;
            }
        };

        const sorted_data = new_orders.sort((a,b) => b.payment_time - a.payment_time);

        all_order_data[theatre_key].orders = sorted_data;

        const task = {task: 'update-deleted-order', order_count: order_count, theatre_id : theatre_id, seen_orders: seen_orders };
        postMessage(task);
    }
}


self.onmessage = (e) => {
    const data = e.data;
    const task = data.task;

    if (task === 'get-all-orders') {
        getAllOrders();
    }

    else if (task === 'get-all-orders-of-theatre') {
        const theatre_id = data.theatre_id;
        const task = { 'task': 'theatre-orders', 'order_data': all_order_data[`theatre-id-${theatre_id}`] };
        postMessage(task);
    }


    else if (task === 'get-all-orders-data') {
        const task = { 'task': 'all-orders-data', 'order_data': all_order_data };
        postMessage(task);
    }

    else if (task === 'add-new-order') {
        const order_data = data.order_data
        saveOrderData(order_data);
    }

    else if (task === 'delete-order') {
        const theatre_id = data.theatre_id;
        const order_id = data.order_id;
        removeOrderData(order_id, theatre_id);
    }

    else if (task === 'order-seen') {
        const theatre_id = data.theatre_id;
        const order_id = data.order_id;
        updateSeenOrder(order_id, theatre_id);
    }
}