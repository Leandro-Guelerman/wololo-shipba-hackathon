
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


headers = {
    "api-key": API_KEY,
    "Content-Type": "application/json"
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


@app.route('/api/assistants/location-restrictions')
def create_assistant_restrictions():
    assistant_data = {
        "instructions": """### Role ###
 
Provide a list of required documentation for a given travel destination
 
### Task ###
 
Given a departure location and an arrival destination determine a list of all the required documentation
 
### Constraints ###
- Exclude Return/Onward Ticket recommendations
 
- Assume nationality of the passenger is from the departure location
 
- Differentiate mandatory documentation from recommended documentation
 
- Translate the response to spanish
 
### Output ###
 
Output a JSON file with the results specifying a list with document type and description.
     """,
        "name": "LocationRestrictionsAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


@app.route('/api/assistants/best-flight')
def create_assistant_best_flight():
    assistant_data = {
        "instructions": """### Role ###
 
Determine the best round trip including arrival and return flights
 
### Task ###
 
- You will receive a json with a list of departure flights, each flight has multiple return options.
 
- Your job is to find the best combination of arrival and return flight based on a balance between flight duration and prices.
 
### Constraints ###
 
- If flight durations are similar and the amount of stops is the same, prioritize price to make your decision
 
- If no year is provided for departure time of flights assume the year is 2025
 
- If no year is provided for arrival time of flights assume the year is 2025
 
- Format the departure time to be YYYY-MM-DDTHH:mm:ss
 
- Format the arrival time to be YYYY-MM-DDTHH:mm:ss
 
### Output ###
 
- Return only a JSON with a departure and a return flight based on the analysis performed following this structure:
 
"departure": {
            "arrival_time": "2025-10-01T15:20:00",
            "departure_time": "2025-10-01T12:25:00",
            "duration": "2 hr 55 min",
            "name": "Aerolineas Argentinas",
            "price": 450907,
            "stops": 0
        },
        "return": {
            "arrival_time": "2025-10-05T10:35:00",
            "departure_time": "2025-10-05T07:15:00",
            "duration": "3 hr 20 min",
            "name": "British Airways",
            "url": "https://www.google.com/url"
            "price": 470083,
            "stops": 0
        }
     """,
        "name": "BestFlightFinderAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}

@app.route('/api/assistants/weather')
def create_weather_assistant():
    assistant_data = {
        "instructions": """### Role ###
 
Determine the best possible time of the year for a trip.
 
### Task ###
 
You will receive a json with the following format:
 
{
	location: “Paris”
	duration: ”7”
        departureDate: "2025-11-02"
        arrivalDate: "2025-11-09"
}
 
Based on this input determine best date for a trip on the provided location:
 
- Duration is provided in days
 
- Calculate the best possible dates for the trip depending on the weather conditions at the location. Remember to take into account if the weather would be optimal to perform the most popular activities at the desired location. Generate "recommended_dates" based on this period with the following format:
 
 {
"recommended_dates": {
"departureDate": "2025-11-02",
"arrivalDate": "2025-11-09",
"average_weather": 15,
"weather_hazards": {
"rain_chances": "high | low | medium",
"temperatures": "high | low | medium",
"high_winds": true
}}}
 
### Constraints  ###
 
- If departureDate and arrivalDate are provided generate "provided_dates" with the following format:
 
{
"provided_dates": {
"departureDate": "2025-11-02",
"arrivalDate": "2025-11-09",
"average_weather": 10,
"weather_hazards": {
"rain_chances": "high | low | medium",
"temperatures": "high | low | medium",
"high_winds": true
}}}
 
### Output ###
 
- Output "provided_dates" and "recommended_dates" as JSON
 
- If the weather conditions in "provided_dates" and "recommended_dates" are similar only output "provided_dates" as JSON
 
- If departureDate and arrivalDate are not provided just return recommended_dates as JSON
     """,
        "name": "LocationToAirportsAPI",
        "model": "zala-dev-ai"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


@app.route('/api/assistants/activities')
def create_activities_assistant():
    assistant_data = {
        "instructions": """# Task ###
 
- You will receive a list of activities, your task is to filter and improve it
 
### Constraints ###
 
- Adjust rating to only show a number from 1 to 10, decimals can be included
 
- Only show the top ten activities based on rating arranged from best to worst
 
- Exclude duplicated activities
 
- Adjust the price to only show a round number
 
- Adjust duration to be in the format hs, min. If the duration cannot be parsed return 'N/A'
 
### Output ###
 
- Output a list of activities in json format
     """,
        "name": "LocationToAirportsAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


@app.route('/api/assistants/hotels-to-spanish')
def create_hotels_assistant():
    assistant_data = {
        "instructions": """###TASK###
 
You will receive a list of hotels, your job is to translate the name and amenities to Spanish while keeping the structure of the JSON intact.
     """,
        "name": "HotelsToSpanishAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


@app.route('/api/assistants/classifier')
def create_classifier_assistant():
    assistant_data = {
        "instructions": """### Role ###
 
Determine a destination
 
### Task ###
 
- Get a destination from the provided information, this can be a city, place, attraction or activity.
 
- You can also receive a trip duration or dates.
 
- Separate the received dates into departure date and arrival date
 
### Constraints ###
 
- If no trip duration is received assume 10 days
 
- If no departure location is received assume Buenos Aires, Argentina
 
- If no departure date an arrival date are provided do not generate those keys in the response
 
- If only a departure date is provided calculate the arrival date based on the trip duration
 
- If an activity or location is provided instead of a city, return the nearest city
 
- If you receive more than one location return an array of locations
 
### Output ###
 
Output a json with the following format:
{"location", ["Miami, United States"],"duration": '7", "departureLocation: ["Buenos Aires, Argentina"], "departureDate": "2025-11-02", "arrivalDate": "2025-11-09"}
 
- Translate only location and departureLocation to Spanish
     """,
        "name": "ClassifierAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


if __name__ == "__main__":
    pass
