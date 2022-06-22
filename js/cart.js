import { firebaseConfig } from '../config/config.js';
import { sendMail } from '../email_body/email_body.js';

firebase.initializeApp(firebaseConfig());
var db = firebase.firestore();

let total;
let items;
let email_items_list;
let costumer_details;
let empty = true;
let cartNo = "3550"
let itemMap = new Map();

$('#invalidAlertBtn').click(function () {
    $('#invalidAlert').hide('fade');
});
$('#validAlertBtn').click(function () {
    $('#validAlert').hide('fade');
});

$('#promo-btn').click(function () {
    if(document.getElementById('promo-code').value.toUpperCase() != "MAIGAREEBHU"){
        $('#invalidAlert').show('fade');
        document.getElementById('promo-code').value = '';
    }else{
        $('#invalidAlert').hide('fade');
        $('#validAlert').show('fade');
    }
});

db.collection("Cart").doc(cartNo)
    .onSnapshot((doc) => {
        total = 0;
        if (!(doc.data() == null)) {
            console.log("hello", doc.data());
            var length = Object.keys(doc.data()).length;
            if (length == 0) {
                if (!empty) {
                    removeOldItems('currentItem');
                }
                empty = true;
                emptyCart();

            } else {
                if (empty) {
                    document.getElementById('basket-empty').style.display = 'none';
                    document.getElementsByClassName('basket-labels')[0].style.display = 'block';
                    empty = false;
                }
                items = Object.keys(doc.data())
                itemMap = new Map();
                for (let i = 0; i < items.length; i++) {
                    itemMap.set(items[i], doc.data()[items[i]]);
                };

                db.collection('Items').where('id', 'in', items)
                    .get()
                    .then((querySnapshot) => {
                        removeOldItems('currentItem');
                        email_items_list = []
                        querySnapshot.forEach((doc) => {
                            var subtotal = doc.data().mrp * itemMap.get(doc.data().id)
                            var div = document.createElement('div');
                            div.setAttribute('id', doc.data().id);
                            div.setAttribute('class', 'currentItem');
                            div.innerHTML = `
                                            <div class="basket-product">
                                            <div class="item">
                                            <div class="product-image">
                                            <img src="${doc.data().imageUrl}" alt="http://placehold.it/120x120" class="product-frame">
                                            </div>
                                            <div class="product-details">
                                            <h5"><strong><span class="item-quantity"></span> ${doc.data().name}</strong></h5>
                                            <p>Product Code - ${doc.data().id}</p>
                                            </div>
                                            </div>
                                            <div class="price">${doc.data().mrp.toFixed(2)}</div>
                                            <div class="quantity" style="text-align: left; padding-left: 20px;">${itemMap.get(doc.data().id)}</div>
                                            <div class="subtotal" style="margin-left:15px;">${subtotal.toFixed(2)}</div>
                                            </div>
                                            `;
                            document.getElementById('items').appendChild(div);

                            total += subtotal
                            
                            var email_item = new Map([
                                ["image", doc.data().imageUrl],
                                ["name", doc.data().name],
                                ["quantity", itemMap.get(doc.data().id)],
                                ["mrp", doc.data().mrp.toFixed(2)],
                                ["subtotal", subtotal.toFixed(2)]]
                            );

                            email_items_list.push(email_item)
                        });
                        
                        if(total!=0){
                            costumer_details.set("total_amount",total);
                        }
                        document.getElementById('basket-subtotal').innerText = total.toFixed(2);
                        document.getElementById('basket-total').innerText = total.toFixed(2);

                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            }

        } else {
            removeOldItems('currentItem');
            emptyCart();
        }

    });

db.collection("Cart").doc(cartNo).
    collection("Data").doc("current_status").onSnapshot((doc) => {
        if (!doc.data().in_use) {

            for (const [key, value] of itemMap.entries()) {
                db.collection("Items").doc(key).update({
                    currentQuantity: firebase.firestore.FieldValue.increment(-value)
                }).catch((error) => {
                    console.error("Error writing document: ", error);
                });
                console.log(key,value);
            }

            let sendMailRequest = function () {

                sendMail(email_items_list, costumer_details);

                setTimeout(() => {
                    db.collection("Cart").doc(cartNo).delete().then(() => {
                        console.log("Document successfully deleted!");
                    }).then(() => {
                        location.href = "paymentSuccessful.html";
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }, 2000);
            };

            sendMailRequest();

        }else{
            costumer_details = new Map([
                ["user_name", doc.data().user_name],
                ["user_email", doc.data().user_email]]);
        }
    });

function emptyCart() {
    document.getElementById('basket-empty').style.display = 'block';
    document.getElementsByClassName('basket-labels')[0].style.display = 'none';
    document.getElementById('basket-subtotal').innerText = total.toFixed(2);
    document.getElementById('basket-total').innerText = total.toFixed(2);
};

function removeOldItems(className) {
    var elements = document.getElementsByClassName(className);
    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
};

