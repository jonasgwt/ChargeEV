---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Find A Charge
permalink: /findacharge
nav_order: 2
parent: Features
---
# Find A Charge

---
ChargeEV users can find public chargers hosted by other companies and ChargeEV chargers hosted by other users in a 50km radius.
Information about these public chargers is received from the Google Places API, taking into account opening hours and charger functionality.
ChargeEV chargers are hosted by other ChargeEV users, renting out their home chargers for a small fee. Unlike public chargers, ChargeEV chargers charge users based on a per charge basis.
On load, results of all the chargers are displayed to the users arranged from nearest to furthest, with an option for them to sort by cheapest or filter by charger type.

**Searching of chargers**

Searching of public chargers is done by making an API call to Google Places API in the `nearbySearch` mode with the keyword "chargers".
Searching for ChargeEV location is done by taking the precomputed geohash and making a geo query. However, as documented <a href="https://firebase.google.com/docs/firestore/solutions/geoqueries">here</a>, we experienced false positives and had to do a check to eliminate them. This was a time-consuming operation, and to reduce loading time, we used firebase indexing to index our database, making the search faster.

**Booking Public Chargers**

Upon booking of a public charger location, the user will be redirected to their preferred maps for navigation, and the booking will not be recorded.

**Booking ChargeEV Chargers**

Upon booking a ChargeEV charger location, the host will be informed, and the user location will be shared live with the host. The charger location will also be set to unavailable, so other users will not be able to book it.
We will also create a geofence of a 50m radius of the charger location with `startGeofencingAsync()`. Upon entry of the geofenced region, the host will be informed, and the user will not be able to cancel the booking.
After the user has completed the charge, they will have to verify with us that they have made their payment.
If they did not do so and leave the geofenced region, we will send them a notification or/and an alert to remind them to verify the payment.

**Live Location Tracking**

During the booking process, the user location will be updated with `startLocationUpdatesAsync()` to firebase.
The host will be able to view user location by receiving coordinates from firebase. This update is done at every 5s interval.
Upon arriving at the location, we will immediately stop the location update with `stopLocationUpdatesAsync()`. The live tracking page for hosts will also close.

**Background Location Tracking**

We have also used background location tracking to retrieve users' location when they make their way to a charger location during a booking, even when their app is closed.
If the user does not allow for background tracking, during the live tracking page, hosts will be informed that the location of the user might not be updated.

**Notifications**

As a user, you will receive notifications

* upon arrival at charger location
* when the host verifies your payment

This is achieved by making use of expo push notifications. Upon launch of the app, we will prompt the user for permission to send push notifications. If accepted, we will generate a unique `expoPushToken`, and store it in firebase. When sending a notification, we made use of Expo Push API and the unique token we received earlier to send a notification to a user.

<br>

**Note:** As we do not have information on charger types and pricing for public chargers, filtering by charger type or sorting by cheapest will not display any public chargers.

**ChargeEV Chargers / Public Chargers:**
<p float="left">
  <img src="{{ "assets/photo/onplatform.GIF" | relative_url }}" width="30%" height="30%" />
  <img src="{{ "assets/photo/offplatform.GIF" | relative_url }}" width="30%" height="30%" />
</p>
