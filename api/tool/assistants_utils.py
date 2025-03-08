
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
 
- Calculate the best possible dates for the trip depending on the weather conditions at the location without taking into account departureDate and arrivalDate
 
### Output ###
 
- If departureDate and arrivalDate are provided output a json with the following format:
{
"provided_dates": {
"departureDate": "2025-11-02",
"arrivalDate": "2025-11-09",
"average_weather": 10,
"weather_hazards": {
"rain_chances": "high",
"temperatures": "high",
"high_winds": true
}
},
"recommended_dates": {
"departureDate": "2025-11-02",
"arrivalDate": "2025-11-09",
"average_weather": 15,
"weather_hazards": {
"rain_chances": "high",
"temperatures": "low",
"high_winds": true
}
}
}
 
- If departureDate and arrivalDate are not provided just return recommended_dates
     """,
        "name": "LocationToAirportsAPI",
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
 
- If no departure date an arrival date are provided do not generate those keys in the response
 
### Output ###
 
Output a json with the following format:
{
"location", [Miami, USA"],
"duration": '7"
"departureDate": "2025-11-02"
  "arrivalDate": "2025-11-09"
}
 
- For the location output cities and countries only
 
- If you receive more than one location return an array of locations
 
- If no trip duration is received assume 10 days
     """,
        "name": "ClassifierAPI",
        "model": "gpt-4o-mini"
    }

    assistant = requests.post(ASSISTANTS_ENDPOINT, headers=headers, json=assistant_data)
    assistant_id = assistant.json()['id']
    return {'assistant_id': assistant_id}


if __name__ == "__main__":
    pass
