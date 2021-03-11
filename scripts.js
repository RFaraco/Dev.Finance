

const Modal = {
    open() {
        // Abrir modal e adicionar a classe active ao modal
        /* Vai varrer todo html do DOM e pegar a parte que tem a "model-overlay' e vai devolver o objeto que no caso
        é a DIV. */
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },

    close() {
        // fechar modal e remover a classe active ao modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const Storage = {
    get() {
        // Pega a string do localStorage e transforma em array
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        // Pega o array de transações e transforma em string para armazenar no localStorage
        console.log(transactions)
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reaload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reaload()

    },

    incomes() {
        // Somar as entradas
        let income = 0;

        // Transaction.forEach(function(transaction) {
        Transaction.all.forEach(transaction => {

                if (transaction.amount > 0) {
                //income = income + transaction.amount;
                income += transaction.amount;
            }        
        })
    return income;
    },
    
    expenses() {
        //Somar as saidas
        let expense = 0;
        // Poderia usar arrow function  - Transactions.forEach(function(transaction) {
        Transaction.all.forEach(transaction => {
                if (transaction.amount < 0) {
                //Income = income + transaction.amount;
                expense += transaction.amount
            }
        })
        return expense;
    },
    
    total(){
        //Calcular o total
        //Somar as entradas
        let total = 0;
        total =  Transaction.incomes() + Transaction.expenses();
        return total;
    }

}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction,index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLtransaction(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
        console.log(tr)
    },

    updateBalance() {
        document.
            getElementById('incomeDisplay').
                innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.
            getElementById('expenseDisplay').
                innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.
            getElementById('totalDisplay').
                innerHTML = Utils.formatCurrency(Transaction.total())

    },

    innerHTMLtransaction(transaction, index) {
        // Avisa o CSS qual tipo de classe usar para mudar de cor
        const cssClass = transaction.amount > 0 ? "income" : "expense"  

        // Chama função para transformar - e +
        const amount = Utils.formatCurrency(transaction.amount)

        // Template literals
        const html = `
        <td class ="description">${transaction.description}</td>
        <td class="${cssClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>
        `
        return html
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        // Transforma tudo que não for número em número
        value = String(value).replace(/\D/g, "")
        // Para mostar a casa decimal
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value    

    },

    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value)

    },

    formatDate(date) {
        const splitedDate = date.split("-")
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields() {
        const {description, amount, date} = Form.getValues()
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campus")
            }

    },

    formatValues (){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description: description,
            amount: amount,
            date: date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        // Para evitar que traga um monte de informações no formulario
        event.preventDefault()

        try {
        // Tratar o que veio no evento no forme e capturar erros
        Form.validadeFields()
        const transaction = Form.formatValues()
        Transaction.add(transaction)
        Form.clearFields()
        Modal.close()

        } catch (error) {
            alert(error.message)
            
        }


    }
}


const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        });

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reaload () {
        DOM.clearTransactions()
        App.init()
    }
}

// Iniciando a aplicação

App.init()

