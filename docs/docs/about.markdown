---
layout: home
title: About
permalink: /
nav_order: 1
---

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

# ChargeEV
{: .fs-9 }

ChargeEV is an app that connects Electric Vehicle chargers with hosts that
are willing to loan out their chargers.
{: .fs-6 .fw-300 }

[View it on GitHub](https://github.com/jonasgwt/ChargeEV){: .btn .btn-green .fs-5 .mb-4 .mb-md-0 }

---

<!-- ABOUT THE PROJECT -->

## Aim

ChargEV is a mobile-based application targeted towards EV users in large countries to
provide them with additional locations to charge their vehicles if superchargers are not
available in the current area.

## Motivation

Many countries have been shifting their focus to electric vehicles (EV) in recent years.
However, in many larger countries such as the United States (US) and Australia, electric
cars are seen as less superior compared to traditional petrol vehicles in terms of range
and convenience.
Due to its short range, many people are put off from purchasing EVs as they cannot
travel out of large cities where superchargers are usually located. ChargEV aims to
solve this problem by enabling people to loan out chargers so that EV users can charge
anywhere, even in the most remote areas.
While apps on the market show EV chargers locations, it does not enable users to add
their chargers and rent them out. With outdoor chargers costing up to $15000, some
users might be unwilling to install them. Additionally, in rural areas, there might be a lack
of charging stations, and thus users will be able to share.

## Key Features

- ChargEV will consist of two sections, GetACharge and GiveACharge.
- GetACharge will consist of users looking to charge their EVs. Using their current
  location, the app will find suitable chargers for the user, and they can then select
  the preferred charge point depending on distance etc.
- GiveACharge will consist of hosts that provide users with charging points. Hosts
  offer details such as an address, photos, charger type, available times,
  instructions etc. Hosts can also have the option to charge users a chosen
  amount. The app will provide a recommended cost for the host based on their
  need to charge. Users will tentatively make payments through a QR code.

## Tech Stack

- ![Expo][expo.com]
- ![Javascript][js.com]
- ![Firebase][firebase.com]
- ![Google Cloud][googleCloud.com]
- ![Python][Python.com]
- ![Heroku][Heroku.com]
- ![Telegram][Telegram.com]

## Target Audience

- ChargEV will be targeting countries or areas that are more sparse where it is more difficult to locate
  a charger
- Such areas include the rural areas in the United States
- We do not believe the host feature will be used significantly in Singapore due to the density of EV chargers present

## User Stories

1. Hosts can provide EV chargers at fixed prices (the app will provide an estimated cost). The host will seek to lend their chargers when they are not using them.

2. Users can find and select their preferred locations and suitable chargers within the area. As a user, I might be unable to find chargers near me, especially if there is no well-developed EV network in my country.

3. As administrators, we will seek to reduce predatory behaviour such as price gouging. This can be done by informing users if they are overpaying.

## Current competition

- We have not identified an app that implements the same ideas as ours.
- There are apps that allow the locating of chargers in general, we are aware of such apps. We have allowed for the non ChargeEV chargers to be shown as well as this will attract more users to the app

## Plans

- One drawback is that our app requires sign-ups which could hold back potential users

* A way is to create a mode which allows for non signed up users to use the app, however CRM methods will have to be thought off to encourage them to sign up

- We have an advantage whichout many competitors, this also means the market share is likely to be small. There will have to be greater drive to increase potential market.

## Roadmap

Refer to the development plan

Plan: [Link](https://app.instagantt.com/shared/s/kY9oAKAc2ID3k56JL8l7/latest)


[expo.com]: https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white
[js.com]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[firebase.com]: https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black
[googleCloud.com]: https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white
[Heroku.com]:  https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white
[Python.com]: https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue
[Telegram.com]: https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white
