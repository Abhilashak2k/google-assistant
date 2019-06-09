Skip to content
Features
Business
Explore
Marketplace
Pricing

Search

Sign in or Sign up
9 29 19 actions-on-google/conversation-components-nodejs
 Code  Issues 6  Pull requests 0  Projects 0  Insights
Join GitHub today
GitHub is home to over 28 million developers working together to host and review code, manage projects, and build software together.

conversation-components-nodejs/actions-sdk/functions/index.js
0c151e5  on Apr 17
@taycaldwell taycaldwell Update to use client lib v2
@taycaldwell @smishra2 @mandnyc @lucaswadedavis
     
371 lines (350 sloc)  10.6 KB
// Copyright 2017-2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

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
const functions = require('firebase-functions');

// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_ONE = 'title';

// Constants for image URLs
const IMG_URL_AOG = 'https://developers.google.com/actions/images/badges' +
  '/XPM_BADGING_GoogleAssistant_VER.png';
const IMG_URL_GOOGLE_ALLO = 'https://allo.google.com/images/allo-logo.png';
const IMG_URL_GOOGLE_HOME = 'https://lh3.googleusercontent.com' +
  '/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const IMG_URL_GOOGLE_PIXEL = 'https://storage.googleapis.com/madebygoog/v1' +
  '/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: 'You selected the first item in the list or carousel',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
  [SELECTION_KEY_GOOGLE_ALLO]: 'You selected Google Allo!',
};

const intentSuggestions = [
  'Basic Card',
  'Browse Carousel',
  'Carousel',
  'List',
  'Media',
  'Suggestions',
];


// React to a text intent
app.intent('actions.intent.TEXT', (conv, input) => {
  let rawInput = input.toLowerCase();
  console.log('USER SAID ' + rawInput);
  if (rawInput === 'basic card') {
    basicCard(conv);
  } else if (rawInput === 'list') {
    list(conv);
  } else if (rawInput === 'carousel') {
    carousel(conv);
  } else if (rawInput === 'normal ask') {
    normalAsk(conv);
  } else if (rawInput === 'normal bye') {
    normalBye(conv);
  } else if (rawInput === 'bye card') {
    byeCard(conv);
  } else if (rawInput === 'bye response') {
    byeResponse(conv);
  } else if (rawInput === 'suggestions' || rawInput === 'suggestion chips') {
    suggestions(conv);
  } else {
    normalAsk(conv);
  }
});


function carousel(conv) {
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
        synonyms: [
          'synonym of title 1',
          'synonym of title 2',
          'synonym of title 3',
        ],
        title: 'First Recommendation',
        description: 'At Shivaji Military Hotel, Bengaluru they use only nati varieties of all ingredients - from the vegetables to ginger, garlic and the chicken too, and an identical variety of rice to ensure consistency in taste.',
        image: new Image({
          url: RICE_MUTTON,
          alt: 'rice mutton',
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_TWO]: {
        synonyms: [
          
      ],
        title: 'Second Recommendation',
        description: 'Rakesh Kumar Pani Puri and Chaat is one of the oldest Pani Puri places in the Jayanagar, Rakesh Pani Puri and Chaat authentic North Indian Chaat',
        image: new Image({
          url: SUKHA_PURI,
          alt: 'sukha puri',
        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_THREE]: {
        synonyms: [
          
        ],
        title: 'Third Recommendation',
        description: 'This particular Dosa Time on Sarjapur road was opened 2 years ago and is the oldest amongst a total of 5 outlets of the same chain ',
        image: new Image({
          url: MASALA_DOSA,
          alt: 'masala dosa',
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_FOUR]: {
        title: 'Fourth Recommendation',
        synonyms: [
         
        ],
        description: 'Bite-me Cupcakes in Indira Nagar is a cozy cafe and a best hangout. Small-sized cupcakes that allow for indulgences and dont pinch the pocket.',
        image: new Image({
          url: CUPCAKE,
          alt: 'bite me cupcake',
        }),
      },
    },
  }));
}

