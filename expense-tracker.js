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