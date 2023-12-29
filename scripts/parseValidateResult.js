const fs = require('fs')

let result = JSON.parse(fs.readFileSync('validate.json'));

let summaryText = '';
let colorCode = '#008000';
if(result.status == 1){
     colorCode = '#FF0000';
     summaryText = `❌ Validation to Salesforce Org has been failed with the \n Error : ${result.message} and \n return code ${result.code} \n with status code as ${result.status}`
} else {
    colorCode = '#008000';
    summaryText = `✅ Validation to Salesforce Org has been passed 🎉 and \n return code ${result.code} \n with status code as ${result.status} `
}
/*
let slackPayload = {
	"attachments": [
		{
			"color": colorCode,
			"blocks": [
                    {
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": summaryText
					}
				},
				{
					"type": "section",
					"text": {
						"type": "mrkdwn",
						"text": "`" + result.message + "`"
					}
				}
			]
		}
	]
};
*/
let slackPayload = {
      "text": summaryText,
      "blocks": [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": summaryText
		}
	},
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "`" + result.message + "`"
		}
	}
    ]
};

// Convert the object to a JSON string
const jsonData = JSON.stringify(slackPayload); 

// Write the JSON string to the file
fs.writeFileSync('slackPayload.json', jsonData, 'utf-8');
