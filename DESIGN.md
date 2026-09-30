---
name: Filip Stefanovski
description: Product Developer portfolio staged as a product launch, black ground and one neon green.
colors:
  stage: "#0a0a0a"
  stage-raised: "#151515"
  light: "#f2f2ee"
  dim: "rgb(242 242 238 / 0.62)"
  line-stage: "rgb(242 242 238 / 0.14)"
  accent: "#39ff14"
  ink: "#0a0a0a"
  ink-soft: "rgb(10 10 10 / 0.72)"
  line: "rgb(10 10 10 / 0.18)"
  paper: "#f2f2ee"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(88px, 15vw, 248px)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 75, \"opsz\" 96"
  headline:
    fontFamily: "Bricolage Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(56px, 7vw, 104px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 75, \"opsz\" 96"
  title:
    fontFamily: "Bricolage Grotesque, Arial Narrow, sans-serif"
    fontSize: "clamp(30px, 2.6vw, 40px)"
    fontWeight: 800
    lineHeight: 0.9
    fontVariation: "\"wdth\" 75"
  lede:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(20px, 2vw, 29px)"
    fontWeight: 450
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  none: "0px"
  focus: "2px"
  screen: "8px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 3.2vw, 44px)"
  max: "1440px"
  column-gap: "24px"
  hairline-row: "22px"
  segment: "clamp(96px, 16vh, 200px)"
  section: "clamp(140px, 22vh, 240px)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "15px 22px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.light}"
    textColor: "{colors.ink}"
  button-close:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.accent}"
    rounded: "{rounded.none}"
    padding: "20px 30px"
  button-close-hover:
    backgroundColor: "{colors.light}"
    textColor: "{colors.ink}"
  link-live:
    textColor: "{colors.light}"
    padding: "6px 0"
  link-live-hover:
    textColor: "{colors.accent}"
  link-quiet:
    textColor: "{colors.dim}"
    padding: "10px 0"
  link-quiet-hover:
    textColor: "{colors.light}"
  stage-counter:
    textColor: "{colors.accent}"
    typography: "{typography.headline}"
  surface-close:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
---

# Design System: Filip Stefanovski

## Overview

**Creative North Star: "The Keynote Stage"**

Every surface is a dark auditorium and each product walks on like a launch: one thing lit, one sentence says what it is, then the house lights stay down while the next one comes up. The ground is near-black everywhere, type is a warm off-white, and a single neon green marks whatever is live right now. Nothing is boxed into cards; products stand on the stage in a soft off-white spotlight with their own screen shadows.

The density is theatrical rather than dense. Condensed uppercase display type fills the width at enormous sizes, the supporting copy is short and set in the same family at text widths, and the spacing between acts is generous (100 to 240px). Secondary information lives in hairline-ruled rows, never in panels.

The neon is not decoration. It lights the lanyard and badge, the stage counter, the primary action, the live-link underline, and finally floods the whole closing section, where the colours invert: black type and a black button on green.

**Key Characteristics:**
- Near-black ground, off-white type, one neon green for live things only.
- One variable family, Bricolage Grotesque: condensed 800 uppercase for names and titles, text widths for everything else.
- Soft radial off-white spotlight behind whatever is on stage; no boxes, no cards.
- Square buttons, hairline rules, 8px corners only on product screens.
- Motion is a light coming up: rise, brighten, settle on one long ease-out.

## Colors

A black room with one neon light; everything else is off-white at full or dimmed strength.

### Primary
- **Live Neon** (`accent`): the only colour. Lanyard straps and badge card, the stage counter digit, primary buttons, the underline on live links, text selection, focus rings, the caret, and the drenched closing section. If it is green, it is live or it is the action.

