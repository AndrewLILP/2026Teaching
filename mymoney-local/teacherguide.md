# Quick Start Guide for Teachers
## MyMoney Tracker - Local Storage Version

---

## ⚡ 5-Minute Setup

1. **Download** all files to a folder called `mymoney-local`
2. **Open** `index.html` in any web browser (double-click it)
3. **Done!** The app is now running

---

## 📖 Teaching the Code (Lesson Plan)

### Lesson 1: Understanding the Structure (45 mins)

**1. HTML Structure (15 mins)**
- Open `index.html` in a code editor
- Identify the two main screens:
  - User selection screen (lines 1-50)
  - Main app screen (lines 52-200)
- Find where modals are defined
- Discussion: Why do we need two screens?

**2. CSS Styling (15 mins)**
- Open `css/style.css`
- Find the user selection styles
- Find the summary cards styles
- Experiment: Change colors and see the result
- Discussion: What is flexbox? What is grid?

**3. JavaScript Basics (15 mins)**
- Open `js/app.js`
- Read the comments at the top
- Find the global variables
- Identify the main functions
- Discussion: What is a function? What is a variable?

---

### Lesson 2: Data Storage (45 mins)

**1. Introduction to localStorage (10 mins)**
- Open browser DevTools (F12)
- Go to Application → Local Storage
- Type in console:
  ```javascript
  localStorage.setItem('test', 'hello');
  localStorage.getItem('test');
  ```
- Discussion: Where is this data stored?

**2. How Users are Stored (15 mins)**
- Look at `loadUserList()` function
- Create a user in the app
- Check DevTools → Application → Local Storage
- Find `mymoney_users` key
- Discussion: Why is it a JSON string?

**3. How Transactions are Stored (20 mins)**
- Add an income and expense
- Check localStorage again
- Find `mymoney_data_USERNAME` key
- Copy the value and paste into a JSON formatter
- Discussion: What is the structure of each transaction?

---

### Lesson 3: Code Walkthrough (60 mins)

**1. User Creation Flow (20 mins)**
Follow the code path:
1. User types name → `<input id="new-username">`
2. Clicks button → `onclick="createNewUser()"`
3. Function runs → `js/app.js` line ~150
4. Validates input → checks if empty or duplicate
5. Adds to array → `allUsers.push(username)`
6. Saves to localStorage → `localStorage.setItem(...)`
7. Updates display → `displayUserButtons()`

**Activity:** Add console.log statements to track the flow

**2. Adding Income Flow (20 mins)**
Follow the code path:
1. Click "Add Income" → `showAddIncome()`
2. Modal appears → CSS changes `display: none` to `flex`
3. User fills form
4. Clicks "Add Income" → `addIncome()`
5. Data validated
6. Transaction object created
7. Saved to localStorage
8. Dashboard refreshed

**Activity:** What happens if validation fails?

**3. Displaying Data Flow (20 mins)**
Follow the code path:
1. User logs in → `selectUser(username)`
2. `loadDashboard()` is called
3. `calculateMonthlyTotals()` runs
   - Gets all transactions
   - Filters by current month
   - Adds up totals
   - Updates display
4. `loadChart()` runs
   - Gets expenses
   - Groups by category
   - Creates Chart.js pie chart

**Activity:** Add a console.log to see all transactions

---

### Lesson 4: Hands-On Modifications (45 mins)

