const fs = require("fs");

const EXPENSE_FILE = "./expense.json";

const writeFile = (data) => {
  if (!Array.isArray(data)) {
    throw new Error("Invalid data format: expected array");
  }
  fs.writeFileSync(EXPENSE_FILE, JSON.stringify(data, null, 2), "utf-8");
};

const readFile = () => {
  if (!fs.existsSync(EXPENSE_FILE)) {
    writeFile([]);
    return [];
  }
  const data = fs.readFileSync(EXPENSE_FILE, "utf-8");
  return data ? JSON.parse(data) : [];
};

const addExpense = (description, amount) => {
  try {
    description = description.trim();
    if (!description) {
      throw new Error("description cannot be empty.");
    }

    amount = Number(amount);
    if (isNaN(amount) || amount < 0) {
      throw new Error(
        "Invalid amount, please provide a valid positive numeric amount."
      );
    }

    const now = new Date().toLocaleDateString();

    const data = readFile();

    const expense = {
      id: data.length === 0 ? 1 : Math.max(...data.map((data) => data.id)) + 1,
      description: description,
      amount: amount,
      createdAt: now,
      updatedAt: now,
    };

    writeFile([...data, expense]);

    console.log(`Expense added successfully (ID: ${expense.id})`);
  } catch (error) {
    console.error(`Error adding expense: ${error.message}`);
  }
};