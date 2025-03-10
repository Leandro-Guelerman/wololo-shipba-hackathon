import datetime
import json
import logging
import re
from typing import TYPE_CHECKING, Any
import os

import requests
from flask import Flask, request, make_response, jsonify
from primp import Client
from selectolax.lexbor import LexborHTMLParser
from dotenv import load_dotenv

from api.tool.flight_pb import get_tfs, custom_response_parser

import api.tool.flights_trip_pb2 as PB

if TYPE_CHECKING:
    PB: Any


app = Flask(__name__)

load_dotenv()

API_VERSION="?api-version=2024-12-01-preview"
LOCATION_TO_AIRPORTS_ASSISTANT_ID= "asst_iiBi1RdmT53DBWajaWfanSU4"
LOCATION_RESTRICTIONS_ID="asst_p796twbeakiJHYtx2DtCe8Be"
BEST_FLIGHT_ID="asst_6fIlZzGqPl3QU9aWpaQVLEZj"
API_KEY = os.getenv("API_OPENAI_API_KEY")
BASE_URL = os.getenv("API_OPENAI_ENDPOINT")
ASSISTANTS_ENDPOINT = f"{BASE_URL}/assistants{API_VERSION}"
THREADS_ENDPOINT = f"{BASE_URL}/threads{API_VERSION}"
GEMINI_API_KEY="AIzaSyBpMsHl1hdAf8CRATuHEF_G36rg2TZRVv8"

WEATHER_ASSISTANT_ID="asst_ztnj7aefcMzgIvZ3ulbJ5xJV"
CLASSIFIER_ASSISTANT_ID="asst_zcxk7RIUD6vb5kluuwRxFtcy"
ACTIVITIES_ASSISTANT_ID="asst_CrrUWATJ9Z73vcTn1nDpZeS1"
HOTELS_SPANISH_ID="asst_c5TSNZJAWHX4caWrUSvPAGqD"



WHISPER_OPENAI_ENDPOINT=os.environ.get("AZURE_OPENAI_ENDPOINT")
WHISPER_OPENAI_API_KEY=os.environ.get("AZURE_OPENAI_API_KEY")


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

def parse_rf_proto(date_from, date_to, airport_from, airport_to, flight_selected, return_selected) -> bytes:
    pf_data = PB.SelectedData()

    pf_data.sampler1 = 28
    pf_data.sampler2 = 2

    departure_flights = PB.FlightDataV2()
    departure_flights.date = date_from

    departure_flight_1 = PB.FlightV2()
    departure_flight_1.date = date_from
    departure_flight_1.from_airport = airport_from
    departure_flight_1.to_airport = airport_to
    departure_flight_1.airline = flight_selected['flight_codes'][0][0].strip()
    departure_flight_1.flight_number = flight_selected['flight_codes'][0][1].strip()
    departure_flights.flights.append(departure_flight_1)

    departure_flights.airport_from.sample = 1
    departure_flights.airport_from.path = airport_from
    departure_flights.airport_to.sample = 1
    departure_flights.airport_to.path = airport_to




    # pf_data.flights_data.append(departure_flights)

    # return_trip = pf_data.flights_data.add()
    # return_trip.date = date_to
    # return_trip.airport_from.sample = 1
    # return_trip.airport_from.path = airport_from
    # return_trip.airport_to.sample = 1
    # return_trip.airport_to.path = airport_to
    #
    return_trip = PB.FlightDataV2()
    return_trip.date = date_to

    return_flight_1 = PB.FlightV2()
    return_flight_1.date = date_to
    return_flight_1.from_airport = airport_to
    return_flight_1.to_airport = airport_from
    return_flight_1.airline = return_selected['flight_codes'][0][0].strip()
    return_flight_1.flight_number = return_selected['flight_codes'][0][1].strip()
    return_trip.flights.append(return_flight_1)

    return_trip.airport_from.sample = 1
    return_trip.airport_from.path = airport_to
    return_trip.airport_to.sample = 1
    return_trip.airport_to.path = airport_from

    pf_data.flights_data.extend([departure_flights,return_trip])
        #


    pf_data.passengers = 1
    pf_data.seat = 1
    # pf_data.trip = 1
    pf_data.sample1 = 1

    # pf_data.sample1 = 1
    # pf_data.sample2 = 1
    # pf_data.sample3 = 1
    sample_data = PB.SampleData()
    sample_data.sample1 = -1
    pf_data.sample_data.CopyFrom(sample_data)
    pf_data.sample5 = 1

    return pf_data.SerializeToString()

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

    ## only entrancees
    query = "?allowedCategoryIds=5"

    if date_from is not None:
        query += f"&fromDate={date_from}"
    if date_to is not None:
        query += f"&toDate={date_to}"


    city = city.lower().split(",")[0]
    city = city.replace("%20", " ")
    city = city.replace(" ", "-")
    print("city" + city)


    res = client.get(f"https://www.civitatis.com/ar/{city}{query}")

    parser = LexborHTMLParser(res.text)
    activities = []

    for i, fl in enumerate(parser.css('div[class="o-search-list__item"]')):
        # Activity name
        name = fl.css_first('h2').text(
            strip=True
        ).replace("'", "")
        try:
            thumbnail_url = "https://civitatis.com"+fl.css_first('div[class="comfort-card__img"]').css_first('img').attributes['data-src']
        except:
            thumbnail_url = "N/A"

        try:
            ratings = fl.css_first('span[class="m-rating--text"]').text(
                strip=True
            )
        except:
            ratings = 8


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
    return activities

