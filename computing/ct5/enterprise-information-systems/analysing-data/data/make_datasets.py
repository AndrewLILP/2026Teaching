# make_datasets.py
# Builds the five seeded teaching datasets for the CT5 EIS Analysing Data unit.
# For each context: a CLEAN dataset, then a RAW copy with planted problems.
# A separate cleaning function is applied to RAW and must reproduce CLEAN exactly.
import csv, random, sqlite3, os, sys
from datetime import date, timedelta

OUT = sys.argv[1] if len(sys.argv) > 1 else "data"
os.makedirs(OUT, exist_ok=True)
random.seed(2026)

CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
def code(prefix, n=4, used=set()):
    while True:
        c = prefix + "".join(random.choice(CODE_CHARS) for _ in range(n))
        if c not in used:
            used.add(c); return c

def write_csv(path, header, rows):
    with open(path, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)

def insert_at(rows, idx, row):
    rows.insert(idx, row)

# ─────────────────────────────────────────────────────────────
# 1. Unity 3D — "Coin Run 3D"  runs.csv
# ─────────────────────────────────────────────────────────────
U_HEAD = ["runId","playerId","level","coinsCollected","coinsAvailable","timeSeconds","deaths","completed","platform"]
COINS_AVAIL = {1: 20, 2: 30, 3: 40}
def make_unity():
    rows = []; rid = 1
    players = [code("P-") for _ in range(40)]
    for p in players:
        platform = "SteamDeck" if random.random() < 0.35 else "PC"
        skill = random.uniform(0.55, 1.0)
        for level in (1, 2, 3):
            tries = random.choice([1, 1, 2]) if level < 3 else random.choice([1, 2, 2])
            for _ in range(tries):
                avail = COINS_AVAIL[level]
                base_t = {1: 95, 2: 160, 3: 260}[level]
                deck_pen = 1.18 if (platform == "SteamDeck" and level == 3) else 1.0
                t = round(random.gauss(base_t, base_t * 0.18) * deck_pen / skill, 1)
                deaths = max(0, int(random.gauss({1: 0.6, 2: 1.8, 3: 3.6}[level] / skill, 1.0)))
                if platform == "SteamDeck" and level == 3:
                    deaths += 1
                p_complete = {1: 0.95, 2: 0.8, 3: 0.48}[level] * (0.8 + 0.2 * skill)
                if platform == "SteamDeck" and level == 3:
                    p_complete -= 0.15
                done = random.random() < p_complete
                frac = random.uniform(0.55, 1.0) * skill if done else random.uniform(0.15, 0.6)
                coins = min(avail, int(round(avail * frac)))
                rows.append([f"R{rid:03d}", p, level, coins, avail, t, deaths, "Y" if done else "N", platform])
                rid += 1
            if level == 2 and random.random() < 0.3:
                break  # some players never reach level 3
    # genuine outlier: player left the game paused (kept)
    rows[57][5] = 1452.0
    clean = [r[:] for r in rows]
    raw = [r[:] for r in rows]
    # planted problems
    insert_at(raw, 5,  ["R900","TEST",1,20,20,10.0,0,"Y","PC"])               # test row
    insert_at(raw, 31, raw[30][:])                                             # exact duplicate
    insert_at(raw, 77, ["R901",rows[70][1],2,34,30,150.2,1,"Y","PC"])         # coins > available
    insert_at(raw, 102,["R902",rows[95][1],1,12,20,-8.0,0,"N","PC"])          # negative time
    raw[120][8] = "steamdeck" if raw[120][8] == "SteamDeck" else "pc"         # inconsistent case (fix)
    insert_at(raw, 140,["R903",rows[130][1],3,18,40,240.5,2,"N",""])          # blank platform
    return clean, raw

def clean_unity(raw):
    seen = set(); out = []
    for r in raw:
        r = r[:]
        if r[1] == "TEST": continue
        key = tuple(r)
        if key in seen: continue
        seen.add(key)
        if int(r[3]) > int(r[4]): continue
        if float(r[5]) < 0: continue
        if r[8] == "": continue
        r[8] = {"steamdeck": "SteamDeck", "pc": "PC"}.get(r[8], r[8])
        out.append(r)
    return out

