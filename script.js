let participants = [];
let bills = [];

function addParticipants() {
    const participantsInput = document.getElementById('participants').value;
    participants = participantsInput.split(',').map(participant => participant.trim());
    console.log('Participants:', participants);
}

function addBill() {
    let billHTML = `
        <div class="bill">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name">

            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount">

            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names">

            <label for="payer">Payer:</label>
            <input type="text" class="payer" placeholder="Enter who paid the bill">
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
            if (!bill.participants.includes(bill.payer)) {
                if (person !== bill.payer) {
                    balances[person] += perPersonAmount;
                } else if (person === bill.payer) {
                    balances[person] -= bill.amount - perPersonAmount;
                }
            } else {
                console.log("el filtro funca")
                balances[person] += perPersonAmount;
                balances[bill.payer] -= bill.amount;
                
            }

        });
    });

    console.table(balances);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Settlement:</h2>';

    /*     Object.keys(balances).forEach(person => {
            if (balances[person] !== 0) {
                const message = balances[person] > 0 ? `owes $${balances[person]} to ${"""return all negative balances[person]"""}` : `is owed $${Math.abs(balances[person])}`;
                resultDiv.innerHTML += `<p>${person} ${message}</p>`;
            }
        }); */

    Object.keys(balances).forEach(person => {
        if (balances[person] !== 0) {
            if (balances[person] < 0) {
                resultDiv.innerHTML += `<p>${person} is owed $${-balances[person]}</p>`;
            } else {
                const debtors = Object.keys(balances).filter(
                    debtor => balances[debtor] < 0 && person !== debtor
                );

                if (debtors.length != null) {
                    const debtList = debtors.map(debtor => `${debtor}`).join(', ');
                    console.log(debtList)
                    resultDiv.innerHTML += `<p>${person} owes $${Math.abs(balances[person])} to ${debtList}</p>`;
                } /* else {
                    resultDiv.innerHTML += `<p>${person} owes $${Math.abs(balances[person])}</p>`;
                } */
            }
        }
    });

}
