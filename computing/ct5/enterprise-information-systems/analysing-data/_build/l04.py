import sys
from components import *

toc = [("intentions","Learning intentions"),("hook","\"Make me a report\""),("vocab","Key vocabulary"),
       ("deconstruct","Deconstruct a summary"),("purpose","Purpose statement"),("functional","Functional requirements"),
       ("usecase","Use cases"),("testcases","Test cases"),("sort","Sort it out"),("tasks","Your task"),
       ("checkpoint","Checkpoint"),("exam","Exam-style question"),("grades","What success looks like"),("reflect","Reflection")]

TEST_ROWS = [
  ("A1","P-62X3","2","Fell","1491"),
  ("A2","P-62X3","2","Cleared","3200"),
  ("A3","P-ZZU7","2","Fell","1522"),
  ("A4","P-ZZU7","1","Fell","1450"),
  ("A5","P-K4RM","2","Enemy","2410"),
  ("A6","P-K4RM","2","Fell","1400"),
  ("A7","P-W8NB","2","Quit","640"),
  ("A8","TEST","2","Fell","1500"),
]
rows = "\n".join(f"              <tr><td>{a}</td><td>{p}</td><td>{l}</td><td>{o}</td><td>{x}</td></tr>" for a,p,l,o,x in TEST_ROWS)
test_table = f'''<div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Eight test attempts for the Pixel Pockets fail report</caption>
            <thead><tr><th scope="col">attemptId</th><th scope="col">playerId</th><th scope="col">level</th><th scope="col">outcome</th><th scope="col">endX</th></tr></thead>
            <tbody>
{rows}
            </tbody>
          </table>
        </div>'''