# ─────────────────────────────────────────────────────────────
# 2. Python text game — "Cave of Echoes"  sessions.csv
# ─────────────────────────────────────────────────────────────
T_HEAD = ["sessionId","playerId","turns","validCommands","invalidCommands","roomsVisited","ending","minutesPlayed"]
def make_text():
    rows = []
    players = [code("P-") for _ in range(55)]
    sid = 1
    for p in players:
        n = random.choice([1, 2, 3, 3, 4])
        exp = 0
        for _ in range(n):
            confusion = max(0, int(random.gauss(6 - exp * 1.5, 2.5)))
            valid = max(5, int(random.gauss(38 + exp * 6, 12)))
            rooms = min(12, max(1, int(valid / 4.5 + random.gauss(0, 1))))
            if confusion >= 5:
                ending = random.choices(["Quit","Lost","Escaped"], [0.62, 0.25, 0.13])[0]
            else:
                ending = random.choices(["Quit","Lost","Escaped"], [0.15, 0.30, 0.55])[0]
            if ending == "Escaped":
                rooms = max(rooms, 9)
            turns = valid + confusion
            mins = round(turns * random.uniform(0.18, 0.32), 1)
            rows.append([f"S{sid:03d}", p, turns, valid, confusion, rooms, ending, mins])
            sid += 1
            exp += 1
    rows[88][2] += 190; rows[88][3] += 190; rows[88][7] = round(rows[88][2] * 0.25, 1)  # genuine long session
    clean = [r[:] for r in rows]; raw = [r[:] for r in rows]
    bad = raw[20][:]; bad[0] = "S900"; bad[2] = bad[3] + bad[4] + 7                       # turns != valid + invalid
    insert_at(raw, 21, bad)
    raw[44][6] = raw[44][6].lower()                                                      # inconsistent case (fix)
    insert_at(raw, 60, raw[59][:])                                                       # duplicate
    insert_at(raw, 90, ["S901", rows[80][1], 30, 26, 4, 15, "Lost", 7.5])                # rooms > 12
    insert_at(raw, 111,["S902", rows[100][1], 22, 20, 2, 5, "", 5.1])                    # blank ending
    insert_at(raw, 130,["S903", rows[120][1], 18, 15, 3, 4, "Quit", -3.0])               # negative minutes
    return clean, raw

def clean_text(raw):
    seen = set(); out = []
    for r in raw:
        r = r[:]
        key = tuple(r)
        if key in seen: continue
        seen.add(key)
        if int(r[2]) != int(r[3]) + int(r[4]): continue
        if int(r[5]) > 12: continue
        if r[6] == "": continue
        if float(r[7]) < 0: continue
        r[6] = r[6].capitalize()
        out.append(r)
    return out

