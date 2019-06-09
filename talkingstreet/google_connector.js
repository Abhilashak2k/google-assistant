var hashMap=require('hashmap');
var request=require('request');
var config = require('./config.js')(process.env.NODE_ENV || 'development')


var expectedIntentHash = new hashMap() ;

var redirectRequest = function(gapp,userText,userId=null) {

  


    /* check user's last state and take necessary action */
    console.log(userText,userId);
    var intent = getUserIntent (userText,userId);
    if (intent == null) {
        /* if we do not find any user intent we pass the default user input*/
        console.log("found intent",intent);
        intent = userText;
    }
    else if (intent == 'invalid') {
        gapp.tell('unexpected input... please try again');
        return
    }


    var userData = null;
    userData = {
    'text': intent,
    'userId': userId
    };

    var req = {
    uri: config.main_url ,
    method: 'POST',

    json: true,
    body: userData
    };
    console.log("Request to main ",req)

    request (req,function(err,result,body) {
    console.log("error in nlp ",err)
    if (err) {
        res.send ({ action: 'udc' })
    }
    else {
        console.log(body);
        renderJSON(body,gapp,userId);
        
    }

    });

}

function renderJSON(output,gapp,userId=null) {
    /** @type {boolean} */
    var buttonlist=[]
    var intenthashes=[]
    var text_to_speak = ""
    var imageToDisplay=""
    var card=null;
    
    
    /* find out if screen has rendering capabilites */
    const screenOutput = gapp.hasSurfaceCapability(gapp.SurfaceCapabilities.SCREEN_OUTPUT);
    if (output.length > 0) {
        for (var i=0 ; i < output.length ; i++) {
            switch (output[i]["dtype"]) {
                case 'objText' :
                    var value = output[i]["value"];
                    var text = value["text"];
                    //gapp.ask(text);
                    text_to_speak = text_to_speak + text ;
                    console.log(text_to_speak.length);
                    break;
                case 'objEapi':
                    imageToDisplay = imageList[getRandomInt(0,imageList.length-1)]
                    break;
                case 'objButton' :
                    var value = output[i]["value"];
                    var text = value["text"];
                    var payload = value["payload"]
                    var intenthash = {"text":text, "payload": payload}
                    buttonlist.push(text);
                    intenthashes.push(intenthash);
                    break;
                case 'objTrigger' :
                    var value = output[i]["value"];
                    var text = "Next"; // force a user input
                    var payload = value["payload"]
                    var intenthash = {"text":text, "payload": payload}
                    buttonlist.push(text);
                    intenthashes.push(intenthash);
              
                    break;
                default:
                    break;

            }
        }
    }

    console.log(screenOutput);
    console.log(buttonlist);
    console.log(intenthashes);
    console.log(imageToDisplay);
    if (intenthashes.length > 0) {
        var currentHash = expectedIntentHash.get(userId);
        if (currentHash != null) {
            expectedIntentHash.delete(userId);
            expectedIntentHash.set(userId,intenthashes);
        }
        else {
            expectedIntentHash.set(userId,intenthashes);

        }
    }
    
    if (screenOutput) {
        if (buttonlist.length > 0) {
            
            
            if (text_to_speak.length == 0)
                text_to_speak = 'Tap on Button to Proceed';
            

            if (imageToDisplay.length > 0) {
                card=gapp.buildBasicCard(); 
                card.setImage(imageToDisplay,"testImage");

            }
            const richResponse = gapp.buildRichResponse();
            if (card != null) {
                richResponse.addBasicCard(card);
            }

            
            richResponse.addSimpleResponse(text_to_speak);
            richResponse.addSuggestions(buttonlist);
            gapp.ask(richResponse);
        }
        else {
            if (imageToDisplay.length > 0) {
                card=gapp.buildBasicCard(); 
                card.setImage(imageToDisplay,"testImage");

            }

            if (text_to_speak.length > 0) {
                const richResponse = gapp.buildRichResponse();
                if (card != null) {
                    richResponse.addBasicCard(card);
                }
                richResponse.addSimpleResponse(text_to_speak)
                gapp.ask(richResponse);


            }


        }
    }
}

function getUserIntent (userText,userId) {
    var currentHash = expectedIntentHash.get(userId);
    console.log(userText,userId);
    console.log(currentHash);
    if (currentHash == null) {
        return null;
    }
    if (currentHash.length > 0) {
        for (var i=0 ;i < currentHash.length ; i++) {
            if (currentHash[i]["text"].toUpperCase() == userText.toUpperCase())
                return currentHash[i]["payload"];
        }
    }
    else {
        return null;
    }
    
    return "invalid";

}

module.exports = {
    redirectRequest: redirectRequest
}

