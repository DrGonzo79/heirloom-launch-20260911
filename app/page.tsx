"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, CheckCircle2, ChefHat, ChevronRight, CircleDollarSign, Factory, Heart, LoaderCircle, PackageCheck, Search, Sparkles, Store, XCircle } from "lucide-react";
import copackers from "@/data/copackers.json";

type Category = "Sauce" | "Spread" | "Snack" | "Bakery";
type Channel = "Local retail" | "Direct online" | "Regional grocery";
type Screen = { readinessScore: number; grossMarginPct: number; monthlyContribution: number; requiredCash: number; budgetGap: number; blockers: string[]; matches: typeof copackers };

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const pretty = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());

function screenLaunch(input: { category: Category; monthlyUnits: number; retailPrice: number; unitCost: number; startupBudget: number; shelfLifeDays: number; channel: Channel }): Screen {
  const channelCost = input.channel === "Direct online" ? 3.2 : input.channel === "Regional grocery" ? input.retailPrice * 0.35 : input.retailPrice * 0.18;
  const grossMarginPct = Math.round(((input.retailPrice - input.unitCost) / input.retailPrice) * 100);
  const matches = copackers.filter(packer => packer.categories.includes(input.category) && packer.minimumRun <= input.monthlyUnits * 3).sort((a, b) => a.minimumRun - b.minimumRun);
  const firstRun = matches[0]?.minimumRun ?? input.monthlyUnits * 3;
  const requiredCash = Math.round(firstRun * input.unitCost + 3600 + (input.channel === "Regional grocery" ? 4000 : 1200));
  const blockers = [
    ...(grossMarginPct < 55 ? ["gross_margin_below_55_percent"] : []),
    ...(input.shelfLifeDays < 120 ? ["shelf_life_needs_validation"] : []),
    ...(input.startupBudget < requiredCash ? ["first_run_budget_gap"] : []),
    ...(!matches.length ? ["no_demo_copacker_match"] : []),
  ];
  const readinessScore = Math.max(0, Math.min(100, 35 + Math.min(30, Math.round(grossMarginPct * .4)) + (input.shelfLifeDays >= 180 ? 15 : 4) + (input.startupBudget >= requiredCash ? 20 : 5) - (!matches.length ? 20 : 0)));
  return { readinessScore, grossMarginPct, monthlyContribution: Math.round((input.retailPrice - input.unitCost - channelCost) * input.monthlyUnits), requiredCash, budgetGap: Math.max(0, requiredCash - input.startupBudget), blockers, matches };
}

