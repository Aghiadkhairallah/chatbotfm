require("dotenv").config()
var express = require('express'),
    app = express(),
    // cors = require('cors'),
    bodyParser = require('body-parser');
    
const request = require('request');
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fetch = require('node-fetch');
const path = require('path');

let challengerSenderPsid = "";
let currentSenderPsid = "";
const API_URL = "https://lit-anchorage-94924.herokuapp.com/api/ver0001";
const GRAPH_URL = "https://graph.facebook.com/";
// let webview_url = `https://lit-anchorage-94924.herokuapp.com/webview.html?utm_source=fb&utm_medium=chat&utm_campaign=${challengerSenderPsid}&utm_term=${currentSenderPsid}`;
let webview_url = `https://lit-anchorage-94924.herokuapp.com/webview.html`;
// import CRUD functions
let challenger = {};
let newSender = "";
let faceBookUserData = {};
let challengerEmail = {};
let RetrievedFacebookUserData = faceBookUserData;
let senderObj = {};
let updatedSender = {};
let attachment = {};
let acceptedChallenge = true;
// let registerByMail = true;
let choseVoteByEarlyBallot = true;
let choseVoteByPoll = true;
let voted = true;

// let db = require("./models");
// let authRoutes = require('./routes/auth');
let challengerRoutes = require("./routes/challengers");
let attachmentRoutes = require("./routes/attachments");
let senderRoutes = require("./routes/senders");
// const cors = require('cors');
let auth = require("./middleware/auth");



app.use(express.static(path.join(__dirname + '/views')));

app.get('/', function (req, res) {
    res.sendFile("index.html");
});

app.get('/api/ver0001/challengers', challengerRoutes);
app.get('/api/ver0001/challengers/:challengerId', challengerRoutes);
app.get('/api/ver0001/challengers/attachments/:attachments', challengerRoutes);
app.get('/api/ver0001/challengers/challenged-by/:challengerId', challengerRoutes);
app.get('/api/ver0001/challengers/name/:name', challengerRoutes);
app.get('/api/ver0001/challengers/fb-users/:fbUserId', challengerRoutes);
app.get('/api/ver0001/challengers/sender-psid/:senderPSID', challengerRoutes);
app.post('/api/ver0001/challengers', challengerRoutes);
app.put('/api/ver0001/challengers/:challengerId', auth.loginRequired, challengerRoutes);
app.delete('/app/ver0001/challengers/:challengerId', auth.loginRequired, challengerRoutes);
app.use('/api/ver0001/challengers', challengerRoutes);

app.get('/api/ver0001/senders', senderRoutes);
app.get('/api/ver0001/senders/:senderId', senderRoutes);
app.get('/api/ver0001/senders/attachments/:attachments', senderRoutes);
app.get('/api/ver0001/senders/challenged-by/:challengerId', senderRoutes);
app.get('/api/ver0001/senders/fbUser/:fbUserId', senderRoutes);
app.get('/api/ver0001/senders/sender-psid/:senderPSID', senderRoutes);
app.put('/api/ver0001/senders/sender-psid/:senderPSID', senderRoutes);
app.post('/api/ver0001/senders', senderRoutes);
app.put('/api/ver0001/senders/:_id', senderRoutes);
app.delete('/app/ver0001/senders/:challengerId', auth.loginRequired, senderRoutes);
app.use('/api/ver0001/senders', senderRoutes);

app.get('./api/ver001/attachments', attachmentRoutes);
app.get('./api/ver001/attachments/:attachmentId', attachmentRoutes);
app.post('/api/ver0001/attachments', auth.loginRequired, attachmentRoutes);
app.put('/api/ver0001/attachments/:attachmentId', auth.loginRequired, attachmentRoutes);
app.delete('/api/ver0001/attachments/:attachmentId', auth.loginRequired, attachmentRoutes);
app.use('/api/ver0001/attachments/', attachmentRoutes);

const responses = require('./responses');

