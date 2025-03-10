# Wololo SHIP BA Hackathon

24hs Hackathon [SHIP BA](https://www.shipba.dev/)

Live demo: [wololo-shipba-hackathon.vercel.app](http://wololo-shipba-hackathon.vercel.app/)

![image](https://github.com/user-attachments/assets/81fadd58-fb72-4ce4-a856-4280fe15925b)

## Project

This is a AI Travel Planner that gets real data for Flights, Hotels, Activities and takes into account the weather forecast to suggest the best options for the trip. Also it provides the booking links for everything that is listed. We wanted to take into account availability, but we couldn't make it on time (this was a 24hs challenge).

## Limitations

- It only supports direct flights from main airports. Limited to 1 passenger.

## How it works

Flights and Hotels are being scrapped from Google Flights, Activities are scrapped from Citavitis. We deployed 5 AI Agents in Azure AI Foundry to be able to make the suggestions, data analysis/convertion and output. 

## Tech Stack

- Next.js
- Python
- Azure AI Foundry (using GPT-4o and GPT-4o-mini models)

## Demo

You can watch a live demo video [here](https://drive.google.com/file/d/1nhbDfasH0Ye8t_pzzdi2YGB-YNfts3nw/view?usp=drive_link)

## Team
- [Gabriel Villoldo](https://github.com/gvillo)
- [Tomás de Priede](https://github.com/tomiito)
- [Gonzalo Zarza](https://github.com/zeta22)
- [Leandro Guelerman](https://github.com/Leandro-Guelerman)

## Disclaimer

Sorry for the messy code, we were in a hurry and we started coding using Cursor, so we blame it in the first place.
