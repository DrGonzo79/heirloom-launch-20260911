# Product plan

## ICP and JTBD

**ICP:** the operating family member behind a shelf-stable sauce, spread, snack, or bakery recipe already selling 50–200 units/month informally, able to invest $10k–$25k, and located near independent grocers. **JTBD:** “Before I spend family money on packaging and inventory, show me whether this recipe can survive wholesale margin, process review, a realistic production run, and one retailer reorder without losing what makes it ours.”

## MVP and offer ladder

The MVP is a $750 fixed-scope screen: recipe/process intake, unit economics, cash requirement, claims and shelf-life dependencies, verified manufacturer outreach, and a 100-unit local pre-sell plan. The prototype implements input validation, margin and channel math, named blockers, readiness scoring, demo manufacturer matching, and route selection.

Offer ladder: free 15-minute fit call → $750 screen → $4,500 four-week local launch sprint → $12k–$25k operator-funded first run only after deposits/orders → selective revenue-share studio after three reorders. Excluded now: national brand launch, holding-company acquisition, recipe marketplace, automated certification, retailer guarantees, payments, AI-generated formulations, and paid advertising.

## Data model

- **RecipeOwner:** family, authority, contributors, rights evidence, approval and exit terms.
- **RecipeVersion:** ingredients, yield, allergens, process steps, source, hash, approved version.
- **ProductConcept:** category, occasion, story promise, claims, target format and channel.
- **CostScenario:** ingredient, packaging, labor, freight, channel fee, price, volume and margin.
- **SafetyDependency:** process authority, shelf-life test, allergen/label review, status and evidence.
- **Manufacturer:** capabilities, MOQ, certifications, lead time, geography and last verification date.
- **LaunchBrief:** scenario version, blockers, cash need, matches, decision and reviewer.
- **RetailPilot:** store, order, units, sampling, weekly sell-through, returns and reorder.

## Technical architecture

The demo is Next.js 16 App Router + TypeScript, statically exported with a repository base path. FastAPI exposes a strict `/launches/screen` operation. Both use `data/copackers.json`, an explicitly fictional fixture; Pages mirrors deterministic calculations client-side because it cannot run Python. Production uses Postgres for metadata, object storage for owner-approved recipe versions, a versioned calculation service, and a human review queue. Manufacturer data must carry verification timestamps; recipe access must be least-privilege and auditable.

## AI/model strategy

No model is needed for launch economics. Deterministic math and named rules are auditable. Later, an LLM may draft positioning variants from owner-approved story inputs and normalize manufacturer responses; retrieval may map process requirements to verified capability records. Models must never decide food safety, infer ownership, alter formulations, or publish family stories without approval. Track prompt/model versions, evidence links, human edits, and acceptance.

## Economics (assumptions, not forecasts)

A $750 screen uses 5 hours at $70 loaded cost plus $50 tools, yielding $350 contribution (47%). A $4,500 sprint assumes 35 hours ($2,450), $400 samples/tools, and $300 acquisition, yielding $1,350 contribution (30%). A first run should target 55%+ product gross margin before wholesale/channel costs and require deposits or retailer commitments covering at least 50% of inventory cash. The demo’s unit economics are fictional and omit taxes, spoilage, slotting, brokerage, discounts, returns, and working-capital timing.

Kill the wedge if 10 screens produce fewer than three paid sprints, fewer than two written trial orders, first-run contribution is negative after all landed costs, or no product earns a reorder within eight weeks. Do not launch a holding company until three unrelated products each earn two reorders with shared operations.

## Validation, GTM, and moat

Recruit through farmers-market managers, shared kitchens, state food incubators, and independent grocers—not broad founder ads. Observe five costing/manufacturer calls, sell three screens, ask two grocers for written trial criteria, pre-sell 100 units, then measure lead conversion, screen-to-sprint conversion, margin error, time to manufacturer response, weekly sell-through, returns, and reorder. The moat is not branding or a manufacturer directory; it is the accumulated graph of verified process-to-manufacturer fit, landed-cost accuracy, retailer acceptance, sell-through, and family-safe operating terms.

## Risks

Recipe ownership disputes; undisclosed allergens; unsafe process or unsupported shelf life; false manufacturer certifications; MOQ and freight destroying margin; story exploitation; retailer returns; perishable inventory; channel concentration; services-heavy margins; family disagreement; and regulatory variance. Food safety and legal approvals are hard gates, not disclaimers after launch.

## 30/60/90 days

- **30:** observe five sellers, conduct ten interviews, sell three screens, collect two retailer trial criteria documents.
- **60:** complete two verified co-packer outreach cycles and one 100-unit pre-sell; measure actual landed-cost error.
- **90:** run one compliant local pilot and require a reorder. If none, stop production operations and retain the screening service only.
