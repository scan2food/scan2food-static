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



var allRunningOrders = {}

async function getAllRunningOrders(theatre_id) {
    const url = `/theatre/api/live-orders?theatre-id=${theatre_id}`
    allRunningOrders = await getRequest(url);
    console.log(allRunningOrders);
    // console.log('theatre id ===>', theatre_id);
    // console.log('hit the server api\nget all the running order\nshow all the vacent seats and return all the orders...');
}

onmessage = (e) => {
    const task = e.data;
    const task_name = task.task_name;

    if (task_name === 'get-all-orders') {
        const theatre_id = task.theatre_id;
        getAllRunningOrders(theatre_id);
    }
}