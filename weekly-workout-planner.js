import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dumbbell,
  Activity,
  Zap,
  Waves,
  Mountain,
  Moon,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Check,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Battery,
  User,
  Bike,
  Footprints,
  Flame,
  Heart,
  Timer,
  Sparkles,
  Target,
  Sun,
  Wind,
  Leaf
} from "lucide-react";
const ICONS = {
  Dumbbell,
  Activity,
  Zap,
  Waves,
  Mountain,
  Moon,
  Bike,
  Footprints,
  Flame,
  Heart,
  Timer,
  Sparkles,
  Target,
  Sun,
  Wind,
  Leaf
};
const ICON_OPTIONS = [
  "Dumbbell",
  "Activity",
  "Zap",
  "Waves",
  "Mountain",
  "Moon",
  "Bike",
  "Footprints",
  "Flame",
  "Heart",
  "Timer",
  "Sparkles",
  "Target",
  "Sun",
  "Wind",
  "Leaf"
];
const COLOR_PRESETS = [
  // HIGH energy (green band)
  { color: "#2D5230", bg: "#D7E2D5" },
  // deep forest
  { color: "#3F6B4A", bg: "#DEE8DB" },
  // saturated green
  { color: "#507344", bg: "#DFE6D5" },
  // moss
  { color: "#4A7A5A", bg: "#DDE7DD" },
  // sage-green
  // MEDIUM-HIGH (olive transition)
  { color: "#6B7536", bg: "#E4E4C9" },
  // olive
  { color: "#7A8040", bg: "#E6E5CC" },
  // sage-olive
  // MEDIUM (amber)
  { color: "#9A6520", bg: "#F2E4CF" },
  // mustard
  { color: "#A67800", bg: "#F1E5BC" },
  // amber
  // MEDIUM-LOW (amber-red)
  { color: "#B6722A", bg: "#F3E2D0" },
  // warm orange
  { color: "#B06040", bg: "#F1DBCF" },
  // terracotta
  // LOW (red band)
  { color: "#B8554E", bg: "#F0D6D1" },
  // soft coral
  { color: "#A8515F", bg: "#EDD6DB" },
  // dusty rose
  { color: "#8B4A4A", bg: "#E8D5D3" },
  // muted red-brown
  // Neutral fallback
  { color: "#5C5C5C", bg: "#E8E6E2" }
  // charcoal (for workouts that don't fit the scale)
];
const DEFAULT_WORKOUT_TYPES = [
  // ─── HIGH energy required (green band) ───────────────────────────────────
  { id: "liftA", label: "Lift A", sub: "Lower + core", icon: "Dumbbell", color: "#2D5230", bg: "#D7E2D5" },
  // deep forest (heaviest lift)
  { id: "speed", label: "Speed", sub: "4\u20136 \xD7 30\u201360s efforts", icon: "Zap", color: "#3F6B4A", bg: "#DEE8DB" },
  // saturated green
  { id: "hardMile", label: "Hard Mile", sub: "10 min \xB7 near threshold", icon: "Flame", color: "#507344", bg: "#DFE6D5" },
  // deep moss
  { id: "surf", label: "Surf", sub: "~2 hr session", icon: "Waves", color: "#4A7A5A", bg: "#DDE7DD" },
  // sage-green (cool lean)
  // ─── MEDIUM-HIGH energy (green-amber transition) ────────────────────────
  { id: "liftB", label: "Lift B", sub: "Upper", icon: "Dumbbell", color: "#6B7536", bg: "#E4E4C9" },
  // olive (warm lean)
  { id: "long", label: "Long Easy", sub: "45\u201360 min talkable", icon: "Mountain", color: "#7A8040", bg: "#E6E5CC" },
  // sage-olive
  // ─── MEDIUM energy (amber band) ─────────────────────────────────────────
  { id: "liftC", label: "Lift C", sub: "Mixed / weak points", icon: "Dumbbell", color: "#9A6520", bg: "#F2E4CF" },
  // warm mustard (warm lean)
  { id: "skillsSurf", label: "Skills Surf", sub: "Paddle \xB7 technique", icon: "Target", color: "#A67800", bg: "#F1E5BC" },
  // amber (cool-neutral lean)
  // ─── MEDIUM-LOW energy (amber-red transition) ───────────────────────────
  { id: "endurance", label: "Easy Z2", sub: "30\u201345 min endurance", icon: "Activity", color: "#B6722A", bg: "#F3E2D0" },
  // warm orange
  { id: "easySurf", label: "Easy Surf", sub: "30\u201360 min small wave", icon: "Waves", color: "#B06040", bg: "#F1DBCF" },
  // terracotta (cool lean)
  // ─── LOW energy required (red band) ─────────────────────────────────────
  { id: "shortSurf", label: "Short Surf", sub: "20\u201330 min mellow", icon: "Waves", color: "#B8554E", bg: "#F0D6D1" },
  // soft coral (cool lean)
  { id: "easyMile", label: "Easy Mile", sub: "10 min \xB7 conversational", icon: "Footprints", color: "#A8515F", bg: "#EDD6DB" },
  // dusty rose (neutral lean)
  { id: "low", label: "Low Day", sub: "Walk \xB7 mobility", icon: "Moon", color: "#8B4A4A", bg: "#E8D5D3" }
  // muted red-brown (lowest)
];
const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const INITIAL_DEFAULT_PLAN = {
  0: [{ type: "liftA" }],
  1: [{ type: "endurance" }],
  2: [{ type: "liftB" }],
  3: [{ type: "speed" }],
  4: [{ type: "liftC" }],
  5: [{ type: "long" }],
  6: [{ type: "low" }]
};
const RECOVERY_STATES = [
  { id: "none", color: "#D5CEC2", label: "Not set", icon: null },
  { id: "green", color: "#4E8155", label: "Green \xB7 push", icon: BatteryFull },
  { id: "yellow", color: "#B8902F", label: "Yellow \xB7 build", icon: BatteryMedium },
  { id: "red", color: "#9E3E3A", label: "Red \xB7 protect", icon: BatteryLow }
];
const WORKOUT_DETAILS = {
  liftA: {
    tagline: "Lower body strength + core stability.",
    recovery: { green: "Normal intensity.", yellow: "Go, but leave 1\u20133 reps in reserve on big compounds.", red: "Technique + accessories only, or move to another day." },
    focus: [
      "Main compound lift is the priority \u2014 earn the hard sets.",
      "Optional 5\u201310 min very easy bike/row at the end if you want extra circulation.",
      "Core work after lifting, not before (don't pre-fatigue trunk stabilizers)."
    ],
    avoid: [
      "Don't stack this within 24 hrs of a long heavy surf \u2014 legs will be cooked.",
      "No hard run on the same day."
    ],
    strategy: "This is your anchor day. Everything else in the week slots around keeping this session quality."
  },
  liftB: {
    tagline: "Upper body push/pull volume.",
    recovery: { green: "Normal intensity.", yellow: "Go, but leave 1\u20133 reps in reserve.", red: "Light technique work, or move the day." },
    focus: [
      "Good choice the day before a big surf \u2014 upper won't trash paddling if you keep volume moderate.",
      "Balance push and pull work; don't neglect rows and pulls for the sake of pressing."
    ],
    avoid: [
      "Don't follow a heavy surf day with high-volume pressing \u2014 shoulders are already taxed."
    ],
    strategy: "Lower-impact on whole-body recovery. Safe to do the day before surf is expected."
  },
  liftC: {
    tagline: "Mixed session targeting weak points.",
    recovery: { green: "Push the weak points.", yellow: "Moderate intensity, reps in reserve.", red: "Skip or swap for mobility + bands only." },
    focus: [
      "Use this slot to address whatever's lagging \u2014 unilateral work, grip, posterior chain, whatever.",
      'Lower volume on the "main" lifts here since A and B already covered the big rocks.'
    ],
    avoid: [
      "Don't turn this into a third heavy Lift A \u2014 the point is variety and weak-point work."
    ],
    strategy: "Most flexible lift day. First to get demoted or moved if the week gets chaotic."
  },
  endurance: {
    tagline: "Aerobic base building at a truly easy pace.",
    recovery: { green: "Full 30\u201345 min at talkable pace.", yellow: "Still appropriate \u2014 this is the sweet spot for Yellow days.", red: "Downgrade to a walk or skip." },
    focus: [
      "Target Day Strain around 10\u201312 \u2014 moderate, not taxing.",
      "Nose-breathing test: if you can't, you're going too hard.",
      "Conversational pace the entire session."
    ],
    avoid: [
      "No heavy lifting the same day.",
      "Don't let this creep into tempo/threshold \u2014 it defeats the purpose."
    ],
    strategy: "The boring engine work that makes everything else possible. Protect its easiness."
  },
  speed: {
    tagline: "Your one hard cardio session of the week.",
    recovery: { green: "Ideal day for it.", yellow: "Skip the intervals \u2014 do easy endurance instead.", red: "No. Walk or light spin only." },
    focus: [
      "10 min easy warm-up.",
      "4\u20136 \xD7 30\u201360 sec strong efforts, easy walk/jog back between.",
      "10 min cool-down.",
      "Efforts should be strong but controlled \u2014 not all-out sprints."
    ],
    avoid: [
      "Skip entirely if surf is good \u2014 surf wins.",
      "Never stack with a heavy lift on the same day.",
      "Don't add a second intervals session in the same week."
    ],
    strategy: "Max 1 truly hard cardio day per week. This is it \u2014 or a big surf is. Not both."
  },
  easyMile: {
    tagline: "Quick 10-minute movement snack.",
    recovery: { green: "Fine as a bonus, but don't let it stack onto an already-hard day.", yellow: "Perfect use case \u2014 gives you energy rather than taking it.", red: "OK if you feel decent. Keep it genuinely easy, or walk it. Skip entirely if beat up." },
    focus: [
      "Conversational effort \u2014 think brisk walk/jog for circulation.",
      "Goal: small strain bump that feels like it gives you energy, not takes it.",
      "Great on busy days when you can't fit longer cardio."
    ],
    avoid: [
      "Don't let it drift fast \u2014 if it starts feeling like training, ease off.",
      "Don't do this instead of rest if you're genuinely depleted."
    ],
    strategy: "On busy weeks: a hard mile on Green + a couple of easy miles on Yellow/Red = still solid consistency."
  },
  hardMile: {
    tagline: "Fast, near-threshold effort \u2014 quality work in 10 min.",
    recovery: { green: "Green-only. This is a quality session.", yellow: "No \u2014 drop to Easy Mile.", red: "No \u2014 Easy Mile or walk only." },
    focus: [
      "Strong, controlled effort \u2014 not all-out sprinting.",
      "Near lactate threshold: hard breathing, but sustainable for the full mile.",
      "On busy weeks, this can replace your longer speed session entirely."
    ],
    avoid: [
      "Don't do this AND your regular speed day in the same week \u2014 pick one.",
      "Never the day before a big surf \u2014 make the mile easy regardless of color.",
      "Never on Yellow or Red \u2014 even if you feel OK in the moment."
    ],
    strategy: "The high-ROI option when life is chaotic. 10 minutes, one green light, one hard effort, done."
  },
  surf: {
    tagline: "Long session \u2014 counts as a hard day.",
    recovery: { green: "Full session, surf freely.", yellow: "Go, but ease off later in the session if fading.", red: "Shorten it. Keep the rest of the day very light." },
    focus: [
      'This is your "high strain" day \u2014 treat it as such.',
      "If Strain ends up >15, plan tomorrow as light/easy movement only.",
      "Lift B or C light is the only lifting that should follow within 24 hrs."
    ],
    avoid: [
      "Don't stack a long run or heavy lower body within 24 hrs of a big surf.",
      "Don't also do speed work the same day \u2014 it's one or the other, not both."
    ],
    strategy: "Counts as a hard session. If surf is on today, it replaces your planned speed/run workout."
  },
  easySurf: {
    tagline: "Small-wave session \u2014 active recovery + stoke.",
    recovery: { green: "Fine as easy endurance, or a second low-intensity session after lifting.", yellow: "Ideal. Make it your main movement for the day.", red: "OK if genuinely easy \u2014 lots of sitting, light paddling. Nothing else intense." },
    focus: [
      "Counts like an easy Z2 day, not a hard session.",
      "Can swap in for a scheduled Zone 2 run.",
      "Light lifting afterwards is fine if you still feel good."
    ],
    avoid: [
      "Don't also do speed work on the same day.",
      "Don't let it turn into a heavy paddle session \u2014 that's a different category."
    ],
    strategy: "Small, easy surf = active recovery. Long, heavy surf = hard session. Know which one today is."
  },
  shortSurf: {
    tagline: "Quick 20\u201330 min paddle \u2014 minimum effective dose.",
    recovery: { green: "Bonus session, totally fine.", yellow: "Great low-effort option.", red: "Appropriate if conditions are fun \u2014 keep it very easy and short." },
    focus: [
      `Use this after a big 2-hour surf day as "movement" \u2014 don't turn it into another heavy session.`,
      "Good option when you want water time without the commitment."
    ],
    avoid: [
      "Don't push it hard just because it's short \u2014 the whole point is low cost."
    ],
    strategy: 'The "I just want to get wet" option. Almost always safe to add, almost never a reason to skip.'
  },
  skillsSurf: {
    tagline: "Focused technique and paddle work.",
    recovery: { green: "Full session.", yellow: "Appropriate \u2014 lower intensity than catching waves.", red: "Keep it very short and light, or skip." },
    focus: [
      "Paddle drills, pop-up practice, positioning \u2014 the unsexy stuff that compounds.",
      "Low-intensity enough to pair with a light lift if scheduled."
    ],
    avoid: [
      "Don't turn this into an all-out paddle conditioning session."
    ],
    strategy: "Counts closer to active recovery than cardio. Use it to sharpen without burning matches."
  },
  long: {
    tagline: "Extended easy session \u2014 the weekend aerobic bank deposit.",
    recovery: { green: "Full 45\u201360 min, even push to 75 if feeling great.", yellow: "Do it, but stay at the easy end.", red: "Downgrade to a walk or skip." },
    focus: [
      "Talkable pace the whole way \u2014 same rules as Easy Z2, just longer.",
      "Trail or road, whatever's accessible.",
      "If surf is on: surf is your long day. Don't stack both."
    ],
    avoid: [
      "Never turn this into a tempo run. Longer, not faster.",
      "Don't pair with a heavy lower-body lift on the same day."
    ],
    strategy: "This is where aerobic durability gets built. One long easy day per week is plenty."
  },
  low: {
    tagline: "Protect energy. Adapt. Don't train.",
    recovery: { green: "Still a low day even if you feel great \u2014 respect the schedule.", yellow: "Perfectly aligned.", red: "Essential." },
    focus: [
      "Walking, mobility, stretching.",
      "Light paddle drills or band work at most.",
      "Sleep and eat well \u2014 this day is where adaptation happens."
    ],
    avoid: [
      "No lifting, no intervals, no long runs.",
      'Resist the urge to "just add a quick session" \u2014 the rest IS the session.'
    ],
    strategy: "After 3 days in a row with Strain \u226514, any day becomes a low day regardless of what's scheduled."
  }
};
const PLAYBOOK_RECOVERY = [
  {
    id: "green",
    title: "Green",
    tagline: "push",
    color: "#4E8155",
    icon: BatteryFull,
    sections: [
      { label: "Cardio", body: "Long Z2, intervals, or a ~2 hr surf. Pick one." },
      { label: "Lifting", body: "Scheduled session at normal intensity." },
      { label: "Watch", body: "Don't stack hard run + hard lift + long surf in 24 hrs." }
    ]
  },
  {
    id: "yellow",
    title: "Yellow",
    tagline: "build",
    color: "#B8902F",
    icon: BatteryMedium,
    sections: [
      { label: "Cardio", body: "30\u201345 min easy Z2. If surf is on, surf wins." },
      { label: "Lifting", body: "Scheduled session, but leave 1\u20133 reps in reserve on big lifts." },
      { label: "Watch", body: "Skip all-out intervals. Drop to a walk if unusually tired." }
    ]
  },
  {
    id: "red",
    title: "Red",
    tagline: "protect",
    color: "#9E3E3A",
    icon: BatteryLow,
    sections: [
      { label: "Cardio", body: "Walk, light spin, or very easy jog. Day Strain under 8." },
      { label: "Lifting", body: "Technique + accessories only, or move the day." },
      { label: "Watch", body: "If surf is amazing, treat it as your only session; tomorrow goes easy." }
    ]
  }
];
const PLAYBOOK_SURF = [
  { label: "Surf is on today", body: "Surf is the main session. Scale intensity by recovery color; layer only light lifting or mobility after." },
  { label: "Surf looks great tomorrow", body: "Keep today's Strain \u2264 10\u201311. Skip speed; do easy endurance or an upper lift." }
];
const PLAYBOOK_CAPS = [
  { label: "Hard days", body: "\u2264 2 per week (speed or big surf)." },
  { label: "Cardio days", body: "2\u20133 per week total." },
  { label: "Lift days", body: "3 per week." },
  { label: "Strain rule", body: "3 days in a row with Strain \u2265 14 \u2192 force next day under 8." }
];
const makeUid = () => `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const makeTypeId = () => `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const dowIndex = (date) => {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
};
const buildDefaultWorkouts = (date, defaultPlan) => {
  const key = dateKey(date);
  const dow = dowIndex(date);
  return (defaultPlan[dow] || []).map((w, i) => ({
    uid: `default-${key}-${i}`,
    type: w.type,
    done: false
  }));
};
const resolveDayData = (date, overrides, defaultPlan) => {
  const key = dateKey(date);
  if (overrides[key]) return overrides[key];
  return {
    workouts: buildDefaultWorkouts(date, defaultPlan),
    recovery: "none"
  };
};
function WorkoutTypeModal({ initial, isNew, onSave, onDelete, onCancel }) {
  const [label, setLabel] = useState(initial?.label || "");
  const [sub, setSub] = useState(initial?.sub || "");
  const [colorIdx, setColorIdx] = useState(() => {
    if (!initial) return 0;
    const idx = COLOR_PRESETS.findIndex((c) => c.color === initial.color);
    return idx >= 0 ? idx : 0;
  });
  const [iconName, setIconName] = useState(initial?.icon || "Dumbbell");
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);
  const color = COLOR_PRESETS[colorIdx];
  const PreviewIcon = ICONS[iconName];
  const handleSave = () => {
    if (!label.trim()) return;
    onSave({
      label: label.trim(),
      sub: sub.trim() || "\u2014",
      color: color.color,
      bg: color.bg,
      icon: iconName
    });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: onCancel,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(26, 24, 22, 0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: "#FFFEFB",
            borderRadius: 12,
            width: "100%",
            maxWidth: 460,
            maxHeight: "92vh",
            overflowY: "auto",
            padding: 24,
            border: "1px solid #D5CEC2",
            boxShadow: "0 20px 60px rgba(26, 24, 22, 0.2)"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest", style: { color: "#7A746C", fontSize: "0.65rem" }, children: isNew ? "New workout type" : "Edit workout type" }),
                /* @__PURE__ */ jsx("h3", { className: "wp-display", style: { fontSize: "1.5rem", fontWeight: 500, marginTop: 2, letterSpacing: "-0.01em" }, children: isNew ? "Add to library" : initial?.label || "" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onCancel,
                  style: { color: "#7A746C", background: "transparent", border: "none", cursor: "pointer", padding: 4 },
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-1.5", style: { fontSize: "0.65rem", color: "#7A746C" }, children: "Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: label,
                  onChange: (e) => setLabel(e.target.value),
                  placeholder: "e.g. Hill Sprints",
                  autoFocus: true,
                  style: {
                    width: "100%",
                    padding: "10px 12px",
                    background: "#F6F2EA",
                    border: "1px solid #D5CEC2",
                    borderRadius: 6,
                    fontFamily: "Geist, sans-serif",
                    fontSize: "0.95rem",
                    color: "#1A1816",
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-1.5", style: { fontSize: "0.65rem", color: "#7A746C" }, children: "Description" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: sub,
                  onChange: (e) => setSub(e.target.value),
                  placeholder: "e.g. 8 \xD7 20s steep hill",
                  style: {
                    width: "100%",
                    padding: "10px 12px",
                    background: "#F6F2EA",
                    border: "1px solid #D5CEC2",
                    borderRadius: 6,
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.8rem",
                    color: "#1A1816",
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-2", style: { fontSize: "0.65rem", color: "#7A746C" }, children: "Color" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: COLOR_PRESETS.map((c, i) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setColorIdx(i),
                  "aria-label": `Color ${i + 1}`,
                  style: {
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c.color,
                    border: colorIdx === i ? "2px solid #1A1816" : "2px solid transparent",
                    boxShadow: colorIdx === i ? "0 0 0 2px #FFFEFB inset" : "none",
                    cursor: "pointer",
                    padding: 0
                  }
                },
                i
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-2", style: { fontSize: "0.65rem", color: "#7A746C" }, children: "Icon" }),
              /* @__PURE__ */ jsx("div", { className: "grid gap-1.5", style: { gridTemplateColumns: "repeat(8, 1fr)" }, children: ICON_OPTIONS.map((name) => {
                const Ic = ICONS[name];
                const active = iconName === name;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setIconName(name),
                    "aria-label": name,
                    style: {
                      aspectRatio: "1",
                      borderRadius: 6,
                      background: active ? color.bg : "#F6F2EA",
                      border: active ? `1.5px solid ${color.color}` : "1px solid #E5DFD3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? color.color : "#7A746C",
                      cursor: "pointer",
                      padding: 0
                    },
                    children: /* @__PURE__ */ jsx(Ic, { size: 16 })
                  },
                  name
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-2", style: { fontSize: "0.65rem", color: "#7A746C" }, children: "Preview" }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    backgroundColor: color.bg,
                    borderLeft: `3px solid ${color.color}`,
                    padding: 12,
                    borderRadius: 6
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                      /* @__PURE__ */ jsx(PreviewIcon, { size: 13, style: { color: color.color } }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontWeight: 600, color: color.color, fontFamily: "Geist, sans-serif" }, children: label || "Workout name" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "leading-tight",
                        style: { color: color.color, opacity: 0.75, fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace" },
                        children: sub || "description"
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsx("div", { children: !isNew && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => onDelete(initial.id),
                  style: {
                    padding: "9px 12px",
                    background: "transparent",
                    border: "none",
                    color: "#C25450",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer"
                  },
                  children: "Delete"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onCancel,
                    style: {
                      padding: "9px 16px",
                      background: "transparent",
                      border: "1px solid #D5CEC2",
                      borderRadius: 6,
                      color: "#1A1816",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      cursor: "pointer"
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleSave,
                    disabled: !label.trim(),
                    style: {
                      padding: "9px 16px",
                      background: label.trim() ? "#1A1816" : "#B5AFA3",
                      border: "none",
                      borderRadius: 6,
                      color: "#FFFEFB",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      cursor: label.trim() ? "pointer" : "not-allowed"
                    },
                    children: isNew ? "Create" : "Save"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function WorkoutDetailModal({ type, details, onEdit, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!type) return null;
  const Icon = ICONS[type.icon];
  const hasDetails = !!details;
  const RecoveryRow = ({ id, label, color, BatteryIcon, body }) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-start gap-3",
      style: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: id === "red" ? "none" : "1px solid #EFE9DC"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#FFFEFB",
              border: `2px solid ${color}`,
              color,
              flexShrink: 0,
              marginTop: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(BatteryIcon, { size: 11, strokeWidth: 2.25 })
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { minWidth: 70 }, children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "wp-mono uppercase tracking-wider",
            style: { fontSize: "0.65rem", fontWeight: 700, color: "#1A1816" },
            children: label
          }
        ) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flex: 1,
              fontSize: "0.85rem",
              lineHeight: 1.45,
              color: "#1A1816",
              fontFamily: "Geist, sans-serif"
            },
            children: body
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(26, 24, 22, 0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: "#FFFEFB",
            borderRadius: 12,
            width: "100%",
            maxWidth: 540,
            maxHeight: "92vh",
            overflowY: "auto",
            border: "1px solid #D5CEC2",
            boxShadow: "0 20px 60px rgba(26, 24, 22, 0.2)"
          },
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  backgroundColor: type.bg,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderLeft: `4px solid ${type.color}`,
                  padding: "24px 28px",
                  position: "relative"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: onClose,
                      style: {
                        position: "absolute",
                        top: 14,
                        right: 14,
                        background: "transparent",
                        border: "none",
                        color: type.color,
                        opacity: 0.6,
                        cursor: "pointer",
                        padding: 4
                      },
                      "aria-label": "Close",
                      children: /* @__PURE__ */ jsx(X, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsx(Icon, { size: 18, style: { color: type.color } }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "wp-mono uppercase tracking-widest",
                        style: { color: type.color, fontSize: "0.7rem", fontWeight: 700 },
                        children: "Workout"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      className: "wp-display",
                      style: {
                        fontSize: "2rem",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                        color: type.color,
                        marginBottom: 6
                      },
                      children: type.label
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "wp-mono",
                      style: { color: type.color, opacity: 0.75, fontSize: "0.78rem" },
                      children: type.sub
                    }
                  ),
                  hasDetails && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "wp-display italic",
                      style: {
                        marginTop: 14,
                        color: type.color,
                        opacity: 0.85,
                        fontSize: "1rem",
                        fontWeight: 300,
                        lineHeight: 1.35
                      },
                      children: details.tagline
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { padding: "22px 28px 24px" }, children: [
              !hasDetails && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    fontSize: "0.9rem",
                    color: "#7A746C",
                    fontFamily: "Geist, sans-serif",
                    lineHeight: 1.5,
                    padding: "16px 0"
                  },
                  children: "Custom workout \u2014 no detailed guidance yet. Use the edit button on the library chip to refine the name and description."
                }
              ),
              hasDetails && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { style: { marginBottom: 22 }, children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "wp-mono uppercase tracking-widest mb-1",
                      style: { color: "#7A746C", fontSize: "0.62rem" },
                      children: "By morning recovery"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      RecoveryRow,
                      {
                        id: "green",
                        label: "Green",
                        color: "#4E8155",
                        BatteryIcon: BatteryFull,
                        body: details.recovery.green
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      RecoveryRow,
                      {
                        id: "yellow",
                        label: "Yellow",
                        color: "#B8902F",
                        BatteryIcon: BatteryMedium,
                        body: details.recovery.yellow
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      RecoveryRow,
                      {
                        id: "red",
                        label: "Red",
                        color: "#9E3E3A",
                        BatteryIcon: BatteryLow,
                        body: details.recovery.red
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { marginBottom: 18 }, children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "wp-mono uppercase tracking-widest mb-2",
                      style: { color: type.color, fontSize: "0.62rem", fontWeight: 700 },
                      children: "Focus on"
                    }
                  ),
                  /* @__PURE__ */ jsx("ul", { style: { margin: 0, padding: 0, listStyle: "none" }, children: details.focus.map((item, i) => /* @__PURE__ */ jsxs(
                    "li",
                    {
                      className: "flex gap-2",
                      style: {
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        color: "#1A1816",
                        fontFamily: "Geist, sans-serif",
                        marginBottom: 6
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { style: { color: type.color, fontWeight: 700, flexShrink: 0 }, children: "+" }),
                        /* @__PURE__ */ jsx("span", { children: item })
                      ]
                    },
                    i
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: { marginBottom: 18 }, children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "wp-mono uppercase tracking-widest mb-2",
                      style: { color: "#9E3E3A", fontSize: "0.62rem", fontWeight: 700 },
                      children: "Avoid"
                    }
                  ),
                  /* @__PURE__ */ jsx("ul", { style: { margin: 0, padding: 0, listStyle: "none" }, children: details.avoid.map((item, i) => /* @__PURE__ */ jsxs(
                    "li",
                    {
                      className: "flex gap-2",
                      style: {
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        color: "#1A1816",
                        fontFamily: "Geist, sans-serif",
                        marginBottom: 6
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { style: { color: "#9E3E3A", fontWeight: 700, flexShrink: 0 }, children: "\u2212" }),
                        /* @__PURE__ */ jsx("span", { children: item })
                      ]
                    },
                    i
                  )) })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      marginTop: 18,
                      paddingTop: 16,
                      borderTop: "1px solid #EFE9DC"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "wp-mono uppercase tracking-widest mb-2",
                          style: { color: "#7A746C", fontSize: "0.62rem", fontWeight: 700 },
                          children: "Strategy"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "wp-display",
                          style: {
                            fontSize: "0.95rem",
                            fontStyle: "italic",
                            fontWeight: 400,
                            lineHeight: 1.5,
                            color: "#1A1816"
                          },
                          children: details.strategy
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    marginTop: 22,
                    paddingTop: 16,
                    borderTop: "1px solid #EFE9DC",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8
                  },
                  children: [
                    onEdit && /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: onEdit,
                        style: {
                          padding: "9px 14px",
                          background: "transparent",
                          border: "1px solid #D5CEC2",
                          borderRadius: 6,
                          color: "#1A1816",
                          fontFamily: "Geist, sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6
                        },
                        children: [
                          /* @__PURE__ */ jsx(Edit2, { size: 12 }),
                          " Edit card"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: onClose,
                        style: {
                          padding: "9px 16px",
                          background: "#1A1816",
                          border: "none",
                          borderRadius: 6,
                          color: "#FFFEFB",
                          fontFamily: "Geist, sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          cursor: "pointer"
                        },
                        children: "Got it"
                      }
                    )
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function ProfileModal({
  mode,
  // 'welcome' | 'menu' | 'create' | 'rename' | 'import' | 'delete-confirm'
  activeProfile,
  profileList,
  importPreview,
  onCreate,
  onSwitch,
  onRename,
  onDelete,
  onExport,
  onTriggerImport,
  onConfirmImport,
  onChangeMode,
  onClose
}) {
  const [input, setInput] = useState(
    mode === "rename" ? activeProfile || "" : mode === "import" ? importPreview?.suggestedName || "" : ""
  );
  const [error, setError] = useState("");
  useEffect(() => {
    setInput(
      mode === "rename" ? activeProfile || "" : mode === "import" ? importPreview?.suggestedName || "" : ""
    );
    setError("");
  }, [mode, activeProfile, importPreview]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && mode !== "welcome") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, mode]);
  const submit = () => {
    if (mode === "create" || mode === "welcome") {
      const res = onCreate(input);
      if (!res.ok) setError(res.error);
    } else if (mode === "rename") {
      const res = onRename(input);
      if (!res.ok) setError(res.error);
    } else if (mode === "import") {
      const res = onConfirmImport(input);
      if (!res.ok) setError(res.error);
    }
  };
  const headerText = {
    welcome: "Welcome",
    menu: "Profile",
    create: "New profile",
    rename: "Rename profile",
    import: "Import profile",
    "delete-confirm": "Delete profile?"
  }[mode];
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: mode === "welcome" ? void 0 : onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(26, 24, 22, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: "#FFFEFB",
            borderRadius: 12,
            width: "100%",
            maxWidth: 440,
            maxHeight: "92vh",
            overflowY: "auto",
            padding: 28,
            border: "1px solid #D5CEC2",
            boxShadow: "0 20px 60px rgba(26, 24, 22, 0.25)"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest", style: { color: "#7A746C", fontSize: "0.62rem" }, children: mode === "welcome" ? "Weekly Split" : "Profile" }),
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: "wp-display",
                    style: { fontSize: "1.6rem", fontWeight: 500, marginTop: 2, letterSpacing: "-0.01em", lineHeight: 1.1 },
                    children: mode === "welcome" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic", fontWeight: 300 }, children: "Welcome." }),
                      " Start a profile."
                    ] }) : headerText
                  }
                )
              ] }),
              mode !== "welcome" && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  style: { color: "#7A746C", background: "transparent", border: "none", cursor: "pointer", padding: 4 },
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }),
            mode === "welcome" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.9rem", lineHeight: 1.5, color: "#1A1816", marginBottom: 18 }, children: "Your workouts, schedule, and customizations will be saved in this browser under a profile name. No account, no login \u2014 everything stays on this device." }),
              /* @__PURE__ */ jsxs("label", { className: "block mb-3", children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-1.5", style: { fontSize: "0.62rem", color: "#7A746C" }, children: "Profile name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoFocus: true,
                    value: input,
                    onChange: (e) => {
                      setInput(e.target.value);
                      setError("");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") submit();
                    },
                    placeholder: "Your name or nickname",
                    style: inputStyle
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsx("div", { style: errStyle, children: error }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-2", style: { marginTop: 18 }, children: [
                /* @__PURE__ */ jsx("button", { onClick: onTriggerImport, style: ghostBtnStyle, children: "Import from file" }),
                /* @__PURE__ */ jsx("button", { onClick: submit, disabled: !input.trim(), style: primaryBtnStyle(!input.trim()), children: "Create profile" })
              ] })
            ] }),
            mode === "menu" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "12px 14px",
                    background: "#F6F2EA",
                    borderRadius: 8,
                    marginBottom: 16,
                    border: "1px solid #E5DFD3"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider", style: { fontSize: "0.6rem", color: "#7A746C" }, children: "Active" }),
                    /* @__PURE__ */ jsx("div", { className: "wp-display", style: { fontSize: "1.2rem", fontWeight: 500, marginTop: 2 }, children: activeProfile })
                  ]
                }
              ),
              profileList.length > 1 && /* @__PURE__ */ jsxs("div", { style: { marginBottom: 16 }, children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-2", style: { fontSize: "0.6rem", color: "#7A746C" }, children: "Switch to" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: profileList.filter((p) => p !== activeProfile).map((p) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onSwitch(p),
                    style: {
                      textAlign: "left",
                      padding: "10px 14px",
                      background: "#FFFEFB",
                      border: "1px solid #E5DFD3",
                      borderRadius: 6,
                      fontFamily: "Geist, sans-serif",
                      fontSize: "0.9rem",
                      color: "#1A1816",
                      cursor: "pointer"
                    },
                    children: p
                  },
                  p
                )) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-2", style: { fontSize: "0.6rem", color: "#7A746C" }, children: "Actions" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsx(MenuAction, { onClick: () => onChangeMode("create"), children: "\uFF0B New profile" }),
                /* @__PURE__ */ jsx(MenuAction, { onClick: () => onChangeMode("rename"), children: "\u270E Rename" }),
                /* @__PURE__ */ jsx(MenuAction, { onClick: onExport, children: "\u2193 Export as JSON" }),
                /* @__PURE__ */ jsx(MenuAction, { onClick: onTriggerImport, children: "\u2191 Import from file" }),
                profileList.length >= 1 && /* @__PURE__ */ jsx(MenuAction, { danger: true, onClick: () => onChangeMode("delete-confirm"), children: "\u2715 Delete this profile" })
              ] })
            ] }),
            (mode === "create" || mode === "rename") && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("label", { className: "block mb-3", children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-1.5", style: { fontSize: "0.62rem", color: "#7A746C" }, children: mode === "create" ? "Profile name" : "New name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoFocus: true,
                    value: input,
                    onChange: (e) => {
                      setInput(e.target.value);
                      setError("");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") submit();
                    },
                    style: inputStyle
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsx("div", { style: errStyle, children: error }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", style: { marginTop: 18 }, children: [
                /* @__PURE__ */ jsx("button", { onClick: () => onChangeMode("menu"), style: ghostBtnStyle, children: "Cancel" }),
                /* @__PURE__ */ jsx("button", { onClick: submit, disabled: !input.trim(), style: primaryBtnStyle(!input.trim()), children: mode === "create" ? "Create" : "Save" })
              ] })
            ] }),
            mode === "import" && importPreview && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.88rem", lineHeight: 1.5, color: "#1A1816", marginBottom: 16 }, children: "Import this profile data under a new name:" }),
              /* @__PURE__ */ jsxs("label", { className: "block mb-3", children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-wider mb-1.5", style: { fontSize: "0.62rem", color: "#7A746C" }, children: "Profile name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoFocus: true,
                    value: input,
                    onChange: (e) => {
                      setInput(e.target.value);
                      setError("");
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") submit();
                    },
                    style: inputStyle
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    fontSize: "0.78rem",
                    color: "#7A746C",
                    fontFamily: "JetBrains Mono, monospace",
                    background: "#F6F2EA",
                    padding: "10px 12px",
                    borderRadius: 6,
                    marginBottom: 6
                  },
                  children: [
                    Object.keys(importPreview.data.overrides || {}).length,
                    " day overrides \xB7",
                    " ",
                    (importPreview.data.workoutTypes || []).length,
                    " workout types"
                  ]
                }
              ),
              error && /* @__PURE__ */ jsx("div", { style: errStyle, children: error }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", style: { marginTop: 18 }, children: [
                /* @__PURE__ */ jsx("button", { onClick: onClose, style: ghostBtnStyle, children: "Cancel" }),
                /* @__PURE__ */ jsx("button", { onClick: submit, disabled: !input.trim(), style: primaryBtnStyle(!input.trim()), children: "Import" })
              ] })
            ] }),
            mode === "delete-confirm" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.9rem", lineHeight: 1.55, color: "#1A1816", marginBottom: 6 }, children: [
                "Delete ",
                /* @__PURE__ */ jsx("strong", { children: activeProfile }),
                " and all its data?"
              ] }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "0.82rem", color: "#7A746C", marginBottom: 18 }, children: "This can't be undone. Consider exporting first." }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => onChangeMode("menu"), style: ghostBtnStyle, children: "Cancel" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onDelete,
                    style: {
                      ...primaryBtnStyle(false),
                      background: "#9E3E3A"
                    },
                    children: "Delete"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: "#F6F2EA",
  border: "1px solid #D5CEC2",
  borderRadius: 6,
  fontFamily: "Geist, sans-serif",
  fontSize: "0.95rem",
  color: "#1A1816",
  outline: "none",
  boxSizing: "border-box"
};
const ghostBtnStyle = {
  padding: "9px 16px",
  background: "transparent",
  border: "1px solid #D5CEC2",
  borderRadius: 6,
  color: "#1A1816",
  fontFamily: "Geist, sans-serif",
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer"
};
const primaryBtnStyle = (disabled) => ({
  padding: "9px 16px",
  background: disabled ? "#B5AFA3" : "#1A1816",
  border: "none",
  borderRadius: 6,
  color: "#FFFEFB",
  fontFamily: "Geist, sans-serif",
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: disabled ? "not-allowed" : "pointer"
});
const errStyle = {
  fontSize: "0.8rem",
  color: "#9E3E3A",
  fontFamily: "Geist, sans-serif",
  marginTop: 4,
  marginBottom: 8
};
function MenuAction({ children, onClick, danger }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      style: {
        textAlign: "left",
        padding: "10px 14px",
        background: "transparent",
        border: "1px solid #E5DFD3",
        borderRadius: 6,
        fontFamily: "Geist, sans-serif",
        fontSize: "0.88rem",
        color: danger ? "#9E3E3A" : "#1A1816",
        cursor: "pointer",
        transition: "background 0.15s ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = danger ? "#F7E8E7" : "#F6F2EA";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
      },
      children
    }
  );
}
const SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  profileList: "workout-planner:profiles",
  activeProfile: "workout-planner:active",
  profile: (name) => `workout-planner:profile:${name}`
};
const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const loadProfileList = () => {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.profileList), []);
};
const saveProfileList = (names) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.profileList, JSON.stringify(names));
};
const loadActiveProfile = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.activeProfile);
};
const saveActiveProfile = (name) => {
  if (typeof window === "undefined") return;
  if (name) window.localStorage.setItem(STORAGE_KEYS.activeProfile, name);
  else window.localStorage.removeItem(STORAGE_KEYS.activeProfile);
};
const loadProfileData = (name) => {
  if (typeof window === "undefined" || !name) return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.profile(name)), null);
};
const saveProfileData = (name, data) => {
  if (typeof window === "undefined" || !name) return;
  window.localStorage.setItem(STORAGE_KEYS.profile(name), JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    defaultPlan: data.defaultPlan,
    overrides: data.overrides,
    workoutTypes: data.workoutTypes,
    savedAt: (/* @__PURE__ */ new Date()).toISOString()
  }));
};
const deleteProfileData = (name) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.profile(name));
};
const sanitizeProfileName = (raw) => (raw || "").trim().slice(0, 40);
function WorkoutPlanner() {
  const [defaultPlan, setDefaultPlan] = useState(INITIAL_DEFAULT_PLAN);
  const [overrides, setOverrides] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [drag, setDrag] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);
  const [workoutTypes, setWorkoutTypes] = useState(DEFAULT_WORKOUT_TYPES);
  const [editing, setEditing] = useState(null);
  const [viewingType, setViewingType] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [profileList, setProfileList] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [profileAction, setProfileAction] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const importInputRef = useRef(null);
  const dragRef = useRef(null);
  dragRef.current = drag;
  const hoverRef = useRef(null);
  hoverRef.current = hoverDay;
  const dragMovedRef = useRef(false);
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const defaultPlanRef = useRef(defaultPlan);
  defaultPlanRef.current = defaultPlan;
  useEffect(() => {
    const list = loadProfileList();
    const active = loadActiveProfile();
    setProfileList(list);
    if (list.length === 0) {
      setProfileAction("welcome");
      setHydrated(true);
      return;
    }
    const target = active && list.includes(active) ? active : list[0];
    const data = loadProfileData(target);
    if (data) {
      setDefaultPlan(data.defaultPlan || INITIAL_DEFAULT_PLAN);
      setOverrides(data.overrides || {});
      setWorkoutTypes(data.workoutTypes || DEFAULT_WORKOUT_TYPES);
    }
    setActiveProfile(target);
    saveActiveProfile(target);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated || !activeProfile) return;
    const handle = setTimeout(() => {
      saveProfileData(activeProfile, { defaultPlan, overrides, workoutTypes });
    }, 300);
    return () => clearTimeout(handle);
  }, [hydrated, activeProfile, defaultPlan, overrides, workoutTypes]);
  const weekDates = useMemo(() => {
    const today2 = /* @__PURE__ */ new Date();
    const day = today2.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today2);
    monday.setDate(today2.getDate() + diff + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);
  const weekDatesRef = useRef(weekDates);
  weekDatesRef.current = weekDates;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const mutateDate = (date, fn) => {
    const key = dateKey(date);
    setOverrides((prev) => {
      const current = prev[key] || {
        workouts: buildDefaultWorkouts(date, defaultPlanRef.current),
        recovery: "none"
      };
      return { ...prev, [key]: fn(current) };
    });
  };
  const startDrag = (e, source) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const point = e.touches?.[0] || e;
    dragMovedRef.current = false;
    setDrag({
      ...source,
      x: point.clientX,
      y: point.clientY,
      startX: point.clientX,
      startY: point.clientY,
      offsetX: point.clientX - rect.left,
      offsetY: point.clientY - rect.top,
      width: rect.width
    });
  };
  useEffect(() => {
    if (!drag) return;
    const DRAG_THRESHOLD = 6;
    const move = (e) => {
      const point = e.touches?.[0] || e;
      const d = dragRef.current;
      if (d && !dragMovedRef.current) {
        const dx = point.clientX - d.startX;
        const dy = point.clientY - d.startY;
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          dragMovedRef.current = true;
        }
      }
      setDrag((prev) => prev ? { ...prev, x: point.clientX, y: point.clientY } : prev);
      if (dragMovedRef.current) {
        const el = document.elementFromPoint(point.clientX, point.clientY);
        const dayEl = el?.closest("[data-day-index]");
        setHoverDay(dayEl ? parseInt(dayEl.dataset.dayIndex, 10) : null);
      }
      if (e.cancelable) e.preventDefault();
    };
    const end = () => {
      const d = dragRef.current;
      const h = hoverRef.current;
      const wasDrag = dragMovedRef.current;
      if (wasDrag && d && h !== null) {
        const targetDate = weekDatesRef.current[h];
        const targetKey = dateKey(targetDate);
        if (d.source === "library") {
          setOverrides((prev) => {
            const current = prev[targetKey] || {
              workouts: buildDefaultWorkouts(targetDate, defaultPlanRef.current),
              recovery: "none"
            };
            return {
              ...prev,
              [targetKey]: {
                ...current,
                workouts: [...current.workouts, { uid: makeUid(), type: d.typeId, done: false }]
              }
            };
          });
        } else if (d.source === "day") {
          const fromDate = d.fromDate;
          const fromKey = dateKey(fromDate);
          if (fromKey !== targetKey) {
            setOverrides((prev) => {
              const fromCurrent = prev[fromKey] || {
                workouts: buildDefaultWorkouts(fromDate, defaultPlanRef.current),
                recovery: "none"
              };
              const targetCurrent = prev[targetKey] || {
                workouts: buildDefaultWorkouts(targetDate, defaultPlanRef.current),
                recovery: "none"
              };
              const moving = fromCurrent.workouts.find((w) => w.uid === d.uid);
              if (!moving) return prev;
              return {
                ...prev,
                [fromKey]: { ...fromCurrent, workouts: fromCurrent.workouts.filter((w) => w.uid !== d.uid) },
                [targetKey]: { ...targetCurrent, workouts: [...targetCurrent.workouts, moving] }
              };
            });
          }
        }
      } else if (!wasDrag && d) {
        let typeId;
        if (d.source === "library") {
          typeId = d.typeId;
        } else if (d.source === "day") {
          const key = dateKey(d.fromDate);
          const data = overridesRef.current[key] || {
            workouts: buildDefaultWorkouts(d.fromDate, defaultPlanRef.current)
          };
          typeId = data.workouts.find((w) => w.uid === d.uid)?.type;
        }
        if (typeId) setViewingType(typeId);
      }
      setDrag(null);
      setHoverDay(null);
      dragMovedRef.current = false;
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [drag]);
  const removeWorkout = (date, uid) => {
    mutateDate(date, (curr) => ({ ...curr, workouts: curr.workouts.filter((w) => w.uid !== uid) }));
  };
  const toggleWorkoutDone = (date, uid) => {
    mutateDate(date, (curr) => ({
      ...curr,
      workouts: curr.workouts.map((w) => w.uid === uid ? { ...w, done: !w.done } : w)
    }));
  };
  const cycleRecovery = (date) => {
    const order = ["none", "green", "yellow", "red"];
    mutateDate(date, (curr) => ({
      ...curr,
      recovery: order[(order.indexOf(curr.recovery || "none") + 1) % 4]
    }));
  };
  const saveWorkoutType = (data) => {
    if (editing === "new") {
      setWorkoutTypes((prev) => [...prev, { ...data, id: makeTypeId() }]);
    } else if (editing && typeof editing === "object") {
      setWorkoutTypes((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...data } : t));
    }
    setEditing(null);
  };
  const deleteWorkoutType = (id) => {
    setWorkoutTypes((prev) => prev.filter((t) => t.id !== id));
    setDefaultPlan((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        next[k] = prev[k].filter((w) => w.type !== id);
      });
      return next;
    });
    setOverrides((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        next[k] = { ...prev[k], workouts: prev[k].workouts.filter((w) => w.type !== id) };
      });
      return next;
    });
    setEditing(null);
  };
  const typeById = (id) => workoutTypes.find((t) => t.id === id);
  const recById = (id) => RECOVERY_STATES.find((r) => r.id === id);
  const saveWeekAsDefault = () => {
    const nextDefault = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    weekDates.forEach((date) => {
      const dow = dowIndex(date);
      const data = resolveDayData(date, overrides, defaultPlan);
      nextDefault[dow] = data.workouts.map((w) => ({ type: w.type }));
    });
    setDefaultPlan(nextDefault);
    setSaveStatus("saved");
  };
  useEffect(() => {
    if (saveStatus === "saved") {
      const t = setTimeout(() => setSaveStatus("idle"), 1800);
      return () => clearTimeout(t);
    }
    if (saveStatus === "confirm") {
      const t = setTimeout(() => setSaveStatus("idle"), 5e3);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);
  const createProfile = (rawName, seed = null) => {
    const name = sanitizeProfileName(rawName);
    if (!name) return { ok: false, error: "Name required" };
    if (profileList.includes(name)) return { ok: false, error: "Name already taken" };
    const freshData = seed || {
      defaultPlan: INITIAL_DEFAULT_PLAN,
      overrides: {},
      workoutTypes: DEFAULT_WORKOUT_TYPES
    };
    const nextList = [...profileList, name];
    setProfileList(nextList);
    saveProfileList(nextList);
    saveProfileData(name, freshData);
    switchProfile(name, freshData);
    return { ok: true };
  };
  const switchProfile = (name, overrideData = null) => {
    const data = overrideData || loadProfileData(name);
    if (!data) return;
    setDefaultPlan(data.defaultPlan || INITIAL_DEFAULT_PLAN);
    setOverrides(data.overrides || {});
    setWorkoutTypes(data.workoutTypes || DEFAULT_WORKOUT_TYPES);
    setActiveProfile(name);
    saveActiveProfile(name);
    setProfileAction(null);
    setWeekOffset(0);
  };
  const renameProfile = (newRawName) => {
    const newName = sanitizeProfileName(newRawName);
    if (!newName || !activeProfile) return { ok: false, error: "Name required" };
    if (newName === activeProfile) {
      setProfileAction(null);
      return { ok: true };
    }
    if (profileList.includes(newName)) return { ok: false, error: "Name already taken" };
    const nextList = profileList.map((p) => p === activeProfile ? newName : p);
    saveProfileData(newName, { defaultPlan, overrides, workoutTypes });
    deleteProfileData(activeProfile);
    setProfileList(nextList);
    saveProfileList(nextList);
    setActiveProfile(newName);
    saveActiveProfile(newName);
    setProfileAction(null);
    return { ok: true };
  };
  const deleteProfile = () => {
    if (!activeProfile) return;
    const remaining = profileList.filter((p) => p !== activeProfile);
    deleteProfileData(activeProfile);
    setProfileList(remaining);
    saveProfileList(remaining);
    if (remaining.length === 0) {
      setActiveProfile(null);
      saveActiveProfile(null);
      setDefaultPlan(INITIAL_DEFAULT_PLAN);
      setOverrides({});
      setWorkoutTypes(DEFAULT_WORKOUT_TYPES);
      setProfileAction("welcome");
    } else {
      switchProfile(remaining[0]);
    }
  };
  const exportProfile = () => {
    if (!activeProfile) return;
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      profileName: activeProfile,
      defaultPlan,
      overrides,
      workoutTypes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const today2 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProfile.toLowerCase().replace(/\s+/g, "-")}-workouts-${today2}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleImportFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid format");
        const data = {
          defaultPlan: parsed.defaultPlan || INITIAL_DEFAULT_PLAN,
          overrides: parsed.overrides || {},
          workoutTypes: parsed.workoutTypes || DEFAULT_WORKOUT_TYPES
        };
        let suggested = sanitizeProfileName(parsed.profileName || "Imported");
        let candidate = suggested;
        let n = 2;
        while (profileList.includes(candidate)) {
          candidate = `${suggested} ${n++}`;
        }
        setImportPreview({ suggestedName: candidate, data });
        setProfileAction("import");
      } catch (err) {
        alert("Could not read that file \u2014 it may not be a valid workout profile export.");
      }
    };
    reader.readAsText(file);
  };
  const weekRange = () => {
    const s = weekDates[0];
    const e = weekDates[6];
    const sM = s.toLocaleDateString("en-US", { month: "short" });
    const eM = e.toLocaleDateString("en-US", { month: "short" });
    if (sM === eM) return `${sM} ${s.getDate()}\u2013${e.getDate()}`;
    return `${sM} ${s.getDate()} \u2013 ${eM} ${e.getDate()}`;
  };
  const renderGhostCard = () => {
    if (!drag) return null;
    let typeId;
    if (drag.source === "library") {
      typeId = drag.typeId;
    } else if (drag.source === "day") {
      const data = resolveDayData(drag.fromDate, overrides, defaultPlan);
      typeId = data.workouts.find((w) => w.uid === drag.uid)?.type;
    }
    const type = typeById(typeId);
    if (!type) return null;
    const Icon = ICONS[type.icon];
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          backgroundColor: type.bg,
          borderLeft: `3px solid ${type.color}`,
          padding: 12,
          borderRadius: 6,
          boxShadow: "0 8px 24px rgba(26, 24, 22, 0.18)",
          transform: "rotate(-1.5deg)",
          width: drag.width
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
            /* @__PURE__ */ jsx(Icon, { size: 13, style: { color: type.color } }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontWeight: 600, color: type.color, fontFamily: "Geist, sans-serif" }, children: type.label })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "leading-tight",
              style: { color: type.color, opacity: 0.75, fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace" },
              children: type.sub
            }
          )
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .wp-body { font-family: 'Geist', system-ui, sans-serif; }
        .wp-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .wp-mono { font-family: 'JetBrains Mono', monospace; }
        .wp-draggable { touch-action: none; user-select: none; -webkit-user-select: none; cursor: grab; }
        .wp-draggable:active { cursor: grabbing; }
        .wp-card-hover { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .wp-card-hover:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(26, 24, 22, 0.06); }
        .wp-chip-hover { transition: transform 0.15s ease; }
        .wp-chip-hover:hover { transform: translateY(-2px); }
        .wp-scroll::-webkit-scrollbar { height: 6px; }
        .wp-scroll::-webkit-scrollbar-track { background: transparent; }
        .wp-scroll::-webkit-scrollbar-thumb { background: #D5CEC2; border-radius: 3px; }
        .wp-ghost-btn { opacity: 0.4; transition: opacity 0.15s ease; }
        .wp-ghost-btn:hover { opacity: 1; }
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "wp-body min-h-screen p-4 sm:p-6", style: { backgroundColor: "#F6F2EA", color: "#1A1816" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 pb-5",
            style: { borderBottom: "1px solid #D5CEC2" },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "wp-mono uppercase tracking-widest mb-2 flex items-center gap-2 flex-wrap",
                    style: { color: "#7A746C", fontSize: "0.68rem" },
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "Training Log \xB7 Week View" }),
                      activeProfile && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { style: { opacity: 0.4 }, children: "\xB7" }),
                        /* @__PURE__ */ jsxs(
                          "button",
                          {
                            onClick: () => setProfileAction("menu"),
                            className: "wp-mono uppercase tracking-widest",
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 10px",
                              background: "#FFFEFB",
                              border: "1px solid #D5CEC2",
                              borderRadius: 999,
                              color: "#1A1816",
                              fontSize: "0.62rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            },
                            title: "Profile menu",
                            children: [
                              /* @__PURE__ */ jsx(User, { size: 10 }),
                              activeProfile
                            ]
                          }
                        )
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "h1",
                  {
                    className: "wp-display leading-none",
                    style: { fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, letterSpacing: "-0.02em" },
                    children: [
                      /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic", fontWeight: 300 }, children: "The" }),
                      " Weekly Split"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setWeekOffset((w) => w - 1),
                    className: "p-2 rounded-full transition-colors",
                    style: { border: "1px solid #D5CEC2", background: "#FFFEFB", cursor: "pointer" },
                    "aria-label": "Previous week",
                    children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "text-right min-w-[140px]", children: [
                  /* @__PURE__ */ jsx("div", { className: "wp-display", style: { fontSize: "1.15rem", fontWeight: 500 }, children: weekRange() }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setWeekOffset(0),
                      disabled: weekOffset === 0,
                      className: "wp-mono uppercase tracking-wider",
                      style: {
                        color: weekOffset === 0 ? "#B5AFA3" : "#7A746C",
                        fontSize: "0.65rem",
                        marginTop: 2,
                        textDecoration: weekOffset === 0 ? "none" : "underline",
                        background: "transparent",
                        border: "none",
                        cursor: weekOffset === 0 ? "default" : "pointer"
                      },
                      children: weekOffset === 0 ? "This week" : "Back to today"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setWeekOffset((w) => w + 1),
                    className: "p-2 rounded-full transition-colors",
                    style: { border: "1px solid #D5CEC2", background: "#FFFEFB", cursor: "pointer" },
                    "aria-label": "Next week",
                    children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end mb-4", style: { minHeight: 32 }, children: [
          saveStatus === "idle" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSaveStatus("confirm"),
              className: "wp-mono uppercase tracking-wider",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: "transparent",
                border: "1px solid #D5CEC2",
                borderRadius: 6,
                color: "#7A746C",
                fontSize: "0.65rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "#FFFEFB";
                e.currentTarget.style.color = "#1A1816";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#7A746C";
              },
              title: "Apply this week's schedule to every untouched week",
              children: "\u25CE Save as default week"
            }
          ),
          saveStatus === "confirm" && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2",
              style: {
                padding: "4px 4px 4px 12px",
                background: "#FFFEFB",
                border: "1px solid #D5CEC2",
                borderRadius: 6
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "wp-mono",
                    style: { fontSize: "0.7rem", color: "#1A1816" },
                    children: "Apply to all untouched weeks?"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSaveStatus("idle"),
                    className: "wp-mono uppercase tracking-wider",
                    style: {
                      padding: "5px 10px",
                      background: "transparent",
                      border: "none",
                      color: "#7A746C",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderRadius: 4
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: saveWeekAsDefault,
                    className: "wp-mono uppercase tracking-wider",
                    style: {
                      padding: "5px 12px",
                      background: "#1A1816",
                      border: "none",
                      color: "#FFFEFB",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderRadius: 4
                    },
                    children: "Confirm"
                  }
                )
              ]
            }
          ),
          saveStatus === "saved" && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "wp-mono uppercase tracking-wider",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: "#E4E8EC",
                border: "1px solid #B5BFC8",
                borderRadius: 6,
                color: "#4A5F6B",
                fontSize: "0.65rem",
                fontWeight: 700
              },
              children: [
                /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 }),
                " Default updated"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "mb-5",
            style: {
              background: "#FFFEFB",
              borderRadius: 10,
              border: "1px solid #E5DFD3",
              padding: "18px 20px"
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-between mb-4 flex-wrap gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "wp-display",
                    style: {
                      fontSize: "1.15rem",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: "#1A1816",
                      lineHeight: 1.2
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic", fontWeight: 300 }, children: "Match" }),
                      " your workout to your recovery level"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "wp-mono",
                    style: { color: "#7A746C", fontSize: "0.65rem", marginTop: 4, maxWidth: 520, lineHeight: 1.4 },
                    children: "Designed to pair with your Whoop recovery, Garmin Body Battery, or just your subjective energy. Green cards cost more \u2014 save them for full-battery days."
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { style: { width: "100%", maxWidth: 680, margin: "0 auto" }, children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 680 118",
                  xmlns: "http://www.w3.org/2000/svg",
                  style: { width: "100%", height: "auto", display: "block" },
                  "aria-label": "Recovery to workout intensity thermometer",
                  children: [
                    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "therm-grad", x1: "0", y1: "0", x2: "1", y2: "0", children: [
                      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#2D5230" }),
                      /* @__PURE__ */ jsx("stop", { offset: "22%", stopColor: "#3F6B4A" }),
                      /* @__PURE__ */ jsx("stop", { offset: "42%", stopColor: "#7A8040" }),
                      /* @__PURE__ */ jsx("stop", { offset: "62%", stopColor: "#A67800" }),
                      /* @__PURE__ */ jsx("stop", { offset: "80%", stopColor: "#B6722A" }),
                      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#8B4A4A" })
                    ] }) }),
                    /* @__PURE__ */ jsxs("g", { fontFamily: "JetBrains Mono, monospace", fontSize: "9", fontWeight: "600", textAnchor: "middle", fill: "#1A1816", letterSpacing: "0.08em", children: [
                      /* @__PURE__ */ jsx("text", { x: "119", y: "12", fill: "#2D5230", children: "FULL" }),
                      /* @__PURE__ */ jsx("text", { x: "241", y: "12", fill: "#507344", children: "HIGH" }),
                      /* @__PURE__ */ jsx("text", { x: "363", y: "12", fill: "#7A8040", children: "MED" }),
                      /* @__PURE__ */ jsx("text", { x: "485", y: "12", fill: "#A67800", children: "LOW" }),
                      /* @__PURE__ */ jsx("text", { x: "607", y: "12", fill: "#8B4A4A", children: "EMPTY" })
                    ] }),
                    /* @__PURE__ */ jsxs("g", { fontFamily: "JetBrains Mono, monospace", fontSize: "7.5", textAnchor: "middle", fill: "#7A746C", letterSpacing: "0.06em", children: [
                      /* @__PURE__ */ jsx("text", { x: "119", y: "24", children: "GREEN" }),
                      /* @__PURE__ */ jsx("text", { x: "241", y: "24", children: "GREEN-YELLOW" }),
                      /* @__PURE__ */ jsx("text", { x: "363", y: "24", children: "YELLOW" }),
                      /* @__PURE__ */ jsx("text", { x: "485", y: "24", children: "YELLOW-RED" }),
                      /* @__PURE__ */ jsx("text", { x: "607", y: "24", children: "RED" })
                    ] }),
                    /* @__PURE__ */ jsx("circle", { cx: "36", cy: "72", r: "26", fill: "#2D5230", stroke: "#1A1816", strokeWidth: "2" }),
                    /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: "58",
                        y: "54",
                        width: "610",
                        height: "36",
                        rx: "18",
                        ry: "18",
                        fill: "url(#therm-grad)",
                        stroke: "#1A1816",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsx("rect", { x: "54", y: "58", width: "10", height: "28", fill: "#2D5230" }),
                    /* @__PURE__ */ jsxs("g", { stroke: "#FFFEFB", strokeWidth: "1.5", opacity: "0.55", children: [
                      /* @__PURE__ */ jsx("line", { x1: "180", y1: "60", x2: "180", y2: "84" }),
                      /* @__PURE__ */ jsx("line", { x1: "302", y1: "60", x2: "302", y2: "84" }),
                      /* @__PURE__ */ jsx("line", { x1: "424", y1: "60", x2: "424", y2: "84" }),
                      /* @__PURE__ */ jsx("line", { x1: "546", y1: "60", x2: "546", y2: "84" })
                    ] }),
                    /* @__PURE__ */ jsxs("g", { fontFamily: "Geist, sans-serif", fontSize: "9", fontWeight: "600", textAnchor: "middle", fill: "#FFFEFB", children: [
                      /* @__PURE__ */ jsx("text", { x: "119", y: "76", children: "Lift A \xB7 Speed" }),
                      /* @__PURE__ */ jsx("text", { x: "241", y: "76", children: "Lift B \xB7 Long" }),
                      /* @__PURE__ */ jsx("text", { x: "363", y: "76", children: "Lift C \xB7 Skills" }),
                      /* @__PURE__ */ jsx("text", { x: "485", y: "76", children: "Easy Z2 \xB7 Surf" }),
                      /* @__PURE__ */ jsx("text", { x: "607", y: "76", children: "Low Day \xB7 Rest" })
                    ] }),
                    /* @__PURE__ */ jsxs("g", { fontFamily: "JetBrains Mono, monospace", fontSize: "8", fill: "#7A746C", letterSpacing: "0.1em", children: [
                      /* @__PURE__ */ jsx("text", { x: "58", y: "108", textAnchor: "start", children: "\u2190 MORE ENERGY REQUIRED" }),
                      /* @__PURE__ */ jsx("text", { x: "668", y: "108", textAnchor: "end", children: "LESS ENERGY REQUIRED \u2192" })
                    ] })
                  ]
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-between mb-3 flex-wrap gap-2", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest", style: { color: "#1A1816", fontSize: "0.68rem", fontWeight: 600 }, children: "Workout Library" }),
            /* @__PURE__ */ jsx("div", { className: "wp-mono", style: { color: "#7A746C", fontSize: "0.65rem", marginTop: 2 }, children: "tap to read \xB7 drag onto a day \xB7 \u270E to edit \xB7 + to create new" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            workoutTypes.map((w) => {
              const Icon = ICONS[w.icon];
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "wp-draggable wp-chip-hover flex items-center gap-2 pl-3 pr-2 py-2 rounded-md",
                  onPointerDown: (e) => {
                    if (e.target.closest("button")) return;
                    startDrag(e, { source: "library", typeId: w.id });
                  },
                  style: {
                    backgroundColor: w.bg,
                    border: `1px solid ${w.color}26`,
                    borderLeft: `3px solid ${w.color}`
                  },
                  children: [
                    /* @__PURE__ */ jsx(Icon, { size: 14, style: { color: w.color } }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontWeight: 600, color: w.color }, children: w.label }),
                    /* @__PURE__ */ jsx("span", { className: "wp-mono", style: { color: w.color, opacity: 0.7, fontSize: "0.7rem" }, children: w.sub }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onPointerDown: (e) => e.stopPropagation(),
                        onClick: (e) => {
                          e.stopPropagation();
                          setEditing(w);
                        },
                        className: "wp-ghost-btn",
                        style: {
                          background: "transparent",
                          border: "none",
                          color: w.color,
                          padding: "2px 4px",
                          marginLeft: 2,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center"
                        },
                        "aria-label": `Edit ${w.label}`,
                        children: /* @__PURE__ */ jsx(Edit2, { size: 12 })
                      }
                    )
                  ]
                },
                w.id
              );
            }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setEditing("new"),
                className: "wp-chip-hover flex items-center gap-2 px-3 py-2 rounded-md",
                style: {
                  background: "#FFFEFB",
                  border: "1px dashed #1A1816",
                  borderLeft: "3px dashed #1A1816",
                  color: "#1A1816",
                  cursor: "pointer",
                  fontFamily: "Geist, sans-serif"
                },
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 14 }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontWeight: 600 }, children: "New" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "wp-scroll overflow-x-auto pb-2 -mx-2 px-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "grid gap-3",
            style: { gridTemplateColumns: "repeat(7, minmax(140px, 1fr))", minWidth: 980 },
            children: DAYS_OF_WEEK.map((dayName, idx) => {
              const date = weekDates[idx];
              const isToday = date.toDateString() === today.toDateString();
              const { workouts, recovery: dayRecovery } = resolveDayData(date, overrides, defaultPlan);
              const rec = recById(dayRecovery || "none");
              const isHover = hoverDay === idx;
              const allDone = workouts.length > 0 && workouts.every((w) => w.done);
              let bgColor = "#FFFEFB";
              if (allDone) bgColor = "#E4E8EC";
              if (isHover) bgColor = "#EFE9DC";
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-day-index": idx,
                  className: "rounded-lg p-3 flex flex-col",
                  style: {
                    backgroundColor: bgColor,
                    border: isToday ? "1.5px solid #1A1816" : allDone ? "1px solid #B5BFC8" : "1px solid #E5DFD3",
                    minHeight: 300,
                    transition: "background-color 0.25s ease, border-color 0.25s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3 pb-2", style: { borderBottom: "1px solid #EFE9DC" }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "wp-mono uppercase tracking-wider",
                            style: { color: isToday ? "#1A1816" : "#7A746C", fontWeight: 600, fontSize: "0.68rem" },
                            children: dayName
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "wp-display",
                            style: { fontSize: "1.6rem", fontWeight: 500, lineHeight: 1, marginTop: 2 },
                            children: date.getDate()
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                        allDone && /* @__PURE__ */ jsx(
                          "div",
                          {
                            title: "All done",
                            style: {
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: "#7BA884",
                              border: "1.5px solid #4E8155",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFEFB",
                              flexShrink: 0
                            },
                            children: /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => cycleRecovery(date),
                            title: `Recovery: ${rec.label}`,
                            className: "rounded-full transition-all",
                            style: {
                              width: 26,
                              height: 26,
                              backgroundColor: "#FFFEFB",
                              border: `2px solid ${rec.color}`,
                              flexShrink: 0,
                              cursor: "pointer",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: rec.color
                            },
                            "aria-label": `Recovery: ${rec.label}`,
                            children: rec.icon ? /* @__PURE__ */ jsx(rec.icon, { size: 13, strokeWidth: 2.25 }) : /* @__PURE__ */ jsx(Battery, { size: 13, strokeWidth: 1.75, style: { opacity: 0.4 } })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [
                      workouts.length === 0 && /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "flex-1 flex items-center justify-center rounded-md wp-mono uppercase tracking-wider text-center",
                          style: {
                            color: "#B5AFA3",
                            border: "1px dashed #D5CEC2",
                            minHeight: 80,
                            fontSize: "0.65rem",
                            padding: 8
                          },
                          children: "Rest \xB7 drop here"
                        }
                      ),
                      workouts.map((w) => {
                        const type = typeById(w.type);
                        if (!type) return null;
                        const Icon = ICONS[type.icon];
                        const isSource = drag?.source === "day" && drag.uid === w.uid;
                        const isDone = !!w.done;
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "wp-draggable wp-card-hover rounded-md p-3 group relative",
                            onPointerDown: (e) => {
                              if (e.target.closest("button")) return;
                              startDrag(e, { source: "day", uid: w.uid, fromDate: date });
                            },
                            style: {
                              backgroundColor: type.bg,
                              borderLeft: `3px solid ${type.color}`,
                              opacity: isSource ? 0.3 : isDone ? 0.72 : 1,
                              transition: "opacity 0.2s ease"
                            },
                            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                                  /* @__PURE__ */ jsx(Icon, { size: 13, style: { color: type.color, flexShrink: 0 } }),
                                  /* @__PURE__ */ jsx(
                                    "span",
                                    {
                                      className: "text-sm truncate",
                                      style: {
                                        fontWeight: 600,
                                        color: type.color,
                                        textDecoration: isDone ? "line-through" : "none",
                                        textDecorationColor: `${type.color}99`,
                                        textDecorationThickness: "1.5px"
                                      },
                                      children: type.label
                                    }
                                  )
                                ] }),
                                /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    className: "wp-mono leading-tight",
                                    style: { color: type.color, opacity: isDone ? 0.55 : 0.75, fontSize: "0.68rem" },
                                    children: type.sub
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 flex-shrink-0", children: [
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    onPointerDown: (e) => e.stopPropagation(),
                                    onClick: () => toggleWorkoutDone(date, w.uid),
                                    title: isDone ? "Mark as not done" : "Mark as done",
                                    "aria-label": isDone ? "Mark as not done" : "Mark as done",
                                    style: {
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      background: isDone ? "#7BA884" : "transparent",
                                      border: isDone ? "1.5px solid #4E8155" : `1.5px solid ${type.color}55`,
                                      color: isDone ? "#FFFEFB" : type.color,
                                      cursor: "pointer",
                                      padding: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background 0.15s ease, border-color 0.15s ease",
                                      opacity: isDone ? 1 : 0.6
                                    },
                                    onMouseEnter: (e) => {
                                      if (!isDone) e.currentTarget.style.opacity = "1";
                                    },
                                    onMouseLeave: (e) => {
                                      if (!isDone) e.currentTarget.style.opacity = "0.6";
                                    },
                                    children: /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 })
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    onPointerDown: (e) => e.stopPropagation(),
                                    onClick: () => removeWorkout(date, w.uid),
                                    className: "wp-ghost-btn",
                                    style: { color: type.color, background: "transparent", border: "none", cursor: "pointer", padding: 2 },
                                    "aria-label": "Remove",
                                    children: /* @__PURE__ */ jsx(X, { size: 14 })
                                  }
                                )
                              ] })
                            ] })
                          },
                          w.uid
                        );
                      })
                    ] })
                  ]
                },
                idx
              );
            })
          }
        ) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "mt-6 pt-5 flex flex-wrap items-center justify-between gap-4",
            style: { borderTop: "1px solid #D5CEC2" },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5 flex-wrap", children: [
                /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest", style: { color: "#7A746C", fontSize: "0.65rem" }, children: "Recovery" }),
                RECOVERY_STATES.filter((r) => r.id !== "none").map((r) => {
                  const BatteryIcon = r.icon;
                  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "rounded-full",
                        style: {
                          width: 20,
                          height: 20,
                          backgroundColor: "#FFFEFB",
                          border: `2px solid ${r.color}`,
                          color: r.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        },
                        children: /* @__PURE__ */ jsx(BatteryIcon, { size: 10, strokeWidth: 2.25 })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "wp-mono", style: { fontSize: "0.7rem" }, children: r.label })
                  ] }, r.id);
                })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "wp-mono", style: { color: "#7A746C", fontSize: "0.65rem" }, children: "tap \u2713 to complete \xB7 battery to cycle \xB7 click card to read" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { marginTop: "3.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "1.5rem" }, children: [
            /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest", style: { color: "#7A746C", fontSize: "0.68rem" }, children: "Reference \xB7 when to do what" }),
            /* @__PURE__ */ jsxs(
              "h2",
              {
                className: "wp-display leading-none",
                style: { fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, letterSpacing: "-0.02em", marginTop: 6 },
                children: [
                  /* @__PURE__ */ jsx("span", { style: { fontStyle: "italic", fontWeight: 300 }, children: "The" }),
                  " Playbook"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "2rem" }, children: [
            /* @__PURE__ */ jsx("div", { className: "wp-mono uppercase tracking-widest mb-3", style: { color: "#7A746C", fontSize: "0.65rem" }, children: "\u2190 By morning recovery" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "grid gap-3",
                style: { gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },
                children: PLAYBOOK_RECOVERY.map((r) => {
                  const BatteryIcon = r.icon;
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        background: "#FFFEFB",
                        borderRadius: 8,
                        borderTop: `3px solid ${r.color}`,
                        border: "1px solid #E5DFD3",
                        borderTopWidth: 3,
                        borderTopColor: r.color,
                        padding: "18px 20px"
                      },
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                backgroundColor: "#FFFEFB",
                                border: `2px solid ${r.color}`,
                                color: r.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              },
                              children: /* @__PURE__ */ jsx(BatteryIcon, { size: 11, strokeWidth: 2.25 })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "wp-mono uppercase tracking-widest",
                              style: { color: "#1A1816", fontSize: "0.75rem", fontWeight: 700 },
                              children: r.title
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "wp-display",
                              style: { color: "#7A746C", fontSize: "1rem", fontStyle: "italic", fontWeight: 300 },
                              children: r.tagline
                            }
                          )
                        ] }),
                        r.sections.map((s, i) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: i === r.sections.length - 1 ? 0 : 14 }, children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: "wp-mono uppercase tracking-wider",
                              style: { color: r.color, fontSize: "0.62rem", fontWeight: 600, marginBottom: 3 },
                              children: s.label
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                fontSize: "0.875rem",
                                lineHeight: 1.45,
                                color: "#1A1816",
                                fontFamily: "Geist, sans-serif"
                              },
                              children: s.body
                            }
                          )
                        ] }, i))
                      ]
                    },
                    r.id
                  );
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid gap-3",
              style: { gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" },
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      background: "#FFFEFB",
                      borderRadius: 8,
                      border: "1px solid #E5DFD3",
                      padding: "18px 20px"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                        /* @__PURE__ */ jsx(Waves, { size: 14, style: { color: "#4A7A5A" } }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "wp-mono uppercase tracking-widest",
                            style: { color: "#1A1816", fontSize: "0.75rem", fontWeight: 700 },
                            children: "Surf Conditions"
                          }
                        )
                      ] }),
                      PLAYBOOK_SURF.map((s, i) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: i === PLAYBOOK_SURF.length - 1 ? 0 : 14 }, children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "wp-mono uppercase tracking-wider",
                            style: { color: "#4A7A5A", fontSize: "0.62rem", fontWeight: 600, marginBottom: 3 },
                            children: s.label
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              fontSize: "0.875rem",
                              lineHeight: 1.45,
                              color: "#1A1816",
                              fontFamily: "Geist, sans-serif"
                            },
                            children: s.body
                          }
                        )
                      ] }, i))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      background: "#FFFEFB",
                      borderRadius: 8,
                      border: "1px solid #E5DFD3",
                      padding: "18px 20px"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                        /* @__PURE__ */ jsx(Target, { size: 14, style: { color: "#2D5230" } }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "wp-mono uppercase tracking-widest",
                            style: { color: "#1A1816", fontSize: "0.75rem", fontWeight: 700 },
                            children: "Weekly Caps"
                          }
                        )
                      ] }),
                      PLAYBOOK_CAPS.map((c, i) => /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: "flex items-baseline justify-between gap-3",
                          style: {
                            paddingTop: i === 0 ? 0 : 8,
                            paddingBottom: i === PLAYBOOK_CAPS.length - 1 ? 0 : 8,
                            borderBottom: i === PLAYBOOK_CAPS.length - 1 ? "none" : "1px solid #EFE9DC"
                          },
                          children: [
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: "wp-mono uppercase tracking-wider",
                                style: { color: "#2D5230", fontSize: "0.62rem", fontWeight: 600, flexShrink: 0 },
                                children: c.label
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: "text-right",
                                style: {
                                  fontSize: "0.82rem",
                                  lineHeight: 1.4,
                                  color: "#1A1816",
                                  fontFamily: "Geist, sans-serif"
                                },
                                children: c.body
                              }
                            )
                          ]
                        },
                        i
                      ))
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "wp-display italic",
              style: {
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #D5CEC2",
                color: "#7A746C",
                fontSize: "1rem",
                fontWeight: 300,
                textAlign: "center"
              },
              children: [
                "max 1 truly hard cardio day per week \u2014 speed ",
                /* @__PURE__ */ jsx("span", { style: { fontStyle: "normal" }, children: "or" }),
                " big surf, never both"
              ]
            }
          )
        ] })
      ] }),
      drag && (() => {
        const dx = drag.x - drag.startX;
        const dy = drag.y - drag.startY;
        const moved = Math.sqrt(dx * dx + dy * dy) > 6;
        if (!moved) return null;
        return /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "fixed",
              left: drag.x - drag.offsetX,
              top: drag.y - drag.offsetY,
              width: drag.width,
              pointerEvents: "none",
              zIndex: 50,
              opacity: 0.9
            },
            children: renderGhostCard()
          }
        );
      })(),
      editing && /* @__PURE__ */ jsx(
        WorkoutTypeModal,
        {
          initial: editing === "new" ? null : editing,
          isNew: editing === "new",
          onSave: saveWorkoutType,
          onDelete: deleteWorkoutType,
          onCancel: () => setEditing(null)
        }
      ),
      viewingType && /* @__PURE__ */ jsx(
        WorkoutDetailModal,
        {
          type: typeById(viewingType),
          details: WORKOUT_DETAILS[viewingType],
          onEdit: () => {
            const t = typeById(viewingType);
            if (t) {
              setViewingType(null);
              setEditing(t);
            }
          },
          onClose: () => setViewingType(null)
        }
      ),
      profileAction && /* @__PURE__ */ jsx(
        ProfileModal,
        {
          mode: profileAction,
          activeProfile,
          profileList,
          importPreview,
          onCreate: (name) => createProfile(name),
          onSwitch: (name) => switchProfile(name),
          onRename: (name) => renameProfile(name),
          onDelete: () => {
            deleteProfile();
            setProfileAction(null);
          },
          onExport: exportProfile,
          onTriggerImport: () => importInputRef.current?.click(),
          onConfirmImport: (name) => {
            if (!importPreview) return { ok: false, error: "No data" };
            const res = createProfile(name, importPreview.data);
            if (res.ok) setImportPreview(null);
            return res;
          },
          onChangeMode: (m) => setProfileAction(m),
          onClose: () => {
            if (profileAction === "welcome") return;
            setImportPreview(null);
            setProfileAction(profileList.length === 0 ? "welcome" : null);
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: importInputRef,
          type: "file",
          accept: "application/json,.json",
          style: { display: "none" },
          onChange: (e) => {
            const file = e.target.files?.[0];
            handleImportFile(file);
            e.target.value = "";
          }
        }
      )
    ] })
  ] });
}
export {
  WorkoutPlanner as default
};
