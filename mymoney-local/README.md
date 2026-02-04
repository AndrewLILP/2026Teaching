# MyMoney Tracker - Local Storage Version
### Computing Technology 7-10 Teaching Resource

## 📚 Overview

This is a **multi-user money tracking application** that runs entirely in the browser using localStorage. It's designed for Computing Technology students to learn about:

- **Local data storage** (localStorage API)
- **Multi-user systems** (without authentication)
- **DOM manipulation** (JavaScript)
- **Data structures** (objects and arrays)
- **Event handling** (buttons, forms)
- **Data visualization** (Chart.js)

---

## 🎯 Key Features

✅ **Multi-user support** - Multiple family members can have separate profiles  
✅ **Local storage** - All data saved in browser (no server needed)  
✅ **Income & expense tracking** - Track money in and out  
✅ **Categories** - Organize expenses by type  
✅ **Tax deductible tracking** - Mark work-related expenses  
✅ **Visual charts** - See spending by category  
✅ **Monthly summaries** - Current balance, income, expenses  
✅ **Recent transactions** - See latest activity  

---

## 📁 File Structure

```
mymoney-local/
│
├── index.html          # Main HTML file with structure
├── css/
│   └── style.css      # All styling (colors, layout, responsive)
└── js/
    └── app.js         # All functionality (localStorage, calculations)
```

---

## 🚀 How to Use

### For Teachers:
1. Download all three files
2. Open `index.html` in any web browser
3. Walk through the code with students
4. Modify and experiment!

### For Students:
1. Open `index.html` in Chrome, Firefox, or Edge
2. Create a user profile (type your name)
3. Click your name to "log in"
4. Add income and expenses
5. View your dashboard and spending chart

---

## 🧠 Learning Concepts

### 1. **localStorage Basics**

```javascript
// SAVE data
localStorage.setItem('key', 'value');

// GET data
const data = localStorage.getItem('key');

// REMOVE data
localStorage.removeItem('key');

// CLEAR everything
localStorage.clear();
```

**Key Concept:** localStorage stores data as **strings only**!  
That's why we use `JSON.stringify()` and `JSON.parse()`.

---

### 2. **Data Structure**

Each user's data is stored separately:

```
localStorage:
├── 'mymoney_users' = '["Mum", "Dad", "Sarah"]'
├── 'mymoney_data_Mum' = '[{transaction}, {transaction}, ...]'
├── 'mymoney_data_Dad' = '[{transaction}, {transaction}, ...]'
└── 'mymoney_data_Sarah' = '[{transaction}, {transaction}, ...]'
```

Each transaction object:
```javascript
{
    type: 'income',              // or 'expense'
    amount: 150.50,              // Number
    description: 'Woolworths pay',
    date: '2026-02-04',          // String in YYYY-MM-DD format
    timestamp: 1738637234567,    // Milliseconds since 1970 (for sorting)
    category: 'Food & Drinks',   // Only for expenses
    taxDeductible: true,         // Only for expenses
    receiptLocation: 'shoebox'   // Optional
}
```

---

### 3. **Key Functions**

| Function | Purpose |
|----------|---------|
| `loadUserList()` | Load all users from localStorage and display buttons |
| `createNewUser()` | Add a new user profile |
| `selectUser()` | "Log in" a user and show their dashboard |
| `getUserData()` | Retrieve all transactions for current user |
| `saveUserData()` | Save transactions array back to localStorage |
| `addIncome()` | Add a new income transaction |
| `addExpense()` | Add a new expense transaction |
| `calculateMonthlyTotals()` | Calculate balance, income, expenses for current month |
| `loadChart()` | Create pie chart of spending by category |
| `displayRecentTransactions()` | Show last 10 transactions |

---

### 4. **How Multi-User Works**

**Without Authentication:**
- No passwords or security
- Users simply select their name
- Each user's data is stored under `mymoney_data_USERNAME`
- Users cannot see other users' data (it's separated by key)

**User Flow:**
1. User Selection Screen → Choose or create profile
2. Dashboard Screen → See their data only
3. Switch User → Go back to selection screen

---

## 🎨 CSS Concepts Covered

- **Flexbox** - For centering and layout
- **Grid** - For the summary cards
- **Responsive Design** - Works on phones and tablets
- **Transitions** - Smooth hover effects
- **Box Model** - Padding, margin, border
- **Colors** - Hex codes, RGB, RGBA
- **Pseudo-classes** - `:hover`, `:focus`

---

## 💡 Teaching Activities

### Activity 1: Add a New Feature (Beginner)
**Goal:** Add a "Total Transactions" card to the summary section

**Steps:**
1. Add a new `<div>` in `index.html` inside `.summary-cards`
2. Give it an ID like `total-transactions`
3. In `calculateMonthlyTotals()`, count the transactions
4. Update the display with `document.getElementById('total-transactions').textContent`

---

### Activity 2: Add Budget Warnings (Intermediate)
**Goal:** Show a warning if expenses exceed income

