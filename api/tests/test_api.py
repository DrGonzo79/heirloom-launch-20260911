from fastapi.testclient import TestClient
import pytest

from main import app

client = TestClient(app)
BASE = {
    "recipe_name": "Nona's Sunday Sauce",
    "category": "Sauce",
    "channel": "Local retail",
    "monthly_units": 650,
    "retail_price": 12.0,
    "unit_cost": 4.1,
    "startup_budget": 15000.0,
    "shelf_life_days": 180,
}


def test_screen_returns_economics_and_ranked_matches():
    response = client.post("/launches/screen", json=BASE)
    assert response.status_code == 200
    result = response.json()
    assert result["readinessScore"] == 96
    assert result["grossMarginPct"] == 66
    assert result["requiredCash"] == 9720
    assert result["budgetGap"] == 0
    assert result["blockers"] == []
    assert [item["id"] for item in result["matches"]] == ["harvest-kettle"]


def test_named_blockers_cover_margin_shelf_life_budget_and_match():
    result = client.post("/launches/screen", json={
        **BASE,
        "category": "Bakery",
        "monthly_units": 100,
        "retail_price": 5.0,
        "unit_cost": 3.0,
        "startup_budget": 1000.0,
        "shelf_life_days": 30,
    }).json()
    assert result["matches"] == []
    assert result["blockers"] == [
        "gross_margin_below_55_percent",
        "shelf_life_needs_validation",
        "first_run_budget_gap",
        "no_demo_copacker_match",
    ]


def test_channel_changes_contribution_and_cash_requirement():
    local = client.post("/launches/screen", json=BASE).json()
    grocery = client.post("/launches/screen", json={**BASE, "channel": "Regional grocery"}).json()
    assert grocery["monthlyContribution"] < local["monthlyContribution"]
    assert grocery["requiredCash"] > local["requiredCash"]


@pytest.mark.parametrize("payload", [
    {**BASE, "recipe_name": ""},
    {**BASE, "monthly_units": 0},
    {**BASE, "monthly_units": "650"},
    {**BASE, "retail_price": 4.0, "unit_cost": 4.1},
    {**BASE, "category": "Beverage"},
    {**BASE, "extra": True},
])
def test_invalid_inputs_are_rejected(payload):
    assert client.post("/launches/screen", json=payload).status_code == 422


def test_fixture_and_health_endpoints():
    assert len(client.get("/copackers").json()) == 4
    assert client.get("/health").json() == {"status": "ok", "mode": "demo", "source": "fictional_fixture"}
