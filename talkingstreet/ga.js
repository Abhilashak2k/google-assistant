'use strict';
var entities = require("html-entities");
var cors = require('cors');
//var NodeGeocoder = require('node-geocoder');
//var geocoder = NodeGeocoder(options);
var bodyParser = require('body-parser');
var config = require('./config.js')(process.env.NODE_ENV || 'development')
var https = require('https');
var http = require('http');

var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();

const {
  actionssdk,
  BasicCard,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  Suggestions,
  SimpleResponse,
 } = require('actions-on-google');

 const gapp = actionssdk({debug: true});

var loc = "sample", cus = "sample";

var SERVER_RESULT = [{}];				

gapp.middleware((conv) => {
  conv.hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
  conv.hasAudioPlayback =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});


// here goes the code

 const intentSuggestions = [
  'I am Hungry',
  'Whats good here',
  'What can i eat here',
  'find me good food around here',
  'where should I go to eat?',
];
const intentSuggestions2 = [
  'Rolls',
  'Italian',
  'Chinese',
  'Snacks',
  'Sweets',
  'Bengali',
  'Lassi',
  'Chaat',
  'Pani Puri',
  'North Indian',
  'South Indian',
  'Rajasthani',
  'Kebab',
  'Continental',
];

const SELECTION_KEY_ONE = 'title1';
const SELECTION_KEY_TWO = 'title2';
const SELECTION_KEY_THREE = 'title3';
const SELECTION_KEY_FOUR = 'title4';

var SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: "",
  [SELECTION_KEY_TWO]: "",
  [SELECTION_KEY_THREE]: "",
  [SELECTION_KEY_FOUR]: "",
};


//selection keys


const intentSuggestions3 = [
  'mumbai',
  'delhi',
  'pune',
  'chennai',
  'bangalore',
  'varanasi',
  ''
];

gapp.intent('actions.intent.MAIN', (conv) =>
{	 conv.ask(new SimpleResponse({
    speech: 'Hello and Welcome to Talking street. Our local foodies are always ready to help you find good food. How can I help you?',
    text: 'Hello and Welcome to Talking street. Our local foodies are always ready to help you find good food. How can I help you?',
  }));

	 conv.ask(new Suggestions(intentSuggestions));
});

 gapp.intent('actions.intent.TEXT', (conv, input) => 
	{
	let rawInput = input.toLowerCase();
	//loc = place.toLowerCase();

	//only location specified
	console.log('USER SAID ' + rawInput);

		if ( rawInput == 'i am hungry' || rawInput == 'find me good food around here' || rawInput == 'what can i eat here') 
		{
		    //carousel(conv);
		    conv.ask('Where are you?');
		    conv.ask(new Suggestions(intentSuggestions3));

		}

		else if(rawInput == 'ok' || rawInput == 'cool' || rawInput == 'thanks' || rawInput == 'bye' || rawInput == 'ok bye' ) 
		{
			//conv.byeCard(conv);
			conv.ask('OK foodie friend! Hope you get hungry soon!');
		}

		else if (intentSuggestions3.includes(rawInput))
		{
			loc = input.toLowerCase();
		    conv.ask('Okay so you are in ' + (loc.charAt(0).toUpperCase() + loc.substr(1)) + "\nWhat cuisine would you prefer?" );
		    conv.ask(new Suggestions(intentSuggestions2));
		}
		else if (intentSuggestions2.includes(rawInput) )
		{
			cus = input.toLowerCase();
			console.log("Inside the cuisine intent\n");

			return getResponseFromServer(loc, cus).then(data =>{
				conv.ask("OK")
				console.log("About to enter the carousel function\n");
				carousel(conv);
			})
						
		}

		else if(rawInput == 'do you fart')
		{
			conv.ask("depends how many parathas i had");
		}
		else if(rawInput == 'what do you wear')
		{
			conv.ask("anything that covers my food baby");
		}
		else if(rawInput == 'do you believe in god')
		{
			conv.ask("Who else do you think could come up with rajma chawal?");
		}
		else if(rawInput == 'which came first the chicken or the egg?')
		{
			conv.ask("Depend which one did you order first");
		}
		else if(rawInput == 'how do i look')
		{
			conv.ask("you look hungry");
		}
		else if(rawInput == 'what is love')
		{
			conv.ask("the answer is the sight of biryani");
		}


		else{
		let found = rawInput.match(/^ i am in (.*)|whats good in (.*)| what can i eat around in (.*)|find me places to eat in (.*)|where can i go in (.*)$/);
		if (found ) 
		{
			var i;
			for (i=1 ;; i++)
			{
				if(!!found[i]){
		  			loc = found[i];
		  			break;
				}
			}
		  console.log("User is in the location " + loc);
		  conv.ask('Welcome to ' + (loc.charAt(0).toUpperCase() + loc.substr(1)) + "!\nWhat cuisine would you prefer?" );
		    conv.ask(new Suggestions(intentSuggestions2));
		}

		else{//only cuisine specified

		let f = rawInput.match(/^i want (.*)|show me only the (.*) options|i only want (.*)|i like (.*)|i prefer (.*)|tell me about the (.*) options|$/);
			// var locObject = cities.gps_lookup(40.672823, -74.52011);
			// loc = locObject.city;
			if (f ) 
			{
				var i;
				for (i=1 ;; i++)
				{
					if(!!f[i]){
			  			cus = f[i];
			  			break;
					}
				}
			  console.log("User wants " + cus);
			  console.log("Inside the cuisine intent\n");

				return getResponseFromServer(loc, cus).then(data =>{
					conv.ask("Our local foodies have found us these places that serve your type of food.");
					console.log("About to enter the carousel function\n");
					carousel(conv);
				})
			}
		}}		

	});


