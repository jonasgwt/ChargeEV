import logging
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackQueryHandler
import os
import Responses as R
from telegram import *

PORT = int(os.environ.get('PORT', 5000))

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)
TOKEN = '5517977202:AAGENBqDBuAXMNMw1LhI72ZuW1vFfHEf9P8'


# Define a few command handlers. These usually take the two arguments update and
# context. Error handlers also receive the raised TelegramError object in error.
def start(update, context):
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi, I am @ChargeEVHelpBot .\nI am here for all your charging needs \n\n'
                              '\nTo begin, are you asking the question related to host or users? ')
    keyboard = [
        [
            InlineKeyboardButton('User 🚙', callback_data="1"),
            InlineKeyboardButton("Host 🔌", callback_data="2"),
        ],
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)
    update.message.reply_text("Please choose:", reply_markup=reply_markup)


def queryHandler(update, context):
    if (update.callback_query.data == "1"):
        context.bot.send_message(chat_id=update.effective_chat.id,
                             text='Hey user 🚙\n\nTo learn more about ChargeEV\nEnter: \n\n'
                                  '/UpdateProfile\n\n'
                                  '/BookingGuide\n\n'
                                  '/PaymentType\n\n'
                                  '/Policy\n\n'
                                  '/CancelBooking\n\n'
                                  'Press /help to learn more about me')
    if (update.callback_query.data == "2"):
        context.bot.send_message(chat_id=update.effective_chat.id,
                             text='Hey host 🔌\n\nTo learn more about ChargeEV\nEnter: \n\n'
                                  '/AddingLocation\n\n'
                                  '/AcceptingPayment\n\n'
                                  '/Reviews\n\n'
                                  '/Policy\n\n'
                                  '/HostingTips\n\n'
                                  'Press /help to learn more about me')
    else:
        return


def help(update, context):
    """Send a message when the command /help is issued."""
    update.message.reply_text('I am ChargeEV Bot, a Bot created to provide you with dedicated support. To begin press /start')


def UpdateProfile(update, context):
    output = "📱To update profile🙍‍♂️🙍‍♀️:\n\n Go into user profile page -> Edit Profile -> Upload new profile picture -> Key in new first name" \
               "-> New last name -> New phone number 📱 -> Update"
    update.message.reply_text(output)
    context.bot.sendVideo(chat_id=update.effective_chat.id,
                          video="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fcompressedprofile.mp4?alt=media&token=3c03cd6c-16bd-4887-a501-4b275ec9659c",
                          )

def AddingLocation(update, context):
    output = "📱To add location ️:\n\n Go into Host page -> Add New Location -> Select location type -> Key in your Address -> Enter your charger type -> Add an image -> Enter your price -> Select payment method -> Done"
    update.message.reply_text(output)
    context.bot.sendVideo(chat_id=update.effective_chat.id,
                          video="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fnewlocation.MP4?alt=media&token=0c64844e-9fe1-48ee-86b1-fcf718805532",
                          )

def BookingGuide(update, context):
    output = "To book 🔌 :\n\n Go to Charge Map -> Select Charger -> Book charger -> Contact host if required" \
               "-> Make payment, get host to accept -> Charge🔌"
    update.message.reply_text(output)
    update.message.reply_text("For ChargeEV chargers")
    context.bot.sendVideo(chat_id=update.effective_chat.id,
                            video="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fcompressedbooking.mp4?alt=media&token=da6ee245-22ad-40c6-94de-ae3876e19313",
                          )
    update.message.reply_text("For non ChargeEV chargers")
    context.bot.sendVideo(chat_id=update.effective_chat.id,
                          video="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fcompressedbookingnp.mp4?alt=media&token=968d3ae2-d991-4a0d-bd88-4359c872294c",
                          )


def CancelGuide(update, context):
    output = "To cancel:\n\n Go to Inbox -> Select Booking -> Cancel Booking -> Cancel Booking" \
               "-> Make payment, get host to accept -> Charge🔌"
    update.message.reply_text(output)
    context.bot.sendVideo(chat_id=update.effective_chat.id,
                            video="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fcompressedcancel.mp4?alt=media&token=821630d1-453e-43c2-a292-a1b43ff680c6")

