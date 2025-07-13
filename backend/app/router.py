from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services import rephrase_text

router = APIRouter()


@router.get("/process")
async def process_text(text: str):
    """
    Process the text and return the transformed text in multiple styles
    """
    return StreamingResponse(rephrase_text(text), media_type="text/event-stream")
