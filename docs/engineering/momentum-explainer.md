Here’s a plain‑language tour of every factor, what it “means”, how it moves up or down, and concrete mini‑examples. Think of Momentum as a mixing board with 10 dials (factors). Each dial ends up between 0 and 1 (0–100%). Weights decide how loudly each dial’s sound is heard in the final song (the Momentum score).

I’ll group them by domain and finish with two full worked composite examples.

HIGH-LEVEL ANALOGY
Imagine you’re training for a long hike:

Consistency is “Did you show up?”
Target is “Did you finish the day’s planned distance?”
Excess is “Did you go a little extra (but not hurt yourself)?”
Streak is “Have you been reliable multiple days in a row?”
Task factors are “Did you do the planned meaningful prep tasks, and were they legit tasks or just tiny fluff?”
Focus is “Did you have real, deep sessions vs scattered minutes?”
Activity Presence is “Did you actually move at all today, or was it a total rest/void?”
Trend is “Are you accelerating or slowing compared to the recent past?”
FACTOR BY FACTOR
HabitConsistency (HC) Plain meaning: How much of your habit target you actually completed today.
1.0 = you hit 100% of planned habit units (or more, capped)
0.5 = you did half
0 = you did nothing What raises it: Doing more of the day’s target. What lowers it: Skipping or doing only a small fraction. Examples:
Target 4, did 4 → HC = 1.0
Target 4, did 2 → HC = 0.5
Target 4, did 0 → HC = 0
HabitTarget (HT) Plain meaning: “Did you cross the finish line?” Strong reward only if you reach the line; near misses get partial, smaller credit.
If reached: 1.0
If close (e.g. 90%) a moderate partial value
If far (below ~50%) basically 0 Examples:
Target 5, did 5 → HT = 1.0
Target 5, did 4 (80%) → HT maybe ~0.36 (enough effort but not the full victory)
Target 5, did 2 (40%) → HT = 0
HabitExcess (HE) Plain meaning: A small bonus for going above target, with a cap so you can’t farm infinite score.
If you don’t reach target: 0
Small overage (e.g. +20%) gives a modest value (e.g. 0.4 if cap is +50%)
Huge overage still capped (prevents grinding) Examples (cap assumes +50%):
Target 4, did 4 → excess 0 → HE = 0
Target 4, did 5 → excess 25% → HE = 0.25 / 0.5 = 0.5
Target 4, did 8 → excess 100% but capped at 50% → HE = 1.0
HabitStreak (HS) Plain meaning: Reliability over consecutive successful days, scaled to a maximum (e.g. 30 days).
Each day you reach a target, streak increments
Missing target resets (or stays low) Examples (cap = 30):
Streak 1 → HS = 1/30 ≈ 0.03
Streak 7 → HS = 7/30 ≈ 0.23
Streak 40 → HS capped at 30/30 = 1.0
TaskCompletion (TC) Plain meaning: How fully you completed planned tasks (adjusted so wild over-completion doesn’t inflate).
If you complete exactly what you planned → near 1.0
If you do half → 0.5
If you massively overshoot → drops slightly below 1 to discourage stuffing Examples:
Planned 6, completed 6 → TC ≈ 1.0
Planned 6, completed 3 → TC = 0.5
Planned 6, completed 10 → TC maybe ~0.70 (over-completion penalty)
TaskQuality (TQ) Plain meaning: “How meaningful were the tasks?” If you supply an external quality ratio, it uses it; if not, neutral default (0.5). Examples:
Provided qualityRatio = 0.8 (strong tasks) → TQ = 0.8
No quality metric collected yet → TQ = 0.5
Low-value tasks ratio 0.3 → TQ = 0.3
TaskMicroPenalty (TMP) Plain meaning: Protects against flooding many micro (trivial) tasks. It starts at 1 (no penalty) and goes down as micro-task ratio grows.
microTaskRatio = portion of tasks that are “tiny” Examples (power curve):
microTaskRatio 0.0 → TMP = 1.0 (clean)
microTaskRatio 0.3 → penalty maybe ~0.21 → TMP ≈ 0.79
microTaskRatio 0.7 → penalty larger but capped (e.g. TMP might floor around 0.5)
FocusDepth (FD) Plain meaning: Deep, sustained focus minutes (quality work blocks), with diminishing returns after a healthy amount.
Reaching a “good day” threshold (e.g. ~2–3 hours deep) gives a solid value.
Extra hours past the cap don’t matter much. Examples (cap ~240 minutes):
45 deep minutes → base 45/240 ≈ 0.19 → eased ≈ 0.22
150 deep minutes → base 0.625 → eased ≈ 0.67
260 deep minutes → treated as 240 → FD ≈ 1.0
ActivityPresence (AP) Plain meaning: “Was the day totally void?” Encourages at least minimal engagement; two silent days punish more. Examples:
Day with decent XP (or a clear action) → AP = 1.0
Single zero day after active day → AP = 0.3 (soft landing)
Second zero day in a row → AP = 0.0 (void)
Small XP (e.g. 20% of threshold) → AP ≈ 0.16 (scaled)
Trend (TR) Plain meaning: Are you accelerating or losing steam relative to recent history?
Compares a short mini-average (e.g. last 3 days) vs a slightly longer previous slice (e.g. prior 7)
If short > previous by a healthy margin → above 0.5 (upward)
If flat → ~0.5
If declining → below 0.5 Examples:
Improvement (recent average modestly higher) → TR = 0.60–0.70
Flat line → TR = 0.50
Slipping (recent lower) → TR = 0.40
Sharp decline (capped) → TR maybe ~0.30
HOW THEY COMBINE
Each factor gets a value 0–1 for the day.
Missing domain factors (e.g. no tasks today) are set aside; their weight is redistributed among the remaining factors so you don’t get “free emptiness”.
Multiply each factor value by its effective weight.
Sum = raw composite (0–1).
Apply smoothing (EMA) so big swings soften.
Trend is then computed from the smoothed curve and retro‑applied as its own factor.
Final weighted sum × 100 = Momentum score.
Think “weighted average with some clever guardrails & smoothing”.

