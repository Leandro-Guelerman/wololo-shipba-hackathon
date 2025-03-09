import json
import logging
import re
from typing import TYPE_CHECKING, Any

import requests
from flask import Flask, request, make_response, jsonify
from primp import Client
from selectolax.lexbor import LexborHTMLParser

from api.tool.flight_pb import get_tfs, custom_response_parser

import api.tool.flights_trip_pb2 as PB

if TYPE_CHECKING:
    PB: Any


app = Flask(__name__)

API_VERSION="?api-version=2024-12-01-preview"
LOCATION_TO_AIRPORTS_ASSISTANT_ID= "asst_iiBi1RdmT53DBWajaWfanSU4"
LOCATION_RESTRICTIONS_ID="asst_p796twbeakiJHYtx2DtCe8Be"
BEST_FLIGHT_ID="asst_CMUL2VRQ9TE8p6rFRPfHKetG"
API_KEY = "b0cdc8c2c60c43aea9bdd06503293064"
BASE_URL = "https://zala-dev-open-ai.openai.azure.com/openai"
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"
GEMINI_API_KEY="AIzaSyBpMsHl1hdAf8CRATuHEF_G36rg2TZRVv8"

WEATHER_ASSISTANT_ID="asst_AzIKA51ejblUPhoUm2P4a5u9"
CLASSIFIER_ASSISTANT_ID="asst_tIKsx7GapFw1e3GQCpZv6XUf"
ACTIVITIES_ASSISTANT_ID="asst_CrrUWATJ9Z73vcTn1nDpZeS1"
HOTELS_SPANISH_ID="asst_c5TSNZJAWHX4caWrUSvPAGqD"

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

def parse_proto(date_from, date_to, airport_from, airport_to, flight_selected) -> bytes:
    round_trip_data = PB.RoundTripData()

    departure_flights = round_trip_data.flights_data.add()
    departure_flights.date = date_from
    departure_flights.airport_from.path = airport_from
    departure_flights.airport_to.path = airport_to

    if flight_selected is not None:
        departure_flight_1 = departure_flights.flights.add()
        departure_flight_1.date = date_from
        departure_flight_1.from_airport = airport_from
        departure_flight_1.to_airport = airport_to
        departure_flight_1.airline =flight_selected['flight_codes'][0][0]
        departure_flight_1.flight_number = flight_selected['flight_codes'][0][1]

        # departure_flight_2 = departure_flights.flights.add()
        # departure_flight_2.date = date_from
        # departure_flight_2.from_airport = "ATH"
        # departure_flight_2.to_airport = "RHO"
        # departure_flight_2.airline = "A3"
        # departure_flight_2.flight_number = "206"

        return_flight = round_trip_data.flights_data.add()
        return_flight.date = date_to
        return_flight.airport_from.path = airport_to
        return_flight.airport_to.path = airport_from

    round_trip_data.passengers.append(1)
    round_trip_data.seat = 1
    round_trip_data.trip = 1

    return round_trip_data.SerializeToString()

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
            a = "#"

        try:
            price = float(fl.css_first('span[class="comfort-card__price__text"]')
                          .text(strip=True).replace("US$", "").split(",")[0]) * 1086
        except:
            price = 0
        try:
            duration = fl.css_first('div[class="comfort-card__features"]').text().split("\n\t")[2].replace("\t ", "").replace("\t","")
        except:
            duration = "N/A"
        # href = fl.css_first('a')
        activities.append({'name': name, 'href': a, 'thumbnail_url': thumbnail_url, 'price': price, 'ratings': ratings, 'duration': duration})

    print(activities)

    sorted_list = sorted(activities, key=lambda x: x['ratings'], reverse=True)

    return sorted_list

@app.route('/api/civitatis/<location>')
def civitatis(location):
    logging.info("location to airports")

    from_date = request.args.get('fromDate')
    to_date = request.args.get('toDate')

    activities = fetch_civitatis(location, from_date, to_date)
    thread_id, run_id = post_message(ACTIVITIES_ASSISTANT_ID, json.dumps(activities))
    return parse_message(thread_id, run_id)

@app.route('/api/classifier', methods=["POST"])
def classifier():
    logging.info("classifier running")
    content = request.json

    thread_id, run_id = post_message(CLASSIFIER_ASSISTANT_ID, content['text'])
    return parse_message(thread_id, run_id)

@app.route('/api/locations/<location>/airports')
def airports(location):
    logging.info("location to airports")
    thread_id, run_id = post_message(LOCATION_TO_AIRPORTS_ASSISTANT_ID, location)
    return parse_message(thread_id, run_id)

