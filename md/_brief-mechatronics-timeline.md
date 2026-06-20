# Brief: Have Humans and Machines Become ONE?

**For use in a new chat.** Before writing any code: read `_pattern-reference.md` in full, then this brief in full, then confirm the open questions at the bottom with Andrew before building anything.

---

## 1. Source

NESA document: `computing-technology-7-10-stage-5-sample-unit-3.docx` — "Computing Technology Stage 5: Sample unit", Sample Unit 3.

- **Title:** Have Humans and Machines Become ONE?
- **Duration:** 10–15 hours (confirmed with Andrew as **≈ 12 lessons** of 50 minutes — see §4)
- **Focus area(s):** Mechatronic and Automated Systems (primary) + Designing for User Experience (secondary)
- **Unit description (NESA's own words, paraphrased):** Students investigate and develop an interactive historical timeline exploring the evolution of mechatronic and automated systems, building knowledge and appreciation of key historical milestones and an understanding of where these systems might go next.

## 2. Folder & naming

```
computing/NESAsamples/mechatronics-timeline/
├── index.html
└── lesson01.html … lesson12.html
```

- Folder slug: `mechatronics-timeline`
- Accent colour: cyan family, same as the other two mechatronics units — `--accent: #0e7490; --accent-bright: #0891b2;` (see pattern reference §3). Use the **same** accent as the other mechatronics units even though UX is a secondary focus area, so all three mechatronics units read as a family on the master hub.
- `unitId` for progress tracking: `nesa-mechatronics-timeline-2026`
- Breadcrumb's fourth level (the focus-area hub) should match whatever the other two mechatronics units use — confirm the exact path against `mechatronics-investigating-io/index.html` rather than guessing.

## 3. What NESA actually specifies (don't invent beyond this without flagging it)

**Identifying & Defining**
- Students consider the purpose, inputs/storage/transmission/processes/outputs, and impact (job losses from automation, safety, liability, greater access and participation) of a mechatronic/automated system.
- In teams, students brainstorm (mind map or mood board) examples of mechatronic and automated systems throughout history and how they've evolved.
- Guiding research questions NESA provides directly:
  - What are mechatronic systems, and what is the history of mechatronics?
  - What key milestones have contributed to the development of modern mechatronic and automated systems?
  - What problems or needs have robots solved historically?
  - How have robots been perceived throughout history? How have these perceptions changed over time?
  - Why were robotics and automated systems developed?
  - How have cultural or diverse human needs driven the design of mechatronic or automated systems? (numeracy advice document)

**Researching & Planning**
- Students choose an authoring tool for their interactive timeline. NESA's own example list: interactive website, virtual reality walk-through, interactive presentation, video/infomercial, digital storytelling app, comic strip.
- Students evaluate existing UIs/interactive media and assess their suitability, exploring design principles and issues relevant to UI/UX for whichever tool they pick.
- A numeracy integration point exists here: NESA's numeracy advice document for this unit suggests creating a scale drawing of the timeline (e.g. 1cm = 20 years) before building the digital version — worth a dedicated planning lesson.

**Producing & Implementing**
- Students are presented with the provocation: *"Humans and machines have become ONE."*
- They investigate and produce an interactive historical timeline (using their chosen tool) illustrating the evolution of mechatronic and automated systems, in support of a final class discussion on whether they agree with the statement.
- The timeline should consider the perspectives of diverse groups and demonstrate functionality, accessibility, usability and aesthetics.

**Testing & Evaluating**
- NESA's table for this phase wasn't fully captured in the source extraction available — when building this unit, re-run a project knowledge search for "sample unit 3 testing evaluating" before writing those lessons, rather than inventing the phase from scratch. The general Testing & Evaluating advice in `computing-technology-7-10-teaching-advice-computing-domains-and-project-work-advice.docx` (testing against criteria, peer evaluation, refining based on feedback) is a safe fallback if nothing more specific turns up.

## 4. Proposed lesson sequence (12 lessons — confirm with Andrew before building)

| # | Title | D&P phase | Focus |
|---|---|---|---|
| 1 | Have Humans and Machines Become ONE? | Identify | Hook discussion on the provocation statement; introduce the unit and its final product |
| 2 | A Brief History of Mechatronics | Identify | Scan major eras/inventions; intro vocabulary |
| 3 | Milestones That Changed Everything | Identify/Research | Research key historical milestones (one of NESA's guiding questions per lesson) |
| 4 | How We've Seen Robots: Then and Now | Identify/Research | Changing perceptions of robots/automation through history; diverse cultural perspectives |
| 5 | What Automation Costs, What It Gives | Identify | Impact of automation — job losses, safety, liability, access and participation |
| 6 | Choosing Our Timeline Tool | Research/Planning | Compare authoring tools (website, VR, presentation, video, digital storytelling app, comic strip) against the brief |
| 7 | Designing for Use: UI/UX Principles | Research/Planning | UI/UX principles and evaluation of existing interactive media relevant to the chosen tool |
| 8 | Planning the Timeline: Scale and Structure | Research/Planning | Mind map/mood board → scale drawing (numeracy link) → structure plan |
| 9 | Building the Timeline: Content | Produce | First production session — content and structure |
| 10 | Building the Timeline: Interactivity & Polish | Produce | Second production session — interactivity, accessibility, aesthetics |
| 11 | Testing Against Our Criteria | Test | Peer + self-testing against functionality/accessibility/usability/aesthetics criteria |
| 12 | Have We Become ONE? Final Verdict | Test/Evaluate | Present timelines, debate the provocation statement, careers/future-of-mechatronics reflection |

This is a **proposed** sequence built from what NESA specifies plus sensible pacing — not handed down by NESA lesson-by-lesson the way the 10-week unit was. Treat lesson boundaries as adjustable.

## 5. Outcomes

NESA's outcome table for this document was only partially captured. **Action for the building chat:** run `project_knowledge_search` for "sample unit 3 outcomes CT5" before finalising outcome tags on any page — do not guess outcome codes. What's known with confidence from the source text: it includes *"selects and applies safe, secure and responsible practices in the ethical use of data and computing technology"* (almost certainly CT5-SAF-01). Cross-check against the other mechatronics units' outcome sets (CT5-DPM-01, CT5-EVL-01, CT5-OPL-01, CT5-THI-01, CT5-DES-01) for plausible overlap, but verify before publishing.

## 6. Open questions to confirm with Andrew before building

1. **Lesson 11 platform-agnostic?** Unlike the Investigating Inputs and Outputs unit, this unit has no fixed build platform (VEX VR etc.) — students choose their own authoring tool. Does Andrew want to constrain tool choice for a classroom context (e.g. limit to "interactive website" or "interactive presentation" only, for marking consistency), or keep it fully open as NESA intends?
2. **Scale drawing lesson (Lesson 8):** confirm whether this numeracy cross-link is wanted, or whether it should be cut for time.
3. **Final outcome codes** per §5 above — must be verified, not assumed.
4. Confirm the breadcrumb's mechatronics-hub path matches the live site (check against the built `mechatronics-investigating-io` unit rather than assuming).
