from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.services import OpenAIClient
import asyncio

router = APIRouter()

def get_openai_client() -> OpenAIClient:
    return OpenAIClient()

@router.get("/process")
async def process_text(text: str, openai_client: OpenAIClient = Depends(get_openai_client)):
    """
    Process the text and return the transformed text in multiple styles
    
    Characteristics:
    - It uses OpenAI's GPT-4o-mini as the model to rephrase the text in the given style
    - It uses EventSource to stream the response to the client
    - It uses asyncio to handle the async operations, so each style is processed in a separate task
    - It uses a queue to collect the results from the OpenAI API
    """

    styles = ["polite", "social_media", "professional", "casual"]

    queue = asyncio.Queue()

    async def generate_stream():
        tasks = [
            asyncio.create_task(openai_client.rephrase_text(style, text, queue)) 
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
