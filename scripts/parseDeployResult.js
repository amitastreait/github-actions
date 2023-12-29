const fs = require('fs')

let result = JSON.parse(fs.readFileSync('deploy.json'));

let summaryText = '';
let colorCode = '#008000';
if(result.status == 1){
     colorCode = '#FF0000';
     summaryText = `❌ *Deployment to Salesforce Org has been failed with the error* `
} else {
    colorCode = '#008000';
    summaryText = `✅ Deployment to Salesforce Org has been passed 🎉 with status code as ${result.status} `
}

let slackPayload = {
      "text": summaryText,
      "blocks": [
      	{
      		"type": "section",
      		"text": {
      			"type": "mrkdwn",
      			"text": summaryText
      		}
      	}
    ]
};

// iterate over the failed components and add those into the slack payload
for(const res of result?.result?.details?.componentFailures){
    if(res.success == false){
        let blockText = `${res.problemType} : ${res.problem} \n ${res.componentType} : ${res.fileName} \n ${res.fullName} : ${res.createdDate}`;
        let block = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '`'+blockText+'`'
            }
        }
        slackPayload.blocks.push(block);
    }
}

// Convert the object to a JSON string
const jsonData = JSON.stringify(slackPayload); 

// Write the JSON string to the file
fs.writeFileSync('slackPayload.json', jsonData, 'utf-8');
