import type { IllustrationId } from "@/content/site";
import s from "./illustrations.module.css";

/**
 * Illustrative product screens rendered in code. Every name and figure is synthetic.
 * They show interface patterns, never real product data. Product UIs use their own
 * neutral hues; the site's vermilion never appears inside them.
 */

function Note({ children = "Illustrative, synthetic data" }: { children?: string }) {
  return <span className={s.note}>{children}</span>;
}

export function Q4Answer() {
  return (
    <div className={`${s.screen} ${s.q4}`} role="img" aria-label="Illustration of a research answer with inline source citations, using synthetic companies and figures.">
      <div className={s.bar}>
        <span className={s.brand}>Q4</span>
        <span className={s.barLabel}>Research</span>
        <span className={s.select}>Model</span>
        <Note />
      </div>
      <div className={s.q4Body}>
        <p className={s.question}>Compare revenue growth for Company A and Company B since 2022.</p>
        <p className={s.answer}>
          Both grew revenue. Company A added 12.4% over the period<sup>1</sup>, while Company B grew faster from a smaller
          base, up 19.1%<sup>2</sup>.
        </p>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>2022</th>
              <th>2025</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Company A</td>
              <td>41,200</td>
              <td>46,310</td>
              <td className={s.pos}>+12.4%</td>
            </tr>
            <tr>
              <td>Company B</td>
              <td>12,050</td>
              <td>14,350</td>
              <td className={s.pos}>+19.1%</td>
            </tr>
          </tbody>
        </table>
        <div className={s.sources}>
          <span>
            <b>1</b> Annual report 2025, p. 42
          </span>
          <span>
            <b>2</b> Q4 2025 filing, p. 17
          </span>
        </div>
      </div>
    </div>
  );
}

export function Q4Source() {
  return (
    <div className={`${s.screen} ${s.source}`} role="img" aria-label="Illustration of a source document page with the cited sentence highlighted.">
      <div className={s.sourceHead}>
        <span>Annual report 2025</span>
        <span>p. 42</span>
      </div>
      <p className={s.docText}>Operating income for the year increased on higher financing and investment income.</p>
      <p className={s.highlight}>Revenue for the year amounted to 46,310 million, compared with 41,200 million in 2022.</p>
      <p className={s.docText}>The Board has recommended a final dividend, subject to approval.</p>
    </div>
  );
}

