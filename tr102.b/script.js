const typeEl = document.getElementById("type");
    const categoryEl = document.getElementById("category");
    const descEl = document.getElementById("description");
    const amountEl = document.getElementById("amount");
    const addBtn = document.getElementById("addBtn");
    const transactionsEl = document.getElementById("transactions");
    const balanceEl = document.getElementById("balance");
    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateSummary() {
      const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      const balance = income - expense;

      balanceEl.textContent = `Rs ${balance.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
      incomeEl.textContent = `Rs ${income.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
      expenseEl.textContent = `Rs ${expense.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
    }

    function renderTransactions() {
      transactionsEl.innerHTML = "";
      
      if (transactions.length === 0) {
        transactionsEl.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-receipt"></i>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to get started</p>
          </div>
        `;
        return;
      }
      
      transactions.forEach((t, index) => {
        const div = document.createElement("div");
        div.classList.add("transaction");
        div.classList.add(t.type);
        div.innerHTML = `
          <div class="transaction-content">
            <div class="transaction-title">${t.description}</div>
            <div class="transaction-meta">
              <span><i class="fas fa-tag"></i> ${t.category}</span>
              <span>•</span>
              <span><i class="far fa-calendar"></i> ${t.date}</span>
            </div>
          </div>
          <div class="transaction-actions">
            <div class="transaction-amount">${t.type === "income" ? "+" : "-"} Rs ${t.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</div>
            <div class="delete" onclick="deleteTransaction(${index})">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        `;
        transactionsEl.appendChild(div);
      });
    }

    function deleteTransaction(index) {
      transactions.splice(index, 1);
      saveToLocal();
      renderTransactions();
      updateSummary();
    }

    function saveToLocal() {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    addBtn.addEventListener("click", () => {
      const type = typeEl.value;
      const category = categoryEl.value;
      const description = descEl.value.trim();
      const amount = parseFloat(amountEl.value);

      if (!category || !description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid details!");
        return;
      }

      const date = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      const transaction = { type, category, description, amount, date };
      transactions.push(transaction);

      saveToLocal();
      renderTransactions();
      updateSummary();

      descEl.value = "";
      amountEl.value = "";
      categoryEl.selectedIndex = 0;
    });

    window.addEventListener("load", () => {
      renderTransactions();
      updateSummary();
    });