function showTax() {
    let order_area = document.getElementById('order-items');

    let sub_amount = parseFloat(document.getElementById('sub-amount').innerText);

    let all_taxes = order_area.querySelectorAll('.tax-perscantage');

    let grand_sum = 0
    grand_sum += sub_amount;

    let tax_amounts = order_area.querySelectorAll('.tax-amount')
    for (let i = 0; i < all_taxes.length; i++) {

        let tax_perscantage = parseFloat(all_taxes[i].innerText)

        let tax_amount = sub_amount * (tax_perscantage / 100)

        tax_amounts[i].innerText = tax_amount
        grand_sum += tax_amount
    }

    grand_sum = grand_sum.toFixed(2)
    let amount_titles = document.querySelectorAll('.amount-with-tax')

    amount_titles.forEach(element => {
        element.innerText = grand_sum;
    });


}

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


function printKot(btn) {
    let order_id = btn.getAttribute('order_id');
    window.open(`/theatre/print-kot/${order_id}`, "", "width=600, height=600");
}

function printBill(btn) {
    let order_id = btn.getAttribute('order_id');
    window.open(`/theatre/print-bill/${order_id}`, "", "width=600, height=600");
}

function createOrderTab(order_data) {
    document.getElementById('delivery-detail-box').setAttribute('class', 'd-none');
    if (order_data.order_detail.food_delivered === false) {
        document.getElementById('delivery-status').innerHTML = `<i class="fa fas fa-clock text-danger mb-0 me-1"></i>Delivery Pending`;
        document.getElementById('order-deliver-button').setAttribute('style', '');
    }
    else {
        document.getElementById('delivery-status').innerHTML = `<i class="fa fas fa-check-circle text-success mb-0 me-1"></i> Order Delivered`;
        document.getElementById('order-deliver-button').style.display = 'none';
        document.getElementById('delivery-detail-box').setAttribute('class', 'd-flex justify-content-between');
        document.getElementById('delivery-detail-box-value').innerText = order_data.order_detail.delivery_time;
    }

    document.getElementById('order-deliver-button').setAttribute('order-id', order_data.order_detail.order_id)
    document.getElementById('order-id').innerText = `#${order_data.order_detail.order_id}`;
    document.getElementById('seat-name').innerText = order_data.seat;
    document.getElementById('order-date').innerText = order_data.order_detail.order_date;
    document.getElementById('order-time').innerText = order_data.order_detail.order_time;
    console.log(order_data)
    document.getElementById('phone-number').innerText = order_data.order_detail.phone_number;
    
    if (order_data.order_detail.payment_pending === true) {
        payment_status = `<i class="fa fas fa-clock text-danger mb-0 me-1"></i> ${order_data.order_detail.payment_status}`;
        document.getElementById('panding-amount-heading').innerText = 'Pending Amount';
        document.getElementById('payment-tab-panding-amount-heading').innerText = 'Pending Amount';
        document.getElementById('panding-amount-heading-value').innerText = 0;
        document.getElementById('payment-tab-panding-amount-value').setAttribute('class', 'amount-with-tax');
    }
    else {
        payment_status = `<i class="fa fas fa-check-circle text-success mb-0 me-1"></i> ${order_data.order_detail.payment_status}`;
        document.getElementById('panding-amount-heading').innerText = 'Amount Paid';
        document.getElementById('payment-tab-panding-amount-heading').innerText = 'Amount Paid';
        document.getElementById('panding-amount-heading-value').innerText = order_data.order_detail.amount;
        document.getElementById('payment-tab-panding-amount-value').innerText = order_data.order_detail.amount;
        document.getElementById('payment-method-value').innerHTML = order_data.order_detail.payment_method;
    }

    document.getElementById('payment-status').innerHTML = payment_status
    document.getElementById('payment-tab-payment-status').innerHTML = payment_status

}

function createCartTab(order_data) {
    let cart_items = order_data.order_items;
    let all_tax_area_html = document.getElementById('all-tax-area').innerHTML
    document.getElementById('order-items').innerHTML = ""
    for (let i = 0; i < cart_items.length; i++) {
        let item = cart_items[i];
        let item_row = `
                        <div class="row mb-2 order-item">
                            <div class="col-8">
                                <h6 class="d-flex align-items-center">
                                    <span class="">${item.name}</span>
                                    <span class="text-muted ms-4 ps-2" style="font-size: 0.85rem;">
                                        <span class="ms-2 me-3"> | </span> Price: ₹ ${item['item-price']}
                                    </span>
                                    <span class="text-muted ms-4 ps-2" style="font-size: 0.85rem;">
                                    <span class="ms-2 me-3"> | </span>Quantity: ${item.quantity}
                                    </span>
                                </h6>
                              
                            </div>
                            <div class="col-4 text-end">
                                <h6 class="price"><span class="me-1-cust">₹</span>${item.price}</h6>
                            </div>  
                        </div>
                       
        `
        document.getElementById('order-items').innerHTML += item_row;
    }
    document.getElementById('order-items').innerHTML += `
                        <div class="d-flex justify-content-between mt-3">
                            <p class="text-muted">Sub Total</p>
                            <h6 class="total-amount"><span class="me-1-cust">₹</span><span
                                    id="sub-amount">${order_data.order_amount}</span></h6>
                        </div>
                        <div id="all-tax-area">
                        ${all_tax_area_html}
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="text-muted">Total</p>
                            <h6 class="total-amount"><span class="me-1-cust">₹</span><span class="amount-with-tax">

                                </span>
                            </h6>
                        </div>
                        
    `
}

function paymentTab(order_data) {

}

async function openOrderProfile(order_id, page) {
    let order_data_url = "";

    if (page === "order-page") {
        order_data_url = `/theatre/api/order-data/${order_id}`
    }
    else {
        order_data_url = `/theatre/api/seat-last-order/${order_id}`
    }
    let order_data = await getRequest(order_data_url)

    order_id = order_data.order_detail.order_id;
    document.getElementById('bill-button').setAttribute('order_id', order_id);
    document.getElementById('kot-button').setAttribute('order_id', order_id);
    // creating order tab
    createOrderTab(order_data);
    // creating Cart Tab
    createCartTab(order_data);

    // show tax
    showTax()

}

async function deliverOrder() {
    let order_deliver_button = document.getElementById('order-deliver-button');
    let order_id = order_deliver_button.getAttribute('order-id')

    let url = `/theatre/api/deliver-order/${order_id}`
    let order_status = await getRequest(url)


    if (order_status.message === 'Order Delivered Successfully') {
        document.getElementById('delivery-status').innerHTML = `<i class="fa fas fa-check-circle text-success mb-0 me-1"></i> Order Delivered`
    }

    document.getElementById('order-deliver-button').style.display = 'none'

    if (window.location.href.includes('theatre/all-seats')) {
        $("#orderPopUp").modal('hide');
    }
}