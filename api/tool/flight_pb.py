import base64
import re
from typing import Optional, List, Tuple, TYPE_CHECKING, Any

from selectolax.lexbor import LexborHTMLParser, LexborNode

from api.tool import flights_return_pb2 as PB

if TYPE_CHECKING:
    PB: Any

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


def get_tfs(date_from, date_to, airport_from, airport_to, flight_selected) -> str:
    binary = parse_proto(date_from, date_to, airport_from, airport_to, flight_selected)
    return base64.urlsafe_b64encode(binary).decode('utf-8').rstrip('=')

def extract_airport_path(s: str) -> str:
    pattern = r";(.*?);"
    result = re.findall(pattern, s)
    if not result:
        print("No airport path found in:", s)
    return result[0]


def extract_airline_code_and_flight_number(s: str) -> Optional[List[Tuple[str, str]]]:
    """
    Extracts the airline code and flight number from a string.

    :param s: The string to extract the airline code and flight number from.
    :return: A list of tuples containing the airline code and flight number. Returns [] if no matches are found.

    Example:
    https://www.travelimpactmodel.org/lookup/flight?itinerary=FCO-FLR-AZ-1679-20250120,FLR-MUC-EN-8191-2025012
    [("AZ", "1679"), ("EN", "8191")]

    Special cases:
    - A3 1234 (number in flight code)
    - FV 12 (flight code has only 2 digits)
    """
    pattern = r"-([A-Z0-9]{2})-(\d{2,4})-"
    result = re.findall(pattern, s)
    if not result:
        print("No airline code and flight number found in:", s)
    return result

def custom_response_parser(res):
    # Changes from original:
    # Adds fields to each flight:
    # - Flight airline code (i.e. for "El Al" the code is "LY")
    # - Flight number (i.e. "5221")

    class _blank:
        def text(self, *_, **__):
            return ""

        def iter(self):
            return []

    blank = _blank()

    def safe(n: Optional[LexborNode]):
        return n or blank

    parser = LexborHTMLParser(res.text)
    flights = []

    for i, fl in enumerate(parser.css('div[jsname="IWWDBc"], div[jsname="YdtKid"]')):
        is_best_flight = i == 0

        for item in fl.css("ul.Rk10dc li")[
                    : (None if i == 0 else -1)
                    ]:
            # Flight name
            name_spans = item.css("div.sSHqwe.tPgKwe.ogfYpf span")
            if len(name_spans) > 0:
                name = name_spans[len(name_spans) - 1].text(
                    strip=True
                )
            else:
                name = "n/a"

            # Get departure & arrival time
            dp_ar_node = item.css("span.mv1WYe div")
            try:
                departure_time = dp_ar_node[0].text(strip=True)
                arrival_time = dp_ar_node[1].text(strip=True)
            except IndexError:
                # sometimes this is not present
                departure_time = ""
                arrival_time = ""

            # Get arrival time ahead
            time_ahead = safe(item.css_first("span.bOzv6")).text()

            # Get duration
            duration = safe(item.css_first("li div.Ak5kof div")).text()

            # Get flight stops
            stops = safe(item.css_first(".BbR8Ec .ogfYpf")).text()

            # Get delay
            delay = safe(item.css_first(".GsCCve")).text() or None

            # Get prices
            price = safe(item.css_first(".YMlIz.FpEdX")).text() or "0"

            # Stops formatting
            try:
                stops_fmt = 0 if stops == "Nonstop" else int(stops.split(" ", 1)[0])
            except ValueError:
                stops_fmt = "Unknown"

            try:
                flight_codes = extract_airline_code_and_flight_number(
                    item.css_first(".NZRfve").attributes["data-travelimpactmodelwebsiteurl"])
            except Exception:
                flight_codes = []

            flights.append(
                {
                    "is_best": is_best_flight,
                    "name": name,
                    "departure": " ".join(departure_time.split()),
                    "arrival": " ".join(arrival_time.split()),
                    "arrival_time_ahead": time_ahead,
                    "duration": duration,
                    "stops": stops_fmt,
                    "delay": delay,
                    "price": price.replace(",", ""),
                    "flight_codes": flight_codes
                }
            )

    flights = [d for d in flights if d['stops'] != 'Unknown']

    current_price = safe(parser.css_first("span.gOatQ")).text()
    return {"current_price": current_price, "flights": flights}