export default function Home() {
  const [recipeName, setRecipeName] = useState("Nona's Sunday Sauce");
  const [category, setCategory] = useState<Category>("Sauce");
  const [channel, setChannel] = useState<Channel>("Local retail");
  const [monthlyUnits, setMonthlyUnits] = useState(650);
  const [retailPrice, setRetailPrice] = useState(12);
  const [unitCost, setUnitCost] = useState(4.1);
  const [startupBudget, setStartupBudget] = useState(15000);
  const [shelfLifeDays, setShelfLifeDays] = useState(180);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState<Screen | null>(null);
  const [selectedPacker, setSelectedPacker] = useState<string | null>(null);
  const selected = useMemo(() => copackers.find(item => item.id === selectedPacker), [selectedPacker]);
  const resetResult = () => { setScreen(null); setSelectedPacker(null); setError(""); };

  async function runScreen() {
    resetResult();
    if (recipeName.trim().length < 3) return setError("Give the recipe a name with at least 3 characters.");
    if ([monthlyUnits, retailPrice, unitCost, startupBudget, shelfLifeDays].some(value => !Number.isFinite(value) || value <= 0)) return setError("Every operating assumption must be greater than zero.");
    if (retailPrice <= unitCost) return setError("Retail price must exceed the estimated unit cost.");
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 650));
    setScreen(screenLaunch({ category, monthlyUnits, retailPrice, unitCost, startupBudget, shelfLifeDays, channel }));
    setLoading(false);
  }

  return <div className="shell">
    <a className="skip" href="#workbench">Skip to launch workbench</a>
    <header className="topbar"><a className="brand" href="#top"><span><ChefHat size={19} /></span>Heirloom Launch</a><nav aria-label="Primary"><a className="active" href="#workbench">Workbench</a><a href="#method">Method</a></nav><div className="demo"><i /> FICTIONAL FIXTURES · SIMULATED SCREEN</div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><Heart size={14} /> FAMILY RECIPE → FIRST RUN</div><h1>Protect the story.<br /><em>Prove the numbers.</em></h1><p>Turn a treasured food recipe into a launch brief: screen margin, first-run cash, shelf-life risk, and demo co-packer fit before ordering a single jar.</p><a href="#workbench">Screen the fictional recipe <ArrowRight size={16} /></a></div><div className="recipe-card" aria-hidden="true"><div className="card-top"><span>RECIPE CARD · 1978</span><Heart size={14} /></div><h2>Sunday Sauce</h2><p>“Low and slow. Never rush the garlic.”</p><div className="path"><span><ChefHat /><small>Family recipe</small></span><i /><span><Factory /><small>First run</small></span><i /><span><Store /><small>First shelf</small></span></div><div className="stamp">STORY<br />STAYS</div></div></section>
      <section className="proof" id="method" aria-label="Launch method"><div><span>01</span><Heart /><p><strong>Capture the promise</strong>Name the memory and buyer occasion.</p></div><div><span>02</span><CircleDollarSign /><p><strong>Screen the run</strong>Expose margin and cash before design spend.</p></div><div><span>03</span><PackageCheck /><p><strong>Match production</strong>Shortlist capability, MOQ, and lead time.</p></div></section>
      <section className="workspace" id="workbench"><div className="section-head"><div><span>LAUNCH ROOM 01</span><h2>Build the first-run brief</h2></div><p>All companies, prices, certifications, scores, and outcomes shown below are fictional demo data.</p></div><div className="workgrid">
        <section className="brief" aria-labelledby="brief-title"><div className="panel-head"><div><small>PRODUCT ASSUMPTIONS</small><h3 id="brief-title">Recipe & economics</h3></div><Sparkles size={20} /></div><div className="form-grid">
          <label className="wide"><span>Recipe / working brand</span><input aria-label="Recipe name" value={recipeName} onChange={event => { setRecipeName(event.target.value); resetResult(); }} /></label>
          <fieldset className="wide"><legend>Product type</legend><div className="pills">{(["Sauce", "Spread", "Snack", "Bakery"] as Category[]).map(item => <button type="button" key={item} aria-pressed={category === item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); resetResult(); }}>{item}</button>)}</div></fieldset>
          <label><span>Monthly units</span><input aria-label="Monthly units" type="number" min="1" value={monthlyUnits} onChange={event => { setMonthlyUnits(Number(event.target.value)); resetResult(); }} /></label>
          <label><span>Target shelf life</span><div className="suffix"><input aria-label="Shelf life days" type="number" min="1" value={shelfLifeDays} onChange={event => { setShelfLifeDays(Number(event.target.value)); resetResult(); }} /><em>days</em></div></label>
          <label><span>Retail price</span><div className="prefix"><i>$</i><input aria-label="Retail price" type="number" min="0.01" step="0.1" value={retailPrice} onChange={event => { setRetailPrice(Number(event.target.value)); resetResult(); }} /></div></label>
          <label><span>Estimated unit cost</span><div className="prefix"><i>$</i><input aria-label="Unit cost" type="number" min="0.01" step="0.1" value={unitCost} onChange={event => { setUnitCost(Number(event.target.value)); resetResult(); }} /></div></label>
          <label><span>Startup budget</span><div className="prefix"><i>$</i><input aria-label="Startup budget" type="number" min="1" value={startupBudget} onChange={event => { setStartupBudget(Number(event.target.value)); resetResult(); }} /></div></label>
          <label><span>First channel</span><select aria-label="First channel" value={channel} onChange={event => { setChannel(event.target.value as Channel); resetResult(); }}><option>Local retail</option><option>Direct online</option><option>Regional grocery</option></select></label>
        </div><div className="form-foot"><p><AlertTriangle size={14} /> Screening only—food safety, process authority, labeling, insurance, and legal review remain required.</p><button className="run" onClick={() => void runScreen()} disabled={loading}>{loading ? <><LoaderCircle className="spin" size={17} />Screening the first run…</> : <>Run launch screen <ArrowRight size={16} /></>}</button></div></section>
        <aside className="result-panel" aria-labelledby="result-title"><div className="panel-head"><div><small>DEMO DECISION</small><h3 id="result-title">Launch screen</h3></div>{screen?.blockers.length === 0 ? <CheckCircle2 /> : <PackageCheck />}</div><div className="result" aria-live="polite">
          {error && <div className="error" role="alert"><AlertTriangle size={18} /><span>{error}</span></div>}
          {!screen && !error && <div className="idle"><ChefHat size={30} /><h4>No brief yet</h4><p>Set the operating assumptions and run the screen to see cash needs, blockers, and demo production matches.</p></div>}
          {screen && <><div className="score"><span><small>READINESS</small><strong>{screen.readinessScore}<i>/100</i></strong></span><div style={{ "--score": `${screen.readinessScore}%` } as React.CSSProperties}><i /></div></div><div className={screen.blockers.length ? "status blocked" : "status pass"}>{screen.blockers.length ? <XCircle size={18} /> : <CheckCircle2 size={18} />}<span><strong>{screen.blockers.length ? "Pause before packaging spend" : "Ready for a concierge feasibility call"}</strong><small>{screen.blockers.length ? `${screen.blockers.length} named blocker${screen.blockers.length > 1 ? "s" : ""}` : "Demo screen passed; human diligence still required."}</small></span></div><dl><div><dt>Gross margin</dt><dd>{screen.grossMarginPct}%</dd></div><div><dt>Monthly contribution</dt><dd>{money(screen.monthlyContribution)}</dd></div><div><dt>Cash for first run</dt><dd>{money(screen.requiredCash)}</dd></div><div><dt>Budget gap</dt><dd>{money(screen.budgetGap)}</dd></div></dl>
          {screen.blockers.length > 0 && <div className="blockers"><small>FIX BEFORE COMMITTING</small>{screen.blockers.map(item => <span key={item}><AlertTriangle size={12} />{pretty(item)}</span>)}</div>}
          <div className="matches"><small>FICTIONAL CO-PACKER MATCHES</small>{screen.matches.length ? screen.matches.map(item => <button key={item.id} className={selectedPacker === item.id ? "match selected" : "match"} onClick={() => setSelectedPacker(item.id)} aria-pressed={selectedPacker === item.id}><span><strong>{item.name}</strong><small>{item.location} · {item.minimumRun.toLocaleString()} unit MOQ · {item.leadWeeks} weeks</small></span><ChevronRight size={15} /></button>) : <div className="no-match"><Search size={18} /><span><strong>No demo match</strong><small>Increase 3-month volume or test a different product type.</small></span></div>}</div>
          {selected && <div className="selection"><Check size={15} /><span><strong>Brief route: {selected.name}</strong><small>{selected.strength}. Verify claims directly; this company is fictional.</small></span></div>}</>}
        </div></aside>
      </div></section>
    </main>
    <footer><a className="brand" href="#top"><span><ChefHat size={16} /></span>Heirloom Launch</a><p>Fictional prototype · No recipes, vendors, orders, compliance decisions, or payments are stored.</p><a href="https://github.com/DrGonzo79/heirloom-launch-20260911">Source & product notes <ChevronRight size={14} /></a></footer>
  </div>;
}
