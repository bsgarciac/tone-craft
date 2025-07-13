import pytest
from app.utils import get_style_prompt


@pytest.mark.unit
class TestUtils:
    """Test cases for utils module"""

    def test_get_style_prompt_with_valid_input(self):
        """Test get_style_prompt with valid style and text"""
        style = "professional"
        text = "Hello world"
        expected = f"Rephrase the following in a {style} style: \\n {text}"
        
        result = get_style_prompt(style, text)
        
        assert result == expected