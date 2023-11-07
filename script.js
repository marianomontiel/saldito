let participants = [];
let bills = [];

function addBill() {
    let billHTML = `
        <div class="bill">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name">

            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount">

            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names">
        </div>
    `;
    document.getElementById('billsList').insertAdjacentHTML('beforeend', billHTML);
}

function settleUp() {
    participants = document.getElementById('participants').value.split(',').map(name => name.trim());
    bills = Array.from(document.querySelectorAll('.bill')).map(bill => {
        const name = bill.querySelector('.billName').value;
        const amount = parseFloat(bill.querySelector('.billAmount').value);
        const billParticipants = bill.querySelector('.billParticipants').value.split(',').map(name => name.trim());
        return { name, amount, billParticipants };
    });

    let settleUpResult = {};

    participants.forEach(participant => {
        settleUpResult[participant] = 0;
    });

    bills.forEach(bill => {
        const billAmountPerParticipant = bill.amount / bill.billParticipants.length;
        bill.billParticipants.forEach(participant => {
            settleUpResult[participant] += billAmountPerParticipant;
        });
    });

    let settlementHTML = '<h2>Settlement</h2><ul>';
    for (const person in settleUpResult) {
        settlementHTML += `<li>${person} owes ${settleUpResult[person]}.</li>`;
    }
    settlementHTML += '</ul>';
    document.getElementById('settlementList').innerHTML = settlementHTML;
}
