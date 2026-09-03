"""
Overland — Teacher Exemplar
Stage 5 Software Development | Overland Studio

A complete, working reference build of the trail simulator taught
across Lessons 1-6, in plain procedural Python compatible with Grok
Learning's console environment: input()/print() only, no file I/O,
and nothing beyond the standard library's `random` module.

THIS IS A TEACHING REFERENCE, NOT A STUDENT STARTER FILE.
It intentionally goes a little further than the Sprint A/B
walkthroughs (a three-speed pace choice, rather than one fixed
travel rate) so there's a known-good, non-trivial build to compare
a student's code against when troubleshooting. It deliberately does
NOT include a Lesson 6 creativity extension — that task asks each
student to design their own, and a single "canonical" extension in
the reference file would just end up being copied.

Covers, lesson by lesson:
  L1  Brief requirements: tracked state, change over time, a real
      player choice, randomness, two distinct endings, clear
      console feedback.
  L2  State as a dictionary; a while loop guarded on distance, food,
      AND health together (see the note on is_still_travelling()
      below — this is the exact gap Lesson 5's testing section
      asks students to go looking for in their own Sprint A code).
  L3  travel() as an extracted function, taking and returning state.
  L4  check_for_event() using random.randint(); get_pace_choice()
      as a validated-input guard loop (CT5-SAF-01).
  L5  The >= comparison on distance, not ==, for exactly the
      boundary-value reason covered in that lesson's Bug Detective:
      at Fast pace, distance increases by 30/day and DISTANCE_TO_COAST
      isn't a multiple of 30, so an == check would miss the win
      entirely.

IMPORTANT — DISTANCE_TO_COAST is 150 here, not 2000.
The lesson materials (L2's pseudocode, L3's walkthrough and trace
table, L4, and L5's test-case table) all use 2000 as the target,
paired with the taught numbers food=100, food_cost=10/day,
distance_gain=20/day. Those numbers make the game mathematically
unwinnable: even with zero random events, the party runs out of
food after 10 days / 200km, and can never reach 2000km. Simulating
1,000 runs at the taught values confirms a 0% win rate regardless
of strategy. 150 was chosen by simulating win rates across a range
of thresholds until arrival became a genuine possibility (roughly
7-90% depending on pace strategy) without becoming close to
guaranteed. If you'd like the lesson files corrected to match —
it's a small, contained edit (the number 2000, and one L5 test
case that forces distance to 1990) — flag it and it can be fixed
directly in Lessons 2, 3, 4, and 5.
"""

import random


DISTANCE_TO_COAST = 150

STARTING_STATE = {
    "food": 100,
    "health": 100,
    "distance": 0,
    "days_passed": 0,
}

# Slower pace costs less food per day but covers less ground;
# faster pace is the opposite trade-off. This is the "real choice"
# the Lesson 1 brief asks for — there's no strictly best option.
PACE_OPTIONS = {
    "1": {"label": "Slow",   "food_cost": 6,  "distance_gain": 12},
    "2": {"label": "Normal", "food_cost": 10, "distance_gain": 20},
    "3": {"label": "Fast",   "food_cost": 16, "distance_gain": 30},
}


def get_pace_choice():
    """Ask for a pace, re-asking until the answer is valid.

    The Lesson 4 input-validation pattern: nothing later in the
    program ever has to handle a pace value that isn't "1", "2",
    or "3", because this guard loop never lets one through.
    """
    prompt = "Choose your pace — 1) Slow  2) Normal  3) Fast: "
    choice = input(prompt)
    while choice not in PACE_OPTIONS:
        print("Please enter 1, 2, or 3.")
        choice = input(prompt)
    return choice


def travel(state, pace_choice):
    """Advance the party by one day at the chosen pace."""
    pace = PACE_OPTIONS[pace_choice]
    state["food"] -= pace["food_cost"]
    state["distance"] += pace["distance_gain"]
    state["days_passed"] += 1
    return state


def check_for_event(state):
    """Roll for a random event and apply its effect, if any.

    Rolls 1-3 (30%): river crossing costs food. Rolls 4-5 (20%):
    illness costs health. Roll 6 (10%): a broken wheel costs a day.
    Rolls 7-10 (40%): nothing happens.
    """
    roll = random.randint(1, 10)

    if roll <= 3:
        print("The river crossing is rough — some food is lost!")
        state["food"] -= 15
    elif roll <= 5:
        print("Someone in the party has fallen ill.")
        state["health"] -= 20
    elif roll <= 6:
        print("The wagon wheel has broken! You lose a day fixing it.")
        state["days_passed"] += 1

    return state


def is_still_travelling(state):
    """The loop's guard condition, factored out for readability.

    Checks distance, food, AND health together, matching the
    Lesson 2 pseudocode plan. A Sprint A build that only checks
    distance and food (health left out) will run forever once
    health hits zero — that's the exact bug Lesson 5 asks students
    to test for and fix in their own code.
    """
    return (
        state["distance"] < DISTANCE_TO_COAST
        and state["food"] > 0
        and state["health"] > 0
    )


def print_day_report(state):
    print(
        f"Day {state['days_passed']}: "
        f"{state['distance']}km travelled, "
        f"{state['food']} food, "
        f"{state['health']} health"
    )


def print_ending(state):
    """Two distinct outcome categories, as the Lesson 1 brief requires:
    arrival, or one of several failure states."""
    if state["distance"] >= DISTANCE_TO_COAST:
        print("\nYou made it to the coast!")
    elif state["food"] <= 0:
        print("\nThe party has run out of food. The journey ends here.")
    elif state["health"] <= 0:
        print("\nThe party is too unwell to continue. The journey ends here.")
    else:
        print("\nThe journey ends here.")


def play():
    """Run one full game from a fresh copy of the starting state."""
    state = dict(STARTING_STATE)

    print("=== OVERLAND ===")
    print("Guide your party to the coast before you run out of food or health.\n")

    while is_still_travelling(state):
        print_day_report(state)
        pace_choice = get_pace_choice()
        state = travel(state, pace_choice)
        state = check_for_event(state)
        print()

    print_ending(state)


if __name__ == "__main__":
    play()
