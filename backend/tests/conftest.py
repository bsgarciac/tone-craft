import pytest
from fastapi.testclient import TestClient
from app.main import app

# Suppress pytest warnings about unknown markers
pytest_plugins = []


@pytest.fixture
def client():
    """Test client for FastAPI application"""
    return TestClient(app)

def pytest_configure(config):
    """Configure pytest to suppress warnings"""
    config.addinivalue_line(
        "markers", "unit: Unit tests"
    )
    config.addinivalue_line(
        "markers", "integration: Integration tests"
    )
    config.addinivalue_line(
        "markers", "asyncio: Async tests"
    )

