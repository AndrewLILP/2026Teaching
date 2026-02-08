# Year 10 Computing Technology - Term 1 Week 2
## CSS Methods and Design Decision-Making Challenge

**Duration:** Double lesson (110 minutes)  
**Design Framework Stage:** Producing and Implementing  
**Assessment:** Formative (practice and exploration)

---

## Learning Intention

Students will explore different methods of applying CSS to web pages by comparing working code examples, make informed decisions about which approach best suits their needs, and develop skills in independent problem-solving using online documentation.

---

## Success Criteria

### Basic (All students should achieve)
- [ ] Successfully download and organize the website files into a proper folder structure
- [ ] Open and view all four pages in a browser
- [ ] Identify which pages use different CSS methods (none, inline, external stylesheet)
- [ ] Choose ONE CSS method and justify why they prefer it
- [ ] Successfully modify at least 3 colors using their chosen method
- [ ] Link at least one image using W3Schools as a reference
- [ ] Maintain consistency across all four pages
- [ ] Document their design decisions with code comments

### Intermediate (Most students should achieve)
- [ ] Compare all three CSS methods and explain advantages/disadvantages of each
- [ ] Test color contrast for accessibility using online tools
- [ ] Add multiple images with appropriate alt text
- [ ] Implement hover effects on navigation or list items
- [ ] Use W3Schools to add at least 2 CSS features not in the original code
- [ ] Create a design that is consistent with the syllabus content theme
- [ ] Share their design choices with peers and provide constructive feedback

### Advanced (Some students may achieve)
- [ ] Convert ALL pages to use external stylesheet while maintaining all functionality
- [ ] Implement responsive design features (media queries for mobile)
- [ ] Add custom fonts or advanced layout techniques (flexbox/grid improvements)
- [ ] Create accessibility documentation explaining their color/design choices
- [ ] Propose improvements to the original code structure
- [ ] Help peers troubleshoot file linking or CSS issues

---

## Resources Required

### Student Files (Available on SEQTA)
- `index.html` (unstyled home page)
- `identifying.html` (unstyled page)
- `researching.html` (inline styles)
- `producing.html` (external stylesheet)
- `testing.html` (external stylesheet)
- `style.css` (external stylesheet)

### Online Resources
- W3Schools HTML Tutorial: https://www.w3schools.com/html/
- W3Schools CSS Tutorial: https://www.w3schools.com/css/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Sample images (or students can source their own)

### Equipment
- Computer with web browser
- Text editor (VS Code, Notepad++, or similar)
- Access to SEQTA and internet

---

## Learning Experiences

### Part 1: Setup and Exploration (20 minutes)

#### Teacher Introduction (5 minutes)
**Teacher says:** "Today you're going to explore three different ways to style web pages. I've given you a set of pages about the Design and Production Framework - the same framework you'll use for your Data Story project. Some pages have no styling, some have styling built in, and some use a separate stylesheet. Your job is to figure out which method works best and why, then make the site your own."

**Display on board:**
```
Three CSS Methods:
1. No styling (just HTML)
2. Inline styling (<style> in HTML)
3. External stylesheet (separate .css file)
```

#### Student Activity: Download and Organize (15 minutes)

**CHALLENGE 1: Get Organized**

Download all six files from SEQTA and set up your workspace:

1. Create a folder called `CSS_Challenge` on your computer
2. Download ALL six files into this folder
3. Open the folder and check you have:
   - 5 HTML files (index, identifying, researching, producing, testing)
   - 1 CSS file (style.css)
4. Open `index.html` in your browser (double-click or right-click → Open with → Chrome/Firefox)
5. Test ALL the navigation links - do they work?

**CHECKPOINT:** Show your teacher:
- Your folder structure
- All four pages opening in your browser
- Working navigation between pages

**Common Issues to Troubleshoot:**
- If navigation doesn't work: Check all files are in the same folder
- If pages don't display: Make sure you're opening .html files, not .txt files
- If styles are missing on some pages: This is expected! We'll investigate why.

---

### Part 2: Analysis and Comparison (25 minutes)

#### Student Activity: CSS Method Investigation

**CHALLENGE 2: Compare the Three Methods**

Open each HTML file in your text editor AND browser side-by-side.

Complete this comparison table in your notebook or a Word document:

| Page | CSS Method | Where is styling? | What does it look like? | Pros | Cons |
|------|------------|-------------------|------------------------|------|------|
| `identifying.html` | ❓ | ❓ | Plain/Simple | ❓ | ❓ |
| `researching.html` | ❓ | ❓ | Styled | ❓ | ❓ |
| `producing.html` | ❓ | ❓ | Styled | ❓ | ❓ |
| `testing.html` | ❓ | ❓ | Styled | ❓ | ❓ |

**Investigation Questions:**

1. **No Styling (identifying.html, index.html):**
   - What does the page look like with no CSS at all?
   - Can you still read the content?
   - What's missing?

2. **Inline Styling (researching.html):**
   - Where is the CSS code located? (Hint: look for `<style>` tags)
   - Open the code - how many lines of CSS are embedded in the HTML?
   - What happens if you want the same styling on another page?

