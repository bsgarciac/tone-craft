from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services import OpenAIClient
import asyncio

router = APIRouter()


@router.get("/process")
async def process_text(text: str):
    """
    Process the text and return the transformed text in multiple styles
    """

    styles = ["polite", "social_media", "professional", "casual"]

    queue = asyncio.Queue()

    async def generate_stream():
        client = OpenAIClient()
        tasks = [
            asyncio.create_task(client.rephrase_text(style, text, queue)) 
            for style in styles
        ]

        try:
            done = False
            while not done or not queue.empty():
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=10)
                    yield message
                except asyncio.TimeoutError:
                    done = all(task.done() for task in tasks)

            yield 'data: [DONE]\n\n'
        finally:
            for task in tasks:
                task.cancel()
                
        
    return StreamingResponse(generate_stream(), media_type="text/event-stream")
