import requests
from flask import Flask, request

app = Flask(__name__)

API_VERSION="?api-version=2024-12-01-preview"
ASSISTANT_ID="asst_E3CaEmaLhVuJRxmMqbddaPrb"
API_KEY = "b0cdc8c2c60c43aea9bdd06503293064"
BASE_URL = "https://zala-dev-open-ai.openai.azure.com/openai"
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"

headers = {
    "api-key": API_KEY,
    "Content-Type": "application/json"
}

data = {
    "name": "LocationToAirports",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4o-mini"
}

## curl $AZURE_AI_AGENTS_ENDPOINT/assistants?api-version=2024-12-01-preview \
  # -H "Authorization: Bearer $AZURE_AI_AGENTS_TOKEN" \
  # -H "Content-Type: application/json" \
  # -d '{
  #   "instructions": "You are a helpful agent.",
  #   "name": "my-agent",
  #   "tools": [{"type": "code_interpreter"}],
  #   "model": "gpt-4o-mini"
  # }'


@app.route('/locations/<location>/airports')
def airports(location):

    ## create a request to the azure agents endpoint
    thread = requests.post(THREADS_ENDPOINT, headers=headers, json={})
    thread_id =  thread.json()['id']

    messages = f"{BASE_URL}/threads/{thread_id}/messages{API_VERSION}"
    runs = f"{BASE_URL}/threads/{thread_id}/runs{API_VERSION}"

    message = requests.post(messages, headers=headers, json={
        "role": "user",
        "content": location
    })
    run = requests.post(runs, headers=headers, json={
        "assistant_id": ASSISTANT_ID,
    })

    ## wait for the run to complete
    run_id = run.json()['id']
    run_status = f"{BASE_URL}/threads/{thread_id}/runs/{run_id}{API_VERSION}"
    run_status = requests.get(run_status, headers=headers)
    while run_status.json()['status'] != "completed":
        run_status = requests.get(run_status.json()['id'], headers=headers)

    message = requests.get(messages, headers=headers)

    return message.json()




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
    pass