### Neutral
- **Stage Black** (`stage`): the ground of every page, header, section and case study. Also the browser theme colour.
- **Raised Stage** (`stage-raised`): reserved one step above the ground for the rare raised surface.
- **House Light** (`light`): headings, primary text, the giant hero name, button hover fill.
- **Dimmed House Light** (`dim`): secondary copy, roles, labels, captions, quiet nav links.
- **Stage Hairline** (`line-stage`): every rule on the dark ground: row dividers, section tops, list borders, the header underline.
- **Ink** (`ink`): text and the button fill on the neon close; badge card type.
- **Soft Ink** (`ink-soft`) and **Ink Hairline** (`line`): body copy and the footer rule on the neon close.
- **Paper** (`paper`): the badge's keyboard spin control only. Illustrative product screens keep their own neutral and product hues and are not part of this palette.

### Named Rules
**The Live Light Rule.** Neon marks what is live or the one action on screen. It never colours body copy, headings on the dark ground, or decoration.

**The Inversion Rule.** On the neon close (`data-surface="neon"`) roles swap: ink for type and buttons, ink focus rings, ink selection with neon text.

## Typography

**Display Font:** Bricolage Grotesque, condensed (with Arial Narrow fallback)
**Body Font:** Bricolage Grotesque, text widths (with system-ui fallback)

**Character:** One variable family carries the whole voice. At weight 800, width 75 and uppercase it is a marquee; at weight 400 to 650 and normal width it is a plain, human speaker. Figures are tabular site-wide.

### Hierarchy
- **Display** (800, width 75, uppercase, clamp(88px, 15vw, 248px), 0.82): project names on stage. The close heading (clamp(72px, 14vw, 232px)) and case-study title (clamp(88px, 17vw, 280px), 0.8) sit on the same voice. The hero name is set edge to edge by SVG text length.
- **Headline** (800, width 75, uppercase, clamp(56px, 7vw, 104px), 0.86): section titles such as Also and About; the next-project link runs larger (clamp(64px, 10vw, 160px)).
- **Title** (800, width 75, uppercase, clamp(30px, 2.6vw, 40px), 0.9): case-study block titles in the left column; decision titles at clamp(34px, 3.2vw, 48px).
- **Lede** (450, clamp(20px, 2vw, 29px), 1.25, balanced, 32 to 34ch): the one sentence under a product name, the About lead, the case lede and problem statement (up to clamp(26px, 2.8vw, 42px)).
- **Body** (400, 17px, 1.55, max 60ch): paragraphs, usually in dim.
- **Label** (600, 13.5 to 15px): roles, fact terms (dim, 400), fact values (600, light), nav links (550).

### Named Rules
**The One Family Rule.** Everything on the site is Bricolage Grotesque. Serif and monospace stacks exist only inside illustrative product screens.

**The Marquee Rule.** Condensed type is always 800, width 75, uppercase, and line-height at or below 0.9. Never set it in sentence case or at text sizes.

## Layout

A centred container (max 1440px) with a fluid gutter (clamp(16px, 3.2vw, 44px)). Product acts are centred single columns: name, one line, the lit product, then a foot row with three hairline "built" items on the left and actions stacked at the right. Supporting sections use a 3 : 9 column split from 900px, heading left, content right, 24px column gap.

Rhythm between acts is large and viewport-relative: segments open with clamp(96px, 16vh, 200px), sections with up to clamp(140px, 22vh, 240px). Inside rows the rhythm tightens to 14 to 22px vertical padding against hairlines.

Responsive: below 900px foot rows and splits collapse to one column and actions align left; below 640px the hero corner text stacks and the name stacks as FILIP / STEFANOVSKI; below 560px the header drops its role; the stage counter shows only from 1200px, where the gutter can hold it.

## Elevation & Depth

Depth is light, not layers. The page is flat black; what sits on stage is lifted by a soft off-white radial spotlight behind it and by the product screens' own drop shadows. There are no glows, no coloured shadows and no elevated panels.