# ─────────────────────────────────────────────────────────────
# 3. Fitness app — "StepUp"  workouts.csv
# ─────────────────────────────────────────────────────────────
F_HEAD = ["workoutId","userId","date","activity","durationMin","distanceKm","steps","avgHeartRate"]
def make_fitness():
    rows = []; wid = 1
    users = [code("U-") for _ in range(30)]
    start = date(2027, 2, 1)  # Monday, 4 weeks
    for u in users:
        pref = random.choice(["Walk","Walk","Run","Cycle","Gym"])
        for d in range(28):
            day = start + timedelta(days=d)
            weekend = day.weekday() >= 5
            p = 0.28 + (0.12 if weekend else 0) - (0.006 * d)  # motivation fades over 4 weeks
            if random.random() > p: continue
            act = pref if random.random() < 0.6 else random.choice(["Walk","Run","Cycle","Gym"])
            dur = max(10, int(random.gauss({"Walk":40,"Run":32,"Cycle":50,"Gym":55}[act], 10)))
            if act == "Walk":
                dist = round(dur * random.uniform(0.075, 0.095), 1); steps = int(dist * random.uniform(1250, 1400)); hr = int(random.gauss(102, 8))
            elif act == "Run":
                dist = round(dur * random.uniform(0.15, 0.2), 1); steps = int(dist * random.uniform(1000, 1150)); hr = int(random.gauss(152, 10))
            elif act == "Cycle":
                dist = round(dur * random.uniform(0.3, 0.42), 1); steps = 0; hr = int(random.gauss(132, 10))
            else:
                dist = ""; steps = int(random.gauss(1800, 500)); hr = int(random.gauss(118, 12))
            rows.append([f"W{wid:03d}", u, day.isoformat(), act, dur, dist, steps, hr])
            wid += 1
    # genuine outlier: a very long run (kept)
    for r in rows:
        if r[3] == "Run":
            r[4] = 175; r[5] = 30.4; r[6] = 33100; r[7] = 149; break
    clean = [r[:] for r in rows]; raw = [r[:] for r in rows]
    raw[12][2] = date.fromisoformat(raw[12][2]).strftime("%d/%m/%Y")      # wrong date format (fix)
    insert_at(raw, 40, raw[39][:])                                        # duplicate
    raw[70][4] = f"{raw[70][4]} mins"                                     # text in number column (fix)
    insert_at(raw, 95, ["W900", rows[90][1], "2027-02-10", "Walk", 600, 3.4, 4500, 98])  # 600 min walk, 3.4 km: impossible
    insert_at(raw, 130,["W901", rows[120][1], "2027-02-17", "Run", 30, 5.2, 5600, 0])    # heart rate 0
    insert_at(raw, 160,["W902", "TEST", "2027-02-18", "Walk", 1, 0.1, 100, 80])          # test row
    return clean, raw

def clean_fitness(raw):
    seen = set(); out = []
    for r in raw:
        r = r[:]
        if r[1] == "TEST": continue
        key = tuple(r)
        if key in seen: continue
        seen.add(key)
        if "/" in str(r[2]):
            dd, mm, yy = r[2].split("/"); r[2] = f"{yy}-{mm}-{dd}"
        if isinstance(r[4], str) and r[4].endswith(" mins"):
            r[4] = int(r[4].replace(" mins", ""))
        if int(r[7]) == 0: continue
        if r[3] == "Walk" and r[5] != "" and int(r[4]) > 300 and float(r[5]) < 10: continue
        out.append(r)
    return out

# ─────────────────────────────────────────────────────────────
# 4. Godot 2D — "Pixel Pockets"  attempts.csv
# ─────────────────────────────────────────────────────────────
G_HEAD = ["attemptId","playerId","level","coins","jumps","timeSeconds","outcome","endX"]
LEVEL_W = 3200
def make_godot():
    rows = []; aid = 1
    players = [code("P-") for _ in range(35)]
    for p in players:
        skill = random.uniform(0.5, 1.0)
        for level in (1, 2):
            cleared = False; tries = 0
            while not cleared and tries < 5:
                tries += 1
                pc = (0.75 if level == 1 else 0.42) * (0.7 + 0.3 * skill) + 0.08 * (tries - 1)
                if random.random() < pc:
                    outcome = "Cleared"; endx = LEVEL_W; cleared = True
                else:
                    outcome = random.choices(["Fell","Enemy","Quit"], [0.6, 0.3, 0.1])[0]
                    if level == 2 and outcome == "Fell" and random.random() < 0.7:
                        endx = int(random.gauss(1500, 40))      # the gap jump on level 2
                    else:
                        endx = random.randint(150, LEVEL_W - 100)
                frac = endx / LEVEL_W
                coins = int(round(25 * frac * random.uniform(0.6, 1.0)))
                jumps = int(endx / random.uniform(95, 130))
                t = round(endx / random.uniform(42, 60) / (0.8 + 0.2 * skill), 1)
                rows.append([f"A{aid:03d}", p, level, coins, jumps, t, outcome, endx])
                aid += 1
            if not cleared: break
    rows[33][5] = 612.4  # genuine outlier: long, careful attempt (kept)
    clean = [r[:] for r in rows]; raw = [r[:] for r in rows]
    insert_at(raw, 8,  ["A900", "TEST", 1, 25, 0, 1.0, "Cleared", 3200])  # test row
    insert_at(raw, 41, raw[40][:])                                         # duplicate
    raw[66][6] = raw[66][6].lower()                                        # inconsistent case (fix)
    insert_at(raw, 90, ["A901", rows[85][1], 2, 9, 20, 41.0, "Fell", 5120]) # endX beyond level width
    insert_at(raw, 118,["A902", rows[110][1], 1, "", 14, 30.2, "Enemy", 1650]) # blank coins
    return clean, raw

