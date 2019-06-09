Steps To set the assistant up in your machine:-
Please note you need to have nodejs, xampp (used in step 12) installed on your machine.

1. Download both the zip files.

2. https://developers.google.com/actions/sdk/create-a-project and create a project. Update the last field of the google assistant batch file to your project id.

3. Download gactions.cli

4. Run gactions init in talkingstreet folder

5. Run node ga.js in talkingstreet folder

6. Run ngrok http 9955

7. ngrok will give a https url. Copy that url in the action.json file (you will find the URL at the end of the json file). Just 

8. replace only the domain portion of the URL. do not run anything.

9. Run the command 
gactions test --action_package action.json --project YourProjectId

10. and then run
gactions update --action_package action.json --project YourProjectId

11. In the server folder run node script.js.

12. Start Apache and Mysql on Xampp.

13. Go to the actions console and test the assistant. after welcome, you can type any of the utterances configured and then you will be able to see the corresponding response.

























Folder Structure:-

Server:-
	Contains the script.js program that fetches outlets on the basis of location and cuisine via the url http: http://localhost:1337/location/<location>/<cuisine>/outlets.
From the databse named talking street.

Talkingstreet:-
	Contains ga.js program that handles utterances and calls getResponseFromServer function once it has the information about location and cuisine.

	Also contains actions.json file that handles intents.
	
	










