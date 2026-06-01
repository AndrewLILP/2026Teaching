# CD26 — Sprite Atlas: Photoshop Instructions

## New chat prompt

Paste this entire document into a new chat to get started.

---

## Project context

I am building a Unity 6.3 LTS game set in Australia in 1992. It combines arcade-style driving with financial education. The game uses **UI Toolkit** for its HUD.

I need to create a **sprite atlas** in Photoshop containing note and coin icons for the in-game cash display. The HUD shows the player's current money using a visual note icon alongside a cash counter for money collection.

A key feature: the **$100 note changes mid-game**. In 1992 it is a grey paper note called "The Grey Nurse" (shark illustration). When the game progresses to 1996, it transitions to a green polymer note called "The Avocado". This transition is a meaningful moment in the game — the world literally changes around the player.

The art style is a **fun parody of Australian currency** — bright, flat, charming. No portraits on the notes. Each note has a simple iconic illustration and its slang nickname.

---

## What I want to achieve in this session

1. Set up a well-organised Photoshop document using **Artboards** (one per sprite)
2. Design and paint each of the 13 sprites to spec
3. Export individual PNGs ready for Unity import
4. Learn good Photoshop habits along the way: artboards, layer groups, smart objects, export workflow

---

## Sprite specifications

### Notes (13 sprites total — 12 note variants + see coins below)

All notes: **128 × 64 px** canvas per artboard  
Format: PNG-24 with transparency  
Style: Flat, no gradients, no drop shadows. Simple bold shapes. The design reference is a charming parody of a real banknote — coloured background, denomination number, nickname text, and one central illustration.

| Sprite name | Background colour | Nickname | Central illustration |
|---|---|---|---|
| `note_5` | `#6B46A0` purple | "The Prawn" | King prawn silhouette — curved body, antennae, tail fan |
| `note_10` | `#185EA0` blue | "The Blue Swimmer" | Crab — round body, stalked eyes, two big claws, six legs |
| `note_20` | `#B02A20` red | "The Lobster" | Lobster — elongated body, two big front claws, tail fan, antennae |
| `note_50` | `#A07808` gold | "The Pineapple" | Pineapple — oval body with diamond crosshatch, spiky leaves on top |
| `note_100_paper` | `#6A7480` grey | "The Grey Nurse" | Shark — streamlined body, dorsal fin, tail fin, eye |
| `note_100_poly` | `#296028` green | "The Avocado" | Avocado — pear shape, inner lighter flesh, round brown stone/pit |

### Coins (7 sprites)

All coins: **64 × 64 px** canvas per artboard  
Shape: Circle clipped to the artboard (the corners are transparent)  
Silver coins: base colour `#828C96`, border `#9AA4AE`  
Gold coins: base colour `#C09010`, border `#D4A828`  
50c is dodecagonal (12-sided polygon), not a circle.

| Sprite name | Type | Nickname | Illustration |
|---|---|---|---|
| `coin_5c` | Silver circle (small) | "The Shrimp" | Tiny prawn/shrimp — same curved shape as note_5 but miniature |
| `coin_10c` | Silver circle | "The Lyrebird" | Lyrebird — oval body, round head, distinctive lyre-shaped tail fans |
| `coin_20c` | Silver circle | "The Platty" | Platypus — oval body, duck bill left, beaver tail right, small eye |
| `coin_50c` | Silver 12-sided | "The Frisbee" | Simplified map of Australia outline + 3 small star dots (Southern Cross) |
| `coin_1` | Gold circle | "The Roo" | Kangaroo silhouette — hunched body, round head, long tail, hind legs |
| `coin_2` | Gold circle (largest) | "Gold Coin" | Just the text "$2" centred, with "GOLD COIN" in small caps below |

---

## Photoshop document setup

### Step 1 — New document with artboards

- File → New
- Width: `1400 px`, Height: `800 px`
- Resolution: `72 ppi` (screen work, not print)
- Colour mode: `RGB Colour, 8 bit`
- Background: `Transparent`
- Check **Artboards** checkbox before clicking Create

### Step 2 — Create artboards for notes

Add artboards sized 128 × 64 px each. Arrange them in two rows:
- Row 1: note_5, note_10, note_20
- Row 2: note_50, note_100_paper, note_100_poly

