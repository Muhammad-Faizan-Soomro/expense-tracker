const fs = require("fs");

const EXPENSE_FILE = "./expense.json";
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
    if (!amount || isNaN(amount) || amount < 0) {
      throw new Error(
        "Invalid amount, please provide a valid positive numeric amount."
      );
    }

    const now = new Date();

    const formattedDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const data = readFile();

    const expense = {
      id: data.length === 0 ? 1 : Math.max(...data.map((data) => data.id)) + 1,
      description: description,
      amount: amount,
      createdAt: formattedDate,
    };

    writeFile([...data, expense]);

    console.log(`Expense added successfully (ID: ${expense.id})`);
  } catch (error) {
    console.error(`Error adding expense: ${error.message}`);
  }
};

const updateExpense = (id, description = "", amount = "") => {
  try {
    id = Number(id);
    if (!id || isNaN(id)) {
      throw new Error("Invalid ID, please provide a valid numeric ID.");
    }

    if (!(description || amount)) {
      throw new Error(
        "provide any one of description or amount or both to update the expense."
      );
    }

    description = description.trim();

    if (amount) {
      amount = Number(amount);
      if (isNaN(amount) || amount < 0) {
        throw new Error(
          "Invalid amount, please provide a valid positive numeric amount."
        );
      }
    }

    const data = readFile();

    const expenseIndex = data.findIndex((expense) => expense.id === id);

    if (expenseIndex == -1) {
      throw new Error(`No expense found with ID = ${id}.`);
    }

    data[expenseIndex].description = description
      ? description
      : data[expenseIndex].description;
    data[expenseIndex].amount = amount ? amount : data[expenseIndex].amount;

    writeFile(data);

    console.log(`Expense updated successfully (ID: ${id})`);
  } catch (error) {
    console.error(`Error Updating Expense: ${error.message}`);
  }
};

const deleteExpense = (id) => {
  try {
    id = Number(id);
    if (!id || isNaN(id)) {
      throw new Error("Invalid ID, please provide a valid numeric ID.");
    }

    const data = readFile();
    const initialLength = data.length;

    const updatedData = data.filter((expense) => expense.id != id);

    if (initialLength == updatedData.length) {
      throw new Error(`No expense found with ID = ${id}.`);
    }

    writeFile(updatedData);

    console.log(`Expense deleted successfully (ID: ${id})`);
  } catch (error) {
    console.error(`Error Deleting Expense: ${error.message}`);
  }
};

const listExpense = () => {
  try {
    const data = readFile();

    if (data.length == 0) {
      console.log("No expense(s) available.");
      return;
    }

    console.log("ID      Date   Description    Amount");
    console.log("────────────────────────────────────");

    data.forEach((expense) => {
      console.log(
        `${expense.id.toString().padEnd(3)}  ${
          expense.createdAt
        }  ${expense.description.padEnd(12)}  $${expense.amount}`
      );
    });
  } catch (error) {
    console.error(`Error Listing Expense(s): ${error.message}`);
  }
};

const summary = (month = "") => {
  try {
    if (month) {
      month = Number(month);
      if (isNaN(month) || month < 0 || month > MONTHS.length) {
        throw new Error(
          "Invalid month, please provide a valid numeric month [1-12]."
        );
      }
    }

    const data = readFile();
    if (data.length == 0) {
      console.log(
        `Total expenses ${month ? `for ${MONTHS[month - 1]}` : ""}: $0`
      );
      return;
    }

    if (!month) {
      const finalSum = data.reduce((acc, curr) => acc + curr.amount, 0);
      console.log(`Total expenses: $${finalSum}`);
      return;
    }

    const finalSum = data
      .filter((expense) => new Date(expense.createdAt).getMonth() + 1 === month)
      .filter(
        (expense) =>
          new Date(expense.createdAt).getFullYear() === new Date().getFullYear()
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    console.log(`Total expenses for ${MONTHS[month - 1]}: $${finalSum}`);
  } catch (error) {
    console.error(`Error Listing Summary: ${error.message}`);
  }
};
