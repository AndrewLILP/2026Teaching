import sys
from components import *

toc = [("intentions","Learning intentions"),("hook","Correct, but useless"),("vocab","Key vocabulary"),
       ("compare","Two reports, same numbers"),("categories","Kinds of non-functional requirement"),
       ("testable","Make it testable"),("sort","Sort it out"),("sample","Case study: 13 runs"),("tasks","Your task"),
       ("checkpoint","Checkpoint"),("exam","Exam-style question"),("grades","What success looks like"),("reflect","Reflection")]

body = f'''
      <aside class="teaching-advice">
        <h4>Teaching advice</h4>
        <p><strong>Timing:</strong> hook 4 min · vocabulary 5 min · two reports 10 min · categories 8 min · make it testable 8 min · sort 5 min · case study 5 min · tasks 4 min · checkpoint and exam question 6 min.</p>
        <p><strong>Discussion focus:</strong> students write vague non-functional requirements ("fast", "easy", "secure"). The fix is always a number, a condition and a way to check it. Model the rewrite once, then make students do the rest.</p>
        <p><strong>Link back:</strong> Lesson 4's functional requirements for the Pixel Pockets fail report are reused in the make-it-testable section.</p>
      </aside>

      <section class="content-section" id="intentions">
        <h2>Learning intentions</h2>
        <p>By the end of this lesson I can:</p>
        <ul class="dot-points">
          <li>explain the difference between functional and non-functional requirements</li>
          <li>specify non-functional requirements for a data analysis, including usability, performance, reliability, security, privacy and accessibility</li>
          <li>rewrite a vague requirement so it can be tested.</li>
        </ul>
        <div class="info-box">
          <strong>Success criteria:</strong> I can write four non-functional requirements for one data analysis, each with a measurable target and a way to test it.
        </div>
      </section>

      <section class="content-section" id="hook">
        <span class="paper-tape paper-tape--rose" aria-hidden="true"></span>
        <h2>Correct, but useless</h2>
        <p>The StepUp team builds the weekly summary card from Lesson 4. Every test case passes: the counts and totals are all correct. Then they release it.</p>
        <ul>
          <li>The card takes 40 seconds to appear.</li>
          <li>The text is too small to read on a phone.</li>
          <li>A "friends" screen shows each friend's average heart rate.</li>
          <li>When a user reaches 5,000 workouts, the card stops loading.</li>
        </ul>
        <p>Talk with the person next to you. The card does everything it's meant to <em>do</em>. So what went wrong?</p>
{expand("The idea behind today's lesson", '''<p>None of these problems is about <em>what</em> the card does. They're about <em>how well</em> it does it: speed, readability, privacy and coping with growth. Those qualities are <strong>non-functional requirements</strong>. If nobody writes them down, nobody tests them.</p>''')}
      </section>

      <section class="content-section" id="vocab">
        <h2>Key vocabulary</h2>
        <p>Tap each card to check your understanding before reading the definition.</p>
        {flips([
          ("Non-functional requirement","A quality the solution must have, describing how well it works rather than what it does."),
          ("Usability","How easily the intended user can use the solution to reach their goal."),
          ("Performance","How quickly the solution responds or finishes processing."),
          ("Reliability","Whether the solution gives correct, consistent results every time."),
          ("Security","Protecting data from people who shouldn't see or change it."),
          ("Privacy","Making sure personal information is only collected, shown and shared appropriately."),
          ("Accessibility","Whether people with disability can use the solution, for example with a screen reader."),
          ("Scalability","Whether the solution still works as the amount of data grows."),
        ])}
      </section>

      <section class="content-section" id="compare">
        <span class="section-phase-tag research"><span class="dot"></span>Analysis first</span>
        <h2>Two reports, same numbers</h2>
        <p>Two students built a completion report for <em>Coin Run 3D</em>. Both reports pass every functional test: they calculate the same completion rates from the same 155 runs. Read both descriptions.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Comparison of two completion reports</caption>
            <thead><tr><th scope="col">Feature</th><th scope="col">Report A</th><th scope="col">Report B</th></tr></thead>
            <tbody>
              <tr><td><strong>Level 3 result</strong></td><td>42.592593%</td><td>42.6% (23 of 54 runs)</td></tr>
              <tr><td><strong>Status shown as</strong></td><td>A red or green dot with no label</td><td>A bar with the label "Needs work" or "OK"</td></tr>
              <tr><td><strong>Detail</strong></td><td>Lists every <code>playerId</code> with each player's deaths</td><td>Shows totals per level only</td></tr>
              <tr><td><strong>Time to open</strong></td><td>About 30 seconds</td><td>Under 1 second</td></tr>
              <tr><td><strong>Runs on</strong></td><td>Only the student's own laptop</td><td>Any school laptop, and readable on a Steam Deck screen</td></tr>
              <tr><td><strong>If the file has a blank <code>platform</code></strong></td><td>Crashes</td><td>Skips the row and reports "1 row skipped"</td></tr>
            </tbody>
          </table>
        </div>
        <div class="analysis-box">
          <p class="analysis-box__eyebrow">Analysis activity · pairs · 8 min</p>
          <h3>Why is B better?</h3>
          <ol>
            <li>For each row of the table, write one word for the quality that makes B better (for example: speed, privacy).</li>
            <li>Which difference would matter most to the level designer? Which would matter most to a player?</li>
            <li>Report A shows more detail. Is more detail always better? When could it be worse?</li>
          </ol>
        </div>
{expand("Possible answers", '''<p><strong>1.</strong> Level 3 result: usability (readable precision, and the counts behind the percentage) · status: accessibility (colour alone fails colour-blind users) · detail: privacy (individual players aren't needed for this decision) · time to open: performance · runs on: portability and usability · blank platform: reliability.</p>
            <p><strong>2.</strong> The designer cares most about readability and speed. A player would care most about privacy: their own deaths, listed by ID.</p>
            <p><strong>3.</strong> No. Extra detail can expose personal data and hide the pattern the user needs. Show what the decision needs, and no more.</p>''')}
      </section>

      <section class="content-section" id="categories">
        <h2>Kinds of non-functional requirement</h2>
        <p>Each kind can be written for any of our five projects. A good non-functional requirement includes a <strong>measurable target</strong>.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Non-functional requirement categories with examples</caption>
            <thead><tr><th scope="col">Kind</th><th scope="col">Example requirement</th><th scope="col">How to test it</th></tr></thead>
            <tbody>
              <tr><td><strong>Performance</strong></td><td>The Canteen Click weekly report opens within 3 seconds for up to 2,000 orders.</td><td>Load 2,000 test orders and time it.</td></tr>
              <tr><td><strong>Usability</strong></td><td>The canteen manager can find Friday's best-selling item within 30 seconds, without training.</td><td>Watch the manager try it, and time them.</td></tr>
              <tr><td><strong>Reliability</strong></td><td>Running the Pixel Pockets fail report twice on the same file gives identical results.</td><td>Run it twice and compare the outputs.</td></tr>
              <tr><td><strong>Security</strong></td><td>StepUp workout data is sent only over HTTPS.</td><td>Inspect the network traffic during a sync.</td></tr>
              <tr><td><strong>Privacy</strong></td><td>StepUp never shows one user's heart rate to another user.</td><td>Log in as a friend and check every screen.</td></tr>
              <tr><td><strong>Accessibility</strong></td><td>Every Coin Run 3D chart labels its bars with text, not colour alone.</td><td>View the chart in greyscale; check it with a screen reader.</td></tr>
              <tr><td><strong>Scalability</strong></td><td>The Cave of Echoes analysis still runs when sessions grow from 143 to 100,000.</td><td>Generate 100,000 test sessions and run it.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="content-section" id="testable">
        <h2>Make it testable</h2>
        <p>Vague requirements can't be tested, so nobody can prove they're met. A testable requirement has a <strong>measure</strong>, a <strong>target</strong> and a <strong>condition</strong>.</p>
        <div class="example-box">
          <strong>Worked example: Pixel Pockets fail report</strong>
          <span class="example-box__subhead">Vague</span>
          The report should be fast.
          <span class="example-box__subhead">Testable</span>
          The report shows the bar chart within 2 seconds (target) of choosing a level (measure: time), for a file of up to 5,000 attempts on a school laptop (condition).
        </div>
        <div class="guided-box">
          <p class="guided-box__eyebrow">We do · pairs · 6 min</p>
          <p>Rewrite each vague requirement so it can be tested. Name the measure, target and condition.</p>
          <ol>
            <li>The Canteen Click report should be easy to use.</li>
            <li>StepUp should keep data secure.</li>
            <li>The Coin Run 3D report should work with lots of data.</li>
            <li>The Pixel Pockets chart should be accessible.</li>
          </ol>
        </div>
{expand("Possible rewrites", '''<ol>
              <li>A canteen staff member who hasn't used the report before can find the total sales for any day within 1 minute, without help.</li>
              <li>Workout data is encrypted when stored on the phone and in the cloud, and is sent only over HTTPS.</li>
              <li>The report opens within 5 seconds for files of up to 50,000 runs.</li>
              <li>Every bar has a text label and a value, and the chart has a text summary that a screen reader can read.</li>
            </ol>
            <p>Your numbers may differ. What matters is that someone else could run the test and agree on whether it passed.</p>''')}
      </section>

      <section class="content-section" id="sort">
        <h2>Sort it out</h2>
        <p>These are planning notes for the <em>StepUp</em> weekly summary card. Is each one a functional requirement, a non-functional requirement or a constraint on the project?</p>
{sort_activity([
  ("The card shows the total minutes exercised this week.","fr","It's something the card must do: total the minutes.","Sort: shows total minutes this week"),
  ("The card appears within 2 seconds of opening the app.","nfr","Speed is a quality: performance.","Sort: appears within 2 seconds"),
  ("The team has four weeks to build the card.","con","A deadline limits the project, not the card.","Sort: four weeks to build"),
  ("No other user can see this user's heart rate.","nfr","A privacy quality the whole system must have.","Sort: no other user can see heart rate"),
  ("The card compares this week's workout count with last week's.","fr","Comparing is something the card does.","Sort: compares this week with last week"),
  ("All text on the card can be read at 200% zoom without overlapping.","nfr","A measurable accessibility quality.","Sort: readable at 200 percent zoom"),
  ("The card must be built with the app's existing database.","con","A limit on which tools the team can use.","Sort: built with the existing database"),
  ("The card names the most common activity this week.","fr","Finding the most frequent activity is a function.","Sort: names the most common activity"),
], [("fr","Functional"),("nfr","Non-functional"),("con","Constraint")])}
      </section>

      <section class="content-section" id="sample">
        <h2>Case study: 13 runs</h2>
        <div class="case-study-box">
          <p class="case-study-box__eyebrow">Case study</p>
          <h3>Should we redesign Level 3 for Steam Deck?</h3>
          <p>The Coin Run 3D report shows Level 3 completion by platform. On PC, 20 of 41 runs were completed (48.8%). On Steam Deck, only 3 of 13 runs were completed (23.1%). The designer is ready to spend two weeks redesigning Level 3 for Steam Deck controls.</p>
          <p>A teammate points out that 13 runs is very few. Three or four lucky or unlucky runs would change the Steam Deck percentage a lot. They suggest a new requirement: <strong>"Any percentage calculated from fewer than 20 records is marked 'small sample'."</strong></p>
          <p class="case-study-box__question"><strong>Discuss:</strong> Is this a functional or a non-functional requirement? (You can argue either way.) Should the designer still act on the Steam Deck result? What data would make the decision safer?</p>
        </div>
      </section>
{tiers(
  ("Name the quality", '''<p>For each problem with the StepUp card in the hook, write the kind of non-functional requirement it breaks:</p>
            <ul>
              <li>takes 40 seconds to appear</li>
              <li>text too small on a phone</li>
              <li>friends see heart rate</li>
              <li>stops loading at 5,000 workouts</li>
            </ul>'''),
  ("Requirements for Canteen Click", '''<p>Write four non-functional requirements for the Canteen Click weekly report, from four different kinds.</p>
            <ul>
              <li>Each needs a measure, a target and a condition.</li>
              <li>Write how you would test each one.</li>
            </ul>'''),
  ("Trade-offs", '''<p>Some non-functional requirements pull against each other.</p>
            <ul>
              <li>Explain how <em>privacy</em> and <em>usefulness</em> conflict in Report A vs Report B.</li>
              <li>Find one other pair of qualities that conflict in one of the five projects, and recommend a balance.</li>
            </ul>'''))}
{checkpoint([
  ("Which is a <em>non-functional</em> requirement for the Canteen Click weekly report?", "B",
   ["Total the quantity sold of each item","The report opens within 3 seconds","Show the busiest day of the week","Filter the orders by pickup time"],
   ["Not quite. Totalling is something the report does, so it's functional.",
    "✓ Correct. Speed is a quality of the report: a performance requirement.",
    "Not quite. Finding the busiest day is a function of the report.",
    "Not quite. Filtering is something the report does, so it's functional."]),
  ("\"Every chart labels its bars with text, not colour alone.\" Which kind of non-functional requirement is this?", "C",
   ["Performance","Maintainability","Accessibility","Reliability"],
   ["Not quite. Performance is about speed.",
    "Not quite. Maintainability is about how easily the solution can be changed later.",
    "✓ Correct. Text labels help people who can't tell colours apart, or who use a screen reader.",
    "Not quite. Reliability is about correct, consistent results."]),
  ("Which rewrite of \"The fail report should be fast\" can be <em>tested</em>?", "D",
   ["It should be very fast for every user","It should feel quick when designers use it","It should use efficient code throughout","Results in 2 s for 5,000 attempts"],
   ["Not quite. \"Very fast\" still has no target to measure against.",
    "Not quite. \"Feel quick\" is an opinion, so two testers could disagree.",
    "Not quite. Efficient code might help, but it isn't a target you can check.",
    "✓ Correct. It has a measure (time), a target (2 s) and a condition (5,000 attempts)."]),
  ("StepUp passes every functional test, but friends can see each other's heart rate on a leaderboard. Which requirement has been missed?", "A",
   ["Privacy","Performance","Scalability","Usability"],
   ["✓ Correct. Heart rate is personal health data and shouldn't be shown to other users.",
    "Not quite. Nothing here is about speed.",
    "Not quite. The problem would exist even with only two users.",
    "Not quite. The screen may be easy to use. The problem is what it reveals."]),
  ("On Level 3, Steam Deck runs completed 3 of 13 (23.1%) and PC runs 20 of 41 (48.8%). Which requirement best stops the designer from over-reacting?", "A",
   ["Flag results from fewer than 20 runs","Show every result to six decimal places","Remove Steam Deck runs from the report","Open the report within two seconds"],
   ["✓ Correct. Flagging small samples warns that 13 runs may not show a real pattern.",
    "Not quite. More decimal places make a small sample look more precise than it is.",
    "Not quite. Hiding the data hides a possible real problem.",
    "Not quite. Speed doesn't help the designer judge the result."]),
  ("Why are non-functional requirements often harder to test than functional ones?", "C",
   ["Users don't think they are important","Only the developer is able to test them","Qualities need a measurable target","They never change once the app launches"],
   ["Not quite. Users often care most about qualities like speed and privacy.",
    "Not quite. Many are best tested by real users, such as usability tests.",
    "✓ Correct. \"Fast\" or \"easy\" must be given a measure and target before anyone can test them.",
    "Not quite. They change often, for example as the amount of data grows."]),
])}
{exam(4, "<p><em>StepUp</em> is a fitness app that records each user's workouts, including heart rate, and shows a weekly summary card.</p>",
  "(a) Distinguish between functional and non-functional requirements, using an example of each for the StepUp weekly summary card. (2 marks) (b) Rewrite the requirement \"The StepUp summary must be secure\" so that it can be tested, and describe how you would test it. (2 marks)",
  [("(a) Clearly distinguishes what the system does from how well it does it, with a correct StepUp example of each","2"),
   ("(a) Correct definition or a correct example of one type","1"),
   ("(b) Testable rewrite (measure/target/condition) AND a matching test","2"),
   ("(b) Improved but still partly vague rewrite, OR a test without a rewrite","1")],
  "(a) A functional requirement describes something the card must do, such as \"show the total minutes exercised this week\". A non-functional requirement describes how well it must do it, such as \"the card appears within 2 seconds of opening the app\". (b) \"Workout data, including heart rate, is sent from the phone to the cloud only over HTTPS and is stored encrypted.\" To test it, sync a workout while capturing network traffic and check that no workout data can be read in plain text.",
  "giving two functional examples (for example, \"show steps\" and \"show heart rate\"), or rewriting \"secure\" as \"very secure\", which is still not testable.")}
{cpd("communicating with data", [
  "Selects relevant data, media and processes to effectively communicate information in a range of contexts.",
  "Selects relevant data, media and processes to communicate appropriate information in a range of contexts.",
  "Selects appropriate data, media and processes to communicate information in a range of contexts.",
  "Uses data to communicate basic information.",
  "Uses data to communicate information in a very limited way.",
], [
  "Writes testable non-functional requirements and explains trade-offs between them, such as privacy versus detail.",
  "Writes four testable non-functional requirements of different kinds, each with a matching test.",
  "Distinguishes functional from non-functional requirements and writes testable examples of each.",
  "Names the quality broken by a described problem.",
  "Identifies one way a report could be easier to read.",
])}
{reflection(5, [
  ("Which non-functional requirement does your own project fail right now?","My project would fail ___ because…"),
  ("Report A or Report B: which are your own reports more like, and why?","My reports are more like Report ___ because…"),
])}'''

html = page(5, "How well must it work?",
  "specify non-functional requirements for a data analysis, including usability, performance, reliability, security, privacy and accessibility, and make them testable.",
  toc, ["CT5-DPM-01","CT5-SAF-01","CT5-COM-01"], [PILL["identify"]],
  "A report can get every number right and still be slow, confusing or unsafe. Today you'll write the requirements that describe how well a data analysis must work, and turn vague words like \"fast\" and \"secure\" into targets you can test.",
  [PILL["identify"]], body, ("lesson04.html","Lesson 4: What must the analysis do?"), ("lesson06.html","Lesson 6: Who is in the data, and who isn't?"))
open(sys.argv[1], "w", encoding="utf-8").write(html)
