
let db;

const request = indexedDB.open('money_transactions', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('money', { autoIncrement: true });
  };

  
request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
      // uploadTransaction();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };


function saveRecord(record) {
    const transaction = db.transaction(['money'], 'readwrite');
    const moneyObjectStore = transaction.objectStore('money');
    moneyObjectStore.add(record);
}


function uploadMoney() {
    const transaction = db.transaction(['money'], 'readwrite');
    const moneyObjectStore = transaction.objectStore('money');
    const getAll = moneyObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['money'], 'readwrite');
            // access the new_pizza object store
            const pizzaObjectStore = transaction.objectStore('money');
            // clear all items in your store
            pizzaObjectStore.clear();

            alert('Transactions have been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };

  }

window.addEventListener('online', uploadMoney);