@app.route('/api/audio', methods=['POST'])
def whisper():
    logging.info("location to airports")

    audio = request.files['audio']

    data = {
        'definition': json.dumps({
            "locales": ["es-MX"],
            "profanityFilterMode": "None",
            "channels": [0]
        })
    }

    message = requests.post(WHISPER_OPENAI_ENDPOINT, headers={
        "Ocp-Apim-Subscription-Key": WHISPER_OPENAI_API_KEY,
    }, data=data, files={'audio': ('audio.webm', audio, 'audio/webm')} )

    return {
        'text': message.json()['combinedPhrases'][0]['text']
    }

@app.route('/api/civitatis/<location>')
def civitatis(location):
    logging.info("location to airports")

    from_date = request.args.get('fromDate')
    to_date = request.args.get('toDate')

    activities = fetch_civitatis(location, from_date, to_date)
    thread_id, run_id = post_message(ACTIVITIES_ASSISTANT_ID, json.dumps(activities))
    activities = parse_msg(thread_id, run_id)


    sorted_list = sorted(activities, key=lambda x: x['ratings'], reverse=True)
    return sorted_list

@app.route('/api/classifier', methods=["POST"])
def classifier():
    logging.info("classifier running")
    content = request.json

    thread_id, run_id = post_message(CLASSIFIER_ASSISTANT_ID, content['text'])
    classifier = parse_msg(thread_id, run_id)

    today = datetime.datetime.now()
    if 'departureDate' in classifier:
        departure_date = classifier['departureDate']
        departure_date_dt = datetime.datetime.fromisoformat(departure_date)
        if departure_date_dt < today:
            departure_date = (departure_date_dt + datetime.timedelta(days=365)).date().isoformat()
            classifier['departureDate'] = departure_date

            arrival_date = classifier['arrivalDate']
            arrival_date_dt = datetime.datetime.fromisoformat(arrival_date)

            arrival_date = (arrival_date_dt + datetime.timedelta(days=365)).date().isoformat()
            classifier['arrivalDate'] = arrival_date

    if 'departureLocation' not in classifier:
        classifier["departureLocation"] = ["Buenos Aires, Argentina"]

    return classifier

def safe_location(location):
    location = location.replace("á", "a")
    location = location.replace("é", "e")
    location = location.replace("í", "i")
    location = location.replace("ó", "o")
    location = location.replace("ú", "u")
    location = location.replace("ñ", "n")
    return location

@app.route('/api/locations/<location>/airports')
def airports(location):
    logging.info("location to airports")
    thread_id, run_id = post_message(LOCATION_TO_AIRPORTS_ASSISTANT_ID, safe_location(location))
    return parse_message(thread_id, run_id)

@app.route('/api/locations/<location_from>/<location_to>/requirements')
def requirements(location_from,location_to):
    logging.info("location requirements")

    thread_id, run_id = post_message(LOCATION_RESTRICTIONS_ID, json.dumps({
        "departureLocation": safe_location(location_from),
        "arrivalLocation": safe_location(location_to)
    }))
    return parse_message(thread_id, run_id)

@app.route('/api/hotels/<location>/<date_from>/<date_to>')
def hotels(location, date_from, date_to):
    logging.info("searching hotels")
    url = f"https://www.google.com/travel/search?q={safe_location(location)}&currency=ARS"
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
            if price_parsed is None or price_parsed == 0.0:
                for i, p in enumerate(price):
                    try:
                        # cached dollar for effiency
                        price = p.split("$")[1]
                        price_parsed = float(price) * 1086
                        break
                    except:
                        pass
        else:
            price_parsed = float(0)


        # href = fl.css_first('a')
        hotels.append({'name': name, 'price': price_parsed,
                           'img': img,
                           'amenities': amenities,
                           'href': a})



    if len(hotels) <= 5:
        N = len(hotels) - 1
    else:
        N = 5
    hotels = hotels[:N]

    print("Hotels after trunc:" + str(len(hotels)))


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
        if 'href' in hotels[i]:
            h['href'] = hotels[i]['href'].replace("/reviews", "/overview")
    print(hotels)

    response = make_response(jsonify(hotels))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


