from datetime import datetime

def sample_responses(input_text):
    user_message = str(input_text).lower()

    if user_message in ("update profile"):
        return "📱To update profile🙍‍♂️🙍‍♀️:\n\n Go into user profile page -> Edit Profile -> Upload new profile picture -> Key in new first name" \
               "-> New last name -> New phone number 📱 -> Update"

    if user_message in ("booking guide"):
        return "To book🔌:\n\n Go to Charge Map -> Select Charger -> Book charger -> Contact host if required" \
               "-> Make payment, get host to accept -> Charge🔌"

    if user_message in ("payment type", 'payment'):
        output = "There are currently two main options to pay \n\n1)Paynow 📲 \n2)Crypto (Bitcoin & Ethereum) 🌏\n\n" \
                 "To find out more enter /Paynow or /Crypto to get more details on procedures"
        return output


    return "Could you rephrase that?"