In the Artboard tool (A), right-click an artboard to duplicate it — faster than creating from scratch.

Name each artboard exactly as the sprite name in the table above (e.g. `note_20`). This becomes the filename on export.

### Step 3 — Create artboards for coins

Add a third row with 7 coin artboards, all 64 × 64 px:
coin_5c, coin_10c, coin_20c, coin_50c, coin_1, coin_2

---

## Layer structure (per artboard)

Use this layer group structure inside every note artboard:

```
[Artboard: note_20]
  └── Group: background
        └── Shape: bg-rect  (fill entire artboard with note colour, no stroke)
  └── Group: inner-border
        └── Shape: border-rect  (0.5px white stroke, no fill, inset 3px from edges, low opacity ~20%)
  └── Group: illustration
        └── [your shape layers for the central image]
  └── Group: type
        └── Text: denomination  (e.g. "$20", white, large, bold, top-left)
        └── Text: nickname  (e.g. "THE LOBSTER", white, small caps, bottom-left)
  └── Group: bank-text
        └── Text: "RESERVE BANK OF CD26"  (white, tiny, very low opacity, bottom right)
```

For coin artboards, simplify to:

```
[Artboard: coin_1]
  └── Group: background
        └── Shape: coin-circle  (fill with gold colour, circular)
  └── Group: inner-ring
        └── Shape: ring  (thin white stroke circle, inset 4px, low opacity)
  └── Group: illustration
        └── [kangaroo shape layers]
```

---

## Drawing the illustrations

### General approach

Work at **400% zoom** for the illustrations. Use the **Pen tool (P)** for clean silhouette shapes. Keep everything as **Shape layers** (not pixel layers) so they stay crisp if you scale later.

Use `rgba(255, 255, 255, 0.75)` (white at 75% opacity) for the main illustration stroke, and `rgba(255, 255, 255, 0.20)` for body fill areas. This gives the "etched into the note" look.

### Tips per illustration

**Prawn (note_5 / coin_5c)**  
Start with a curved C-shape for the body using the Pen tool. Add a small circle for the head. Draw two thin curved lines from the head for antennae. Three short lines from the underside for legs. A small fan of three lines at the tail.

**Blue Swimmer crab (note_10)**  
Draw a horizontal ellipse for the body. Two triangular claws on the left and right edges. Three short lines below each side for legs. Two thin lines rising from the top with small circles at the end for stalked eyes.

**Lobster (note_20)**  
Vertical rounded rectangle for the body. Add a larger ellipse overlapping the top for the carapace/head. Two antennae lines from the head going up and outward. Two larger triangular claws extending left and right from the upper body. A fan of three lines at the bottom for the tail.

**Pineapple (note_50)**  
Draw a vertical ellipse for the body. Inside it, draw a diamond crosshatch: 3 diagonal lines in each direction, clipped to the ellipse using a Clipping Mask. Add a small horizontal ellipse near the top of the main ellipse for the crown. Five short lines radiating upward from the crown for the spiky leaves.

**Grey Nurse shark (note_100_paper)**  
Draw a long horizontal torpedo shape — pointed at the right (nose), wider in the middle, tapering to a forked tail on the left. Add a triangle dorsal fin on top. A smaller triangle pectoral fin on the underside. A small circle for the eye near the nose. Two short vertical lines for gill slits.

**Avocado (note_100_poly)**  
Draw a pear/teardrop shape — narrow at top, wider at bottom. Inside it, draw a slightly smaller version of the same shape in a slightly lighter fill (the flesh). Inside that, draw an oval for the stone/pit. Optionally add a tiny dollar sign inside the pit.

**Platypus (coin_20c)**  
Horizontal oval for the body. A wide flat duck bill extending left. A wide flat beaver tail extending right. A small circle for the eye near the bill. Two short lines below for feet.

**Lyrebird (coin_10c)**  
Small oval for the body. Small circle for the head. Short beak line. Two curved arcs sweeping outward and down from the tail area — the distinctive lyre shape. A single vertical line downward for the central tail feather.

**Kangaroo (coin_1)**  
Hunched oval for the body. Smaller oval for the head. One pointed ear. A long sweeping curved line for the tail going down and back. Two thick lines for the powerful hind legs. Small thin arms.