let {
    // default
    default_response,
    // step 1
    accept_the_challenge_step_1,
    accept_the_challenge_24hr_reminder_step_1,
    accept_the_challenge_48hr_reminder_step_1,
    challenge_accepted_step_1,
    get_started_step_1,
    done_registered_in_person_1G,
    i_do_not_know_step_1,
    i_already_did_1I,
    i_dont_have_id_1B,
    i_live_in_a_different_state_1C,
    nah_not_right_now_1H,
    register_online_1A,
    register_by_mail_1D,
    register_in_person_1E,
    yes_registered_to_vote_1F,
    lets_do_it_share_step_1,
    webview_six_by_six_step_1,
    webview_six_by_six_pre_contact_confirm_step_1,
    webview_six_by_six_contact_confirm_step_1,
    yes_contact_info_correct_step_1,
    // step 2
    going_to_the_poll_step_2,
    mail_early_ballot_reminder_step2,
    alright_how_do_i_get_one_2A,
    // step 3
    i_will_step_3,
    already_did_step_3,
    send_early_ballot_reminder_step3,
    // step 4
    go_to_polls_reminder_step4,
    i_voted_step_4,
    
    no_not_registered_to_vote,
    not_yet_step_1,
    not_yet_registered_for_early_ballot_step_2,
    register_to_vote_reminder_step_1,
    yup_mail_early_ballot_step_2,
    // TEST MESSAGES
    share,
    simple_button_message,
    simple_button_url_template,
    simple_message,
    webview_template,
    // FAQ
    how_do_i_vote,
    how_do_i_register_to_vote,
    what_is_this,
    what_is_an_early_ballot,
    who_are_you,
    what_is_the_deadline_to_register_to_vote,
    what_is_the_deadline_to_request_an_early_ballot,
    when_do_i_have_to_mail_in_my_early_ballot,
    what_time_do_the_polls_close
} = responses;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const APP_ID = process.env.APP_ID;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

async function createChallenger(fbUserData) {
    console.log(fbUserData);
    let newUserData = {
        email: fbUserData.email,
        name: fbUserData.name,
        firstName: fbUserData.first_name,
        lastName: fbUserData.last_name,
        // fbAccessToken,
        fbSignedRequest,
        fbUserId,
        acceptedChallenge: true,
    }
    console.log(newUserData);
    // let token = `Bearer ${fbAccessToken}`;
    
    return fetch(`${API_URL}/challengers`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        // 'Authorization': token
      }),
      body: JSON.stringify({ ...newUserData })
    })
      .then(resp => {
        console.log(resp);
        if (!resp.ok) {
          if (resp.status >= 400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = { errorMessage: data.message }
              throw err;
            })
          } else {
            let err = { errorMessage: 'Please Try Again Later. Server Is NOT Responding.' }
            throw err;
          }
        }
        return resp.json();
      })
      .catch(function (err) {
        console.log(err);
        return err;
      })
  }
  

async function createSender(sender_psid) {
  let newSender = { senderPSID: sender_psid };
  return fetch(`${API_URL}/senders`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...newSender })
  })
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = { errorMessage: data.message }
            throw err;
          })
        } else {
          let err = { errorMessage: 'Please Try Again Later. Server Is NOT Responding.' };
          throw err;
        }
      }
      return resp.json();
    })
    .catch(function (err) {
      console.log(err);
      return err;
    });
}

async function getFaceBookUserData(sender_psid) {
  console.log(getFaceBookUserData);
  console.log(sender_psid);
  return fetch(`${GRAPH_URL}${sender_psid}?fields=first_name,last_name,name,id,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`)
  .then(resp => {
    // console.log("resp");
    // console.log(resp);
    // console.log("resp");
    if (!resp.ok) {
      if (resp.status >= 400 && resp.status < 500) {
        return resp.json().then(data => {
          let err = { errorMessage: data.message }
          // console.log("err");
          // console.log(err);
          // console.log("err");
          throw err;
        })
      } else {
        let err = { errorMessage: 'Please Try Again Later. Server Is NOT Responding.' };
        throw err;
      }
    }
    return resp.json();
  })
  .catch(function (err) {
    console.log(err);
    return err;
  })
}

