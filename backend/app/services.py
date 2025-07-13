from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
import asyncio
load_dotenv()


def get_style_prompt(style: str, text: str):
    return f"Rephrase the following in a {style} style: \\n {text}"

class OpenAIClient:

    def __init__(self): 
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def rephrase_text(self, style: str, text: str, queue: asyncio.Queue):
        prompt = get_style_prompt(style, text)

        stream = await self.client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            stream=True
        )  

        async for event in stream:
            if 'output_text' in event.type and hasattr(event, 'delta'):
                await queue.put(f'data: {style}|{event.delta}\n\n')    
