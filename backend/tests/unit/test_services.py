import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from app.services import OpenAIClient


@pytest.mark.unit
class TestOpenAIClient:
    """Test cases for OpenAIClient class"""

    @pytest.fixture
    def mock_env(self):
        """Mock environment variables"""
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'test-api-key'}):
            yield

    def test_openai_client_initialization(self, mock_env):
        """Test OpenAIClient initialization"""
        with patch('app.services.AsyncOpenAI') as mock_class:
            mock_client = AsyncMock()
            mock_class.return_value = mock_client
            
            client = OpenAIClient()
            
            assert client.client is not None
            mock_class.assert_called_once_with(api_key='test-api-key')

    @pytest.mark.asyncio
    async def test_rephrase_text_success(self, mock_env):
        """Test successful text rephrasing"""
        # Setup mock response
        mock_response = MagicMock()
        mock_response.type = 'output_text'
        mock_response.delta = 'Hello world'
        
        # Create async generator for the stream
        async def mock_stream():
            yield mock_response
        
        with patch('app.services.AsyncOpenAI') as mock_class:
            mock_client = AsyncMock()
            mock_client.responses.create.return_value = mock_stream()
            mock_class.return_value = mock_client
            
            # Create client and queue
            client = OpenAIClient()
            queue = asyncio.Queue()
            
            # Test rephrase_text
            await client.rephrase_text("polite", "Hello", queue)
            
            # Verify OpenAI API was called correctly
            mock_client.responses.create.assert_called_once_with(
                model="gpt-4o-mini",
                input="Rephrase the following in a polite style: \\n Hello",
                stream=True
            )
            
            # Verify message was put in queue
            assert not queue.empty()
            message = await queue.get()
            assert message == 'data: polite|Hello world\n\n'

    @pytest.mark.asyncio
    async def test_rephrase_text_multiple_chunks(self, mock_env):
        """Test text rephrasing with multiple response chunks"""
        # Setup mock responses
        mock_response1 = MagicMock()
        mock_response1.type = 'output_text'
        mock_response1.delta = 'Hello'
        
        mock_response2 = MagicMock()
        mock_response2.type = 'output_text'
        mock_response2.delta = ' world'
        
        # Create async generator for the stream
        async def mock_stream():
            yield mock_response1
            yield mock_response2
        
        with patch('app.services.AsyncOpenAI') as mock_class:
            mock_client = AsyncMock()
            mock_client.responses.create.return_value = mock_stream()
            mock_class.return_value = mock_client
            
            # Create client and queue
            client = OpenAIClient()
            queue = asyncio.Queue()
            
            # Test rephrase_text
            await client.rephrase_text("professional", "Hi", queue)
            
            # Verify messages were put in queue
            assert queue.qsize() == 2
            
            message1 = await queue.get()
            message2 = await queue.get()
            
            assert message1 == 'data: professional|Hello\n\n'
            assert message2 == 'data: professional| world\n\n'

    @pytest.mark.asyncio
    async def test_rephrase_text_api_error(self, mock_env):
        """Test handling of OpenAI API errors"""
        with patch('app.services.AsyncOpenAI') as mock_class:
            mock_client = AsyncMock()
            mock_client.responses.create.side_effect = Exception("API Error")
            mock_class.return_value = mock_client
            
            # Create client and queue
            client = OpenAIClient()
            queue = asyncio.Queue()
            
            # Test that exception is raised
            with pytest.raises(Exception, match="API Error"):
                await client.rephrase_text("polite", "Hello", queue)