---

## Exporting from Photoshop

### Method — Export As (recommended)

1. File → Export → Export As
2. Set Format: `PNG`
3. Check `Transparency` box
4. Uncheck `Metadata` (keeps file clean)
5. Click `Export All` — Photoshop exports one PNG per artboard, named after the artboard

All files land in the folder you choose. Names will match exactly: `note_5.png`, `coin_1.png` etc.

### Alternative — Generator (automatic on save)

Add `.png` to each artboard name (e.g. `note_5.png`) and enable **File → Generate → Image Assets**. Photoshop auto-exports PNGs every time you save. Useful for iteration.

---

## Unity import steps

After exporting, do the following in Unity:

### 1 — Import sprites

Drag all exported PNGs into `Assets/Sprites/Currency/` in the Project panel.

### 2 — Set texture type

Select all imported sprites → In the Inspector:
- Texture Type: `Sprite (2D and UI)`
- Sprite Mode: `Single`
- Pixels Per Unit: `100`
- Filter Mode: `Point (no filter)` ← important for crisp pixel-art feel
- Compression: `None` or `Lossless`
- Click `Apply`

### 3 — Create the Sprite Atlas

Right-click in the Project panel → Create → 2D → Sprite Atlas  
Name it `NotesCoinsSpriteAtlas`

In the Inspector:
- Type: `Master`
- Include in Build: checked
- Allow Rotation: **unchecked** (prevents Unity from rotating your notes sideways to save space)
- Tight Packing: checked
- Padding: `4`

Drag all 13 sprites into the **Objects for Packing** list.

Click **Pack Preview** to verify everything fits cleanly.

### 4 — Reference in HUDController.cs

In the Inspector for `HUDController`, you'll see serialised sprite fields. Drag each named sprite from the atlas into its corresponding slot:
- Note 5 Sprite → `note_5`
- Note 10 Sprite → `note_10`
- (etc.)
- Note 100 Paper → `note_100_paper`
- Note 100 Polymer → `note_100_poly`

---

## Photoshop skills you will practise

| Skill | Where it appears |
|---|---|
| Artboards | Setting up the document, one artboard per sprite |
| Pen tool (vector shapes) | Drawing all illustrations as shape layers |
| Clipping masks | Constraining the pineapple crosshatch to the ellipse |
| Layer groups | Organising background / illustration / type per artboard |
| Opacity on layers | The white illustration overlay effect |
| Type tool + small caps | Denomination numbers and nicknames |
| Export As workflow | Exporting all artboards as individual named PNGs |
| Colour swatches | Saving the 6 note background colours as a swatch set for consistency |

---

## Colour swatches to save at session start

Create these as a named swatch group called **CD26 Notes** at the start of the session:

| Name | Hex |
|---|---|
| Note 5 Purple | `#6B46A0` |
| Note 10 Blue | `#185EA0` |
| Note 20 Red | `#B02A20` |
| Note 50 Gold | `#A07808` |
| Note 100 Paper Grey | `#6A7480` |
| Note 100 Polymer Green | `#296028` |
| Coin Silver Base | `#828C96` |
| Coin Silver Border | `#9AA4AE` |
| Coin Gold Base | `#C09010` |
| Coin Gold Border | `#D4A828` |
| Illustration White | `#FFFFFF` (use at 75% opacity on layers) |

---

## Suggested session order

1. Set up document, artboards, colour swatches
2. Complete `note_20` (The Lobster) first — it's the most iconic and mid-complexity
3. Complete all remaining notes
4. Complete `coin_1` (The Roo) — establishes the coin style
5. Complete remaining coins
6. Export all, import to Unity, create the SpriteAtlas
7. Wire up in HUDController

---

## Questions to ask Claude in the new chat

- "How do I set up artboards in Photoshop for sprite work?"
- "Show me how to use the Pen tool to draw a clean lobster silhouette at 128×64px"
- "How do I create a clipping mask for the pineapple crosshatch pattern?"
- "What's the best Export As workflow for Unity sprites?"
- "How do I create and save a colour swatch group?"
- "Review my lobster shape layer and suggest improvements"
- "How do I set up Unity's SpriteAtlas with these exported PNGs?"
