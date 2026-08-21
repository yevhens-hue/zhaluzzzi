import pytest

@pytest.hookimpl(tryfirst=True)
def pytest_configure(config):
    print("\n🔍 Запуск автоматического тестирования AI-Консультанта «Жалюзи»...")

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call":
        status = "PASSED ✅" if report.passed else "FAILED ❌"
        print(f"  [{status}] {item.name}")
