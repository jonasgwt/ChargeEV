<div id="top"></div>




<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/jonas-goh-891a15146/)(Jonas)
[![LinkedIn][linkedin-shield]](https://www.linkedin.com/in/tay-jiakang-mila-61a9bb146/)(Mila)




<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="photo/logo_nobg_white.png" alt="Logo" width="280" height="90">
  </a>
  <p float="center">
  <img src="photo/intro.GIF" width="20%"/>
  </p>
  

<h3 align="center">ChargeEV</h3>

  <p align="center">
    ChargeEV is an app that connects Electric Vehicle chargers with hosts that are willing to loan out their chargers.
    <br />
    <a href="https://github.com/jonasgwt/ChargeEV"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://drive.google.com/file/d/1PxCbZpWghce-7rELC49nZX0rGvxPq9iz/view">Project Video</a>
    ·
    <a href="https://github.com/jonasgwt/ChargeEV/issues">Report Bug</a>
    ·
    
    
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#planning">Planning</a></li>
    <li><a href="#backend">Backend</a></li>
    <li><a href="#feature">Feature</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#other">Others</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project


<div align="center">
  <a href="">
    <img src="photo/ChargeEV MS2 Poster-1.png" width="70%" height="90%">
  </a>
</div>

### Aim 

ChargEV is a mobile-based application targeted towards EV users in large countries to
provide them with additional locations to charge their vehicles if superchargers are not
available in the current area.

### Motivation

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

* ChargEV will consist of two sections, GetACharge and GiveACharge.
* GetACharge will consist of users looking to charge their EVs. Using their current
location, the app will find suitable chargers for the user, and they can then select
the preferred charge point depending on distance etc.
* GiveACharge will consist of hosts that provide users with charging points. Hosts
offer details such as an address, photos, charger type, available times,
instructions etc. Hosts can also have the option to charge users a chosen
amount. The app will provide a recommended cost for the host based on their
need to charge. Users will tentatively make payments through a QR code.

## Target Audience

* ChargEV will be targeting countries or areas that are more sparse where it is more difficult to locate
a charger
* Such areas include the rural areas in the United States 
* We do not believe the host feature will be used significantly in Singapore due to the density of EV chargers present


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [ReactNative](https://reactnative.dev/)
* [Firebase](https://firebase.google.com/)
* [Javascript](https://www.javascript.com/)
* [Maps Api](https://developers.google.com/maps)
* [Python](https://www.python.org/)
* [Heroku](https://dashboard.heroku.com/apps)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

The App has only been optimised for IOS, Andriod is being considered
To start, download the ExpoGo app and scan the following QR code (In Camera App)
Contact Mila @MilaTayJK (Telegram) should you have any issues 

<p float="center">
  <img src="photo/ms2png.jpeg" width="20%" />
  <img src="photo/setup.GIF" width="20%" />
</p>

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Planning


### Mockups

Link to Figma Mockup [here](https://www.figma.com/file/BozibW7ZR0EI4SWFEHyQCm/ChargeEV).
 

#### Log-in and Charging map view
<p float="left">
  <img src="photo/login.PNG" width="30%" />
  <img src="photo/chargemap.PNG" width="30%" /> 
</p>

#### User profile display
<p float="left">
  <img src="photo/userprofile.PNG" width="20%" />
</p>

#### Edit Profile Planned Flow


<div align="center">
  <a href="">
    <img src="photo/editprofile.png" width="30%" >
  </a>
</div>

#### Adding Charger Process
<p float="left">
  <img src="photo/addingcharger.PNG"  />
</p>

<div align="center">
  <a href="">
    <img src="photo/chargesetup.drawio.png" width="10%" >
  </a>
</div>


<p align="right">(<a href="#top">back to top</a>)</p>



### User flow
<p float="left">
  <img src="photo/PF.png" width="20%"/>
</p>

<!-- BACKEND -->
## Backend

### Database structure
<p float="left">
  <img src="photo/QuickDBD-Free Diagram.png" width="25%" />
</p>


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- FEATURE -->

## Feature 

### Main Feature List 

#### FindACharge
This enables drivers to find EVchargers that are near them. Chargers may not be on ChargeEV platform and are retrieved using the Google maps API.
The function works by using the Google maps API by scanning the area with a 50km radius. The chargers that are within that range
on and off the platform are both loaded and are shown to the user. They are arranged from nearest to furthest. 

On Platform / Off Platform (Chargers not on ChargeEV platform):
<p float="left">
  <img src="photo/onplatform.GIF" width="30%" height="30%" />
  <img src="photo/offplatform.GIF" width="30%" height="30%" />
</p>



#### GiveACharge
This enables individuals or comapanies to loan out their chargers. The fees are pre-determined.
We used an API to calculate the average electricity cost of the area around the charger and also the chargers around.
This helps the host better guage the pricing. Hosts will be notified when user is nearby, this is done via expo Geo-fencing

Setting up:
<p float="left">
  <img src="photo/host.gif" width="30%" height="30%" />
</p>

#### Telegram Bot 
To provide a more interactive support experience. The telegram bot is created to help users troubleshoot issues they face.
Video aids are used in the bot to help users have a visual experience. 

TelegramBot
<p float="left">
  <img src="photo/telegram.gif" width="30%" height="30%" />
</p>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

Refer to the development plan

Plan: [Link](https://app.instagantt.com/shared/s/kY9oAKAc2ID3k56JL8l7/latest)

<!-- Testing -->
## Testing

* We tested core features internally and after that we requested the help of peers to do testing and provide feedback to us of the product so far.
The results are shown in the following sheet
* We have also collected textual feedback via Google Forms and are in the mindst of cleaning up the data. A visualisation of the positive and negative feedback can be seen on our MS2 poster. 

Sheet: [Sheet](https://docs.google.com/spreadsheets/d/1lI6qObjsvcQ8hcxTFgI2hN9g1sCO6TRdgVF5pagoI_w/edit?usp=sharing)


<!-- CONTACT -->
## Contact

Name - Jonas Goh (jongoh2000@gmail.com) 

Name - Mila Tay (taymila1@gmail.com) 

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Deviations from initial plan -->
## Changes from initial plan

<p>While we initially wanted to use our backend with MySQL, we found that Firebase suited our backend better as it allowed for user authentication and also data storage </p>
We also decided to add a telegram bot to value add to our product. The FAQ were generated from feedback during our initial round of UAT

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Other

* For our payment plan we are considering using the paynow system
* The api keys has been removed from github will only be uploaded after Orbital has concluded for those that hope to work on it
* Should you have suggestions for features please open an <a href="https://github.com/jonasgwt/ChargeEV/issues">issue</a>
* We will be working to fix bugs and add content to the telegram bot for MS3

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