**Steps:**
1. In `calculateMonthlyTotals()`, compare income vs expenses
2. If expenses > income, show a warning message
3. Use `document.createElement()` to create a warning div
4. Style it with CSS (red background, bold text)

---

### Activity 3: Add Delete Transaction (Advanced)
**Goal:** Let users delete transactions

**Steps:**
1. Add a delete button to each transaction in `displayRecentTransactions()`
2. Create a `deleteTransaction(timestamp)` function
3. Filter out the transaction from the array
4. Save back to localStorage
5. Reload the dashboard

---

### Activity 4: Export Data (Advanced)
**Goal:** Download transactions as a JSON file

**Steps:**
1. Add an "Export" button to the dashboard
2. Create a function that gets user data
3. Convert to JSON string with `JSON.stringify(data, null, 2)`
4. Create a Blob and trigger download
5. Research: `Blob`, `URL.createObjectURL()`, `<a download>`

---

## 🔧 Common Modifications

### Change the Color Scheme
**File:** `css/style.css`

Look for:
```css
.income-card .amount { color: #4CAF50; }  /* Green */
.expense-card .amount { color: #F44336; } /* Red */
.balance-card .amount { color: #2196F3; } /* Blue */
```

Replace with your own hex colors!

---

### Add More Categories
**File:** `js/app.js` and `index.html`

1. In `index.html`, add new `<option>` in the expense category dropdown
2. In `app.js`, add the category name to the `categories` array in `loadChart()`

---

### Change Date Format
**File:** `js/app.js`

Currently uses ISO format: `2026-02-04`

To display as DD/MM/YYYY:
```javascript
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Data disappears when I refresh
**Cause:** localStorage might be disabled, or you're in Incognito/Private mode  
**Solution:** Use normal browsing mode, check browser settings

---

### Issue: Chart doesn't update
**Cause:** Old chart wasn't destroyed before creating new one  
**Solution:** Already fixed! See `loadChart()` - we call `currentChart.destroy()` first

---

### Issue: Multiple users see the same data
**Cause:** Not switching `currentUser` properly  
**Solution:** Check that `selectUser()` sets `currentUser` before loading data

---

### Issue: Can't delete a user
**Feature:** Not implemented yet! This would be a great student activity:
1. Add a delete button next to each user
2. Remove from `allUsers` array
3. Delete their data key: `localStorage.removeItem('mymoney_data_' + username)`
4. Save updated user list

---

## 📊 Technical Details

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ⚠️ Incognito mode (data won't persist)

### Libraries Used
- **Chart.js v3.9.1** - For pie charts
  - CDN: `https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js`

### Storage Limits
- localStorage typically allows **5-10MB** per domain
- This app uses very little (transactions are small)
- Thousands of transactions = still under 1MB

---

## 🎓 Syllabus Alignment

### NSW Computing Technology 7-10

**Outcomes Addressed:**
- **CT5-DPM-01** - Design and production processes
- **CT5-DAT-01** - Data storage and transmission
- **CT5-COM-01** - Communication through digital interfaces
- **CT5-OPL-01** - Programming and problem solving
- **CT5-DES-01** - User interface and experience design

**Focus Areas:**
- Developing Apps and Web Software
- Designing for User Experience
- Analysing Data

---

## 🚨 Important Notes

### Data Privacy
⚠️ **This app has NO security!**
- No passwords
- No encryption
- Anyone using the browser can access any profile
- Suitable for: Learning, family use on private devices
- NOT suitable for: Sensitive financial data, public computers

### localStorage Limitations
- Data is tied to the browser
- Clearing browser data = losing all transactions
- Can't sync between devices
- No backup system

**For Students:** This is a learning project! Real banking apps use:
- Secure servers
- Encryption
- Authentication (passwords)
- Backups

---

## 📖 Further Learning

### Next Steps for Students:
1. **Add features** - Budget limits, recurring transactions, categories
2. **Improve UI** - Better graphs, animations, dark mode
3. **Data export/import** - Save to file, upload from file
4. **Learn Firebase** - Add real authentication and cloud storage
5. **Build a server** - Use Node.js, Express, MongoDB

### Resources:
- MDN localStorage guide: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Chart.js documentation: https://www.chartjs.org/docs/latest/
- JavaScript array methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

---

## 📝 License

This is a teaching resource created for NSW Computing Technology classes.  
Feel free to modify and use for educational purposes.

---

## 🙋 Questions for Discussion

1. **Why does each user need a separate localStorage key?**
   - So their data doesn't mix with other users

2. **What happens if two users have the same name?**
   - The code prevents this in `createNewUser()` using `includes()`

3. **Could we add a password system to this?**
   - Yes! But localStorage passwords aren't secure (can be viewed in DevTools)

4. **How would you export data to a CSV file?**
   - Convert array to CSV format, create Blob, trigger download

5. **What if we wanted to sync between devices?**
   - Need a server (Firebase, custom backend) or cloud storage

---

**Created by:** Andrew (Computing Technology Teacher)  
**Version:** 1.0 - Local Storage Edition  
**Last Updated:** February 2026