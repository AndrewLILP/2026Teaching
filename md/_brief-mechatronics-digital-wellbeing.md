# Brief: Digital Wellbeing

**For use in a new chat.** Before writing any code: read `_pattern-reference.md` in full, then this brief in full, then confirm the open questions at the bottom with Andrew before building anything.

**Important — read this before the rest of the brief:** unlike the other two mechatronics units, NESA does **not** provide a detailed, lesson-by-lesson sample for Digital Wellbeing anywhere in the project files. It only ever appears as a single repeated paragraph inside several scope-and-sequence documents — never as its own standalone "Sample unit" document with an Identifying/Researching/Producing/Testing table like Sample Unit 3 or the Life Skills Year 9 unit had. This means the lesson sequence in this brief is **original design that satisfies NESA's stated brief**, not a transcription of NESA's own detailed activities. Say so explicitly if asked — don't present it as more "official" than it is.

---

## 1. Source

NESA documents (same paragraph recurs verbatim or near-verbatim across): `computing-technology-7-10-scope-and-sequence-stage-5-100hrs-single-focus-areas.docx`, `...-200hrs-single-focus-areas.docx`, `...-100hrs-blended-focus-areas.docx`, `...-200hrs-blended-focus-areas.docx`, `...-stage-4-5-100hrs-single-focus-areas.docx`, and others.

- **Title:** Digital Wellbeing
- **Duration:** presented as a full 10-week term in every scope-and-sequence document (same length as the Investigating Inputs and Outputs unit) — **not** an hour count like Sample Unit 3, so target **9 lessons** to match that unit's cadence (confirm with Andrew, see §6).
- **Focus area(s):** Building Mechatronic and Automated Systems
- **Unit description (NESA's exact paragraph, this is genuinely all there is):** *"Students develop their knowledge and skills in the use of a variety of microcontrollers and coding options to develop a simple device to support the physical, emotional, social or cognitive wellbeing of a user. This could include devices that promote access and participation for people with disability. This unit supports students as they develop, plan, design and construct a mechatronic system using algorithms and/or automated systems to solve a real-world problem (student choice). Students evaluate their own project, ensuring functionality, code validation and data security."*

## 2. Folder & naming

```
computing/NESAsamples/mechatronics-digital-wellbeing/
├── index.html
└── lesson01.html … lesson09.html
```

- Folder slug: `mechatronics-digital-wellbeing`
- Accent colour: cyan family, matching the other two mechatronics units — `--accent: #0e7490; --accent-bright: #0891b2;`
- `unitId` for progress tracking: `nesa-mechatronics-wellbeing-2026`

## 3. What NESA actually specifies (this is the whole brief — design around it, don't pad it with invented NESA detail)

- A **microcontroller-based** mechatronic device (any microcontroller/coding platform — NESA doesn't name one)
- Purpose: support **physical, emotional, social or cognitive** wellbeing of a user
- Explicitly invites devices that **promote access and participation for people with disability**
- **Student choice** of real-world problem
- Full D&P cycle: develop, plan, design, construct, using algorithms and/or automated systems
- Self-evaluation covering three named criteria: **functionality, code validation, data security**

That data security mention is notable and specific — it's the only unit of the three mentioning data handling, and deserves its own lesson rather than a throwaway line.

## 4. Important — check for overlap before building

Andrew already has an in-progress, longer-form custom Mechatronics unit (10 weeks, 30 lessons, "Designing Mechatronic Solutions") elsewhere on the site at `computing/ct5/software-development/mechatronics/`, which explicitly includes **"digital wellbeing devices"** as one of three student problem-type angles (the other two being social-issue data-capture systems and autonomous response systems). That unit uses VEX VR and Micromelon with a Blocks/Python toggle.

This NESA sample unit's brief is conceptually the same idea, compressed into its own short standalone unit. Before building, **flag this overlap to Andrew directly** and ask whether he wants:
- this unit kept genuinely independent and differentiated from that existing strand, or
- this unit to intentionally mirror that existing strand's platform conventions (VEX VR/Micromelon) for consistency, effectively acting as a shorter standalone on-ramp to the same problem space.

Don't assume either way.

## 5. Proposed lesson sequence (9 lessons — confirm with Andrew before building)

| # | Title | D&P phase | Focus |
|---|---|---|---|
| 1 | What Is Digital Wellbeing? | Identify | Physical/emotional/social/cognitive wellbeing as four categories; brainstorm everyday problems in each |
| 2 | Choosing Our Problem | Identify | Student-choice real-world problem; explicit lens on access/participation for people with disability |
| 3 | Microcontrollers and Sensors for Wellbeing | Identify/Research | Survey of microcontroller options and sensors relevant to the chosen problem space |
| 4 | Planning Our Algorithm | Research/Plan | NSW pseudocode for the sense → decide → act logic of the chosen device |
| 5 | Designing the System | Research/Plan | Block diagram, component list, non-functional requirements |
| 6 | Building It: Core Logic | Produce | First build session — core sensing/decision/action logic |
| 7 | Building It: Refining and Responding | Produce | Second build session — feedback, reliability, edge cases |
| 8 | Data Security and Code Validation | Test | Validating code against requirements; protecting any personal/wellbeing data the device collects |
| 9 | Testing and Evaluating Our Device | Test/Evaluate | Final testing against functionality criteria; self-evaluation; reflection on real-world impact |

This sequence is built to satisfy NESA's stated brief, not transcribed from a NESA lesson table (none exists). Treat it as a starting proposal.

## 6. Outcomes

Most consistently appearing across the Stage 5-specific scope-and-sequence documents:
- **Focus outcomes:** CT5-DPM-01, CT5-EVL-01, CT5-OPL-01, CT5-THI-01, CT5-DES-01
- **Life Skills outcomes:** CTLS-DPM-01, CTLS-EVL-01, CTLS-OPL-01, CTLS-THI-01

One Stage 4/5-blended document lists a different set (CT5-SOL-01, CT5-EVL-01, CT5-OPL-01, CTLS-THI-01) — the building chat should treat the first set above as primary but sanity-check against `project_knowledge_search` before publishing, same as Unit 2.

## 7. Open questions to confirm with Andrew before building

1. **Overlap with the existing 30-lesson Mechatronics unit (§4)** — independent or intentionally aligned?
2. **9-lesson target** — confirm, since NESA gives no lesson count for this unit, only a 10-week term length.
3. **Platform** — open device choice, or constrained to VEX VR/Micromelon for consistency with the rest of the site?
4. Confirm the breadcrumb's mechatronics-hub path matches the live site, same as Unit 2.