### Shadow Vocabulary
- **Screen edge** (`box-shadow: 0 0 0 1px rgb(244 244 242 / 0.1)`): a hairline that separates a product screen from the black.
- **Screen drop** (`box-shadow: 0 50px 90px -40px rgb(0 0 0 / 0.9), 0 18px 36px -24px rgb(0 0 0 / 0.7)`): the long fall shadow under product screens on stage.
- **Spotlight** (`radial-gradient(ellipse 46% 50% at 50% 48%, rgb(244 244 242 / 0.26), rgb(244 244 242 / 0.08) 45%, transparent 72%)`): behind each product on the home stage; case pages use a dimmer pass (0.11 / 0.03).

### Named Rules
**The Spotlight Rule.** Only the thing on stage is lit. One spotlight per product, off-white, never green.

## Shapes

Square by default. Buttons, rows, sections and the counter have no radius. Product screens take a gentle 8px corner so they read as devices, not UI chrome. Focus rings carry a 2px corner. Fully round pills appear only on the badge (its role chips and keyboard spin control). Rules are 1px hairlines; live links use a 1.5px neon underline. Icons are a small authored set of arrows: 16px box, 1.5px stroke, square caps.

## Components

### Buttons
Blunt, square and loud, one per context.
- **Shape:** square corners (0px).
- **Primary (on stage):** neon fill, ink label, 650 weight at 15px, 15px 22px padding, trailing arrow.
- **Close action (on neon):** ink fill, neon label, 700 weight at clamp(17px, 1.4vw, 20px), 20px 30px padding.
- **Hover / Focus:** fill swaps to house light (180ms), the arrow nudges 3 to 4px in its direction (260ms ease-out), press sinks 1px. Focus is a 2px neon outline at 4px offset (ink on the neon close).

### Links
- **Live link:** light text, 600 weight, 1.5px neon bottom border; hover turns the text neon. Used for LinkedIn and external product URLs on case pages.
- **Quiet link:** dim text, hover to light (160ms). Used for nav, back links, and product URL links on stage (hover adds a neon underline).
- **Next project:** the product name in condensed headline; hover turns it neon and slides the arrow 10px.

### Hairline Rows
The stand-in for cards. Lists of facts, "built" items, Also entries and contributions sit between 1px stage hairlines with 14 to 22px vertical padding: term in dim 13.5px, value in 600 light.

### Navigation
Case and 404 pages carry a slim header: condensed name at 26px (neon on hover) with the dim role beside it, quiet links at 15px / 550 on the right, LinkedIn in full light, a single hairline underneath. The home page has no header; its hero corners do the job.

### Stage Counter (signature)
A fixed rail in the left gutter showing which product is on stage: a condensed neon two-digit number (30px) over a dim "/04" (12px, 600, tabular). Fades and slides in over 300ms when a segment crosses the reading line. Decorative and hidden below 1200px.

### ID Badge (signature)
A draggable physics badge on a neon V lanyard: neon card, ink condensed name, ink and outline pills, a glassy sleeve and a metal clip. The only place pills and glass appear.

### Neon Close (signature)
The footer floods with neon: centred condensed heading, one soft-ink sentence (34ch), one ink button, and a base row of soft-ink facts above an ink hairline.

## Do's and Don'ts

### Do:
- **Do** keep every page on the black stage with off-white type; dim secondary text to 62%, never to grey hex values.
- **Do** reserve neon for live state and the single action, and flood it only at the close.
- **Do** light products with the off-white radial spotlight and give screens 8px corners with the screen edge and drop shadows.
- **Do** set names and titles in condensed 800 uppercase at 0.9 line-height or tighter; everything else at text widths.
- **Do** use hairline rows for supporting information and square buttons with trailing arrows for actions.
- **Do** bring products in with the light-up motion (rise 48px, brightness 0.3 to 1, 1200ms on cubic-bezier(0.16, 1, 0.3, 1)) and respect reduced motion.

### Don't:
- **Don't** put glows, text shadows or gradients on type; the only gradients are the spotlight and the badge's physical materials.
- **Don't** introduce a second accent colour or tint the spotlight green.
- **Don't** box work into cards or panels.
- **Don't** add serif, monospace or italic type outside illustrative product screens.
- **Don't** use pills or rounded buttons outside the badge.
