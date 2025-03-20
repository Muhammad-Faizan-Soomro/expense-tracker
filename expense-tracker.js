const fs = require("fs");
const { Command } = require("commander");
const program = new Command();

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

function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

const writeFile = (data) => {
  if (!isObject(data)) {
    throw new Error("Invalid data format: expected object");
  }
  fs.writeFileSync(EXPENSE_FILE, JSON.stringify(data, null, 2), "utf-8");
};

const readFile = () => {
  if (!fs.existsSync(EXPENSE_FILE)) {
    const data = { expense: [], category: [] };
    writeFile(data);
    return data;
  }
  const data = fs.readFileSync(EXPENSE_FILE, "utf-8");
  return data ? JSON.parse(data) : { expense: [], category: [] };
};

const addExpense = (description, amount, categoryId) => {
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

    categoryId = Number(categoryId);
    if (!categoryId || isNaN(categoryId) || categoryId < 0) {
      throw new Error(
        "Invalid categoryId, please provide a valid positive numeric categoryId."
      );
    }

    const now = new Date();

    const formattedDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const { expense, category } = readFile();

    const categoryIndex = category.findIndex(
      (category) => category.id === categoryId
    );

    if (categoryIndex === -1) throw new Error("Category does not exist.");

    const expenseData = {
      id:
        expense.length === 0
          ? 1
          : Math.max(...expense.map((data) => data.id)) + 1,
      description: description,
      amount: amount,
      categoryId: categoryId,
      createdAt: formattedDate,
    };

    writeFile({ expense: [...expense, expenseData], category: [...category] });

    console.log(`Expense added successfully (ID: ${expenseData.id})`);
  } catch (error) {
    console.error(`Error adding expense: ${error.message}`);
  }
};

