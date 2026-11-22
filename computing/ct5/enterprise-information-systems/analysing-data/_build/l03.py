import sys
from components import *

toc = [("intentions","Learning intentions"),("hook","Is the game too hard?"),("vocab","Key vocabulary"),
       ("judge","Judge the questions"),("anatomy","What makes a good data question"),("breakdown","Break it down"),
       ("users","Who uses the answer?"),("cave","We do: why do players quit?"),("tasks","Your task"),
       ("checkpoint","Checkpoint"),("exam","Exam-style question"),("grades","What success looks like"),("reflect","Reflection")]

body = f'''
      <aside class="teaching-advice">
        <h4>Teaching advice</h4>
        <p><strong>Timing:</strong> hook 4 min · vocabulary 5 min · judge the questions 10 min · anatomy 6 min · break it down 8 min · users 5 min · Cave of Echoes 7 min · tasks 5 min · checkpoint and exam question 5 min.</p>
        <p><strong>Discussion focus:</strong> the key move is from "Is it good?" to a question that names fields in the data. Keep asking: <em>which column would answer that?</em> If no column exists, the question can't be answered with this data, which is a useful finding too.</p>
        <p><strong>Keep handy:</strong> the column headings from Lesson 1 (Five rows, five systems). Students need them to judge whether a question is answerable.</p>
      </aside>

      <section class="content-section" id="intentions">
        <h2>Learning intentions</h2>
        <p>By the end of this lesson I can:</p>
        <ul class="dot-points">
          <li>turn a vague concern into a data question that the available data can answer</li>
          <li>break a large data question into smaller sub-questions linked to fields</li>
          <li>describe the users of a data analysis and the decision they need to make.</li>
        </ul>
        <div class="info-box">
          <strong>Success criteria:</strong> I can write one data question for a project, break it into at least three sub-questions, and name the field or fields that answer each one.
        </div>
      </section>

      <section class="content-section" id="hook">
        <span class="paper-tape paper-tape--violet" aria-hidden="true"></span>
        <h2>Is the game too hard?</h2>
        <p>The developer of <em>Coin Run 3D</em> has 155 run records and one worry: "I think my game is too hard." She opens the data file and stares at it. Where should she start?</p>
        <p>Talk with the person next to you. "Too hard" for whom? On which level? How would you <em>know</em> from the data? Try to rewrite her worry as a question the file could answer.</p>
{expand("Some rewrites the class might suggest", '''<ul>
              <li>What percentage of runs are completed on each level?</li>
              <li>How many deaths happen on average on each level?</li>
              <li>Do Steam Deck runs complete less often than PC runs?</li>
            </ul>
            <p>Each rewrite names something we can <strong>count or measure</strong> using a column in the data (<code>completed</code>, <code>deaths</code>, <code>platform</code>, <code>level</code>). "Too hard" can't be counted. "Percentage of Level 3 runs completed" can.</p>''')}
      </section>

      <section class="content-section" id="vocab">
        <h2>Key vocabulary</h2>
        <p>Tap each card to check your understanding before reading the definition.</p>
        {flips([
          ("Data question","A question that can be answered by processing a specific set of data."),
          ("Measurable","Able to be counted or calculated from fields in the data."),
          ("Sub-question","A smaller question that answers one part of a bigger question."),
          ("Decomposition","Breaking a big problem into smaller parts that are easier to solve."),
          ("User","The person who uses the result of the analysis to make a decision."),
          ("Stakeholder","Anyone affected by the analysis, including the people whose data is in it."),
          ("Scope","The limits of the analysis: which data, which time period and which question."),
          ("Data gap","Something you need to know that the dataset doesn't record."),
        ])}
      </section>

      <section class="content-section" id="judge">
        <span class="section-phase-tag research"><span class="dot"></span>Analysis first</span>
        <h2>Judge the questions</h2>
        <p>People asked these questions about our five projects. Before learning any rules, sort each one. Use the column headings from Lesson 1 to check whether the data could answer it.</p>
        <ul class="dot-points">
          <li><strong>Good data question:</strong> specific, and the data has the fields to answer it.</li>
          <li><strong>Too vague:</strong> it's not clear what to count or compare.</li>
          <li><strong>Data can't answer:</strong> it's specific, but the dataset doesn't record what's needed.</li>
        </ul>
{sort_activity([
  ("Which Canteen Click item sells the most on Fridays?","good","Specific, and orderDate, itemId and quantity answer it.","Sort: which item sells most on Fridays"),
  ("Is the canteen any good?","vague","\"Good\" isn't defined. Good food? Fast service? Good profit? Nothing to count yet.","Sort: is the canteen any good"),
  ("Do students enjoy the food they order?","gap","Specific enough, but Canteen Click records orders, not opinions. There's no enjoyment field.","Sort: do students enjoy the food"),
  ("Do Cave of Echoes sessions with more invalid commands end in Quit more often?","good","invalidCommands and ending are both in the data, so this can be counted and compared.","Sort: do sessions with more invalid commands end in Quit"),
  ("Which room do Cave of Echoes players quit in?","gap","The data records how many rooms were visited, not which room the player was in. That's a data gap.","Sort: which room do players quit in"),
  ("What's going on with Pixel Pockets?","vague","There's no clear thing to measure or compare.","Sort: what's going on with Pixel Pockets"),
  ("Does using StepUp make people healthier?","gap","StepUp logs workouts, not health before and after. Even more workouts wouldn't prove the app caused better health.","Sort: does StepUp make people healthier"),
  ("In which week do StepUp workouts drop the most?","good","Count workouts per week using the date field, then compare the weeks.","Sort: in which week do workouts drop the most"),
  ("Why is Cave of Echoes boring?","vague","\"Boring\" isn't measurable, and it assumes the game is boring.","Sort: why is Cave of Echoes boring"),
  ("Do Steam Deck runs on Level 3 finish less often than PC runs?","good","level, platform and completed answer it directly.","Sort: do Steam Deck runs on Level 3 finish less often"),
], [("good","Good data question"),("vague","Too vague"),("gap","Data can't answer")])}
        <div class="analysis-box">
          <p class="analysis-box__eyebrow">Discuss · pairs · 3 min</p>
          <h3>Look at the "can't answer" pile</h3>
          <ol>
            <li>Pick one question from that pile. What extra field would the system need to record to answer it?</li>
            <li>Would collecting that field create a privacy problem? (Think about the StepUp question.)</li>
          </ol>
        </div>
      </section>

      <section class="content-section" id="anatomy">
        <h2>What makes a good data question</h2>
        <p>A good data question passes three checks. If it fails one, rewrite it before you touch the data.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Three checks for a data question</caption>
            <thead><tr><th scope="col">Check</th><th scope="col">Ask yourself</th><th scope="col">Fails</th><th scope="col">Passes</th></tr></thead>
            <tbody>
              <tr><td><strong>Specific</strong></td><td>Does it say what, who and when?</td><td>Is the canteen busy?</td><td>How many orders are placed on each day of the week?</td></tr>
              <tr><td><strong>Measurable</strong></td><td>Which fields answer it? Can they be counted, averaged or compared?</td><td>Do players like Level 2?</td><td>What percentage of Level 2 attempts are cleared?</td></tr>
              <tr><td><strong>Useful</strong></td><td>Who will use the answer, and what will they decide?</td><td>What is the average playerId?</td><td>Where on Level 2 do most failed attempts end, so we know which jump to fix?</td></tr>
            </tbody>
          </table>
        </div>
        <aside class="paper-sticky paper-sticky--rotate-l">
          <p class="paper-sticky__label">Sentence frame</p>
          <p>"<em>[User]</em> wants to know <em>[measurable thing]</em> for <em>[which records / time]</em> so they can decide <em>[decision]</em>."</p>
        </aside>
      </section>

      <section class="content-section" id="breakdown">
        <h2>Break it down</h2>
        <p>Real questions are usually too big to answer in one step. Analysts use <strong>decomposition</strong>: split the big question into sub-questions, and link each sub-question to the fields that answer it.</p>
        <div class="example-box">
          <strong>Worked example: Canteen Click</strong>
          <span class="example-box__subhead">Big question</span>
          How much stock should the canteen prepare for Fridays?
        </div>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Sub-questions and fields for the Canteen Click Friday question</caption>
            <thead><tr><th scope="col">Sub-question</th><th scope="col">Fields needed</th><th scope="col">Processing</th></tr></thead>
            <tbody>
              <tr><td>1. Are Fridays busier than other days?</td><td><code>orderDate</code></td><td>Count orders per day</td></tr>
              <tr><td>2. Which items sell most on Fridays?</td><td><code>orderDate</code>, <code>itemId</code>, <code>quantity</code></td><td>Filter to Fridays, total quantity per item</td></tr>
              <tr><td>3. Is the Friday demand at recess or lunch?</td><td><code>orderDate</code>, <code>pickup</code></td><td>Filter to Fridays, count by pickup</td></tr>
              <tr><td>4. Were any Friday totals inflated by one big order?</td><td><code>orderDate</code>, <code>quantity</code></td><td>Filter to Fridays, sort by quantity, look for unusual values</td></tr>
            </tbody>
          </table>
        </div>
        <p>Sub-question 4 matters. On the Friday in our dataset, beef burgers sold 22 and sausage rolls sold 19. But 12 of those sausage rolls came from one order for a class event. Without sub-question 4, the canteen would prepare far too many sausage rolls for a normal Friday.</p>
      </section>

      <section class="content-section" id="users">
        <h2>Who uses the answer?</h2>
        <p>The <strong>user</strong> of a data analysis is the person who makes a decision from it. That's often not the person whose data is being analysed. Knowing the user tells you what form the answer should take.</p>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <caption class="sr-caption">Users of the analysis and people in the data for each project</caption>
            <thead><tr><th scope="col">Project</th><th scope="col">User of the analysis</th><th scope="col">What they need</th><th scope="col">People in the data</th></tr></thead>
            <tbody>
              <tr><td><strong>Coin Run 3D</strong></td><td>Level designer</td><td>Which level, and which platform, to fix first</td><td>Players</td></tr>
              <tr><td><strong>Cave of Echoes</strong></td><td>Solo Python developer</td><td>Which commands confuse players</td><td>Players</td></tr>
              <tr><td><strong>StepUp</strong></td><td>Product team</td><td>When users stop exercising, so they can send a reminder</td><td>App users</td></tr>
              <tr><td><strong>Pixel Pockets</strong></td><td>Producer and level designer</td><td>Where players fail on each level</td><td>Playtesters</td></tr>
              <tr><td><strong>Canteen Click</strong></td><td>Canteen manager</td><td>A simple stock list, not a spreadsheet</td><td>Students who order</td></tr>
            </tbody>
          </table>
        </div>
        <p>The canteen manager might never open a spreadsheet. So her answer should be a short list of how many of each item to prepare, not a table of 176 orders.</p>
      </section>

      <section class="content-section" id="cave">
        <h2>We do: why do players quit?</h2>
        <div class="guided-box">
          <p class="guided-box__eyebrow">We do · whole class · 7 min</p>
          <p>The Cave of Echoes developer asks: <strong>"Why do players quit my game?"</strong> The data has these fields:</p>
          <p class="raw-row"><code>sessionId, playerId, turns, validCommands, invalidCommands, roomsVisited, ending, minutesPlayed</code></p>
          <ol>
            <li>Which of the three checks does the question fail?</li>
            <li>Write three sub-questions that the fields <em>can</em> answer.</li>
            <li>Write one sub-question the developer would love to answer but <em>can't</em> with this data. What field is missing?</li>
          </ol>
        </div>
{expand("Possible answers", '''<p><strong>1.</strong> It's not measurable yet. "Why" can't be counted directly, but we can look for patterns linked to quitting.</p>
            <p><strong>2.</strong> Do sessions with more invalid commands end in <code>Quit</code> more often? · Do players who quit visit fewer rooms than players who escape? · Do players quit earlier in their first session than in later sessions?</p>
            <p><strong>3.</strong> "Which command did players type just before quitting?" The data records a <em>count</em> of invalid commands, not the commands themselves. To answer this, the game would need to log each command, which also raises a privacy question if players type personal information.</p>''')}
      </section>
{tiers(
  ("Fix the question", '''<p>Each question fails a check. Rewrite it so it passes all three.</p>
            <ul>
              <li>Is StepUp popular?</li>
              <li>Do people like Pixel Pockets?</li>
              <li>Is the canteen busy?</li>
            </ul>
            <p>Use the sentence frame on this page.</p>'''),
  ("Decompose a question", '''<p>Choose Coin Run 3D or StepUp. Write one big data question using the sentence frame.</p>
            <ul>
              <li>Break it into at least three sub-questions.</li>
              <li>For each, list the fields needed and the processing.</li>
              <li>Name the user and their decision.</li>
            </ul>'''),
  ("Find the gaps", '''<p>Write a big question for your <strong>own</strong> game or app, then decompose it.</p>
            <ul>
              <li>Identify at least one data gap, and the field you'd need to add.</li>
              <li>Explain whether collecting that field is worth any privacy risk.</li>
            </ul>'''))}
{checkpoint([
  ("Which of these is a <em>measurable</em> data question for Coin Run 3D?", "A",
   ["What % of Level 2 runs are completed?","Is Level 2 fun for most of the players?","Why do some players give up on Level 2?","Is Coin Run 3D a good game for most players?"],
   ["✓ Correct. It names a level and something countable from the completed field.",
    "Not quite. \"Fun\" isn't recorded in any field, so it can't be measured.",
    "Not quite. \"Why\" questions need to be turned into patterns we can count first.",
    "Not quite. \"Good\" isn't defined, so there's nothing to count or compare."]),
  ("A data question is \"too vague\" when…", "C",
   ["it uses more than one field of the data","it needs a calculation such as an average","it doesn't say what to count or compare","it is about one specific day of the week"],
   ["Not quite. Many good questions combine fields, such as level and completed.",
    "Not quite. Calculations are normal. Most good questions need one.",
    "✓ Correct. A vague question leaves the analyst guessing what to measure.",
    "Not quite. Naming a day makes a question more specific, not vaguer."]),
  ("Canteen Click records <code>orderDate, pickup, yearGroup, itemId, quantity</code>. Which question can this data <em>not</em> answer?", "B",
   ["Which year group orders the most items?","Which items taste best to students?","Are more orders picked up at recess or lunch?","Which day has the most orders in the week?"],
   ["Not quite. yearGroup and quantity answer this.",
    "✓ Correct. There's no rating field, so taste is a data gap.",
    "Not quite. The pickup field answers this directly.",
    "Not quite. Count orders for each orderDate to answer this."]),
  ("Who is the main <em>user</em> of an analysis of Canteen Click orders?", "D",
   ["The students who placed the orders","The company that hosts the server","The parents who pay for the orders","The manager who plans the stock"],
   ["Not quite. Students are the people in the data, but they don't use this analysis to decide anything.",
    "Not quite. The host stores the data but doesn't make decisions from it.",
    "Not quite. Parents may pay, but they aren't making stock decisions.",
    "✓ Correct. The manager uses the result to decide what to prepare."]),
  ("The canteen asks, \"How much stock should we prepare for Fridays?\" Which sub-question best protects the decision from a misleading total?", "C",
   ["Which item has the highest price on the menu?","How many items are rated Everyday on the menu?","Did one big order inflate Friday totals?","What is the most common year group ordering?"],
   ["Not quite. Price matters for revenue, not for how many to prepare.",
    "Not quite. This describes the menu, not Friday demand.",
    "✓ Correct. One 12-roll order would make normal demand look much higher.",
    "Not quite. Year group doesn't change how much stock is needed."]),
  ("The Cave of Echoes developer wants to know which command players typed just before quitting. What is the best response?", "B",
   ["Use roomsVisited, since it shows the quit room","Say it's a data gap; log each command first","Guess from the average minutes played instead","Delete the Quit sessions and ask the question again"],
   ["Not quite. roomsVisited is a count of rooms, not which room or command.",
    "✓ Correct. The data doesn't record commands. The system must log them first, and the privacy risk should be considered.",
    "Not quite. Minutes played can't tell you which command was typed.",
    "Not quite. Deleting data hides the problem rather than answering the question."]),
])}
{exam(4, '<p>A <em>Coin Run 3D</em> developer says: "I want to know if my game is too hard." Each run record contains <code>runId, playerId, level, coinsCollected, coinsAvailable, timeSeconds, deaths, completed, platform</code>.</p>',
  "(a) Explain why the developer's statement is not yet a good data question. (2 marks) (b) Rewrite it as a data question the run data can answer, and identify two fields needed to answer it. (2 marks)",
  [("(a) Explains that \"too hard\" is vague/not measurable AND that it doesn't say which level, platform or what to count","2"),
   ("(a) Identifies that the statement is vague or not measurable","1"),
   ("(b) Writes a specific, measurable question AND names two relevant fields","2"),
   ("(b) Writes a measurable question OR names two relevant fields","1")],
  "(a) \"Too hard\" can't be measured directly. It doesn't say which level or platform, or what would show that the game is hard, so the analyst doesn't know what to count. (b) What percentage of runs are completed on each level? This needs the <code>level</code> and <code>completed</code> fields.",
  "naming a field that doesn't match the question, such as <code>coinsCollected</code> for a completion question, or rewriting the question as \"Is Level 3 hard?\", which is still not measurable.")}
{cpd("applying processes", CPD_DPM, [
  "Decomposes a question for their own project, finds a data gap and weighs the privacy cost of filling it.",
  "Writes a specific, measurable, useful question with three sub-questions linked to the right fields and the user's decision.",
  "Writes a measurable data question and at least two sub-questions with fields.",
  "Rewrites a vague question so it names something to count.",
  "Identifies which of two questions could be answered with the data.",
])}
{reflection(3, [
  ("Write one data question about your own game or app using the sentence frame.","___ wants to know ___ for ___ so they can decide…"),
  ("Which question from today surprised you by being impossible to answer with the data?","I thought ___ could be answered, but the data doesn't record…"),
])}'''

html = page(3, "Asking a good data question",
  "turn vague concerns into specific, measurable data questions, decompose them, and describe the users of the analysis.",
  toc, ["CT5-DPM-01","CT5-THI-01","CT5-DAT-02"], [PILL["identify"]],
  "Every useful analysis starts with a good question. \"Is my game too hard?\" sounds like a question, but the data can't answer it until it's made specific and measurable. Today you'll learn to sharpen questions, break them into parts, and work out who needs the answer.",
  [PILL["identify"]], body, ("lesson02.html","Lesson 2: Where does the data go?"), ("lesson04.html","Lesson 4: What must the analysis do?"))
open(sys.argv[1], "w", encoding="utf-8").write(html)
