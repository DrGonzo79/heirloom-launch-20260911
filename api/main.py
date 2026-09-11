import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, model_validator

app = FastAPI(title="Heirloom Launch Feasibility API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
copackers = json.loads((Path(__file__).resolve().parent.parent / "data/copackers.json").read_text())


class LaunchRequest(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    recipe_name: str = Field(min_length=3, max_length=100)
    category: Literal["Sauce", "Spread", "Snack", "Bakery"]
    channel: Literal["Local retail", "Direct online", "Regional grocery"]
    monthly_units: int = Field(gt=0, le=1_000_000)
    retail_price: float = Field(gt=0, le=10_000)
    unit_cost: float = Field(gt=0, le=10_000)
    startup_budget: float = Field(gt=0, le=100_000_000)
    shelf_life_days: int = Field(gt=0, le=3650)

    @model_validator(mode="after")
    def validate_economics(self):
        if self.retail_price <= self.unit_cost:
            raise ValueError("retail_price_must_exceed_unit_cost")
        if not self.recipe_name.strip():
            raise ValueError("recipe_name_blank")
        return self


@app.get("/health")
def health():
    return {"status": "ok", "mode": "demo", "source": "fictional_fixture"}


@app.get("/copackers")
def list_copackers():
    return copackers


@app.post("/launches/screen")
def screen_launch(request: LaunchRequest):
    channel_cost = 3.2 if request.channel == "Direct online" else request.retail_price * (0.35 if request.channel == "Regional grocery" else 0.18)
    gross_margin = round(((request.retail_price - request.unit_cost) / request.retail_price) * 100)
    matches = sorted(
        [item for item in copackers if request.category in item["categories"] and item["minimumRun"] <= request.monthly_units * 3],
        key=lambda item: item["minimumRun"],
    )
    first_run = matches[0]["minimumRun"] if matches else request.monthly_units * 3
    required_cash = round(first_run * request.unit_cost + 3600 + (4000 if request.channel == "Regional grocery" else 1200))
    blockers = []
    if gross_margin < 55:
        blockers.append("gross_margin_below_55_percent")
    if request.shelf_life_days < 120:
        blockers.append("shelf_life_needs_validation")
    if request.startup_budget < required_cash:
        blockers.append("first_run_budget_gap")
    if not matches:
        blockers.append("no_demo_copacker_match")
    readiness = max(0, min(100, 35 + min(30, round(gross_margin * 0.4)) + (15 if request.shelf_life_days >= 180 else 4) + (20 if request.startup_budget >= required_cash else 5) - (20 if not matches else 0)))
    return {
        "readinessScore": readiness,
        "grossMarginPct": gross_margin,
        "monthlyContribution": round((request.retail_price - request.unit_cost - channel_cost) * request.monthly_units),
        "requiredCash": required_cash,
        "budgetGap": max(0, round(required_cash - request.startup_budget)),
        "blockers": blockers,
        "matches": matches,
        "disclaimer": "Fictional feasibility screen only; food safety, process authority, labeling, insurance, legal review, and vendor verification are required.",
    }
