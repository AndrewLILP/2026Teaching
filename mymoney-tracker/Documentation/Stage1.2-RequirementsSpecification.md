# Stage 1.2 Requirements Specification

## 1.2 Requirements Specification

### Functional Requirements (What it MUST do)

#### Student's List

---

### Income Management

The user must be able to **add income**, including:

- Recording the amount  
- Recording the date  
- Adding a description (e.g., *"Woolworths pay"*)

---

### Expense Management

The user must be able to **add expenses**, including:

- Recording the amount  
- Recording the date  
- Choosing a category  
- Marking whether the expense is tax deductible  
- Adding notes about receipt location

---

### Expense Categories

The app must include the following categories:

- Food & Drinks  
- Transport (bus, petrol)  
- Entertainment  
- Clothes & Shoes  
- Work Expenses  
- Savings  
- Other

---

### Dashboard Requirements

The dashboard must display:

- Total income for the current month  
- Total expenses for the current month  
- Money left after expenses  
- A chart showing spending by category

---

### Tax Management Section

The tax section must display:

- A list of all tax-deductible expenses  
- The total tax-deductible amount  
- Notes about where receipts are kept

---

### Data Persistence

- User data must be saved so it is still available when the user returns to the app

#### Non-Functional Requirements (How WELL it must work)
### Student's List:

- Usability: Should be easy to use, quick to add transactions (under 30 seconds)
- Accessibility: Should work on phone and computer
- Performance: Should load quickly (under 3 seconds)
- Appearance: Should look clean and professional, not babyish
- Reliability: Data shouldn't disappear


### Test Cases (Student's Work)
- Test #, Input, Expected Output, Pass/Fail, 
- 1 Add income: $250, "Woolworths pay", 15/01/2026 Transaction appears in list, balance updates
- 2 Add expense: $45, "Work shoes", Work Expenses, tax deductible
- Transaction saved, appears in tax section
- 3 View dashboard, Shows total income, expenses, and chart
- 4 Close browser and reopen, All data is still there
- 5 Add expense with receipt note: "shoebox under bed", Note is saved and visible in tax section

### ✅ What's Done Well:

- Clear problem definition from personal experience
- Realistic user personas
- Specific functional requirements
- Test cases cover main features

### 📈 What Could Improve This to A-Grade:

- Break down functional requirements into user stories (e.g., "As a teen worker, I want to mark expenses as tax-deductible so that I can claim them at tax time")
- Add acceptance criteria to test cases (more detail on what "pass" looks like)
- Include non-functional requirements for security (even if simple)
- Consider edge cases (What if income is $0? What if negative numbers entered?)
- Add more specific accessibility requirements (keyboard navigation, screen reader compatibility)

