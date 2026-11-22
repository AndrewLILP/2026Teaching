import sys, re, subprocess, tempfile, os
from html.parser import HTMLParser

VOID = {"meta","link","br","img","input","hr","area","base","col","embed","source","track","wbr","path"}

class Balance(HTMLParser):
    def __init__(s):
        super().__init__(); s.stack=[]; s.errors=[]; s.scripts=[]; s.in_script=False; s.ids={}
        s.mcq=[]; s.cur=None; s.cur_opt=None; s.sort=[]
    def handle_starttag(s, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            s.ids[a["id"]] = s.ids.get(a["id"], 0) + 1
        if tag == "script" and "src" not in a: s.in_script = True
        if "class" in a and "mcq-card" in a["class"].split():
            s.cur = {"q": a.get("data-q"), "correct": a.get("data-correct"), "opts": {}, "fb": {k[-1].upper(): v for k, v in a.items() if k.startswith("data-feedback-")}}
            s.mcq.append(s.cur)
        if tag == "button" and "class" in a and "mcq-option" in a["class"].split():
            s.cur_opt = a.get("data-idx"); s.cur["opts"][s.cur_opt] = ""
        if tag == "li" and "class" in a and "sort-item" in a["class"].split():
            s.sort.append(a.get("data-answer"))
        if tag not in VOID: s.stack.append((tag, s.getpos()))
    def handle_startendtag(s, tag, attrs): pass
    def handle_endtag(s, tag):
        if tag in VOID: return
        if tag == "script": s.in_script = False
        if tag == "button": s.cur_opt = None
        if not s.stack or s.stack[-1][0] != tag:
            s.errors.append(f"mismatched </{tag}> at {s.getpos()} (open: {s.stack[-1] if s.stack else None})"); return
        s.stack.pop()
    def handle_data(s, d):
        if s.in_script: s.scripts.append(d)
        if s.cur_opt: s.cur["opts"][s.cur_opt] += d

def strip_letter(t):
    t = t.strip()
    return re.sub(r"^[A-D]", "", t, count=1).strip()

ok = True
for path in sys.argv[1:]:
    print(f"\n=== {path}")
    p = Balance(); p.feed(open(path, encoding="utf-8").read())
    if p.errors or p.stack:
        ok = False; print("TAG BALANCE FAIL", p.errors[:5], p.stack[-5:])
    else: print("tag balance: ok")
    dup = [k for k, v in p.ids.items() if v > 1]
    print("duplicate ids:", dup or "none");  ok &= not dup
    for i, sc in enumerate(p.scripts):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f: f.write(sc)
        r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True); os.unlink(f.name)
        print(f"inline script {i+1} node --check:", "ok" if r.returncode == 0 else r.stderr); ok &= r.returncode == 0
    # MCQ audits
    letters = []; longest = 0; ratios = []
    for c in p.mcq:
        opts = {k: strip_letter(v) for k, v in c["opts"].items()}
        assert c["correct"] in opts, f"Q{c['q']} correct letter missing"
        fb_ok = sum(1 for k, v in c["fb"].items() if v.startswith("✓")) == 1 and c["fb"][c["correct"]].startswith("✓")
        if not fb_ok: ok = False; print(f"Q{c['q']}: feedback ✓ marker mismatch")
        if len(opts) != 4: ok = False; print(f"Q{c['q']}: {len(opts)} options")
        letters.append(c["correct"])
        lens = {k: len(v) for k, v in opts.items()}
        cl = lens[c["correct"]]; others = [v for k, v in lens.items() if k != c["correct"]]
        if cl > max(others): longest += 1
        ratios.append(cl / (sum(others) / len(others)))
    tiers = [letters[0:2], letters[2:4], letters[4:6]]
    print("correct letters:", letters, "| per-tier max repeat:", [max(t.count(x) for x in t) for t in tiers])
    print(f"correct uniquely longest: {longest}/{len(p.mcq)} ({100*longest/len(p.mcq):.0f}%, limit 20%)")
    ratio = sum(ratios) / len(ratios)
    print(f"length-bias ratio (correct / mean distractor): {ratio:.3f} (target <= 0.94 ... checking per-question max {max(ratios):.2f})")
    ok &= longest / len(p.mcq) <= 0.2 and ratio <= 0.94
    print("sort answers:", p.sort)
print("\nOVERALL:", "PASS" if ok else "CHECK OUTPUT")
