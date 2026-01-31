#### Wireframes (Student's Adobe XD Work)
## Student has created basic wireframes for 3 screens:
- Screen 1: Dashboard (Home)
- Screen 2: Transactions List
- Screen 3: Tax Organizer

## Color Scheme (Student's Notes):

- Main color: Blue (#2196F3) - trust and money
- Income: Green (#4CAF50)
- Expenses: Red (#F44336)
- Background: Light grey (#F5F5F5)
- Text: Dark grey (#333333)

## Data Structure Design (Student's Work)
- Firebase Database Structure:

users: {
  [userId]: {
    email: "sam@example.com",
    displayName: "Sam"
  }
}

transactions: {
  [userId]: {
    [transactionId]: {
      type: "expense",           // or "income"
      amount: 45.00,
      category: "Work Expenses",
      description: "Work shoes",
      date: "2026-01-17",
      taxDeductible: true,
      receiptLocation: "shoebox under bed",
      timestamp: 1642377600000
    }
  }
}

## Categories Array (in JavaScript):


const categories = [
  "Food & Drinks",
  "Transport",
  "Entertainment",
  "Clothes & Shoes",
  "Work Expenses",
  "Savings",
  "Other"
];

### Algorithm Design (Student's Pseudocode)

**Add Transaction Algorithm:**

FUNCTION addTransaction():
  GET amount from input field
  GET description from input field
  GET category from dropdown
  GET date from date picker
  GET taxDeductible from checkbox
  
  IF amount is empty OR amount <= 0:
    SHOW error message
    RETURN
  END IF
  
  IF description is empty:
    SHOW error message
    RETURN
  END IF
  
  CREATE transaction object with all data
  SAVE transaction to Firebase
  CLEAR input fields
  REFRESH dashboard
END FUNCTION


**Calculate Monthly Total Algorithm:**

FUNCTION calculateMonthlyTotal(type):
  SET total = 0
  GET current month and year
  
  FOR EACH transaction in database:
    IF transaction.type == type:
      IF transaction date is in current month:
        ADD transaction.amount to total
      END IF
    END IF
  END FOR
  
  RETURN total
END FUNCTION


**Generate Chart Data Algorithm:**

FUNCTION generateChartData():
  CREATE empty object categoryTotals
  
  FOR EACH category in categories:
    SET categoryTotals[category] = 0
  END FOR
  
  FOR EACH transaction in database:
    IF transaction.type == "expense":
      ADD transaction.amount to categoryTotals[transaction.category]
    END IF
  END FOR
  
  RETURN categoryTotals
END FUNCTION

### ✅ What's Done Well:

- Good research of existing solutions with critical analysis
- Clear reasoning for technology choices
- Complete wireframes for all main screens
- Logical database structure
- Algorithms cover main functionality
- Color scheme considers meaning (green=income, red=expense)

### 📈 What Could Improve This to A-Grade:

- Create higher-fidelity mockups in Adobe XD (not just wireframes)
- Add interaction notes to wireframes (what happens when buttons clicked?)
- Consider mobile-specific wireframes (responsive design planning)
- Data structure could include data validation rules
- Add more detailed error handling to algorithms
- Include flowcharts to visualize algorithms
- Research Firebase security rules and plan them
- Add algorithm for filtering transactions by date range
- Consider edge cases in algorithms (negative numbers, very large amounts)