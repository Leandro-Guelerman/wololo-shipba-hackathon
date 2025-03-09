import json
import logging

import flask
import requests
from fast_flights import get_flights, FlightData, Passengers
from flask import Flask, request, make_response, jsonify
from primp import Client
from selectolax.lexbor import LexborHTMLParser

from api.tool.flight_pb import get_tfs, custom_response_parser

app = Flask(__name__)

API_VERSION="?api-version=2024-12-01-preview"
LOCATION_TO_FLAGS_ASSISTANT_ID= "asst_NWA2VJMnoVqXaLYGnYg0DR4g"
API_KEY = "b0cdc8c2c60c43aea9bdd06503293064"
BASE_URL = "https://zala-dev-open-ai.openai.azure.com/openai"
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"
GEMINI_API_KEY="AIzaSyBpMsHl1hdAf8CRATuHEF_G36rg2TZRVv8"

WEATHER_ASSISTANT_ID="asst_1XycN0ou1XDzlRhseZOhN6O4"
CLASSIFIER_ASSISTANT_ID="asst_n3RDaIqAeEUJko7ZPiLpGhUv"

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


def fetch_civitatis(city, date_from, date_to):
    client = Client(impersonate="chrome_126", verify=False)

    query = "?"

    if date_from is not None:
        query += f"&fromDate={date_from}"
    if date_to is not None:
        query += f"&toDate={date_to}"


    city = city.lower().split(",")[0]

    res = client.get(f"https://www.civitatis.com/ar/{city}{query}")

    parser = LexborHTMLParser(res.text)
    activities = []

    for i, fl in enumerate(parser.css('div[class="o-search-list__item"]')):
        # Activity name
        name = fl.css_first('h2').text(
            strip=True
        )
        try:
            thumbnail_url = "https://civitatis.com"+fl.css_first('div[class="comfort-card__img"]').css_first('img').attributes['data-src']
        except:
            thumbnail_url = "N/A"
        ratings = fl.css_first('span[class="m-rating--text"]').text(
            strip=True
        )
        try:
            a = "https://civitatis.com"+ fl.css('a')[1].attributes['href']
        except:
            a = "N/A"
        price = fl.css_first('span[class="comfort-card__price__text"]').text(
            strip=True
        )
        try:
            duration = fl.css_first('div[class="comfort-card__features"]').text().split("\n\t")[2].replace("\t ", "").replace("\t","")
        except:
            duration = "N/A"
        # href = fl.css_first('a')
        activities.append({'name': name, 'href': a, 'thumbnail_url': thumbnail_url, 'price': price, 'ratings': ratings, 'duration': duration})

    print(activities)

    return activities

@app.route('/api/civitatis/<location>')
def civitatis(location):
    logging.info("location to airports")

    from_date = request.args.get('fromDate')
    to_date = request.args.get('toDate')

    return fetch_civitatis(location,from_date,to_date)

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

    client = Client(impersonate="chrome_126", verify=False)
    tfs = get_tfs(date_from, date_to, from_airport, to_airport, None)
    res = client.get(
        f"https://www.google.com/travel/flights?tfs={tfs}")
    departure_response = custom_response_parser(res)

    departure_flights = departure_response['flights']

    departure_flights = [d for d in departure_flights if d['stops'] == 0]

    return_flights = []

    if len(departure_flights) > 0:
        client = Client(impersonate="chrome_126", verify=False)

        for d in departure_flights:
            tfs = get_tfs(date_from, date_to, from_airport, to_airport, d)
            res = client.get(f"https://www.google.com/travel/flights?tfs={tfs}")
            return_flights = custom_response_parser(res)
            if len(return_flights) > 0:
                return_flights = return_flights['flights']
            else:
                return_flights = []
            d['return'] = return_flights

    output = {
        'flights': departure_flights
    }

    response = make_response(jsonify(output))
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
