import json
import logging

import flask
import requests
from fast_flights import get_flights, FlightData, Passengers
from flask import Flask, request, make_response, jsonify
from primp import Client

app = Flask(__name__)

API_VERSION="?api-version=2024-12-01-preview"
LOCATION_TO_FLAGS_ASSISTANT_ID= "asst_NWA2VJMnoVqXaLYGnYg0DR4g"
API_KEY = "b0cdc8c2c60c43aea9bdd06503293064"
BASE_URL = "https://zala-dev-open-ai.openai.azure.com/openai"
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"

WEATHER_ASSISTANT_ID="asst_1XycN0ou1XDzlRhseZOhN6O4"
CLASSIFIER_ASSISTANT_ID="asst_m4OgwsdABhShlwZCraDDMWPp"

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

@app.route('/api/classifier', methods=["POST"])
def classifier():
    logging.info("classifier running")
    content = request.json

    thread_id, run_id = post_message(CLASSIFIER_ASSISTANT_ID, content['text'])
    return parse_message(thread_id, run_id)

@app.route('/api/locations/<location>/airports')
def airports(location):
    logging.info("location to airports")
    thread_id, run_id = post_message(LOCATION_TO_FLAGS_ASSISTANT_ID, location)
    return parse_message(thread_id, run_id)

@app.route('/api/flights/<from_airport>/<to_airport>/<date_from>/<date_to>/<passengers>')
def flights(from_airport, to_airport,date_from,date_to,passengers):
    logging.info("searching flights")

    flights = get_flights(
        flight_data=[
            FlightData(date=date_from, from_airport=from_airport, to_airport=to_airport)
        ],
        trip="round-trip",
        seat="economy",
        passengers=Passengers(adults=int(passengers), children=0, infants_in_seat=0, infants_on_lap=0),
        fetch_mode="fallback",
    )

    ##
    # flight: [{
    #     departure: {
    #         cityName: 'Madrid',
    #         airport: 'MAD',
    #         date: '2024-07-15T08:00:00Z'
    #     },
    #     arrival: {
    #         cityName: 'Barcelona',
    #         airport: 'BCN',
    #         date: '2024-07-15T09:30:00Z'
    #     },
    #     numberOfStops: 2
    # }]

    response = make_response(jsonify(flights))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


@app.route('/api/locations/<location>/duration/<duration>/weather')
def weather(location, duration):
    logging.info("location pull weather")

    ## flask get the query params called arrivalDate
    departure_date = request.args.get('departureDate')
    arrival_date = request.args.get('arrivalDate')


    data = {
        'location': location,
        'duration': duration
    }

    if departure_date is not None:
        data['departureDate'] = departure_date

    if arrival_date is not None:
        data['arrivalDate'] = arrival_date

    logging.info(json.dumps(data))

    thread_id, run_id = post_message(WEATHER_ASSISTANT_ID, json.dumps(data))
    return parse_message(thread_id, run_id)

def post_message(assistant_id: str, message_input: str):
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
        "assistant_id": assistant_id,
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
    logging.info("message received: " + json.dumps(data))
    ## filter the data by role == assistant
    data = [d for d in data if d['role'] == 'assistant']
    ## get first message
    output = data[0]['content'][0]['text']['value']
    output = output.replace("\n", "")
    output = output.replace("```json", "")
    output = output.replace("```", "")
    output = output.replace("'", "\"")

    logging.info(output)
    print(output)
    json_output = json.loads(output)

    response = make_response(jsonify(json_output))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    pass