**Easy Task (10 mins):** Change Colors
- Modify the income color from green to blue
- Files: `css/style.css` (search for #4CAF50)

**Medium Task (15 mins):** Add "Total Transactions" Display
- Add HTML element
- Count transactions in `calculateMonthlyTotals()`
- Display the count

**Hard Task (20 mins):** Add a "Clear All Data" Button
- Add button in HTML
- Create `clearUserData()` function
- Confirm with user before deleting
- Reload dashboard after clearing

---

## 🎯 Key Concepts to Emphasize

### 1. **localStorage vs Firebase**

| Feature | localStorage | Firebase |
|---------|-------------|----------|
| Storage location | Browser | Cloud server |
| Requires internet? | No | Yes |
| Sync between devices? | No | Yes |
| Setup complexity | Zero | Moderate |
| Security | Low | High |
| Multi-device | No | Yes |

### 2. **Data Structures**

**Array:**
```javascript
['Mum', 'Dad', 'Sarah']  // List of users
```

**Object:**
```javascript
{                         // Single transaction
  type: 'income',
  amount: 150.50,
  description: 'Pay'
}
```

**Array of Objects:**
```javascript
[                        // All transactions
  {type: 'income', ...},
  {type: 'expense', ...},
  {type: 'income', ...}
]
```

### 3. **DOM Manipulation**

**Get an element:**
```javascript
document.getElementById('balance')
```

**Change its content:**
```javascript
element.textContent = '$1234.56'
```

**Change its style:**
```javascript
element.style.display = 'none'
```

**Create a new element:**
```javascript
const div = document.createElement('div')
div.className = 'card'
parent.appendChild(div)
```

---

## 🧪 Testing Scenarios

### Scenario 1: New User
1. Create user "Test123"
2. Check localStorage - should see user in `mymoney_users`
3. Add income $100
4. Check localStorage - should see `mymoney_data_Test123`
5. Refresh page - data should persist

### Scenario 2: Multiple Users
1. Create "Alice" and "Bob"
2. Login as Alice, add income $500
3. Switch to Bob, add expense $50
4. Switch back to Alice - should only see $500

### Scenario 3: Monthly Calculation
1. Add income dated this month
2. Add income dated last month
3. Check dashboard - only this month's income shows

### Scenario 4: Chart Display
1. Add expenses in different categories
2. Check pie chart shows correct proportions
3. Add more in one category
4. Chart should update

---

## 🐛 Debugging Tips for Students

### Problem: "Nothing happens when I click"
**Check:**
1. Did you save the file?
2. Did you refresh the browser?
3. Open DevTools Console (F12) - are there errors?
4. Check if `onclick` is spelled correctly

### Problem: "Data disappeared"
**Check:**
1. Are you in Incognito mode?
2. Did you clear browser data?
3. DevTools → Application → Local Storage - is data there?
4. Try a different browser

### Problem: "Chart doesn't show"
**Check:**
1. Is Chart.js CDN link in the HTML?
2. Is there any expense data?
3. Console - any errors about Chart?
4. Canvas element - does it exist?

---

## 📊 Assessment Ideas

### Formative Assessment (During Lessons)
- Code reading: "What does this function do?"
- Prediction: "What will happen if...?"
- Debugging: "Find the bug in this code"
- Explanation: "Why do we use JSON.stringify?"

### Summative Assessment (End of Unit)

**Option 1: Code Analysis**
- Given a new function, explain what it does
- Identify variables, functions, loops
- Trace the data flow

**Option 2: Feature Implementation**
- Add a specific new feature (budget limits)
- Document the changes made
- Test and demonstrate

**Option 3: Problem Solving**
- Fix three provided bugs
- Explain what was wrong
- Explain your solution

**Option 4: Design Task**
- Design a new feature (categories for income)
- Write pseudocode
- Implement and test

---

## 📚 Extension Activities

### For Fast Finishers:
1. Add dark mode toggle
2. Create a "Search transactions" feature
3. Add transaction editing (not just adding)
4. Create monthly/yearly view toggle
5. Add data export to CSV
6. Create a "budget goal" feature
7. Add transaction notes/tags

### For Advanced Students:
1. Implement data import from CSV
2. Add data validation using regex
3. Create recurring transactions
4. Build a "Reports" page with multiple charts
5. Add undo/redo functionality
6. Implement data encryption
7. Create a "Goals" tracking feature

---

## 🎓 Curriculum Connections

### Mathematics:
- Calculating totals (addition/subtraction)
- Percentages (category spending)
- Graph interpretation
- Financial literacy

### Literacy:
- Reading technical documentation
- Writing code comments
- Creating user instructions
- Technical problem solving

### Design:
- User interface design
- Color theory
- Visual hierarchy
- User experience

---

## 📞 Support Resources

### For Students:
- README.md (comprehensive guide)
- Code comments (throughout files)
- Console.log debugging
- DevTools inspection

### For Teachers:
- This guide
- Sample lesson plans
- Assessment rubrics
- Extension activities

---

**Happy Teaching! 🎉**

*Remember: The goal is not perfection, but understanding.*  
*Encourage experimentation and learning from mistakes!*