async function getChallengerByName(name, sender_psid) {
  return fetch(`${API_URL}/challengers/name/${name}`)
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = { errorMessage: data.message }
            throw err;
          })
        } else {
          let err = { errorMessage: 'Please Try Again Later. Server Is NOT Responding.' };
          throw err;
        }
      }
      return resp.json();
    })
    .catch(function (err) {
      console.log(err);
      return err;
    })
}

async function getSendersBySenderPsid(sender_psid) {
  return fetch(`${API_URL}/senders/sender-psid/${sender_psid}`)
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = { errorMessage: data.message }
            throw err;
          })
        } else {
          let err = { errorMessage: 'Please Try Again Later. Server Is NOT Responding.' };
          throw err;
        }
      }
      return resp.json();
    })
    .catch(function (err) {
      console.log(err);
      return err;
    })
}

async function updateSender(sender_psid, senderObj) {
  console.log("call updateSender");
  console.log(senderObj);
  let sender = await getSendersBySenderPsid(sender_psid);
  console.log(sender);
  let userId = sender[0]._id;
  console.log(userId);

  // let prop = { ...senderObj };
  // read notes in notebook to pass TRUE value
  updatedSender = {
    ...senderObj
  };
  console.log("updatedSender before update");
  console.log(updatedSender);
  return fetch(`${API_URL}/senders/${userId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...updatedSender })
  })
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = { errorMessage: data.message }
            throw err;
          })
        } else {
          let err = { errorMessage: 'Please Try Again Later, Server Is NOT Responding.' }
          throw err;
        }
      }
      return resp.json();
    })
    .catch(function (err) {
      console.log(err);
      return err;
    })
}

async function updateSenderBySenderPsid(sender_psid, senderObj) {
  console.log("call updateSenderBySenderPsid");
  console.log(senderObj);
  // let sender = await getSendersBySenderPsid(sender_psid);
  // console.log(sender);

  // let prop = { ...senderObj };
  // read notes in notebook to pass TRUE value
  updatedSender = {
    senderPSID: sender_psid,
    ...senderObj
  };
  console.log("updatedSender before update");
  console.log(updatedSender);
  return fetch(`${API_URL}/senders/sender-psid/${sender_psid}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...updatedSender })
  })
    .then(resp => {
      if (!resp.ok) {
        if (resp.status >= 400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = { errorMessage: data.message }
            throw err;
          })
        } else {
          let err = { errorMessage: 'Please Try Again Later, Server Is NOT Responding.' }
          throw err;
        }
      }
      return resp.json();
    })
    .catch(function (err) {
      console.log(err);
      return err;
    })
}

function handleReminderMessage(sender_psid) {
    let message;
    let date;

    if (condition) {
        // 24 hour reminder
        message = accept_the_challenge_24hr_reminder_step_1;
    } else {
        // 48 hour reminder
        message = accept_the_challenge_48hr_reminder_step_1;
    }

    // send reminder at 10:00 MST on 2018-10-01, 2018-10-19, 2018-11-01, 2018-11-06

    if (date = "2018-10-01") {

        message = register_to_vote_reminder_step_1;

    } else if (date = "2018-10-19") {
        message = mail_early_ballot_reminder_step2;
    } else if (date = "2018-11-01") {
        message = send_early_ballot_reminder_step3;
    } else if (date = "2018-11-06") {
        message = go_to_polls_reminder_step4;
    }

    callSendAPI(sender_psid, message);
}