const updateExpense = (id, description = "", amount = "", categoryId = "") => {
  try {
    id = Number(id);
    if (!id || isNaN(id)) {
      throw new Error("Invalid ID, please provide a valid numeric ID.");
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

    const { expense, category } = readFile();

    if (categoryId) {
      categoryId = Number(categoryId);
      if (isNaN(categoryId) || categoryId < 0) {
        throw new Error(
          "Invalid category ID, please provide a valid numeric category ID."
        );
      }

      const categoryIndex = category.findIndex(
        (category) => category.id === categoryId
      );

      if (categoryIndex == -1)
        throw new Error(`No category found with ID = ${categoryId}.`);
    }

    const expenseIndex = expense.findIndex((expense) => expense.id === id);

    if (expenseIndex == -1) {
      throw new Error(`No expense found with ID = ${id}.`);
    }

    expense[expenseIndex].description = description
      ? description
      : expense[expenseIndex].description;
    expense[expenseIndex].amount = amount
      ? amount
      : expense[expenseIndex].amount;
    expense[expenseIndex].categoryId = categoryId
      ? categoryId
      : expense[expenseIndex].categoryId;

    writeFile({ expense: [...expense], category: [...category] });

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

const listExpense = (type) => {
  try {
    const { expense, category } = readFile();

    if (type == "expense") {
      if (expense.length == 0) {
        console.log("No expense(s) available.");
        return;
      }

      const categoriesMap = category.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {});

      console.log("ID      Date   Description    Amount     Category");
      console.log("─────────────────────────────────────────────────");

      expense.forEach((expense) => {
        console.log(
          `${expense.id.toString().padEnd(3)}  ${
            expense.createdAt
          }  ${expense.description.padEnd(12)}  $${expense.amount}    ${
            categoriesMap[expense.categoryId]
          }`
        );
      });
    } else {
      if (category.length == 0) {
        console.log("No categories available.");
        return;
      }

      console.log("ID      Date   Name");
      console.log("───────────────────");

      category.forEach((category) => {
        console.log(
          `${category.id.toString().padEnd(3)}  ${category.createdAt}  ${
            category.name
          }`
        );
      });
    }
  } catch (error) {
    console.error(`Error Listing ${type}: ${error.message}`);
  }
};

const summary = (month = "", categoryId = "") => {
  try {
    if (month) {
      month = Number(month);
      if (isNaN(month) || month < 0 || month > MONTHS.length) {
        throw new Error(
          "Invalid month, please provide a valid numeric month [1-12]."
        );
      }
    }

    const { expense, category } = readFile();

    const categoriesMap = category.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    if (categoryId) {
      categoryId = Number(categoryId);
      if (isNaN(categoryId) || categoryId < 0) {
        throw new Error(
          "Invalid category ID, please provide a valid numeric category ID."
        );
      }

      const categoryIndex = category.findIndex(
        (category) => category.id === categoryId
      );

      if (categoryIndex == -1)
        throw new Error(`No category found with ID = ${categoryId}.`);
    }

    if (expense.length == 0) {
      console.log(`Total expenses: $0`);
      return;
    }

    if (!month && !categoryId) {
      const finalSum = expense.reduce((acc, curr) => acc + curr.amount, 0);
      console.log(`Total expenses: $${finalSum}`);
      return;
    } else if (month && !categoryId) {
      const finalSum = expense
        .filter(
          (expense) => new Date(expense.createdAt).getMonth() + 1 === month
        )
        .filter(
          (expense) =>
            new Date(expense.createdAt).getFullYear() ===
            new Date().getFullYear()
        )
        .reduce((acc, curr) => acc + curr.amount, 0);

      console.log(`Total expenses for ${MONTHS[month - 1]}: $${finalSum}`);
      return;
    } else if (categoryId && !month) {
      const finalSum = expense
        .filter((expense) => expense.categoryId === categoryId)
        .reduce((acc, curr) => acc + curr.amount, 0);
      console.log(
        `Total expenses for category ( ${categoriesMap[categoryId]} ): $${finalSum}`
      );
      return;
    } else {
      const finalSum = expense
        .filter((expense) => expense.categoryId === categoryId)
        .filter(
          (expense) => new Date(expense.createdAt).getMonth() + 1 === month
        )
        .filter(
          (expense) =>
            new Date(expense.createdAt).getFullYear() ===
            new Date().getFullYear()
        )
        .reduce((acc, curr) => acc + curr.amount, 0);

      console.log(
        `Total expenses for category ( ${categoriesMap[categoryId]} ) for ${
          MONTHS[month - 1]
        }: $${finalSum}`
      );
    }
  } catch (error) {
    console.error(`Error Listing Summary: ${error.message}`);
  }
};

const createCategory = (name) => {
  try {
    name = name.trim();
    if (!name) {
      throw new Error("Name of category cannot be empty.");
    }

    const { expense, category } = readFile();

    const categoryIndex = category.findIndex(
      (category) => category.name === name
    );

    if (categoryIndex !== -1) throw new Error("Category already exist");

    const now = new Date();

    const formattedDate =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    const categoryData = {
      id:
        category.length === 0
          ? 1
          : Math.max(...category.map((data) => data.id)) + 1,
      name: name,
      createdAt: formattedDate,
    };

    writeFile({ expense: [...expense], category: [...category, categoryData] });

    console.log(`Category added successfully (ID: ${categoryData.id})`);
  } catch (error) {
    console.error(`Error adding category: ${error.message}`);
  }
};

const editCategory = (id, name) => {
  try {
    id = Number(id);
    if (!id || isNaN(id) || id < 0) {
      throw new Error(
        "Invalid ID, please provide a valid positive numeric ID."
      );
    }

    name = name.trim();
    if (!name) {
      throw new Error("Name of category cannot be empty.");
    }

    const { expense, category } = readFile();

    const categoryId = category.findIndex((category) => category.id === id);

    if (categoryId === -1) throw new Error("Category does not exist.");

    const categoryName = category.findIndex(
      (category) => category.name === name
    );

    if (categoryName !== -1) throw new Error("Category already exist");

    category[categoryId].name = name;

    writeFile({ expense: [...expense], category: [...category] });

    console.log(`Category updated successfully (ID: ${id})`);
  } catch (error) {
    console.error(`Error updating category: ${error.message}`);
  }
};

const deleteCategory = (id) => {
  try {
    id = Number(id);
    if (!id || isNaN(id) || id < 0) {
      throw new Error(
        "Invalid ID, please provide a valid positive numeric ID."
      );
    }

    const { expense, category } = readFile();

    const updatedCategory = category.filter((category) => category.id !== id);

    if (category.length === updatedCategory.length)
      throw new Error("Category does not exist.");

    const categoryLink = expense.findIndex(
      (expense) => expense.categoryId === id
    );

    if (categoryLink !== -1)
      throw new Error("Category is linked to one or more expense(s).");

    writeFile({ expense: [...expense], category: [...updatedCategory] });

    console.log(`Category deleted successfully (ID: ${id})`);
  } catch (error) {
    console.error(`Error deleting category: ${error.message}`);
  }
};

program
  .command("add")
  .requiredOption("--description <string>", "Expense description")
  .requiredOption("--amount <number>", "Expense amount")
  .requiredOption("--category <number>", "Category ID")
  .action((options) =>
    addExpense(options.description, options.amount, options.category)
  );

program
  .command("update")
  .requiredOption("--id <number>", "Expense ID")
  .option("--description <string>", "Expense description")
  .option("--amount <number>", "Expense amount")
  .option("--category <number>", "Category ID")
  .action((options) => {
    try {
      if (!options.description && !options.amount && !options.category)
        throw new Error(
          "At least one of --description or --amount or --category is required"
        );
      updateExpense(
        options.id,
        options.description,
        options.amount,
        options.category
      );
    } catch (error) {
      console.error(`Error updating expense: ${error.message}`);
    }
  });

program
  .command("delete")
  .requiredOption("--id <number>", "Expense ID")
  .action((options) => deleteExpense(options.id));

program
  .command("list")
  .argument("<type>", "list of category or expense")
  .action((type) => {
    if (!["expense", "category"].includes(type.toLowerCase())) {
      console.error("Error: Argument must be 'expense' or 'category'.");
      process.exit(1);
    }
    listExpense(type);
  });

program
  .command("summary")
  .option("--month <string>", "Summary month")
  .option("--category <number>", "Category ID")
  .action((options) => {
    if (!options.month && !options.category) {
      summary();
      return;
    }
    summary(options.month, options.category);
  });

program
  .command("create-category")
  .requiredOption("--name <string>", "Category name")
  .action((options) => createCategory(options.name));

program
  .command("edit-category")
  .requiredOption("--id <number>", "Category ID")
  .requiredOption("--name <string>", "Category name")
  .action((options) => editCategory(options.id, options.name));

program
  .command("delete-category")
  .requiredOption("--id <number>", "Category ID")
  .action((options) => deleteCategory(options.id));

program.parse();