def Reviews(update, context):
    output = "Reviews represent the average from users that have used your charger "
    update.message.reply_text(output)
    update.message.reply_text("Ensure the charger is clearly captured in the photo, check to make sure charger is functional")


def PaymentType(update, context):
    output = "There are currently two main options to pay \n\n1)Paynow 📲 \n2)Crypto (Bitcoin & Ethereum) (Beta) 🌏\n\n" \
                 "To find out more enter /Paynow or /Crypto to get more details on procedures"
    update.message.reply_text(output)

def AcceptingPayment(update, context):
    output = "There are currently two main options to pay \n\n1)Cash 📲 \n2) QRCode: Paynow 📲, Crypto (Bitcoin & Ethereum) (Beta) 🌏\n\n" \
                 "To find out more enter /Paynow or /Crypto to get more details on procedures"
    update.message.reply_text(output)

def HostingTips(update, context):
        output = "We encourage hosts to ensure the chargers are usable and are clearly shown in the listing. \n\n Remember to confirm payment before closing the transcation "
        update.message.reply_text(output)

def crypto(update, context):
    update.message.reply_text("To make a crypto transfer, request the host to send their wallet address 👝. \n\n ChargeEV will not be responsible for loss funds")
    context.bot.sendPhoto(update.effective_chat.id,
                          photo="https://firebasestorage.googleapis.com/v0/b/chargeev-986bd.appspot.com/o/telegrambot%2Fegbtc%20(2).jpg?alt=media&token=fa2c426c-c216-413b-b017-4fe140d1a083",
                          caption="Example QRCode")

def paynow(update, context):
    update.message.reply_text("To make a paynow transfer, request the host to send their Phone Number or QR code 📱. \n\n ChargeEV will not be responsible for loss funds")
    update.message.reply_text("Please remember to screenshot your payment in the case of payment dispute")

def error(update, context):
    """Log Errors causesd by Updates."""
    logger.warning('Update "%s" caused error "%s"', update, context.error)

def Policy(update, context):
    update.message.reply_text("ChargeEV is not responsible or liable for any monetary loss or damage to your vehicle or charger")
    update.message.reply_text("Please ensure to check if charger is working before transferring and to retain proof of payment 👝")
    update.message.reply_text("For any disputes, email chargeevnus@gmail.com")

def handle_message(update, context):
    text = str(update.message.text).lower()
    response = R.sample_responses(text)

    update.message.reply_text(response)


def main():
    """Start the bot."""
    # Create the Updater and pass it your bot's token.
    # Make sure to set use_context=True to use the new context based callbacks
    # Post version 12 this will no longer be necessary
    updater = Updater(TOKEN, use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # on different commands - answer in Telegram
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help))

    #Payment queries handler
    dp.add_handler(CommandHandler("Crypto", crypto))
    dp.add_handler(CommandHandler("Paynow", paynow))

    #User Queries
    dp.add_handler(CommandHandler("UpdateProfile", UpdateProfile))
    dp.add_handler(CommandHandler("BookingGuide", BookingGuide))
    dp.add_handler(CommandHandler("PaymentType", PaymentType))
    dp.add_handler(CommandHandler("CancelBooking", CancelGuide))
    dp.add_handler(CommandHandler("Policy", Policy))
    dp.add_handler(CommandHandler("Reviews", Reviews))

    #Host Queries
    dp.add_handler(CommandHandler("AddingLocation", AddingLocation))
    dp.add_handler(CommandHandler("HostingTips", HostingTips))
    dp.add_handler(CommandHandler("AcceptingPayment", PaymentType))


    # on noncommand i.e message for invalid messages
    dp.add_handler(MessageHandler(Filters.text, handle_message))

    # log all errors
    dp.add_error_handler(error)
    dp.add_handler(CallbackQueryHandler(queryHandler))

    # Start the Bot
    updater.start_webhook(listen="0.0.0.0",
                          port=int(PORT),
                          url_path=TOKEN)
    updater.bot.setWebhook('https://chargeevsupport.herokuapp.com/' + TOKEN)

    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()