def clean_godot(raw):
    seen = set(); out = []
    for r in raw:
        r = r[:]
        if r[1] == "TEST": continue
        key = tuple(r)
        if key in seen: continue
        seen.add(key)
        if r[3] == "": continue
        if int(r[7]) > LEVEL_W: continue
        r[6] = r[6].capitalize()
        out.append(r)
    return out

# ─────────────────────────────────────────────────────────────
# 5. Canteen ordering app — "Canteen Click"  menu.csv + orders.csv
# ─────────────────────────────────────────────────────────────
M_HEAD = ["itemId","itemName","category","price","rating"]
MENU = [
    ["M01","Chicken wrap","Hot food",6.50,"Everyday"],
    ["M02","Beef burger","Hot food",7.00,"Occasional"],
    ["M03","Vegie pasta","Hot food",6.00,"Everyday"],
    ["M04","Sausage roll","Hot food",4.00,"Occasional"],
    ["M05","Fruit cup","Fruit",3.00,"Everyday"],
    ["M06","Banana bread","Snack",3.50,"Occasional"],
    ["M07","Popcorn","Snack",2.50,"Everyday"],
    ["M08","Water 600 mL","Drink",2.00,"Everyday"],
    ["M09","Flavoured milk","Drink",3.50,"Occasional"],
    ["M10","Sushi roll","Hot food",5.50,"Everyday"],
]
O_HEAD = ["orderId","orderDate","pickup","yearGroup","itemId","quantity"]
def make_canteen():
    rows = []; oid = 1
    days = [date(2027, 3, 1) + timedelta(days=i) for i in range(5)]   # Mon–Fri
    weights = [12, 14, 10, 16, 8, 6, 9, 13, 8, 7]
    for d in days:
        n = {0: 30, 1: 32, 2: 34, 3: 32, 4: 48}[d.weekday()]   # Friday spike
        for _ in range(n):
            item = random.choices(MENU, weights)[0][0]
            if d.weekday() == 4 and random.random() < 0.3:
                item = "M02"                                   # Friday burger special
            pickup = "Lunch" if random.random() < 0.7 else "Recess"
            yg = random.choice([7,7,8,8,9,9,10,10,11,12])
            qty = 1 if random.random() < 0.85 else 2
            rows.append([f"O{oid:03d}", d.isoformat(), pickup, yg, item, qty])
            oid += 1
    rows[150][5] = 12   # genuine outlier: bulk order for a class event (kept)
    clean = [r[:] for r in rows]; raw = [r[:] for r in rows]
    insert_at(raw, 18, ["O900", "2027-03-01", "Lunch", 8, "M99", 1])     # item not on menu
    insert_at(raw, 50, raw[49][:])                                       # duplicate
    insert_at(raw, 81, ["O901", "2027-03-03", "Recess", 9, "M05", 0])    # quantity 0
    insert_at(raw, 120,["O902", "2027-03-04", "Lunch", 13, "M01", 1])    # year 13
    insert_at(raw, 160,["O903", "2027-03-05", "", 10, "M07", 1])         # blank pickup
    raw[100][2] = raw[100][2].lower()                                    # inconsistent case (fix)
    return clean, raw