def get_flights_from_airports(from_airport, to_airport,date_from,date_to,passengers):
    client = Client(impersonate="chrome_126", verify=False)
    proto = parse_proto(date_from, date_to, from_airport, to_airport, None)
    tfs = get_tfs(proto)
    res = client.get(
        f"https://www.google.com/travel/flights?tfs={tfs}")
    departure_response = custom_response_parser(res)

    departure_flights = departure_response['flights']

    departure_flights = [d for d in departure_flights if d['stops'] == 0]

    if len(departure_flights) > 0:

        departure_flights = [d for d in departure_flights if d['stops'] == 0]

        if len(departure_flights) <= 5:
            N = len(departure_flights) - 1
        else:
            N = 5
        departure_flights = departure_flights[:N]
        client = Client(impersonate="chrome_126", verify=False)

        for d in departure_flights:
            proto = parse_proto(date_from, date_to, from_airport, to_airport, d)
            tfs = get_tfs(proto)
            print("searching returns: ")
            res = client.get(f"https://www.google.com/travel/flights?tfs={tfs}")
            return_flights = custom_response_parser(res)
            if len(return_flights) > 0:
                return_flights = return_flights['flights']

                return_flights = [d for d in return_flights if d['stops'] == 0]
                if len(return_flights) <= 5:
                    N = len(return_flights) - 1
                else:
                    N = 5
                return_flights = return_flights[:N]

                for rf in return_flights:
                    proto = parse_rf_proto(date_from, date_to, from_airport, to_airport, d, rf)
                    tfs = get_tfs(proto)
                    tfu = "EgIIACIA"
                    rf['url'] = f"https://www.google.com/travel/flights/booking?tfs={tfs}&tfu={tfu}&hl=es-419"
                    print("urls: ")
                    print(tfs)
                    print(rf['url'])
                    # exit()

            else:
                return_flights = []
            d['return'] = return_flights

    output = {
        'flights': departure_flights
    }
    return output


@app.route('/api/flights/<from_airport>/<to_airport>/<date_from>/<date_to>/<passengers>')
def flights(from_airport, to_airport,date_from,date_to,passengers):
    logging.info("searching flights")
    output = get_flights_from_airports(from_airport, to_airport, date_from, date_to, passengers)

    if len(output['flights']) == 0 and from_airport == 'EZE':
        from_airport = "AEP"
        print(f"using fallback airport {from_airport}" )
        ## fallback to search another airports
        output = get_flights_from_airports(from_airport, to_airport, date_from, date_to, passengers)

    print("output: ")
    print(output)
    thread_id, run_id = post_message(BEST_FLIGHT_ID, json.dumps(output))
    response = parse_msg(thread_id, run_id)
    if 'departure' in response and response['departure'] is not None:
        response['departure']['price'] = response['departure']['price'] * 1086
        response['departure']['airport'] = from_airport
    if 'return' in response and response['return'] is not None:
        response['return']['price'] = response['return']['price'] * 1086
        response['departure']['airport'] = to_airport

    return response


@app.route('/api/locations/<location>/duration/<duration>/weather')
def weather(location, duration):
    logging.info("location pull weather")

    ## flask get the query params called arrivalDate
    departure_date = request.args.get('departureDate')
    arrival_date = request.args.get('arrivalDate')


    data = {
        'location': safe_location(location),
        'duration': duration
    }

    if departure_date is not None:
        data['departureDate'] = departure_date

    if arrival_date is not None:
        data['arrivalDate'] = arrival_date

    print(json.dumps(data))

    thread_id, run_id = post_message(WEATHER_ASSISTANT_ID, json.dumps(data))
    output = parse_msg(thread_id, run_id)

    today = datetime.datetime.now()
    if 'provided_dates' in output:
        departure_date = output['provided_dates']['departureDate']
        departure_date_dt = datetime.datetime.fromisoformat(departure_date)
        if departure_date_dt < today:
            departure_date = (departure_date_dt + datetime.timedelta(days=160)).date().isoformat()
            output['provided_dates']['departureDate'] = departure_date

            arrival_date = output['provided_dates']['arrivalDate']
            arrival_date_dt = datetime.datetime.fromisoformat(arrival_date)

            arrival_date = (arrival_date_dt + datetime.timedelta(days=160)).date().isoformat()
            output['provided_dates']['arrivalDate'] = arrival_date

    if 'recommended_dates' in output:
        departure_date = output['recommended_dates']['departureDate']
        departure_date_dt = datetime.datetime.fromisoformat(departure_date)
        if departure_date_dt < today:
            departure_date = (departure_date_dt + datetime.timedelta(days=160)).date().isoformat()
            output['recommended_dates']['departureDate'] = departure_date

            arrival_date = output['recommended_dates']['arrivalDate']
            arrival_date_dt = datetime.datetime.fromisoformat(arrival_date)

            arrival_date = (arrival_date_dt + datetime.timedelta(days=160)).date().isoformat()
            output['recommended_dates']['arrivalDate'] = arrival_date

    return output

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
    return response

if __name__ == "__main__":
    pass