@app.route('/api/locations/<location_from>/<location_to>/requirements')
def requirements(location_from,location_to):
    logging.info("location requirements")

    thread_id, run_id = post_message(LOCATION_RESTRICTIONS_ID, json.dumps({
        "departureLocation": location_from,
        "arrivalLocation": location_to
    }))
    return parse_message(thread_id, run_id)

@app.route('/api/hotels/<location>/<date_from>/<date_to>')
def hotels(location, date_from, date_to):
    logging.info("searching hotels")
    url = f"https://www.google.com/travel/search?q={location}&currency=ARS"
    ## TODO use dates in a new damn protobuf
    client = Client(impersonate="chrome_126", verify=False)
    res = client.get(url)

    parser = LexborHTMLParser(res.text)
    hotels = []

    # fetch dollar currency ## cached for efficiency
    # dollar = requests.get("https://dolarapi.com/v1/dolares/oficial")

    for i, fl in enumerate(parser.css('div[class="pjDrrc"]')):
        # Activity name
        name = fl.css_first('h2').text(
            strip=True
        )

        try:
            img = fl.css_first('img').attributes['data-src']
        except:
            img = "#"

        try:
            amenities = fl.css_first('div[class="RJM8Kc"]').text(strip=True).split(":")[1].split(",")
            if len(amenities) > 0:
                amenities.pop()
        except:
            amenities = []

        try:
            a = "https://www.google.com" + fl.css('a')[1].attributes['href']
        except:
            a = "#"

        price_parsed = float(0)
        price_div = fl.css_first('div[class="A9rngd"]')

        if price_div is not None:
            price_html = price_div.text(strip=True)
            price = price_html.replace(u"\xa0", " ").replace("ARS","").replace(",","").split(" ")
            for p in price:
                try:
                    price_parsed = float(p)
                    break
                except:
                    pass
            # price = "$51$51 nightly$136 total1 night with taxes + fees$51Mar 10 – 11"
            ## fallback for usd (prices are not converted even with the currency argument)
            if price is None:
                price = price_html.split(" ")[0].split("$")[1]
                try:
                    # cached dollar for effiency
                    price_parsed = float(price) * 1086

                except:
                    pass
        else:
            price_parsed = float(0)


        # href = fl.css_first('a')
        hotels.append({'name': name, 'price': price_parsed,
                           'img': img,
                           'amenities': amenities,
                           'href': a})

    # print(activities)

    if len(hotels) <= 5:
        N = len(hotels) - 1
    else:
        N = 5
    hotels = hotels[:N]


    hotels_ai = []
    for h in hotels:
        hotels_ai.append({
            "name": h['name'],
            "amenities": h['amenities'],
        })

    print(hotels_ai)
    thread_id, run_id = post_message(HOTELS_SPANISH_ID, json.dumps(hotels_ai))
    json_hotels = parse_msg(thread_id, run_id)

    for i,h in enumerate(hotels):
        h['name'] = json_hotels[i]['name']
        h['amenities'] = json_hotels[i]['amenities']
    print(hotels)

    response = make_response(jsonify(hotels))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response



@app.route('/api/flights/<from_airport>/<to_airport>/<date_from>/<date_to>/<passengers>')
def flights(from_airport, to_airport,date_from,date_to,passengers):
    logging.info("searching flights")

    client = Client(impersonate="chrome_126", verify=False)
    proto = parse_proto(date_from, date_to, from_airport, to_airport, None)
    tfs = get_tfs(proto)
    res = client.get(
        f"https://www.google.com/travel/flights?tfs={tfs}")
    departure_response = custom_response_parser(res)

    departure_flights = departure_response['flights']

    departure_flights = [d for d in departure_flights if d['stops'] == 0]

    return_flights = []

    if len(departure_flights) > 0:
        client = Client(impersonate="chrome_126", verify=False)

        for d in departure_flights:
            proto = parse_proto(date_from, date_to, from_airport, to_airport, d)
            tfs = get_tfs(proto)
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

    ## TODO THE URL

    print(output)
    thread_id, run_id = post_message(BEST_FLIGHT_ID, json.dumps(output))
    return parse_message(thread_id, run_id)


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

    print(json.dumps(data))

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


def parse_msg(thread_id, run_id: str):
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
    return json_output

def parse_message(thread_id, run_id: str):
    json_output = parse_msg(thread_id, run_id)

    response = make_response(jsonify(json_output))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    pass
