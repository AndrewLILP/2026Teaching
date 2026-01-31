### 3.3 Development Process Notes (Student's Project Notebook)
## Week 5 Entry:

- Set up Firebase project
- Created all HTML files
- Started with login page because need authentication first
- Got Firebase working after watching some YouTube tutorials
- Struggled with Firebase imports - had to use compat version because easier for me

## Week 6 Entry:

- Built dashboard page
- Added modals for income and expense
- Got basic add transaction working
- Had to debug why transactions weren't saving - forgot to include userId
- Added date inputs and set default to today

## Week 7 Entry:

- Added Chart.js
- Took a while to figure out how to get data in right format for the chart
- Chart looks good but only shows current month data
- Added the checkbox for tax deductible expenses
- Made receipt location field show/hide based on checkbox

## Week 8 Entry:

- Built transactions list page
- Built tax organizer page
- Realized I need to add orderBy to Firebase queries to sort by date
- Added timestamp to transactions to make sorting easier
- Tax page calculates total deductible amount
- Bottom navigation works to switch between pages

### Challenges I faced:

- Firebase security rules - had to learn about those to make user data private
- Date formatting in JavaScript is confusing
- Chart.js documentation was hard to understand at first
- Making modals show and hide properly
- Getting Firebase imports right

## What I learned:

- How to use Firebase authentication
- How to save and retrieve data from Firestore
- How to make pie charts with Chart.js
- How to validate user input
- How to use modals for forms

## ✅ What's Done Well:

- Complete working application with all core features
- All main pages implemented (login, dashboard, transactions, tax)
- Firebase authentication working
- Data persistence working
- Chart visualization implemented
- Clean, organized code structure
- Good variable naming
- Comments explain main sections
- Progress documented in project notebook

## 📈 What Could Improve This to A-Grade:
- Code Quality:

- Add more error handling (what if Firebase is offline?)
- Improve validation (check for negative numbers, very large amounts)
- Add loading indicators while data is fetching
- Refactor repeated code into reusable functions
- Add more detailed code comments explaining logic
- Implement Firebase security rules (currently relies on default)
- Add .gitignore to avoid committing sensitive files

## Features:

- Add ability to edit or delete transactions
- Add date range filter (view last month, last year, etc.)
- Add search/filter on transactions page
- Show more detailed breakdown on tax page (by category)
- Add export feature (download CSV of transactions)
- Make chart interactive (click slice to see details)

## Design/UX:

- Add loading states and better feedback messages
- Improve mobile responsiveness (test on phone)
- Add confirmation before deleting
- Improve form validation error messages (inline errors)
- Add keyboard shortcuts (Escape to close modal)
- Improve color contrast for accessibility
- Add favicon and better page titles

## Documentation:

- Add JSDoc comments to functions
- Create more detailed README with setup instructions
- Add screenshots to README
- Document Firebase setup process
- Create user guide

## Testing:

- Test with different browsers
- Test on mobile devices
- Test all error cases
- Have someone else try to use it (user testing)