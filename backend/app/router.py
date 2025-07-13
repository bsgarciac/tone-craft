from fastapi import APIRouter
from app.models import TextInput
from app.services import rephrase_text

router = APIRouter()


@router.post("/process/")
def process_text(data: TextInput):
    """
    Process the text and return the transformed text in multiple styles

    TODO: Add streaming response
    """
    return rephrase_text(data.text)
