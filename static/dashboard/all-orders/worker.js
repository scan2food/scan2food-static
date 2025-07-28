var all_order_data = {
    theatre_amount: 0,
    total_amount: 0,
    net_profit: 0,
    orders: [

    ]
}

function addOrder(order) {
    all_order_data.theatre_amount += order.order_amount;

    all_order_data.total_amount += order.total_amount;

    all_order_data.net_profit += order.total_amount - order.order_amount;

    all_order_data.orders.push(order);

    task = { task_name: 'update-card', theatre_amount: all_order_data.theatre_amount, total_amount: all_order_data.total_amount, net_profit: all_order_data.net_profit, order_count: all_order_data.orders.length }
    postMessage(task);

}

var current_page = 0


function showOrdersByPage(page) {
    const start_index = page * 25;
    const end_index = start_index + 25;
    const orders = all_order_data.orders.slice(start_index, end_index);

    const task = {
        task_name: 'show-orders',
        orders: orders,
        current_page: page,
        total_pages: Math.ceil(all_order_data.orders.length / 25)
    };
    postMessage(task);
}


function getAllOrders(daterange, theatre_id, order_status, page) {
    const sse_url = `/theatre/api/all-orders-sse?daterange=${daterange}&selected-theatre=${theatre_id}&order-status=${order_status}`
    const eventSource = new EventSource(sse_url);

    eventSource.onmessage = (e) => {
        try {
            const order_data = JSON.parse(e.data);
            addOrder(order_data);

            showOrdersByPage(page);
        }
        catch (error) {
            console.log('error ==>', error)
        }
    }

    eventSource.onerror = (e) => {
        eventSource.close();
        theatre_amount = parseInt(all_order_data.theatre_amount).toFixed(2);

        total_amount = parseInt(all_order_data.total_amount).toFixed(2);

        net_profit = parseInt(all_order_data.net_profit).toFixed(2);

        task = { task_name: 'update-card', theatre_amount: theatre_amount, total_amount: total_amount, net_profit: net_profit, order_count: all_order_data.orders.length }
        postMessage(task);
    }
}

onmessage = (e) => {
    const task_detail = e.data;
    const task_name = task_detail.task_name;

    if (task_name === "get-all-orders") {
        const daterange = task_detail.daterange;
        const order_status = task_detail.order_status;
        const theatre_id = task_detail.selected_theatre;
        const page = task_detail.page

        getAllOrders(daterange, theatre_id, order_status, page);
    }

    if (task_name === "paginate") {
        showOrdersByPage(task_detail.page);
    }

}