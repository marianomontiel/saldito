let participants = [];
let bills = [];

//Create participants array (it doesn't do anything yet. However, it is important for future data validation)
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

//fuction with default values
/* function addBill() {
    let billHTML = `
        <div class="bill" id="1">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name" value="pizza">
            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount" value="100">
            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names" value="a,b,c,d">
            <label for="payer">Payer:</label>
            <input type="text" class="payer" placeholder="Enter who paid the bill" value="c">
            <button onclick="removeBill(1)">x</button>
        </div>
        <div class="bill" id="2">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name" value="pizza">
            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount" value="100">
            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names" value="c,d,e,f">
            <label for="payer">Payer:</label>
            <input type="text" class="payer" placeholder="Enter who paid the bill" value="d">
            <button onclick="removeBill(2)">x</button>
        </div>
        <div class="bill" id="3">
            <label for="billName">Bill Name:</label>
            <input type="text" class="billName" placeholder="Enter bill name" value="pizza">
            <label for="billAmount">Bill Amount:</label>
            <input type="number" class="billAmount" placeholder="Enter amount" value="100">
            <label for="billParticipants">Participants:</label>
            <input type="text" class="billParticipants" placeholder="Enter participant names" value="c,d">
            <label for="payer">Payer:</label>
            <input type="text" class="payer" placeholder="Enter who paid the bill" value="c">
            <button onclick="removeBill(3)">x</button>
        </div>
    `;
    document.getElementById('billsList').insertAdjacentHTML('beforeend', billHTML);
} */

function removeBill(a) {
    const billDiv = document.getElementById(a);
    billDiv.remove();


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

    //Calculate who owes how much. This is the buggy script.
    bills.forEach(bill => {
        const perPersonAmount = bill.amount / bill.participants.length;
        console.log(perPersonAmount);
        bill.participants.forEach(person => {
            if (!balances[person]) {
                balances[person] = 0;
            }
            if (!bill.participants.includes(bill.payer)) {
                balances[person] += perPersonAmount;
                balances[bill.payer] -= bill.amount;
                console.log("doesnt include bill.payer");

            } else {
                if (person !== bill.payer) {
                    balances[person] += perPersonAmount;
                } else if (person === bill.payer) {
                    balances[person] -= bill.amount - perPersonAmount;
                }
                console.log("includes bill.payer");
            }
            console.table(balances)
        });
    });

    console.table(balances);


    //Output results to DOM
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Settlement:</h2>';

    //Determine who is the lender and who is the borrower then output to DOM
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