def clean_canteen(raw):
    ids = {m[0] for m in MENU}
    seen = set(); out = []
    for r in raw:
        r = r[:]
        key = tuple(r)
        if key in seen: continue
        seen.add(key)
        if r[4] not in ids: continue
        if int(r[5]) <= 0: continue
        if not (7 <= int(r[3]) <= 12): continue
        if r[2] == "": continue
        r[2] = r[2].capitalize()
        out.append(r)
    return out

# ─────────────────────────────────────────────────────────────
SETS = [
    ("coinrun3d-runs", U_HEAD, make_unity, clean_unity, "runs"),
    ("caveofechoes-sessions", T_HEAD, make_text, clean_text, "sessions"),
    ("stepup-workouts", F_HEAD, make_fitness, clean_fitness, "workouts"),
    ("pixelpockets-attempts", G_HEAD, make_godot, clean_godot, "attempts"),
    ("canteenclick-orders", O_HEAD, make_canteen, clean_canteen, "orders"),
]

def norm(rows):
    return [[str(c) for c in r] for r in rows]

for name, head, make, cleaner, table in SETS:
    clean, raw = make()
    write_csv(f"{OUT}/{name}-raw.csv", head, raw)
    write_csv(f"{OUT}/{name}-clean.csv", head, clean)
    # Verify: cleaning the RAW file as read back from disk reproduces CLEAN
    with open(f"{OUT}/{name}-raw.csv") as f:
        back = list(csv.reader(f))[1:]
    def typed(r):
        out = []
        for c in r:
            out.append(c)
        return out
    recleaned = cleaner([typed(r) for r in back])
    assert norm(recleaned) == norm(clean), f"{name}: cleaning RAW does not reproduce CLEAN"
    print(f"{name}: raw {len(raw)} rows -> clean {len(clean)} rows  (verified)")

write_csv(f"{OUT}/canteenclick-menu.csv", M_HEAD, MENU)

# SQLite database with every clean table + the menu (for lessons 21–23)
db = f"{OUT}/analysing-data.db"
if os.path.exists(db): os.remove(db)
con = sqlite3.connect(db)
schemas = {
    "runs": "runId TEXT PRIMARY KEY, playerId TEXT, level INTEGER, coinsCollected INTEGER, coinsAvailable INTEGER, timeSeconds REAL, deaths INTEGER, completed TEXT, platform TEXT",
    "sessions": "sessionId TEXT PRIMARY KEY, playerId TEXT, turns INTEGER, validCommands INTEGER, invalidCommands INTEGER, roomsVisited INTEGER, ending TEXT, minutesPlayed REAL",
    "workouts": "workoutId TEXT PRIMARY KEY, userId TEXT, date TEXT, activity TEXT, durationMin INTEGER, distanceKm REAL, steps INTEGER, avgHeartRate INTEGER",
    "attempts": "attemptId TEXT PRIMARY KEY, playerId TEXT, level INTEGER, coins INTEGER, jumps INTEGER, timeSeconds REAL, outcome TEXT, endX INTEGER",
    "menu": "itemId TEXT PRIMARY KEY, itemName TEXT, category TEXT, price REAL, rating TEXT",
    "orders": "orderId TEXT PRIMARY KEY, orderDate TEXT, pickup TEXT, yearGroup INTEGER, itemId TEXT REFERENCES menu(itemId), quantity INTEGER",
}
for t, s in schemas.items():
    con.execute(f"CREATE TABLE {t} ({s})")
def load(table, path):
    with open(path) as f:
        r = list(csv.reader(f)); h = r[0]
        rows = [[None if c == "" else c for c in row] for row in r[1:]]
        con.executemany(f"INSERT INTO {table} VALUES ({','.join('?'*len(h))})", rows)
for name, head, make, cleaner, table in SETS:
    load(table, f"{OUT}/{name}-clean.csv")
load("menu", f"{OUT}/canteenclick-menu.csv")
con.commit(); con.close()
print("db written")