async function handleMessage(sender_psid, received_message) {
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
    } else if (received_message.attachments) {
        let attachments_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachments_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes"
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no"
                            }
                        ]
                    }]
                }
            }
        }
    }
    callSendAPI(sender_psid, response);
    newSender = await createSender(sender_psid);
    console.log("newSender");
    console.log(newSender);
    faceBookUserData = await getFaceBookUserData(sender_psid);
    // createdChallenger = await createChallenger(faceBookUserData);
    
    console.log("faceBookUserData");
    console.log(faceBookUserData);
    console.log("faceBookUserData");
    challengerEmail = await getChallengerByName(faceBookUserData.name, sender_psid);
    console.log("challengerEmail");
    // console.log(challengerEmail);
    console.log("challengerEmail");
    try {
        console.log("challengerEmail in try");
        console.log(challengerEmail);
        console.log(challengerEmail[0].email);
        console.log("challengerEmail");
        faceBookUserData.email = challengerEmail[0].email;
        updatedSenderEmail = await updateSender(sender_psid, faceBookUserData);
        console.log("updatedSenderEmail in try");
        console.log(updatedSenderEmail);
        console.log(updatedSenderEmail.email);
        console.log("updatedSenderEmail");
    }
    catch (error) {
        console.log(error);
    }
    // updatedSender = await updateSender(sender_psid, faceBookUserData);
    // console.log("updatedSender");
    // console.log(updatedSender);
    // console.log("updatedSender");
}