3. **External Stylesheet (producing.html, testing.html):**
   - Where is the CSS code located? (Hint: look for `<link rel="stylesheet"...`)
   - Open `style.css` - how many lines of code?
   - Why do BOTH pages look similar?
   - What's the advantage of this method?

**Teacher Checkpoint (10 minutes):**
- Class discussion: What did you discover?
- Quick poll: Which method do you think is best for a multi-page website? Why?

---

### Part 3: Decision and Implementation (45 minutes)

**CHALLENGE 3: Choose Your Method and Customize**

Now that you've analyzed all three methods, choose ONE approach and make the website your own.

#### BASIC TIER: Essential Customization

**Requirements:**
1. **Choose your CSS method:**
   - Option A: Convert ALL pages to external stylesheet (recommended)
   - Option B: Use inline styles on all pages
   - Option C: Keep it simple - style in HTML only

2. **Modify colors** (minimum 3 changes):
   - Background color
   - Navigation color
   - Heading color
   
   **How to find colors:**
   - Google "color picker" or use https://htmlcolorcodes.com/
   - W3Schools: https://www.w3schools.com/colors/

3. **Add images** (minimum 1):
   - Find a relevant image (free sources: unsplash.com, pexels.com)
   - Save to your `CSS_Challenge` folder
   - Use W3Schools to learn the `<img>` tag: https://www.w3schools.com/tags/tag_img.asp
   - Add to at least one page with appropriate `alt` text

4. **Document your decisions:**
   Add comments in your code explaining:
   ```html
   <!-- I chose external stylesheet because... -->
   ```
   ```css
   /* Changed navigation to blue (#1e3a8a) for better readability */
   ```

5. **Test consistency:**
   - Click through ALL pages
   - Do they look cohesive?
   - Do all links work?

#### INTERMEDIATE TIER: Enhanced Design

Complete all BASIC requirements PLUS:

6. **Accessibility check:**
   - Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Test your background/text color combinations
   - Ensure WCAG AA compliance (at least)
   - Document your results in code comments

7. **Add interactive elements** using W3Schools:
   - Hover effects on navigation (change color on mouse-over)
   - Hover effects on list items
   - Example: https://www.w3schools.com/css/css_link.asp

8. **Enhance with 2+ new CSS features:**
   Choose from:
   - Border-radius for rounded corners
   - Box-shadow for depth
   - Text-shadow for emphasis
   - Custom fonts (Google Fonts)
   - Transitions/animations
   
   **Research path:** https://www.w3schools.com/css/ → Browse the menu

9. **Peer feedback:**
   - Share your site with a classmate
   - Explain WHY you made your design choices
   - Give and receive constructive feedback
   - Document feedback in your comments

#### ADVANCED TIER: Professional Implementation

Complete all INTERMEDIATE requirements PLUS:

10. **Full external stylesheet conversion:**
    - Convert ALL pages to use one `style.css` file
    - Remove all inline `<style>` tags
    - Ensure no styling remains in HTML files
    - Test that all pages still work perfectly

11. **Responsive design:**
    - Research media queries: https://www.w3schools.com/css/css_rwd_mediaqueries.asp
    - Make your site look good on mobile devices
    - Test using browser developer tools (F12 → Toggle device toolbar)

12. **Advanced layout techniques:**
    - Improve the existing flexbox/grid implementations
    - Or implement your own layout system
    - Research: https://www.w3schools.com/css/css3_flexbox.asp

13. **Accessibility documentation:**
    - Create a new HTML page called `accessibility.html`
    - Document all your accessibility decisions:
      - Color choices and contrast ratios
      - Alt text strategy
      - Navigation clarity
      - Readable font sizes
    - Link from your home page

14. **Code review and mentoring:**
    - Review a peer's code
    - Help troubleshoot CSS or file linking issues
    - Explain concepts to students who are stuck
    - Document your mentoring in your comments

---

### Part 4: Reflection and Sharing (30 minutes)

#### Gallery Walk (15 minutes)

**Activity:**
1. Open your website in a browser
2. Leave your computer unlocked
3. Walk around and view 3-4 other students' websites
4. On sticky notes, write:
   - One thing you really like about their design
   - One question about how they achieved something
   - One suggestion for improvement

**Teacher facilitates:**
- What different approaches did people take?
- What CSS features did you discover that you'd like to learn?
- What was challenging about file organization?

#### Reflection Documentation (15 minutes)

**Individual Reflection (write in notebook or digital document):**

Answer these questions:

1. **Which CSS method did you choose? Why?**
   - What were the advantages for your situation?
   - What trade-offs did you make?

2. **What's the relationship between HTML and CSS?**
   - How does "separating content from presentation" work?
   - Why is this important for web development?

3. **How did you use W3Schools (or other resources)?**
   - What was your search/research strategy?
   - What did you learn about teaching yourself new skills?

4. **What would you do differently if you started again?**
   - Better planning?
   - Different design choices?
   - More ambitious features?

