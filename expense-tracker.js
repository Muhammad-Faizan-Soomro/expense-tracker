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
const options = {};

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

const validateArgs = (expectedLength, command) => {
  if (process.argv.length !== expectedLength) {
    const commands = {
      add: "node expense-tracker.js add --description <description> --amount <amount>",
      summary: "node expense-tracker.js summary --month <month>",
      delete: "node expense-tracker.js delete --id <id>",
      update:
        "\nnode expense-tracker.js update --id <id> --description <description> OR \nnode expense-tracker.js update --id <id> --amount <amount> OR \nnode expense-tracker.js update --id <id> --description <description> --amount <amount>",
    };

    throw new Error(
      `Invalid arguments!\nUsage: ${commands[command] || "unknown command"}`
    );
  }
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

const commands = {
  add: () => {
    validateArgs(7, "add");
    if (!(options.description && options.amount)) {
      console.error(
        "Error: Invalid options, options should only be 'description' and 'amount'."
      );
      return;
    }
    addExpense(options.description, options.amount);
  },
  list: () => {
    if (process.argv.length == 3) {
      listExpense();
      return;
    }
  },
  summary: () => {
    if (process.argv.length == 3) {
      summary();
      return;
    }
    validateArgs(5, "summary");
    if (!options.month) {
      console.error("Error: Invalid option, option should only be 'month'.");
      return;
    }
    summary(options.month);
  },
  delete: () => {
    validateArgs(5, "delete");
    if (!options.id) {
      console.error("Error: Invalid option, option should only be 'id'.");
      return;
    }
    deleteExpense(options.id);
  },
  update: () => {
    if (process.argv.length == 7) {
      validateArgs(7, "update");
      if (!options.id || !(options.amount || options.description)) {
        console.error(
          "Error: Invalid option, option should only be 'id' and ['description' or 'amount']."
        );
        return;
      }
    } else {
      validateArgs(9, "update");
      if (!(options.amount && options.description && options.id)) {
        console.error(
          "Error: Invalid options, options should only be 'id' and 'description' and 'amount'."
        );
        return;
      }
    }

    updateExpense(options.id, options?.description, options?.amount);
  },
};

try {
  const command = process.argv[2];
  if (!commands[command]) {
    throw new Error(
      `Unknown command: ${command}. Available commands: add, list, summary <month>, update, delete`
    );
  }
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].substring(2);
      const value =
        args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : undefined;
      options[key] = value;
    }
  }
  commands[command]();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
