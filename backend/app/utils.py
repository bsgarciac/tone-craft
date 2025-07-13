
def get_style_prompt(style: str, text: str):
    """
    Get the prompt to ask OpenAI to rephrase the text in the given style
    """
    return f"Rephrase the following in a {style} style: \\n {text}"