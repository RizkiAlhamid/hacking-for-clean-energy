import os
from dotenv import load_dotenv
from openai import OpenAI
from googlesearch import search as google_search


load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_APIKEY")

SEARCH_TEMPLATE = """
You are a search engine and you need to generate a search query based on the user's prompt. \n
Given the following user prompt, return a query that can be 
used to search the internet for relevant information. \n
You should return only the query string without any additional sentences. \n
Do not make queries too specific.

For example, if the user prompt is: 
What is the capital of France?

You should return:
capital of France

If you return something else, you will get a really bad grade. \n
"""

def internet_search(user_prompt: str, llm_model: str, openai_apikey: str, max_results: int = 1) -> set[str]:

    client = OpenAI(api_key=openai_apikey)

    stream = client.chat.completions.create(
        model=llm_model,
        messages=[
            {"role": "system", "content": SEARCH_TEMPLATE },
            {"role": "user", "content": user_prompt}
        ],
    )

    search_query = stream.choices[0].message.content
    return_set = set()
    for url in google_search(search_query, num_results=max_results):
        return_set.add(url)

    return return_set