async function handlePostback(sender_psid, received_postback) {
    let response;
    currentSenderPsid = sender_psid;
    let typeofCurrentSenderPsid = typeof currentSenderPsid;
    console.log(`typeof typeofCurrentSenderPsid: ${typeofCurrentSenderPsid}`);

    // console.log(challengerRoutes);
    // console.log(challenger);
    // if (challenger.hasOwnProperty('_id')) {
    //     console.log(`${challenger} has own _id postback`);
    // } else {
    //     console.log(`no challenger postback`);
    // }

    let payload = received_postback.payload;
    switch (payload) {
        case "I'm Ready!":
            try {
                if (faceBookUserData.name === "Anthony McDonald") {
                    console.log("change name from Anthony McDonald");
                    faceBookUserData.name = "update name";
                    challengerEmail[0].email = "update email";
                } else {
                    console.log(faceBookUserData.name);
                    console.log("challengerEmail[0].email");
                    // console.log(challengerEmail[0].email);
                }
            } catch(error) {
                console.log(error);
                console.log("issue with faceBookUserData");
            }
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge: true
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender: Accept the Challenge");
            console.log(updatedSender);
            console.log(challengerEmail);
            console.log("challengerEmail");
            let pleaseUpdate = updatedSenderEmail.email ? updatedSenderEmail.email : "please update";
            try {
                console.log("try challengerEmail[0].email");
                // console.log(challengerEmail[0].email);
            } catch(error){
                console.log(error);
                challengerEmail[0].email = "";
                console.log("catch challengerEmail[0].email");
                // console.log(challengerEmail[0].email);
            }
            console.log(pleaseUpdate);
            console.log("challengerEmail");
            let confirm_contact_info = {
              "attachment": {
                  "type": "template",
                  "payload": {
                  "template_type":"button",
                  "text": `Congrats on accepting the #sixbysix challenge ${faceBookUserData.first_name}! to track your progress, I need some very simple info.  Let me know if this information is correct.  Name: ${faceBookUserData.name} Email: ${pleaseUpdate} ?`,
                  "buttons":[
                      {
                          "type": "postback",
                          "title": "Yes, it’s right",
                          "payload": "Yes, it’s right"
                      },
                      {
                        "type": "postback",
                        "title": "No",
                        "payload": "No"
                      }
                    ]  
                  }
              }
            };
            response = confirm_contact_info;
            break;
        case "Accept the challenge":
            response = webview_six_by_six_pre_contact_confirm_step_1;
            break;
        case "Already did":
            response = already_did_step_3;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            voted = true;
            senderObj = {
              senderPSID: sender_psid,
              voted
            };
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender: Already did");
            console.log(updatedSender);
            break;
        case "Alright, how do I get one?":
            response = alright_how_do_i_get_one_2A;
            choseVoteByEarlyBallot = true;
            senderObj = {
              senderPSID: sender_psid,
              choseVoteByEarlyBallot
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender: Alright, how do I get one?");
            console.log(updatedSender);
            break;
        case "Challenge accepted!":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "Get Started":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "Get started":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "get started":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
          case "Get Started ":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
          case "Get started ":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "sample_get_started_payload":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            newSender = await createSender(sender_psid);
            console.log("newSender");
            console.log(newSender);
            acceptedChallenge = true;
            senderObj = {
            senderPSID: sender_psid,
            acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
          case "get started ":
            response = get_started_step_1;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            acceptedChallenge = true;
            senderObj = {
              senderPSID: sender_psid,
              acceptedChallenge
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "Going to the poll":
            response = going_to_the_poll_step_2;
            choseVoteByPoll = true;
            senderObj = {
              senderPSID: sender_psid,
              choseVoteByPoll
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "I already did":
            response = i_already_did_1I;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            //  change user sixChosen = true
            let sixChosen = true;
            senderObj = {
              senderPSID: sender_psid,
              sixChosen
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "I don’t have an AZ Driver License or ID":
            response = i_dont_have_id_1B;
            break;
        case "I live in a different state":
            response = i_live_in_a_different_state_1C;
            break;
        case "I voted!":
            response = i_voted_step_4;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            //  change user voted = true
            voted = true;
            senderObj = {
              senderPSID: sender_psid,
              voted
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "I will":
            response = i_will_step_3;
            break;
        case "Let’s do it!":
            response = lets_do_it_share_step_1;
            break;
        case "Nah, I’m cool":
            response = going_to_the_poll_step_2;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            choseVoteByPoll = true;
            senderObj = {
              senderPSID: sender_psid,
              choseVoteByPoll
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "Nah, not right now":
            response = nah_not_right_now_1H;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "No, I haven't yet":
            response = no_not_registered_to_vote;
            break;
        case "I don't know":
            response = i_do_not_know_step_1;
            break;
        case "Not Yet":
            response = not_yet_step_1;
            break;
        case "Not Yet.":
            response = not_yet_registered_for_early_ballot_step_2;
            break;
        case "Register by mail":
            response = register_by_mail_1D;
            break;
        case "Register in person":
            response = register_in_person_1E;
            break;
        case "Register Online":
            response = register_online_1A;
            break;
        case "Done":
            response = done_registered_in_person_1G;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "Done!":
            response = yes_registered_to_vote_1F;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            registeredToVote = true;
            senderObj = {
              senderPSID: sender_psid,
              registeredToVote
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "I’m all set":
            response = yes_registered_to_vote_1F;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "Yes!":
            response = yes_registered_to_vote_1F;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "Yes":
            response = yes_registered_to_vote_1F;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "yes":
            response = { "text": "Thanks!" };
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            break;
        case "Yup!":
            response = yup_mail_early_ballot_step_2;
            // currentSenderPsid = await getSendersBySenderPsid(sender_psid);
            // console.log(currentSenderPsid);
            choseVoteByEarlyBallot = true;
            senderObj = {
              senderPSID: sender_psid,
              choseVoteByEarlyBallot
            }
            updatedSender = await updateSender(sender_psid, senderObj);
            console.log("updatedSender");
            console.log(updatedSender);
            break;
        case "Yes, it’s right":
            response = yes_contact_info_correct_step_1;
            faceBookUserData.confirmedFacebookName = true;
            updatedSender = await updateSender(sender_psid, faceBookUserData);
            console.log("faceBookUserData");
            console.log(faceBookUserData);
            console.log("faceBookUserData");
            break;
      case "Contact Info Updated":
          response = yes_contact_info_correct_step_1;
          faceBookUserData.updatedContactData = true;
          updatedSender = await updateSender(sender_psid, faceBookUserData);
          console.log("faceBookUserData");
          console.log(faceBookUserData);
          console.log("faceBookUserData");
          break;
        case "no":
            response = { "text": "Oops, try sending another image." };
            break;
        case "No":
            response = webview_six_by_six_contact_confirm_step_1;
            break;
        case "Challenged Six":
            response = { "text": "Ok, now we wait. I'll be in touch soon!" };
            break;
        case "Talk to human":
            response = {
                "text": "No problem. Give me a bit to contact them and someone will respond."
            };
            break;
        case "Talk to a human":
            response = {
                "text": "No problem. Give me a bit to contact them and someone will respond."
            };
            break;
    
        default:
            response = default_response;
            break;
    }

    callSendAPI(sender_psid, response);
    typeofCurrentSenderPsid = typeof currentSenderPsid;
    console.log(`typeof typeofCurrentSenderPsid: ${typeofCurrentSenderPsid}`);
    newSender = await createSender(sender_psid);
    console.log("newSender");
    console.log(newSender);
    faceBookUserData = await getFaceBookUserData(sender_psid);
    console.log("faceBookUserData");
    console.log(faceBookUserData);
    console.log("faceBookUserData");
    challengerEmail = await getChallengerByName(faceBookUserData.name, sender_psid);
    console.log("challengerEmail");
    console.log(challengerEmail);
    console.log("check email");
    
    console.log("challengerEmail");
    faceBookUserData.getFacebookData = true;
    console.log("faceBookUserData with email and updated for sender");
    console.log(faceBookUserData);
    console.log("faceBookUserData with email and updated for sender");
    updatedSender = await updateSender(sender_psid, faceBookUserData);
    console.log("updatedSender with email and updated true");
    console.log(updatedSender);
    console.log("updatedSender with email and updated true");

    challengerEmail = await getChallengerByName(faceBookUserData.name, sender_psid);
    console.log("challengerEmail");
    console.log(challengerEmail);
    console.log("challengerEmail");
    try {
        console.log("challengerEmail in try");
        console.log(challengerEmail);
        console.log(challengerEmail.email);
        console.log("challengerEmail");
        faceBookUserData.email = challengerEmail[0].email;
        updatedSenderEmail = await updateSender(sender_psid, faceBookUserData);
        console.log("updatedSenderEmail in try");
        console.log(updatedSenderEmail);
        console.log(updatedSenderEmail.email);
        console.log("updatedSenderEmail");
    }
    catch (error) {
        console.log(error);
    }
}

function callSendAPI(sender_psid, response) {
    console.log("callSendAPI");
    // console.log(response);
    let responseMessage;
    let request_body;
    if (response.length > 1) {
        console.log(">1");
        response.forEach(function(responseMessage) {
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": responseMessage
        }
    
        request({
            "uri": "https://graph.facebook.com/v3.1/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log(`message sent!`);
                // console.log("body");
                // console.log(body);
                // console.log("body");
            } else {
                console.err(`Unable to send message: ${ err }`);
            }
         });
        })
    } else {
        console.log("1");
        responseMessage = response;
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": responseMessage
        }
    
        request({
            "uri": "https://graph.facebook.com/v3.1/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log(`message sent!`);
                // console.log("body");
                // console.log(body);
                // console.log("body");
            } else {
                console.err(`Unable to send message: ${ err }`);
            }
        });
    }
    
}

app.post('/webhook', (req, res) => {
    let body = req.body;
    // console.log("body");
    // console.log(body);
    // console.log("body");

    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            // console.log("webhook_event");
            // console.log(webhook_event);
            // console.log("webhook_event");

            let sender_psid = webhook_event.sender.id;
            console.log(`Sender PSID: ${sender_psid}`);

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
                // console.log("webhook_event.message");
                // console.log(webhook_event.message);
                // console.log("webhook_event.message");
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
                // console.log("webhook_event.postback");
                // console.log(webhook_event.postback);
                // console.log("webhook_event.postback");
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {

        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

const PORT = process.env.PORT || 1447

app.listen( PORT, () => console.log(`webhook is Running on port ${PORT}`));
// app.listen( PORT, () => console.log(responses.simple_button_message));
module.exports = RetrievedFacebookUserData;