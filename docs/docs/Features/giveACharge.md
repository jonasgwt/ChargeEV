---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Give a Charge
permalink: /giveacharge
nav_order: 1
parent: Features
---

# Give A Charge

---

This enables individuals or companies to loan out their chargers for a small fee.

**Hosting a Charger Location**

Hosting is done in a simple 6-step process, requiring users to input their location details step-by-step, to not further complicate the process and discourage users from hosting.
A progress bar is also displayed at the bottom to allow users to gauge their process.

**Pricing**

Pricing is based on a per charge basis. To help users better decide on a price, we have used the NREL API to provide electricity cost data to hosted locations in the United States. This is done by first receiving the address of the hosted location, and by using the Google Geocoding API, we get the coordinates of the hosted location, and with it make a call to the NREL API to get /kwh electricity costs. With this, we can give users an estimate of the cost of charging an average EV. On top of that, we also provide users with prices of nearby ChargeEV charger locations within a 50km radius to help them price their location competitively.

**Payment**

We have two payment methods available, cash and QR code. For cash, hosts must be at the charger location to receive the payment during a booking. For QR code, hosts have to display a QR code for users to scan to make their payments. Hosts can choose which payment method they want to make available for their customers.

Hosts can choose which payment method(s) they accept on the "Manage Payment Information" page. Additionally, when adding a location, hosts can choose which payment method(s) they accept for each charger location, allowing them to have the option to choose different payment methods for different charger locations they host.

**Booking**

Upon booking, hosts will be notified that their charger location is booked, and they can track the user location live. Details on how it works are found above in the FindACharge section. After the booking is complete and the user has made payment, the host has to verify that they have received the Payment before the booking is closed.

**Address**

During the address stage, we used the Google Geocoding API to ensure that the location that the user input was valid. This is done by making a query with the address the user provided, and the API will then return a postal code or an error. If the postal code does not match or there is an error, we will display an alert. On the other hand, if the address is valid, we will convert the location address to coordinates and placeID. We will also hash the location and save the geohash and the other information in firebase.

**Edit Locations**

Hosts can also edit details about their location or remove the location. For example, if the host does not want their charger to be available for rent for a period of time, they can set it to "In Use", and their charger would not be booked. Note that hosts will not be able to change the availability of their charger when the location is in an active booking.

**Notifications**

As a host, you will receive a notification

* when your location gets booked
* when the user arrives at the location
* when the user has completed the payment
* when the user has canceled the booking

Details on how the push notification is sent are found in the notifications section of FindACharge.

**Setting up:**
<p float="left">
  <img src="{{ "assets/photo/host.gif" | relative_url }}" width="30%" height="30%" />
</p>
