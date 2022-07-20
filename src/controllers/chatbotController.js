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
  // check if user is in db
  // if NOT add to db
  currentSenderPsid = sender_psid;
  let typeofSender = typeof sender_psid;
  console.log(`typeof sender_psid ${typeofSender}`);

  console.log(sender_psid);
  console.log("request start");
  // request({
  //     "uri": `${API_URL}/senders/sender-psid/${sender_psid}`,
  //     // "qs": { "access_token": PAGE_ACCESS_TOKEN },
  //     "method": "GET",
  //     // "json": request_body
  // }, (err, res, body) => {
  //     if (!err) {
  //         console.log(`message sent! then res.body`);
  //         // console.log(request_body.message);
  //         // console.log(res.body);
  //         console.log(typeof body);
  //         let typeOfBody = typeof body;
  //         console.log(`typeOfBody is ${typeOfBody}`);
  //         let bodyObj = JSON.parse(body);
  //         console.log(body);
  //         // console.log(body[0]);
  //         // console.log(typeof bodyObj);
  //         console.log("done body");
  //         // console.log(bodyObj[0]);
  //         challenger = bodyObj[0];
  //         // let typeOfChallenger = typeof challenger;
  //         // console.log(`typeOfChallenger is ${typeOfChallenger}`);
  //         console.log(typeof challenger);
  //         console.log("after res");
  //     } else {
  //         console.err(`Unable to send message: ${ err }`);
  //     }
  // })
  // .catch(function (error) {
  //   console.log(error);
  //   createSender(sender_psid);
  // });
  console.log("request end");
  // if (challenger === undefined) {
  //     console.log(`challenger undefined`);
  //     createChallenger(sender_psid);
  // } else if (challenger.hasOwnProperty('_id')) {
  //     console.log(`${challenger} has own _id`);
  // } else {
  //   console.log(`no challenger and not undefined`);
    
  // }

  // if (challenger.hasOwnProperty('_id')) {
  //     console.log(`no challenger`);
  //     } else {
  //         console.log(`${challenger} has own _id`);
  //     }
  
  let response;
  let text = received_message.text;
  console.log("handleMessage");
  // console.log(received_message);
  console.log(text);
  let getStarted = /get started\??/ig;
  let whatIsThis = /what ?['i]s this\??/ig;
  let whatIsSixBySix = /what ?['i]s sixbysix\??/ig;
  let whatIsThisAbout = /what ?['i]s this about\??/ig;
  let whatDoesThisChallengeMean = /what does this challenge mean\??/ig;
  let howDoIParticipate = /how do I participate\??/ig;
  let howDoIGetStarted = /how do I get started\??/ig;
  let howDoIRegisterToVote = /how do I register to vote\??/ig;
  let howDoIRegister = /how do I register\??/ig;
  let whereDoIRegisterToVote = /where do I register to vote\??/ig;
  let whereDoIRegister = /where do I register\??/ig;
  let whatDoIDoAfterChallengingMyFriends = /what do i do after challenging my friends\??/ig;
  let whatDoIDoAfterAcceptingTheChallenge = /what do i do after accepting the challenge\??/ig;
  let whoAreYou = /who are you\??/ig;
  let whatAreYou = /what are you\??/ig;
  let howDoIVote = /how do i vote\??/ig;
  let whereDoIVote = /where do i vote\??/ig;
  let whatIsAnEarlyBallot = /what is an early ballot\??/ig;
  let shouldIVoteByEarlyBallot = /should i vote by early ballot\??/ig;
  let shouldIVoteEarly = /should i vote early\??/ig;
  let howDoIRequestAnEarlyBallot = /how do i request an early ballot\??/ig;
  let whatIsTheDeadlineToRegisterToVote = /what ?['i]s the deadline to register to vote\??/ig;
  let whatIsTheDeadlineToRequestAnEarlyBallot = /what ?['i]s the deadline to request an early ballot\??/ig;
  let whatIsTheDeadlineToRegister = /what ?['i]s the deadline to register\??/ig;
  let whenDoIHaveToMailInMyEarlyBallot = /when do i have to mail in my early ballot\??/ig;
  let whatIsTheDeadlineForMailingInMyEarlyBallot = /what is the deadline for mailing in my early ballot\??/ig;
  let whatIsTheDeadlineForMyEarlyBallot = /what is the deadline for my early ballot\??/ig;
  let byWhenDoIHaveToMailInMyEarlyBallot = /by when do i have to mail in my early ballot\??/ig;
  let whenIsItTooLateToMailInMyEarlyBallot = /when is it too late to mail in my early ballot\??/ig;
  let whenIsIt2LateToMailInMyEarlyBallot = /when is it 2 late to mail in my early ballot\??/ig;
  let whenIsItTooL8ToMailInMyEarlyBallot = /when is it too l8 to mail in my early ballot\??/ig;
  let whenIsIt2L8ToMailInMyEarlyBallot = /when is it 2 l8 to mail in my early ballot\??/ig;
  let whenIsItToL8ToMailInMyEarlyBallot = /when is it to l8 to mail in my early ballot\??/ig;
  let whenIsItToLateToMailInMyEarlyBallot = /when is it to late to mail in my early ballot\??/ig;
  // 
  let whatTimeDoThePollsClose = /what time do the polls close\??/ig;
  let howLateCanIGoToVote = /how late can i go to vote\??/ig;
  let howLateCanIGo2Vote = /how late can i go 2 vote\??/ig;
  let howL8CanIGoToVote = /how l8 can i go to vote\??/ig;
  let howL8CanIGo2Vote = /how l8 can i go 2 vote\??/ig;
  let whatTimesAreThePollsOpen = /what times are the polls open\??/ig;
  let whatTimesRThePollsOpen = /what times r the polls open\??/ig;
  let howEarlyCanIGoToVote = /how early can i go to vote\??/ig;
  let howEarlyCanIGo2Vote = /how early can i go 2 vote\??/ig;
  let initiate_share = /share\??/ig;
  
  text = text.replace(getStarted, "get started");
  text = text.replace(initiate_share, "share");
  text = text.replace(whatIsThis, "what is this");
  text = text.replace(whatIsSixBySix, "what is sixbysix");
  text = text.replace(whatIsThisAbout, "what is this about");
  text = text.replace(whatDoesThisChallengeMean, "what does this challenge mean");
  text = text.replace(howDoIParticipate, "how do I participate");
  text = text.replace(howDoIRegisterToVote, "how do i register to vote");
  text = text.replace(howDoIRegister, "how do i register");
  text = text.replace(whereDoIRegisterToVote, "where do i register to vote");
  text = text.replace(whereDoIRegister, "where do i register");
  text = text.replace(whatDoIDoAfterChallengingMyFriends, "what do i do after challenging my friends");
  text = text.replace(whatDoIDoAfterAcceptingTheChallenge, "what do i do after accepting the challenge");
  text = text.replace(howDoIGetStarted, "how do I get started");
  text = text.replace(whoAreYou, "who are you");
  text = text.replace(whatAreYou, "what are you");
  text = text.replace(howDoIVote, "how do i vote");
  text = text.replace(whereDoIVote, "where do i vote");
  text = text.replace(whatIsAnEarlyBallot, "what is an early ballot");
  text = text.replace(shouldIVoteByEarlyBallot, "should i vote by early ballot");
  text = text.replace(shouldIVoteEarly, "should i vote by early ballot");
  text = text.replace(howDoIRequestAnEarlyBallot, "how do i request an early ballot");
  text = text.replace(whatIsTheDeadlineToRegisterToVote, "what's the deadline to register to vote");
  text = text.replace(whatIsTheDeadlineToRegister, "what's the deadline to register to vote");
  text = text.replace(whatIsTheDeadlineToRequestAnEarlyBallot, "what's the deadline to request an early ballot");
  text = text.replace(whenDoIHaveToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whatIsTheDeadlineForMailingInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whatIsTheDeadlineForMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(byWhenDoIHaveToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsItTooLateToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsItTooL8ToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsIt2LateToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsIt2L8ToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsItToL8ToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  text = text.replace(whenIsItToLateToMailInMyEarlyBallot, "when do i have to mail in my early ballot");
  
  text = text.replace(whatTimeDoThePollsClose, "what time do the polls close");
  text = text.replace(howLateCanIGoToVote, "what time do the polls close");
  text = text.replace(howLateCanIGo2Vote, "what time do the polls close");
  text = text.replace(howL8CanIGoToVote, "what time do the polls close");
  text = text.replace(howL8CanIGo2Vote, "what time do the polls close");

  text = text.replace(whatTimesAreThePollsOpen, "what time do the polls close");
  text = text.replace(whatTimesRThePollsOpen, "what time do the polls close");
  text = text.replace(howEarlyCanIGoToVote, "what time do the polls close");
  text = text.replace(howEarlyCanIGo2Vote, "what time do the polls close");
  
  console.log(text);
  console.log("message regex");

  if (received_message.text) {
      
      switch (text) {
          case "Accept the challenge":
              response = get_started_step_1;
              break;
          case "Challenge accepted!":
              response = get_started_step_1;
              break;
          case "get started":
              response = get_started_step_1;
              // change user acceptedChallenge = true
              break;
          case "Get Started":
              response = get_started_step_1;
              break;
          case "Get started":
              response = get_started_step_1;
              break;
          case "get started":
              response = get_started_step_1;
              break;
          case "Get Started ":
              response = get_started_step_1;
              break;
          case "Get started ":
              response = get_started_step_1;
              break;
          case "get started ":
              response = get_started_step_1;
              break;
          case "Yes!":
              response = yes_registered_to_vote_1F;
              //  change user registeredToVote = true
              break;
          case "webview":
              response = webview_six_by_six_step_1;
              break;
          case "webview template":
              response = webview_template;
              break;
          case "Step 2":
              response = mail_early_ballot_reminder_step2;
              break;
          case "Step 3":
              response = send_early_ballot_reminder_step3;
              break;
          case "Step 4":
              response = go_to_polls_reminder_step4;
              break;
              
          case "help":
              response = {
                  "text": "What would you like help with?"
              };
              break;
          case "how do i register to vote":
              response = how_do_i_register_to_vote;
              break;
          case "how do i register":
              response = how_do_i_register_to_vote;
              break;
          case "where do i register to vote":
              response = how_do_i_register_to_vote;
              break;
          case "where do i register":
              response = how_do_i_register_to_vote;
              break;
          case "what do i do after challenging my friends":
              response = how_do_i_register_to_vote;
              break;
          case "what do i do after accepting the challenge":
              response = how_do_i_register_to_vote;
              break;
          case "how do i vote":
              response = how_do_i_vote;
              break;
          case "where do i vote":
              response = how_do_i_vote;
              break;
          case "what's the deadline to register to vote":
              response = what_is_the_deadline_to_register_to_vote;
              break;
          case "what's the deadline to request an early ballot":
              response = what_is_the_deadline_to_request_an_early_ballot;
              break;
          case "what time do the polls close":
              response = what_time_do_the_polls_close;
              break;
          case "share":
              response = lets_do_it_share_step_1;
              break;
          case "Talk to human":
              response = {
                  "text": "No problem. Give me a bit to contact them and someone will respond."
              };
              break;
          case "menu":
              response = {
                  "text": "I don't have a menu, yet. Are you hungry?"
              };
              break;
          case "human":
              response = {
                  "text": "No problem. Give me a bit to contact them and someone will respond."
              };
              break;
          case "Human":
              response = {
                  "text": "No problem. Give me a bit to contact them and someone will respond."
              };
              break;
          case "what is this":
              response = what_is_this;
              break;
          case "what is sixbysix":
              response = what_is_this;
              break;
          case "what is this about":
              response = what_is_this;
              break;
          case "what does this challenge mean":
              response = what_is_this;
              break;
          case "how do I participate":
              response = what_is_this;
              break;
          case "how do I get started":
              response = what_is_this;
              break;
          case "who are you":
              response = who_are_you;
              break;
          case "what are you":
              response = who_are_you;
              break;
          case "what is an early ballot":
              response = what_is_an_early_ballot;
              break;
          case "should i vote by early ballot":
              response = what_is_an_early_ballot;
              break;
          case "how do i request an early ballot":
              response = what_is_an_early_ballot;
              break;
          case "when do i have to mail in my early ballot":
              response = when_do_i_have_to_mail_in_my_early_ballot;
              break;
          // case "How do I get started?":
          //     response = what_is_this;
          //     break;
          // case "How do I get started":
          //     response = what_is_this;
          //     break;        
          default:
              response = default_response
              break;
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