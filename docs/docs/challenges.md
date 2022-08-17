---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Challenges
permalink: /challenges
nav_order: 9
---

# Challenges

---

1. We had trouble with initially using our own server to host the database and user data due to unreliable read-write occuring

    * We solved this by using google firebase and learning the API to understand how to use it to manage our app data

2. We initially had a basic page meant for user support. However, after milestone 1 and during external UAT, we received feedback that it was not interactive and provided little assistance to our users.

    * Thus we decided to create a chatbot. We decided to use telegram as there is good support for python using the API. We had difficulty finding a server to host our chatbot that was reliable. We tried using google cloud, however, it had issues starting up after not using the bot for a few hours. Thus we used heroku which works well and suits out needs

3. We are facing the challenge of bandwidth limitation with firebase for loading images.

    * We have calculated the rough cost of firebase with approximately 5000 users a day at 1 hour. The approximate cost will be $50-$100. For testing, we temporarily disabled the display of images so that we can save up on bandwidth.

4. As we do not have experience with UI/UX, we faced difficulty in creating an app that looks nice and is easy to use.

    * We took inspiration from apps such as Airbnb and Grab when planning out our app design.

5. Android Compatibility

    * Throughout most of the project we have been testing on IOS simulators, as such, we have overlooked the aspect of android compatibility. Furthermore, we experience severe lag when testing on android simulators. With the help of some of our friends with android devices, we have fixed some of the problems, and now all basic features on android should work. However, there are still many styling issues, where fonts don't load in or some animations do not work. As fixing such issues would mean a significant redesign, we have decided to focus our efforts on perfecting the IOS version instead.

6. Long loading times when searching for chargers

    * Since MS2, we have significantly reduced the loading time when searching for chargers. To reduce searching time, we made use of Firebase indexing, to index the chargers based on their geohash, to have faster queries.

    * Another cause for the slow loading time is because of the getting of the user location. Originally we used `getCurrentPositionAsync()`, however, which contributed to a couple of seconds to the loading time. Instead, now, we used `getLastKnownPositionAsync()`, which can receive user location almost immediately.

<p align="right">(<a href="#top">back to top</a>)</p>
