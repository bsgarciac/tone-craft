from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()


async def rephrase_text(text: str):
    prompt = f"""Rephrase the following text in four different writing styles:

    Input: "{text}"

    Styles:
    - professional
    - casual
    - polite
    - social_media
     
    Return in a JSON string format with no extra text or explanation or formatting
    """

    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    stream = client.responses.create(
        model="gpt-4o-mini",
        input=prompt,
        stream=True
    )

    for event in stream:
        if 'output_text' in event.type and hasattr(event, 'delta'):
            yield f'data: {event.delta}\n\n'

    yield 'data: [DONE]\n\n'
    