export function Q4Sheet() {
  const rows: [string, string, string, string][] = [
    ["Revenue", "41,200", "43,870", "46,310"],
    ["Cost of sales", "-24,100", "-25,530", "-26,720"],
    ["Gross profit", "17,100", "18,340", "19,590"],
    ["Net income", "7,410", "8,020", "8,690"],
  ];
  return (
    <div className={`${s.screen} ${s.sheet}`} role="img" aria-label="Illustration of a spreadsheet model built from a research answer, using synthetic figures.">
      <div className={s.bar}>
        <span className={s.barLabel}>Model, Company A, FY2023 to FY2025</span>
        <Note />
      </div>
      <div className={s.fx}>
        <b>fx</b> =B2+B3
      </div>
      <div className={s.grid}>
        <span className={s.gh} />
        {["A", "B", "C", "D"].map((c) => (
          <span key={c} className={s.gh}>
            {c}
          </span>
        ))}
        {rows.map((r, i) => (
          <div key={r[0]} className={s.gRow}>
            <span className={s.gh}>{i + 2}</span>
            {r.map((cell, j) => (
              <span key={j} className={`${s.cell} ${j === 0 ? s.cellLabel : ""} ${i === 2 && j === 1 ? s.cellActive : ""}`}>
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const board = {
  short: [
    { t: "Export flow", o: "AK", st: "In progress", d: "Oct 14" },
    { t: "Search filters", o: "MR", st: "Review", d: "Oct 09" },
    { t: "Settings page", o: "FS", st: "Planned", d: "Oct 21" },
  ],
  long: [
    { t: "Usage dashboard", o: "LT", st: "Planned", d: "Q1" },
    { t: "Team invites", o: "FS", st: "Scoping", d: "Q1" },
  ],
};

export function InternalBoard() {
  return (
    <div className={`${s.screen} ${s.board}`} role="img" aria-label="Illustration of a features board with owners, statuses and deadlines, split into short term and long term columns. Synthetic items.">
      <div className={s.bar}>
        <span className={s.brand}>Q4</span>
        <span className={s.barLabel}>Features</span>
        <Note />
      </div>
      <div className={s.cols}>
        {(["short", "long"] as const).map((k) => (
          <div key={k} className={s.col}>
            <div className={s.colHead}>
              {k === "short" ? "Short term" : "Long term"} <em>{board[k].length}</em>
            </div>
            {board[k].map((c) => (
              <div key={c.t} className={s.card}>
                <div className={s.cardTitle}>{c.t}</div>
                <div className={s.cardMeta}>
                  <span className={s.owner}>{c.o}</span>
                  <span className={s.status} data-state={c.st === "In progress" ? "on" : "off"}>
                    {c.st}
                  </span>
                  <span className={s.due}>{c.d}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InternalOverview() {
  const goals: [string, number][] = [
    ["Ship export flow", 72],
    ["Pilot onboarding", 45],
    ["Docs refresh", 88],
  ];
  return (
    <div className={s.phone} role="img" aria-label="Illustration of the overview on a phone: goals progress and a revenue card with a USD and SAR switch. Figures are hidden. Synthetic content.">
      <div className={s.phoneInner}>
        <div className={s.phoneTop}>
          <b>Overview</b>
          <span className={s.switch}>
            <span>USD</span>
            <span className={s.switchOn}>SAR</span>
          </span>
        </div>
        <div className={s.metric}>
          <span>Revenue</span>
          <b>SAR ••••••</b>
          <em>Figures hidden</em>
        </div>
        <div className={s.goals}>
          <span className={s.phoneLabel}>Goals</span>
          {goals.map(([label, v]) => (
            <div key={label} className={s.goal}>
              <span className={s.goalRow}>
                <span>{label}</span>
                <span>{v}%</span>
              </span>
              <span className={s.goalBar}>
                <i style={{ width: `${v}%` }} />
              </span>
            </div>
          ))}
        </div>
        <div className={s.meeting}>
          <span className={s.phoneLabel}>Next meeting</span>
          <b>Weekly sync</b>
          <span>Monday, 10:00. Recap attached.</span>
        </div>
      </div>
    </div>
  );
}

export function SmccPublic() {
  return (
    <div className={`${s.screen} ${s.smcc}`} role="img" aria-label="Illustration of a chamber of commerce public page with illustrative content.">
      <div className={s.smccNav}>
        <b>SMCC</b>
        <span className={s.navLinks}>
          <span>About</span>
          <span>Members</span>
          <span>Events</span>
          <span>News</span>
        </span>
        <span className={s.lang}>EN</span>
        <span className={s.join}>Become a member</span>
      </div>
      <div className={s.smccHero}>
        <p className={s.smccH1}>Where member companies meet.</p>
        <p className={s.smccSub}>Events, introductions and support for businesses in the chamber&apos;s network.</p>
      </div>
      <div className={s.smccRow}>
        {[
          ["12 Nov", "Member breakfast"],
          ["28 Nov", "Trade briefing"],
          ["04 Dec", "Annual reception"],
        ].map(([d, t]) => (
          <div key={t} className={s.smccTile}>
            <span className={s.tileDate}>{d}</span>
            <span className={s.tileTitle}>{t}</span>
          </div>
        ))}
      </div>
      <span className={s.smccNote}>
        <Note>Illustrative content</Note>
      </span>
    </div>
  );
}

export function SmccMember() {
  return (
    <div className={`${s.screen} ${s.member}`} role="img" aria-label="Illustration of the member sign in form and a welcome email, illustrative content.">
      <b className={s.memberTitle}>Member sign in</b>
      <div className={s.field}>
        <span>Email</span>
        <i>name@company.com</i>
      </div>
      <div className={s.field}>
        <span>Password</span>
        <i>••••••••••</i>
      </div>
      <span className={s.btn}>Sign in</span>
      <div className={s.email}>
        <span className={s.emailHead}>Welcome to the chamber</span>
        <span className={s.emailBody}>Your membership is active. Here is how to get the most from it.</span>
      </div>
    </div>
  );
}

const map: Record<IllustrationId, () => React.JSX.Element> = {
  "q4-answer": Q4Answer,
  "q4-sheet": Q4Sheet,
  "internal-board": InternalBoard,
  "internal-overview": InternalOverview,
  "smcc-public": SmccPublic,
  "smcc-member": SmccMember,
};

export function Illustration({ id }: { id: IllustrationId }) {
  const C = map[id];
  return <C />;
}
