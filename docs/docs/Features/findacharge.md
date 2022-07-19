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
This enables drivers to find EVchargers that are near them. Chargers may not be on ChargeEV platform and are retrieved using the Google maps API.
The function works by using the Google maps API by scanning the area with a 50km radius. The chargers that are within that range
on and off the platform are both loaded and are shown to the user. They are arranged from nearest to furthest.

On Platform / Off Platform (Chargers not on ChargeEV platform):

<p float="left">
  <img src="{{ "assets/photo/onplatform.GIF" | relative_url }}" width="30%" height="30%" />
  <img src="{{ "assets/photo/offplatform.GIF" | relative_url }}" width="30%" height="30%" />
</p>
