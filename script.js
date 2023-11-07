let participants = [];
let bills = [];

function addParticipants() {
    const participantsInput = document.getElementById('participants').value;
    participants = participantsInput.split(',').map(participant => participant.trim());
    console.log('Participants:', participants);
}

/* function addBill() {
    const billName = prompt('Enter bill name:');
    const billAmount = parseFloat(prompt('Enter bill amount:'));

    const participantsInvolved = prompt('Enter participants involved (comma-separated):').split(',').map(participant => participant.trim());

    const payer = prompt('Enter who paid the bill:');

    bills.push({ name: billName, amount: billAmount, participants: participantsInvolved, payer: payer });
    displayBills();
} */

function addBill() {
    let billHTML = `
        <div class="bill">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name" value="pizza">

            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount" value="90">

            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names" value="a,b">

            <label for="payer">Payer:</label>
            <input type="text" class="payer" placeholder="Enter who paid the bill" value="a">
        </div>
    `;
    document.getElementById('billsList').insertAdjacentHTML('beforeend', billHTML);
}

function settleUp() {
    participants = document.getElementById('participants').value.split(',').map(name => name.trim());
    bills = Array.from(document.querySelectorAll('.bill')).map(bill => {
        const name = bill.querySelector('.billName').value,
            amount = parseFloat(bill.querySelector('.billAmount').value),
            participants = bill.querySelector('.billParticipants').value.split(',').map(name => name.trim()),
            payer = bill.querySelector('.payer').value;
        return { name, amount, participants, payer };
    });
    
    const balances = {};

    bills.forEach(bill => {
        const perPersonAmount = bill.amount / bill.participants.length;
        bill.participants.forEach(person => {
            if (!balances[person]) {
                balances[person] = 0;
            }
            if (person !== bill.payer) {
                balances[person] += perPersonAmount;
            } else if (person === bill.payer){
                balances[person] -= bill.amount;
            }
        });
    });

/*     bills.forEach(bill => {
        const payer = bill.payer;
        bill.participants.forEach(person => {
            if (person !== payer) {
                if (!balances[person]) {
                    balances[person] = 0;
                }
                balances[person] -= bill.amount / (bill.participants.length - 1);
                if (!balances[payer]) {
                    balances[payer] = 0;
                }
                balances[payer] += bill.amount / (bill.participants.length - 1);
            }
        });
    }); */

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Settlement:</h2>';

    Object.keys(balances).forEach(person => {
        if (balances[person] !== 0) {
            const message = balances[person] > 0 ? `owes $${balances[person]}` : `is owed $${Math.abs(balances[person])}`;
            resultDiv.innerHTML += `<p>${person} ${message}</p>`;
        }
    });
}
