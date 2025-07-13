import pytest
import asyncio
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from app.main import app
from app.router import get_openai_client


@pytest.mark.unit
class TestRouter:
    """Test cases for router endpoints"""

    @pytest.fixture(autouse=True)
    def cleanup_dependencies(self):
        """Clean up dependency overrides after each test"""
        yield
        app.dependency_overrides = {}

    @pytest.fixture
    def mock_openai_client(self):
        """Mock OpenAI client"""
        mock_client = AsyncMock()
        # Default mock for rephrase_text
        async def default_rephrase_text(style, text, queue):
            await queue.put(f'data: {style}|mocked\n\n')
        mock_client.rephrase_text.side_effect = default_rephrase_text
        return mock_client

    @pytest.fixture
    def client(self, mock_openai_client):
        """Test client with mocked dependencies"""
        # Override the dependency function
        app.dependency_overrides = {
            get_openai_client: lambda: mock_openai_client
        }
        return TestClient(app)

    def test_process_endpoint_exists(self, client):
        """Test that /process endpoint exists"""
        response = client.get("/process", params={"text": "Hello"})
        assert response.status_code in [200, 422]  

    def test_process_endpoint_response_type(self, client):
        """Test that /process endpoint returns streaming response"""
        response = client.get("/process", params={"text": "Hello world"})
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")

    @pytest.mark.asyncio
    async def test_process_endpoint_streaming_response(self, mock_openai_client):
        """Test streaming response from /process endpoint"""
        # Override the mock for this specific test
        async def mock_rephrase_text(style, text, queue):
            await queue.put(f'data: {style}|Hello\n\n')
            await queue.put(f'data: {style}| world\n\n')
        mock_openai_client.rephrase_text.side_effect = mock_rephrase_text
        
        # Override the dependency function
        app.dependency_overrides = {
            get_openai_client: lambda: mock_openai_client
        }
        
        client = TestClient(app)
        response = client.get("/process", params={"text": "Hi"})
        assert response.status_code == 200
        assert "text/event-stream" in response.headers.get("content-type", "")