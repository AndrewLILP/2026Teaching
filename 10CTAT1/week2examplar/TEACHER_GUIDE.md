# TEACHER EXEMPLAR GUIDE
## Interactive Data Story Web Application
### Computing Technology Year 10 - Term 1 Project

---

## Purpose of This Exemplar

This exemplar demonstrates **high-quality student work** for the Term 1 "Interactive Data Story Web Application" project. It shows students what excellence looks like while providing teachers with:

- A benchmark for assessment
- Teaching examples for technical concepts
- Discussion points for design decisions
- Code samples demonstrating best practices

**Important:** This is a **teacher resource**. Students should create their own original work, not copy this exemplar.

---

## Syllabus Alignment

### Primary Focus Areas
- **Developing Apps and Web Software** (CT5-OPL-01, CT5-DES-01)
- **Analysing Data** (CT5-DAT-01, CT5-DAT-02)

### Outcomes Demonstrated

**CT5-DPM-01**: Design and Production Management
- Clear project structure following the Design and Production process
- Iterative development evident in code organization
- Documentation of data sources and methodology

**CT5-DAT-02**: Analysing and Visualizing Data
- Multiple visualization types (line, bar, pie/doughnut charts)
- Interactive data filtering and manipulation
- Appropriate chart selection for different data types
- Clear labeling and accessible design

**CT5-OPL-01**: Programming and Implementation
- Clean, documented JavaScript code
- Event-driven programming with interactive filters
- Reusable functions and modular code structure
- Performance optimization techniques

**CT5-DES-01**: User Interface and Experience Design
- Responsive, mobile-first design
- Accessibility features (ARIA labels, keyboard navigation, skip links)
- Professional visual design with consistent branding
- Clear information hierarchy

**CT5-COM-01**: Communication
- Clear narrative structure guiding users through the data
- Multiple ways to access information (visual, textual, tabular)
- Proper attribution and methodology disclosure

---

## What This Exemplar Demonstrates

### 1. **Technical Excellence**

#### HTML Structure
- **Semantic HTML5** elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`)
- **Accessibility features**:
  - Skip links for keyboard navigation
  - ARIA labels and roles
  - Proper heading hierarchy
  - Alternative text descriptions
  - Screen reader-only content
- **Meta tags** for SEO and responsive design
- **Proper linking** of external resources

**Teaching Point:** Show students how semantic HTML improves both accessibility and SEO.

#### CSS Implementation
- **CSS Variables** for maintainable styling
- **Mobile-first responsive design**:
  - Base styles for mobile (320px+)
  - Tablet breakpoint (768px)
  - Desktop breakpoint (1024px)
  - Large desktop (1200px)
- **CSS Grid and Flexbox** for layout
- **Modern CSS features**:
  - `clamp()` for fluid typography
  - Custom properties (variables)
  - Media queries for print and dark mode
  - Reduced motion support
- **Professional design system**:
  - Consistent spacing scale
  - Defined color palette
  - Typography hierarchy
  - Reusable components

**Teaching Point:** Demonstrate how CSS variables make it easy to update colors/spacing throughout the site.

#### JavaScript & Chart.js
- **Multiple chart types** demonstrating appropriate use:
  - Line chart for time-series data (trends over time)
  - Bar chart for comparisons (state-by-state)
  - Doughnut chart for proportions (energy mix)
- **Interactive features**:
  - Event listeners for filters
  - Dynamic chart updates
  - User feedback (button state changes)
- **Code quality**:
  - Clear comments and documentation
  - Descriptive variable names
  - Reusable functions
  - Error handling considerations
- **Performance optimization**:
  - Debounced resize events
  - Intersection Observer for lazy loading
  - Efficient DOM manipulation

**Teaching Point:** Explain why different chart types are appropriate for different data types.

### 2. **Data Literacy**

The exemplar demonstrates strong data visualization principles:

- **Appropriate chart selection**: Line for trends, bar for comparisons, pie for proportions
- **Clear labeling**: All axes, legends, and data points are properly labeled
- **Color coding**: Consistent colors used meaningfully throughout
- **Context provision**: Data sources, methodology, and limitations clearly stated
- **Multiple perspectives**: Overview stats, detailed visualizations, and textual insights

**Teaching Point:** Discuss with students how to choose the right visualization for their data type.

### 3. **User Experience Design**

- **Progressive disclosure**: Information revealed gradually to avoid overwhelming users
- **Visual hierarchy**: Important information stands out through size, color, and placement
- **Responsive design**: Works well on phones, tablets, and desktops
- **Loading states and feedback**: Users know when their actions have effects
- **Accessibility**: Works with keyboard, screen readers, and various assistive technologies

**Teaching Point:** Have students test the exemplar on different devices and with different assistive technologies.

### 4. **Content & Storytelling**

- **Clear narrative arc**: Introduction → Main data → Insights → Methodology
- **Engaging topic**: Climate change/renewable energy relevant to students' lives
- **Multiple entry points**: Stats, charts, written insights, timeline
- **Credible sources**: Proper attribution to authoritative sources
- **Balanced presentation**: Both achievements and challenges acknowledged

**Teaching Point:** Discuss how data stories differ from traditional reports or presentations.

---

## How to Use This Exemplar

### Phase 1: Introduction (Week 1-2)

**1. Show Without Context**
- Display the exemplar without explanation
- Ask students: "What do you notice? What works well?"
- Record observations on the board
- Discuss first impressions of design, usability, and content

**2. Walkthrough Key Features**
- Demonstrate interactive filters
- Show responsive design (resize browser)
- Test accessibility features (keyboard navigation, skip links)
- View source code structure

**3. Connect to Syllabus**
- Map features to outcomes (use the alignment section above)
- Explain how this demonstrates CT5-DAT-02 (data visualization)
- Discuss how it fulfills CT5-DES-01 (UX design)

### Phase 2: Technical Analysis (Week 3-4)

**HTML Lesson**
```html
<section class="insights-section" aria-labelledby="insights-heading">
    <h2 id="insights-heading">Key Insights & Trends</h2>
