const worker = new Worker('/static/theatre_js/live-orders/worker.js')

const theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

function get_all_orders() {
    task = {task_name: 'get-all-orders', theatre_id: theatre_id}
    worker.postMessage(task);
}

worker.onmessage = (e) => {
    console.log(e);
}

get_all_orders();