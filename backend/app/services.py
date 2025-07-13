from openai import OpenAI
import openai
import json
from dotenv import load_dotenv
import os
load_dotenv()


def rephrase_text(text: str):
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
    )

    return json.loads(stream.output_text)