```
- Why use `<section>` vs `<div>`?
- What does `aria-labelledby` do?
- How does this help screen readers?

**CSS Lesson**
```css
.chart-container {
    position: relative;
    width: 100%;
    height: 400px;
}
```
- Why set explicit height for chart containers?
- What does `position: relative` enable?
- How does this work with Chart.js?

**JavaScript Lesson**
```javascript
stateSelect.addEventListener('change', function() {
    // Update chart based on selection
});
```
- What is an event listener?
- How do we get the selected value?
- How do we update the chart with new data?

### Phase 3: Design Decisions (Week 4-5)

**Facilitate Class Discussions:**

1. **Color Choices**
   - Why green for renewable energy?
   - Why yellow for solar and blue for wind?
   - How does color reinforce meaning?

2. **Chart Type Selection**
   - Why a line chart for the main visualization?
   - Why a bar chart for state comparisons?
   - Why a doughnut chart for energy mix?
   - What would happen if we swapped chart types?

3. **Layout Decisions**
   - Why put filters at the top in a sticky nav?
   - Why use cards for key statistics?
   - Why include a timeline visualization?

4. **Accessibility Choices**
   - Why include a skip link?
   - Why provide text alternatives?
   - Why support keyboard navigation?

### Phase 4: Student Projects (Week 5-10)

**Use Exemplar as Reference:**

1. **Structure Template**
   - Students can mirror the section structure
   - But must use their own topic and data
   - Encourage similar organization: Intro → Viz → Insights → Method

2. **Code Reference**
   - Students can refer to CSS techniques
   - May adapt JavaScript patterns
   - Must understand and modify, not copy blindly

3. **Design Inspiration**
   - Color schemes should differ
   - Layout can be similar but personalized
   - Typography choices should fit their topic

**Assessment Note:** Students who copy this exemplar verbatim receive zero marks for originality. The exemplar is a learning tool, not a template to copy.

---

## Discussion Questions for Students

### Before They Start Their Project:

1. What makes this data story effective?
2. How does the design guide you through the information?
3. What interactive features enhance understanding?
4. How is this different from a static report?
5. What accessibility features did you notice?

### During Development:

1. How is your topic different from this example?
2. What chart types are appropriate for your data?
3. How will you organize your content?
4. What interactivity will enhance your story?
5. How will you ensure accessibility?

### After Completion:

1. How does your project compare to this exemplar?
2. What techniques did you adapt?
3. What did you do differently?
4. What would you improve in your next project?
5. What was most challenging to implement?

---

## Assessment Rubric Connection

This exemplar demonstrates **Grade A (Outstanding)** work across all criteria:

### Technical Implementation (CT5-OPL-01)
- ✓ Multiple data visualizations working correctly
- ✓ Interactive features fully functional
- ✓ Clean, well-documented code
- ✓ Responsive design across devices
- ✓ No console errors, professional finish

### Data Analysis & Visualization (CT5-DAT-02)
- ✓ Appropriate chart types for data
- ✓ Clear, accurate data representation
- ✓ Multiple visualization techniques
- ✓ Effective use of color and labels
- ✓ Data sources properly attributed

### User Experience Design (CT5-DES-01)
- ✓ Professional, polished visual design
- ✓ Intuitive navigation and controls
- ✓ Comprehensive accessibility features
- ✓ Consistent visual language
- ✓ Mobile-first responsive approach

### Communication & Presentation (CT5-COM-01)
- ✓ Clear narrative structure
- ✓ Engaging, age-appropriate content
- ✓ Multiple ways to access information
- ✓ Proper attribution and methodology
- ✓ Professional documentation

### Project Management (CT5-DPM-01)
- ✓ Well-organized file structure
- ✓ Evidence of iterative development
- ✓ Clear documentation of process
- ✓ Meets all project requirements
- ✓ Appropriate scope and complexity

---

## Common Student Challenges & Solutions

### Challenge 1: "My charts don't display"
**Solution in Exemplar:**
- Check Chart.js script is loaded before custom JavaScript
- Ensure canvas elements have IDs matching JavaScript
- Verify container has explicit height set in CSS
- Look for console errors

**Teaching Point:** Show students the browser console and how to debug.

### Challenge 2: "The design looks bad on mobile"
**Solution in Exemplar:**
- Mobile-first approach with progressive enhancement
- Use of flexible units (%, rem) instead of px
- CSS Grid with `repeat(auto-fit, minmax())`
- Media queries at appropriate breakpoints

**Teaching Point:** Demonstrate responsive design testing in DevTools.

### Challenge 3: "I don't know what data to use"
**Solution in Exemplar:**
- Clear topic with readily available data
- Mix of time-series and comparative data
- Data from credible sources
- Appropriate scope (not too much data)

**Teaching Point:** Help students find suitable datasets (ABS, government sites, Kaggle).

### Challenge 4: "Interactive features aren't working"
**Solution in Exemplar:**
- Event listeners properly attached
- Functions update chart data correctly
- Visual feedback confirms user actions
- Error handling for edge cases

**Teaching Point:** Walk through event listener examples line by line.

---

## Extension Activities

For advanced students who want to go beyond the exemplar:

1. **Advanced Visualizations**
   - Add animated transitions between data views
   - Implement a scatter plot with clustering
   - Create a heat map for geographic data
   - Add a radar/spider chart for multi-dimensional comparisons

2. **Data Import Features**
   - Allow users to upload their own CSV files
   - Parse and visualize user-provided data
   - Export customized visualizations

3. **Enhanced Interactivity**
   - Add chart zoom and pan capabilities
   - Implement data range sliders
   - Create custom tooltips with extended information
   - Add chart type switching (user chooses visualization)

4. **API Integration**
   - Fetch real-time data from public APIs
   - Update visualizations automatically
   - Display current vs historical data

5. **Advanced Accessibility**
   - Add a data table view toggle
   - Implement text-to-speech for insights
   - Create high-contrast theme option
   - Add SVG alternative to Canvas charts

---

## File Structure & Organization

```
project/
├── exemplar.html          (Main HTML file)
├── exemplar-styles.css    (All CSS styling)
├── exemplar-charts.js     (Chart.js implementation)
└── README.md             (This documentation)
```

**Teaching Point:** Discuss the importance of file organization and naming conventions.

---

## Links to Syllabus Documents

- **Computing Technology 7-10 Syllabus**: [View on NESA website]
- **Sample Scope & Sequence**: Reference documents in project folder
- **Assessment Advice**: See "Advice on Writing" document
- **Computing Domains**: See "Teaching Advice" document

---

## Acknowledgments

**Mock Data Source:** Australian Energy Market Operator (AEMO) reports and Clean Energy Regulator data. *Note: Data in this exemplar is fictional for educational purposes.*

**Libraries Used:**
- Chart.js v4.4.0 (MIT License)
- Google Fonts - Inter (Open Font License)

**Created By:** Ms. Chen, Computing Technology Teacher
**Term:** 1, 2024
**Year Level:** 10

---

## Teacher Reflection Questions

After using this exemplar:

1. What aspects did students find most helpful?
2. What additional examples would improve understanding?
3. How did student work compare to this exemplar?
4. What should be emphasized more in future years?
5. How can this exemplar be improved?

---

## Version History

- **v1.0** (January 2024): Initial exemplar created
  - Basic HTML/CSS/JS structure
  - Three chart types demonstrated
  - Mobile-responsive design
  - Accessibility features included

---

## Contact & Feedback

For questions about this exemplar or suggestions for improvement, please contact the Computing Technology faculty coordinator.

**Remember:** This exemplar is a teaching tool to demonstrate excellence. Students must create original work based on their own topics and data. Copying this exemplar verbatim is academic dishonesty and will result in zero marks.