function getResponseFromServer(loc, cus) {
	loc = "Mumbai";
				if(!!loc && !!cus)
				var str = "http://localhost:1337/location/" + loc.toLowerCase() + "/" + cus.toLowerCase() + "/outlets";
				var r = {
					'uri': str,
					'method':"GET"
				}
				console.log(r);

				return new Promise((resolve, reject) => {
				request(r, function(err, res, body){
					if(!!err)
					{
						console.log("There is an error");
						console.log(err);
					}
					else
					{
						//console.log("THIS IS THE BODY \n\n")	
						SERVER_RESULT = JSON.parse(body);
						//console.log(SERVER_RESULT[1].img);
						resolve(body);
						
					}

					})
				/*console.log(body);
				resolve(body);*/
				});
}


function carousel(conv) {

SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: SERVER_RESULT[4].url,
  [SELECTION_KEY_TWO]: SERVER_RESULT[1].url,
  [SELECTION_KEY_THREE]: SERVER_RESULT[2].url,
  [SELECTION_KEY_FOUR]: SERVER_RESULT[3].url,
};
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is what we found');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a carousel
  conv.ask(new Carousel({
    items: {
      // Add the first item to the carousel
      [SELECTION_KEY_ONE]: {
        title: SERVER_RESULT[4].title,
        description: SERVER_RESULT[4].description,
        image: new Image({
          url: SERVER_RESULT[4].img,
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_TWO]: {
        title: SERVER_RESULT[1].title,
       description: SERVER_RESULT[1].description,
        image: new Image({
		url: SERVER_RESULT[1].img,        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_THREE]: {
         title: SERVER_RESULT[2].title,
       description: SERVER_RESULT[2].description,
        image: new Image({
          url: SERVER_RESULT[2].img,
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_FOUR]: {
        title: SERVER_RESULT[3].title,
       description: SERVER_RESULT[3].description,
        image: new Image({
          url: SERVER_RESULT[3].img,
        }),
        buttons : new Button({
        	title: "This is a button",
        	url : SERVER_RESULT[3].url,

        }),
      },
    },
  }));
}

	
app.use(bodyParser.json());

app.use(cors())
app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
app.set('port', (process.env.PORT || config.server_port_number));

app.get('/ping', function(req, res) {
    return 'OK'
})


/* this is for testing Google Actions */
app.post('/web/gamessages', function(req, res) {

	gapp(req, res)
// Register handlers for Actions SDK intents
})
