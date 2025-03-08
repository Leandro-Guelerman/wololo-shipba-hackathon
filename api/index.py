import json
import logging

import requests
from flask import Flask

app = Flask(__name__)

API_VERSION="?api-version=2024-12-01-preview"
ASSISTANT_ID="asst_NWA2VJMnoVqXaLYGnYg0DR4g"
API_KEY = "b0cdc8c2c60c43aea9bdd06503293064"
BASE_URL = "https://zala-dev-open-ai.openai.azure.com/openai"
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"

# test

headers = {
    "api-key": API_KEY,
    "Content-Type": "application/json"
}

data = {
    "name": "LocationToAirports",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o-mini"
}

@app.route('/api/assistants/location-to-airports')
def create_assistant():
    assistant_data = {
        "instructions": """### Role ###

    Airport Finder

    ### Task ###

    You will receive a location your task is to find the airports near the provided location.

    ### Constraints ###

    - If you do not recognize the location output: {error: true}

    ### Output ###

    Output a json with a list of airports that follows the following template:

    {

    "main": {"key": "EZE", "name": "Ezeiza Ministro Pistarini", "international": true}

    "others": [{"key": "AEP", "name": "Aeroparque Jorge Newbery", "international": false}]

    }

     """,
        "name": "LocationToAirportsAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


@app.route('/api/locations/<location>/airports')
def airports(location):
    logging.info("location to airports")
    thread_id, run_id = post_message(location)
    return parse_message(thread_id, run_id)

def post_message(message_input: str):
    thread = requests.post(THREADS_ENDPOINT, headers=headers, json={})
    thread_id = thread.json()['id']
    logging.info("thread id: " + thread_id)

    messages = f"{BASE_URL}/threads/{thread_id}/messages{API_VERSION}"
    runs = f"{BASE_URL}/threads/{thread_id}/runs{API_VERSION}"

    # push message
    requests.post(messages, headers=headers, json={
        "role": "user",
        "content": message_input
    })
    logging.info("message done")

    run = requests.post(runs, headers=headers, json={
        "assistant_id": ASSISTANT_ID,
    })
    return thread_id, run.json()['id']


def parse_message(thread_id, run_id: str):
    messages = f"{BASE_URL}/threads/{thread_id}/messages{API_VERSION}"

    run_url = f"{BASE_URL}/threads/{thread_id}/runs/{run_id}{API_VERSION}"
    run_status = requests.get(run_url, headers=headers)
    while run_status.json()['status'] != "completed":
        run_status = requests.get(run_url, headers=headers)
    pass
    message = requests.get(messages, headers=headers)
    data = message.json()['data']
    logging.info("message received: " + data)
    ## filter the data by role == assistant
    data = [d for d in data if d['role'] == 'assistant']
    ## get first message
    return json.loads(data[0]['content'][0]['text']['value'])

# if __name__ == "__main__":
#     pass
