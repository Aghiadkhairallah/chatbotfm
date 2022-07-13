require("dotenv").config();
import request from "request";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
console.log(MY_VERIFY_TOKEN)


let test=(req , res) => {
    return res.send("hello again");
}

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

let postWebhook = (req, res) => {
    
    let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    {
      intents[
        {"tag": "greeting",
         "patterns": ["Hi there", "How are you", "Is anyone there?","Hey","Hola", "Hello", "Good day", "Hey", "Ekse", "Hi"],
         "responses": ["Hi stranger", "Yebo yes, how can I help", "Ey watsupp", "Ekse Hoezit", "Hola", "Hey dude", "You again"]
        },
        {"tag": "goodbye",
         "patterns": ["Bye", "See you later", "Goodbye", "Ok bye", "Bye Bye"],
         "responses": ["See you!", "Have a nice day", "Sure Bye", "Later dude", "Sayoonara", "Peace out", "Sure dude", "Ciao"]
        },
        {"tag": "thanks",
         "patterns": ["Thanks", "Thank you", "That's helpful", "Awesome, thanks", "Thanks for helping me"],
         "responses": ["Happy to help!", "Any time!", "My pleasure", "You are welcome", "Sure dude"]
        },
        {"tag": "noanswer",
         "patterns": [],
         "responses": ["Sorry, can't understand you", "Please give me more info", "Not sure I understand", "I am still here dude"]
         },
         {"tag": "name",
          "patterns": ["What is your name", "Whats your name", "Tell me your name", "Who are you", "Ungubani", "Tell me about yourself", "You are"],
          "responses": ["I am lana kherallah ", "My name is lana kherallah ", "You can call me lk for short", "I am lana kherallah, my friends call me KB", "lana is my name"]
          },
          {"tag": "options",
           "patterns": ["What do you do", "How can you help", "What do you know", "What is your purpose", "How can you help"],
           "responses": ["I can tell you about South Africa", "I can give you interesting facts about South Africa"]
          },
         {"tag": "south_africa_info",
          "patterns": ["South Africa", "What can you tell me about SA", "SA", "Tell me about SA", "What about SA", "What do you know about SA", "Tell me more about SA", "What can you tell me about South Africa", "Tell me about South Africa", "What about South Africa", "What do you know about South Africa", "Tell me more about South Africa"],
          "responses": ["South Africa is the southern most country in Africa, it has a population of more than 59million people and covers an area of 1221 037m2. South Africa has 11 official languages. The currency used in ZAR our South African Rand which trades at about 15ZAR per 1USD."]
          }
      ]
    }
  }  
  
  else if (received_message.attachments) {
  
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;

    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 

  // Sends the response message
  callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = {
    test: test,
    getWebhook:getWebhook,
    postWebhook:postWebhook
}