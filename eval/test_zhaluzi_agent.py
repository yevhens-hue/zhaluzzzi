import os
import json
import pytest
from pathlib import Path
from dotenv import load_dotenv

load_dotenv("/Users/yevhen/Жалюзи/.env")
load_dotenv("/Users/yevhen/Cursor/Тестовое/oracle-agentic-ai/.env")

from agent_runner import ZhaluziAgentRunner

DATASET_PATH = Path(__file__).parent / "eval_dataset_zhaluzi.json"

@pytest.fixture(scope="session")
def dataset():
    with open(DATASET_PATH, encoding="utf-8") as f:
        return json.load(f)

@pytest.fixture(scope="session")
def agent():
    return ZhaluziAgentRunner()

class TestLeadExtractionAndHITL:
    """Tests verifying proper phone extraction and tool calling."""
    
    def test_lead_captured_on_phone_provided_uk(self, dataset, agent):
        case = next(c for c in dataset if c["id"] == "ZH-005")
        result = agent.process_message(case["input"], case["retrieved_context"])
        
        assert result["tool_called"] is True, "AI should call submitLead tool when phone is given"
        lead = result["extracted_lead"]
        assert "0671234567" in lead.get("phone", "") or "067" in lead.get("phone", "")
        assert "Київ" in lead.get("city", "") or "Киев" in lead.get("city", "")

    def test_lead_captured_on_phone_provided_ru(self, dataset, agent):
        case = next(c for c in dataset if c["id"] == "ZH-006")
        result = agent.process_message(case["input"], case["retrieved_context"])
        
        assert result["tool_called"] is True, "AI should call submitLead tool on RU call request"
        lead = result["extracted_lead"]
        assert "380509876543" in lead.get("phone", "") or "050" in lead.get("phone", "")

class TestNoHallucinations:
    """Verify that agent rejects impossible or false products."""
    
    def test_rejection_of_titanium_laser_blinds(self, dataset, agent):
        case = next(c for c in dataset if c["id"] == "ZH-004")
        result = agent.process_message(case["input"], case["retrieved_context"])
        content = result["content"].lower()
        
        assert "титановые" not in content or "не производим" in content or "нет" in content or "не предлагаем" in content
        assert "лазерным" not in content or "нет" in content or "не" in content

    def test_rejection_of_bulletproof_blinds(self, dataset, agent):
        case = next(c for c in dataset if c["id"] == "ZH-011")
        result = agent.process_message(case["input"], case["retrieved_context"])
        content = result["content"].lower()
        
        assert "бронированн" not in content or "нет" in content or "не производим" in content or "не защищают" in content

class TestDomainConsultations:
    """Verify quality, terminology, and accuracy of consultation queries."""
    
    @pytest.mark.parametrize("case_id", ["ZH-001", "ZH-002", "ZH-003", "ZH-007", "ZH-008", "ZH-009", "ZH-010", "ZH-012"])
    def test_consultation_contains_key_domain_terms(self, dataset, agent, case_id):
        case = next(c for c in dataset if c["id"] == case_id)
        result = agent.process_message(case["input"], case["retrieved_context"])
        content = result["content"].lower()
        
        # Check required keywords
        matched_any = any(term.lower() in content for term in case["expected_output_contains"])
        assert matched_any, f"[{case_id}] Expected at least one of {case['expected_output_contains']} in response. Got: {content}"
        
        # Check forbidden phrases
        for forbidden in case.get("should_not_contain", []):
            assert forbidden.lower() not in content, f"[{case_id}] Found forbidden phrase: '{forbidden}'"
