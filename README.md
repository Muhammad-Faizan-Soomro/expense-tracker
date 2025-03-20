# 💰 Expense Tracker CLI

A command-line interface (CLI) application for managing personal finances and expenses with category support.

**Project Page**: [Expense Tracker](https://roadmap.sh/projects/expense-tracker)

## ✨ Features

- 💸 **Expense Management**
  - ➕ Add expenses with descriptions, amounts, and categories
  - ✏️ Update existing expenses
  - ❌ Delete expenses
  - 📜 List all expenses
- 📊 **Financial Insights**
  - 📈 View total expense summary
  - 🔍 Filter summary by month and/or category
- 🗂 **Category System**
  - 🏷️ Create/edit/delete custom categories
  - 🔗 Associate expenses with categories
- 📥 **Data Export**
  - 📄 Export expenses to CSV format
- 📅 **Date Handling**
  - 🕒 Automatic UTC date tracking
  - 📆 Monthly expense filtering

## 🛠 Installation

1. Ensure you have [Node.js](https://nodejs.org) (v16+) installed
2. Clone or download the repository
3. Install dependencies:
   ```bash
   npm install commander
   ```

## 🚀 Usage

```bash
node expense-tracker.js [command] [options]
```

### 📌 Basic Commands

| 🏷️ Command   | 📖 Description              | 🛠 Example |
|-----------|--------------------------|---------|
| `add`     | ➕ Add new expense           | `node expense-tracker.js add --description "Groceries" --amount 50 --category 1` |
| `list`    | 📜 Show expenses/categories  | `node expense-tracker.js list expense` |
| `update`  | ✏️ Modify existing expense   | `node expense-tracker.js update --id 1 --amount 60` |
| `delete`  | ❌ Remove expense            | `node expense-tracker.js delete --id 1` |
| `summary` | 📊 Financial overview        | `node expense-tracker.js summary --month 8 --category 1` |
| `export`  | 📄 CSV export                | `node expense-tracker.js export --output expenses_august.csv` |

### 🗂 Category Management

| 🏷️ Command            | 📖 Description        | 🛠 Example |
|--------------------|--------------------|---------|
| `create-category`  | ➕ Add new category   | `node expense-tracker.js create-category --name "Utilities"` |
| `edit-category`    | ✏️ Modify category    | `node expense-tracker.js edit-category --id 1 --name "Bills"` |
| `delete-category`  | ❌ Remove category    | `node expense-tracker.js delete-category --id 1` |

## 📂 Data Storage

- 📑 **JSON Format**: All data is stored in `expense.json`
- 📝 **Automatic Creation**: File is created on the first run if it does not exist
- 🗃 **Structure**:

```json
{
  "expense": [],
  "category": []
}
```

## ⚠️ Error Handling

- ✅ Input validation for all commands
- ❗ Clear error messages for:
  - 🚫 Invalid numeric inputs
  - 📌 Missing required fields
  - ❓ Non-existent IDs
  - 🔄 Category constraints
  - 📂 File operations

## 🔄 Example Workflow

1. 🏷️ Create a category:
   ```bash
   node expense-tracker.js create-category --name "Food"
   ```
2. ➕ Add expenses:
   ```bash
   node expense-tracker.js add --description "Restaurant" --amount 30 --category 1
   ```
3. 📜 View expenses:
   ```bash
   node expense-tracker.js list expense
   ```
4. 📊 Generate monthly summary:
   ```bash
   node expense-tracker.js summary --month 8
   ```
5. 📄 Export data:
   ```bash
   node expense-tracker.js export --output august_expenses.csv
   ```

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Author  

👤 **Muhammad Faizan Soomro**  
📧 [Email](mailto:mfaizansoomro00@gmail.com)  
🐙 [LinkedIn](https://www.linkedin.com/in/faizansoomro/)  

---