5. **How does this connect to your upcoming Data Story project?**
   - What skills will transfer?
   - What do you still need to learn?

**Teacher collects:** Reflection documents (formative feedback only)

---

## Syllabus Outcomes Addressed

### Technical Knowledge
- **CT5-2:** Designs, produces and evaluates digital solutions by applying computational thinking
  - Understanding HTML/CSS relationship
  - File organization and linking
  - Separating content from presentation

- **CT5-3:** Produces solutions for complex problems by applying technical skills and knowledge
  - Using external documentation independently
  - Troubleshooting file paths and links
  - Implementing CSS features from research

### Social Awareness
- **CT5-1:** Explains the social impact of digital technologies on how people operate in daily life, work and business
  - Accessibility considerations in design
  - Color contrast for diverse users
  - Consistent navigation for usability

### Thinking Skills
- **CT5-4:** Creates solutions by applying algorithmic and design thinking
  - Comparing alternative approaches (CSS methods)
  - Making justified design decisions
  - Iterative refinement based on testing

### Project Management
- **CT5-5:** Communicates and collaborates using digital technologies
  - Peer feedback and code review
  - Documentation through comments
  - Sharing design rationale

---

## Teaching Notes

### Preparation
- [ ] Upload all six files to SEQTA in a clearly labeled folder
- [ ] Test all files work correctly before class
- [ ] Bookmark W3Schools and contrast checker on classroom computers
- [ ] Prepare examples of good/poor color contrast
- [ ] Have sample images ready for students who struggle to find their own

### Differentiation Strategies

**For students who finish early:**
- Encourage Advanced tier challenges
- Invite them to become "CSS experts" who can help others
- Challenge: Can you make the site look completely different using only CSS?

**For students who struggle:**
- Pair with a peer mentor
- Focus on Basic tier only
- Provide step-by-step written guides for common tasks
- Pre-select color palettes and images

**For students with accessibility needs:**
- Larger font sizes in code editor
- Screen reader compatible tools
- Allow verbal explanation instead of written reflection

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Pages don't style | CSS file in wrong location | Check file path, ensure style.css is in same folder |
| Images don't display | Wrong file path | Use relative paths: `src="image.jpg"` not `src="C:/Users/...` |
| Navigation broken | Files not in same folder | Move all files to same directory |
| Can't edit files | Opening in wrong program | Right-click → Open with → Text editor |

### Extension Opportunities

**Connect to Data Story Project:**
- "Start thinking about color schemes for your data story"
- "How might you organize multiple HTML files for your project?"
- "What accessibility considerations will matter for your audience?"

**Real-world Connections:**
- Show examples of professional websites using external stylesheets
- Discuss how companies maintain consistent branding across pages
- Explore browser developer tools (F12) to see CSS on real sites

---

## Assessment Evidence

While this is **formative only**, collect evidence of:

✅ **Folder structure** (organized files)  
✅ **Working website** (all pages load, navigation works)  
✅ **CSS implementation** (chosen method applied consistently)  
✅ **Code comments** (documented design decisions)  
✅ **Reflection document** (thoughtful answers to questions)  
✅ **Peer feedback** (sticky notes from gallery walk)

**Feedback Focus:**
- Celebrate creative design choices
- Highlight good problem-solving strategies
- Identify areas for growth (file organization, accessibility, documentation)
- Preview skills needed for Data Story project

**No grades.** Feedback only: "This shows great progress in..." or "To improve, try..."

---

## Next Lesson Preview

"Next week, we'll build on these CSS skills by adding JavaScript to make our pages interactive. You'll learn how to respond to user actions like button clicks and form submissions. Keep your CSS_Challenge folder - we might extend it!"

---

## Additional Resources for Students

### W3Schools Key Pages
- HTML Tutorial: https://www.w3schools.com/html/
- CSS Tutorial: https://www.w3schools.com/css/
- CSS Colors: https://www.w3schools.com/css/css_colors.asp
- CSS Backgrounds: https://www.w3schools.com/css/css_background.asp
- CSS Borders: https://www.w3schools.com/css/css_border.asp
- HTML Images: https://www.w3schools.com/html/html_images.asp

### Design Resources
- Color palettes: https://coolors.co/
- Free images: https://unsplash.com/ or https://pexels.com/
- Contrast checker: https://webaim.org/resources/contrastchecker/
- Google Fonts: https://fonts.google.com/

### Help and Troubleshooting
- Stack Overflow (read only): https://stackoverflow.com/
- MDN Web Docs: https://developer.mozilla.org/
- CSS-Tricks: https://css-tricks.com/

---

## Teacher Reflection (Post-Lesson)

After teaching this lesson, consider:

1. Did students successfully navigate W3Schools independently?
2. What proportion reached Basic/Intermediate/Advanced tiers?
3. What common misconceptions emerged about file paths/linking?
4. Which CSS method did most students prefer? Why?
5. How engaged were students during gallery walk?
6. What adjustments needed for next year?

**Notes for improvement:**

_[Space for teacher notes]_

---