body = f'''
      <aside class="teaching-advice">
        <h4>Teaching advice</h4>
        <p><strong>Timing:</strong> hook 3 min · vocabulary 5 min · deconstruct 7 min · purpose and requirements 8 min · use case 7 min · test cases 12 min · sort 4 min · tasks 4 min · checkpoint and exam question 5 min.</p>
        <p><strong>Discussion focus:</strong> test cases are the heart of this lesson. Make students work out each expected output <em>by hand</em> from the eight test rows before revealing it. The boundary row (A6, x = 1400) and the TEST row (A8) are deliberate traps.</p>
        <p><strong>Note:</strong> functional requirements here describe what the <em>analysis</em> must do, not what the game must do. Students who built games may slip back into game features.</p>
      </aside>

      <section class="content-section" id="intentions">
        <h2>Learning intentions</h2>
        <p>By the end of this lesson I can:</p>
        <ul class="dot-points">
          <li>state the purpose of a data analysis solution</li>
          <li>write functional requirements and a use case for a data analysis</li>
          <li>develop test cases with inputs and expected outputs, including boundary cases.</li>
        </ul>
        <div class="info-box">
          <strong>Success criteria:</strong> For one data analysis I have written a purpose statement, at least three functional requirements, a use case with an alternative flow, and three test cases with expected outputs I worked out by hand.
        </div>
      </section>

      <section class="content-section" id="hook">
        <span class="paper-tape paper-tape--cyan" aria-hidden="true"></span>
        <h2>"Make me a report"</h2>
        <p>After a playtest, the <em>Pixel Pockets</em> producer sends the team one line: <strong>"Make me a report about where players fail."</strong></p>
        <p>Two developers build it separately. One makes a list of every failed attempt. The other makes a bar chart of failures by position on the level. Both say they did what was asked. Who's right? What should the producer have written instead?</p>
      </section>

      <section class="content-section" id="vocab">
        <h2>Key vocabulary</h2>
        <p>Tap each card to check your understanding before reading the definition.</p>
        {flips([
          ("Purpose statement","One or two sentences saying who the solution is for, what it does and why."),
          ("Functional requirement","Something the solution must <em>do</em>. Example: count failed attempts for each level."),
          ("Use case","A step-by-step description of how a user achieves one goal with the solution."),
          ("Actor","The person (or system) carrying out the steps in a use case."),
          ("Alternative flow","What happens in a use case when something doesn't go to plan."),
          ("Test case","A specific input and the output you expect, used to check one requirement."),
          ("Expected output","The correct result, worked out by hand <em>before</em> running the test."),
          ("Boundary case","A test value right on the edge of a rule, such as exactly 1400 when a band starts at 1400."),
        ])}
      </section>

      <section class="content-section" id="deconstruct">
        <span class="section-phase-tag research"><span class="dot"></span>Analysis first</span>
        <h2>Deconstruct a summary</h2>
        <p>Before writing requirements, look at what a finished analysis does. This is the weekly summary card a StepUp user sees on Sunday night.</p>
        <div class="example-box">
          <strong>StepUp · your week</strong>
          4 workouts · 162 minutes in total<br>
          Most common activity: Walk<br>
          Busiest day: Saturday<br>
          2 fewer workouts than last week
        </div>
        <div class="analysis-box">
          <p class="analysis-box__eyebrow">Analysis activity · pairs · 7 min</p>
          <h3>What must the system do to produce this?</h3>
          <ol>
            <li>For each line on the card, write what the system had to <em>do</em> to produce it. Start each with a verb: count, total, find, compare.</li>
            <li>Which fields from the workout records did each line need? (<code>workoutId, userId, date, activity, durationMin, distanceKm, steps, avgHeartRate</code>)</li>
            <li>Which line needs data from <em>two</em> different weeks?</li>
            <li>What should the card show if the user did no workouts this week?</li>
          </ol>
        </div>
{expand("Possible answers", '''<p><strong>1 and 2.</strong> Count this user's workouts in the week (<code>userId</code>, <code>date</code>) · total <code>durationMin</code> · find the most frequent <code>activity</code> · find the day with the most workouts (<code>date</code>) · compare this week's count with last week's.</p>
            <p><strong>3.</strong> "2 fewer workouts than last week" needs last week's count as well.</p>
            <p><strong>4.</strong> That's an <em>alternative flow</em>. A sensible output is "No workouts this week. Ready to start again?" rather than "0 minutes, most common activity: (blank)".</p>
            <p>Each answer to question 1 is a <strong>functional requirement</strong>: something the analysis must do.</p>''')}
      </section>

      <section class="content-section" id="purpose">
        <span class="section-phase-tag identify"><span class="dot"></span>Defining</span>
        <h2>Purpose statement</h2>
        <p>Back to the Pixel Pockets producer. A purpose statement fixes the vague request by naming the <strong>user</strong>, what the solution <strong>does</strong> and the <strong>decision</strong> it supports.</p>
        <div class="example-box">
          <strong>Purpose: Pixel Pockets fail report</strong>
          The fail report helps the level designer see where on each level playtesters fail, so they can choose which section to redesign before the next playtest.
        </div>
        <p>Now the two developers can check their work against it. The list of every failed attempt doesn't show <em>where</em> failures cluster, so it doesn't meet the purpose. The bar chart does.</p>
      </section>

      <section class="content-section" id="functional">
        <h2>Functional requirements</h2>
        <p>Functional requirements list exactly what the analysis must do. Each one should be specific enough to test.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Functional requirements for the Pixel Pockets fail report</caption>
            <thead><tr><th scope="col">ID</th><th scope="col">The fail report must…</th></tr></thead>
            <tbody>
              <tr><td>FR1</td><td>load an attempts file with the columns <code>attemptId, playerId, level, coins, jumps, timeSeconds, outcome, endX</code></td></tr>
              <tr><td>FR2</td><td>exclude test records (<code>playerId</code> = <code>TEST</code>)</td></tr>
              <tr><td>FR3</td><td>for a chosen level, count failed attempts (any outcome except <code>Cleared</code>) in 200-pixel bands of <code>endX</code>: 0–199, 200–399 and so on</td></tr>
              <tr><td>FR4</td><td>show the percentage of attempts cleared for the chosen level</td></tr>
              <tr><td>FR5</td><td>highlight the band with the most failed attempts</td></tr>
            </tbody>
          </table>
        </div>
        <aside class="paper-sticky paper-sticky--rotate-r">
          <p class="paper-sticky__label">Not a requirement of the analysis</p>
          <p>"Players can double jump" is a requirement of the <em>game</em>. Today we're writing requirements for the <em>analysis</em> of the game's data.</p>
        </aside>
      </section>

      <section class="content-section" id="usecase">
        <h2>Use cases</h2>
        <p>A use case shows how a user reaches one goal, step by step. It also shows what happens when things go wrong.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Use case: find where players fail on a level</caption>
            <thead><tr><th scope="col" colspan="2">Use case: Level designer finds where players fail on a level</th></tr></thead>
            <tbody>
              <tr><td><strong>Actor</strong></td><td>Level designer</td></tr>
              <tr><td><strong>Main flow</strong></td><td>1. Designer opens the fail report.<br>2. Designer loads the latest attempts file.<br>3. Designer chooses Level 2.<br>4. Report removes test records and counts failed attempts in each band.<br>5. Report shows a bar chart with the busiest band highlighted, and the cleared percentage.<br>6. Designer notes the band to redesign.</td></tr>
              <tr><td><strong>Alternative flow 2a</strong></td><td>The file is missing the <code>endX</code> column. The report names the missing column and stops.</td></tr>
              <tr><td><strong>Alternative flow 3a</strong></td><td>No attempts are recorded for the chosen level. The report shows "No attempts recorded for Level 2".</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="content-section" id="testcases">
        <h2>Test cases</h2>
        <p>How do we know the report is correct? We give it a <strong>small</strong> input where we already know the answer. If we tested it on all 127 real attempts, we couldn't check the output by hand.</p>
        <p>Here is the test input: eight attempts, chosen on purpose.</p>
        {test_table}
        <div class="guided-box">
          <p class="guided-box__eyebrow">We do · pairs then whole class · 8 min</p>
          <p>Work out the <strong>expected output</strong> for each test case by hand, before opening the answers. Watch out for A6 and A8.</p>
          <div class="spec-table-wrap">
            <table class="spec-table">
              <caption class="sr-caption">Test cases for the fail report</caption>
              <thead><tr><th scope="col">ID</th><th scope="col">Checks</th><th scope="col">Input</th><th scope="col">Expected output</th></tr></thead>
              <tbody>
                <tr><td>TC1</td><td>FR3</td><td>All eight rows, Level 2</td><td>Count in band 1400–1599 = ______</td></tr>
                <tr><td>TC2</td><td>FR3 boundary</td><td>A6 only (endX = 1400)</td><td>A6 is counted in band ______</td></tr>
                <tr><td>TC3</td><td>FR2</td><td>All eight rows, Level 2</td><td>Is A8 counted? ______</td></tr>
                <tr><td>TC4</td><td>FR4</td><td>All eight rows, Level 2</td><td>Cleared percentage = ______</td></tr>
                <tr><td>TC5</td><td>FR3</td><td>All eight rows, Level 1</td><td>Count in band 1400–1599 = ______</td></tr>
              </tbody>
            </table>
          </div>
        </div>
{expand("Expected outputs", '''<p><strong>TC1:</strong> 3. A1 (1491), A3 (1522) and A6 (1400). A4 is Level 1, A2 was cleared and A8 is a test record.</p>
            <p><strong>TC2:</strong> 1400–1599. Bands start at 1400, so 1400 belongs to the band that <em>starts</em> there, not the one that ends at 1399.</p>
            <p><strong>TC3:</strong> No. FR2 excludes test records. If your TC1 answer was 4, you counted A8.</p>
            <p><strong>TC4:</strong> 16.7%. There are six real Level 2 attempts (A1, A2, A3, A5, A6, A7), and one of them (A2) was cleared: 1 ÷ 6 = 16.7%.</p>
            <p><strong>TC5:</strong> 1. Only A4 is a Level 1 attempt.</p>
            <p>If the report gives a different output from the expected one, the test <strong>fails</strong>, and that's useful: it shows exactly which requirement has a bug.</p>''')}
      </section>

      <section class="content-section" id="sort">
        <h2>Sort it out</h2>
        <p>These lines come from the planning documents for a <em>Coin Run 3D</em> completion report. Is each one a functional requirement, a use case step or a test case?</p>
{sort_activity([
  ("The report must show the completion percentage for each level.","fr","It states something the report must do.","Sort: show the completion percentage for each level"),
  ("3. The designer chooses \"Steam Deck only\" from the platform filter.","uc","A numbered step by an actor: part of a use case flow.","Sort: the designer chooses Steam Deck only"),
  ("Input: three Level 1 runs, two completed. Expected output: 66.7%.","tc","It gives a specific input and the expected output.","Sort: input three Level 1 runs, expected 66.7 percent"),
  ("Input: one run with platform \"steamdeck\" in lower case. Expected: counted as SteamDeck.","tc","It's a test of how the report handles inconsistent data.","Sort: lower-case steamdeck input"),
  ("The report must exclude runs where coinsCollected is more than coinsAvailable.","fr","A validation rule the report must apply.","Sort: exclude runs where coins collected exceeds coins available"),
  ("The report must let the user filter runs by platform.","fr","It describes a function the report must provide.","Sort: filter runs by platform"),
  ("4a. No runs match the filter. The report shows \"No runs found\".","uc","An alternative flow in a use case.","Sort: no runs match the filter"),
  ("Input: no runs at all. Expected output: \"No runs found\", not 0%.","tc","A specific input with an expected output. It's an edge case.","Sort: input no runs at all"),
], [("fr","Functional requirement"),("uc","Use case step"),("tc","Test case")])}
      </section>
{tiers(
  ("Expected outputs", '''<p>Use the eight test attempts. Work out the expected output for:</p>
            <ul>
              <li>Level 2, band 2400–2599</li>
              <li>Level 2, band 600–799</li>
              <li>Level 2, total failed attempts</li>
            </ul>
            <p>Explain why A2 isn't counted in any of them.</p>'''),
  ("Plan a completion report", '''<p>For a Coin Run 3D report that shows the completion rate for each level:</p>
            <ul>
              <li>Write a purpose statement naming the user.</li>
              <li>Write at least three functional requirements.</li>
              <li>Write a use case with one alternative flow.</li>
              <li>Write two test cases with tiny inputs.</li>
            </ul>'''),
  ("Break the report", '''<p>Design five test cases for the StepUp weekly summary card from this lesson.</p>
            <ul>
              <li>Include a boundary case (a workout at 11:59 pm on Sunday) and an empty week.</li>
              <li>Explain why test inputs should be small enough to check by hand.</li>
            </ul>'''))}
{checkpoint([
  ("Which of these is a <em>functional</em> requirement for the Pixel Pockets fail report?", "D",
   ["The report must load in under two seconds","The report is ready before the next playtest","The bar chart is easy to read on a laptop","Count failures in each 200-px band"],
   ["Not quite. Speed is about how well the report works, so it's non-functional.",
    "Not quite. A deadline limits the project. It's a constraint, not a requirement of the report.",
    "Not quite. Readability is a quality of the report, so it's non-functional.",
    "✓ Correct. Counting is something the report must do, so it's functional."]),
  ("What does a test case contain?", "B",
   ["A list of every field in the dataset","An input and the output you expect","A description of who uses the report","The code that runs the analysis"],
   ["Not quite. That describes the data, not a test.",
    "✓ Correct. A test case pairs a specific input with the expected output.",
    "Not quite. That belongs in the purpose statement or the use case.",
    "Not quite. A test case checks the code. It isn't the code itself."]),
  ("Using the eight test attempts on this page, how many <em>Level 2</em> failed attempts fall in band 1400–1599? Test records are excluded.", "C",
   ["2","4","3","5"],
   ["Not quite. You may have missed A6. An endX of exactly 1400 belongs in the 1400–1599 band.",
    "Not quite. You may have counted A8, but it's a TEST record and must be excluded.",
    "✓ Correct. A1 (1491), A3 (1522) and A6 (1400).",
    "Not quite. 5 is every real Level 2 failure, not just the ones in this band."]),
  ("Why does the fail report's use case include an alternative flow for \"no attempts recorded for this level\"?", "A",
   ["It plans for a situation that can happen","It lets the designer skip the main flow entirely","Every use case needs exactly two different flows","It makes the whole report load more quickly"],
   ["✓ Correct. Alternative flows plan for things that really happen, so the user gets a clear message.",
    "Not quite. The alternative flow branches off the main flow. It doesn't replace it.",
    "Not quite. A use case can have any number of alternative flows, including none.",
    "Not quite. Alternative flows are about behaviour, not speed."]),
  ("Bands in the fail report are 0–199, 200–399 and so on. Which single test input best checks the <em>boundary</em> between two bands?", "B",
   ["An attempt ending at x = 1491","An attempt ending at x = 1400","An attempt that cleared at 3200","An attempt by the TEST player"],
   ["Not quite. 1491 sits in the middle of a band, so it doesn't test an edge.",
    "✓ Correct. 1400 is exactly where one band ends and the next begins.",
    "Not quite. This tests that cleared attempts are excluded, not a band boundary.",
    "Not quite. This tests FR2 (excluding test records), not a boundary."]),
  ("Which is the best purpose statement for the Pixel Pockets fail report?", "D",
   ["Show every attempt that has been recorded in the game","Make Pixel Pockets more fun for every one of its players","Store all attempts in a CSV file for use at a later time","Show the designer where players fail, to pick a fix"],
   ["Not quite. Listing everything doesn't say who it's for or what decision it supports.",
    "Not quite. That's a goal for the game, not the purpose of this analysis.",
    "Not quite. Storing data is one step. It isn't the purpose of the report.",
    "✓ Correct. It names the user, what the report shows and the decision it supports."]),
])}
{exam(4, '''<p>The <em>Canteen Click</em> manager needs a report with this requirement: <strong>"For a chosen day, show the total quantity sold of each item."</strong> Use these four orders as test data:</p>
          <div class="spec-table-wrap">
            <table class="spec-table">
              <caption class="sr-caption">Four test orders</caption>
              <thead><tr><th scope="col">orderId</th><th scope="col">orderDate</th><th scope="col">itemId</th><th scope="col">quantity</th></tr></thead>
              <tbody>
                <tr><td>O1</td><td>Fri 5 Mar</td><td>M02</td><td>1</td></tr>
                <tr><td>O2</td><td>Fri 5 Mar</td><td>M04</td><td>12</td></tr>
                <tr><td>O3</td><td>Fri 5 Mar</td><td>M02</td><td>2</td></tr>
                <tr><td>O4</td><td>Thu 4 Mar</td><td>M02</td><td>1</td></tr>
              </tbody>
            </table>
          </div>''',
  "(a) Write the main flow of a use case for the manager producing this report. Include at least three steps. (2 marks) (b) Write two test cases for the requirement, each with an input and an expected output. (2 marks)",
  [("(a) Logical main flow of three or more steps, with the manager as actor, ending in the report output","2"),
   ("(a) Some relevant steps, or steps out of order","1"),
   ("(b) Two test cases, each with a specific input and a correct expected output","2"),
   ("(b) One correct test case, or two test cases missing expected outputs","1")],
  "(a) 1. The manager opens the report. 2. The manager chooses Friday 5 March. 3. The report totals the quantity of each item ordered that day. 4. The report shows a list of items and totals. (b) TC1: input orders O1–O4, day = Fri 5 Mar. Expected output: M02 = 3, M04 = 12 (O4 is Thursday, so it's not included). TC2: input orders O1–O4, day = Mon 1 Mar. Expected output: \"No orders for this day\".",
  "counting <em>orders</em> instead of totalling <em>quantity</em> (giving M02 = 2 and M04 = 1), or including O4 in Friday's total.")}
{cpd("applying processes", CPD_DPM, [
  "Designs a complete set of test cases, including boundary and empty cases, and explains why test inputs are small and hand-checkable.",
  "Writes a purpose statement, testable functional requirements, a use case with an alternative flow and correct test cases.",
  "Writes functional requirements and test cases with correct expected outputs for a supplied scenario.",
  "Works out expected outputs for supplied test inputs.",
  "Identifies the input and output in a test case.",
])}
{reflection(4, [
  ("Which test case today caught a mistake in your thinking?","I expected ___, but the correct output was ___ because…"),
  ("Think of a feature in your own project. Write one test case for it.","Input: ___. Expected output: ___."),
])}'''

html = page(4, "What must the analysis do?",
  "state the purpose of a data analysis, write functional requirements and use cases, and develop test cases of inputs and expected outputs.",
  toc, ["CT5-DPM-01","CT5-THI-01","CT5-DAT-02"], [PILL["identify"]],
  "A vague request like \"make me a report\" leads to two people building two different things. Today you'll pin down exactly what a data analysis must do: its purpose, its functional requirements, a use case, and test cases that prove it works.",
  [PILL["identify"]], body, ("lesson03.html","Lesson 3: Asking a good data question"), ("lesson05.html","Lesson 5: How well must it work?"))
open(sys.argv[1], "w", encoding="utf-8").write(html)