SINGLE-DAY EXAMPLE (Strong Balanced Day)
Assume (after reweight) rough weights: HC 0.18, HT 0.10, HE 0.05, HS 0.07, TC 0.18, TQ 0.07, TMP 0.05, FD 0.15, AP 0.10, TR 0.05 (sums to 1).

Inputs:

Habit target 4, did 4 → HC=1.0, HT=1.0, HE=0, streak=6 (HS=6/30≈0.20)
Tasks planned 6, completed 6 → TC=1.0; quality 0.8 → TQ=0.8; micro ratio 0.1 → TMP≈0.90
Focus 150 min → FD≈0.67
Activity normal → AP=1.0
Trend modestly up → TR=0.55
Weighted sum (approx): 0.181.0 + 0.101.0 + 0.050 + 0.070.20 + 0.181.0 + 0.070.8 + 0.050.90 + 0.150.67 + 0.101.0 + 0.050.55 = 0.18 + 0.10 + 0 + 0.014 + 0.18 + 0.056 + 0.045 + 0.1005 + 0.10 + 0.0275 ≈ 0.803 Score ≈ 80.3 → “Growth/Strong” zone.

Observations:

Excess bonus (HE) is 0 because user didn’t overshoot target; still a great day.
Streak modest (0.20) so its weighted effect small but positive.
Trend only a small nudge at the end.
ANOTHER DAY (Mediocre & Patchy)
Inputs:

Target 5, did 2 → HC=0.4; HT=0 (below half); no excess; streak broken (HS~0.03)
Tasks planned 5, completed 3 → TC=0.6; quality absent → TQ=0.5 default; micro ratio 0.5 → TMP≈0.65
Focus 30 min → FD≈0.18
Activity some small XP → AP=0.6 (scaled)
Trend slightly down → TR=0.45
Rough weighted total (same weights): 0.180.4 = 0.072 0.100 = 0 0.050 = 0 0.070.03≈0.0021 0.180.6 = 0.108 0.070.5 = 0.035 0.050.65= 0.0325 0.150.18≈0.027 0.100.6 = 0.06 0.050.45= 0.0225 Sum ≈ 0.359 → Score ≈ 35.9 (Recovery / Fragile region)

Key drags:

Low Target & Consistency
Weak focus
Micro penalty pulling tasks down
Downward trend not huge but still subtracts optimism
“WHAT SHOULD I DO IF **\_\_** ?” QUICK GUIDE
Low HC / HT: Finish or fully reach habit targets (not half).
HE always zero: You never go a bit beyond; try gentle +10–20% over occasionally (not every day).
HS low: Build a fresh run of consecutive days reaching targets.
TC weak: Either you under-complete or over-plan; align planned tasks to what you can realistically finish.
TQ stuck at 0.5: Start tagging or computing quality/importance so the factor can rise above neutral.
TMP low: Reduce spammy tiny tasks—batch them or group them into one meaningful task.
FD low: Commit to at least one substantial deep block (50+ focused minutes).
AP low / void: Do at least one intentional action to avoid a “silent” day.
TR below 0.5: String 2–3 slightly better days (even modest improvements) to flip the trend upward.
HOW MUCH DOES ONE FACTOR MATTER?
Because of reweighting, if you’re missing tasks entirely, habit + focus + trend weights expand to fill the gap. So a missing domain isn’t “free”—it increases scrutiny on what remains.

MINI CHEAT SHEET
Finish your habit targets (HT) before piling extras (HE).
Keep at least a small streak (HS) alive—streak builds slowly; protect it.
Plan realistically (TC) and avoid micro-task fragmentation (TMP).
Carve protected deep time (FD) for compounding gain.
Touch the system daily (AP) to prevent void penalties.
Chain a few improving days to lift TR.
IF YOU WANT A SIMPLER MENTAL MODEL
Momentum ≈ (Show Up + Finish Plans + Quality + Depth + Direction) balanced, smoothed over time, with small bonuses (excess, streak) and small penalties (void, micro spam). Keep every dial “above average” instead of chasing a single perfect dial.
