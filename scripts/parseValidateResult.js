const fs = require('fs')

let result = JSON.parse(fs.readFileSync('validate.json'));

let summaryText = '';

if(result.status == 1){
     summaryText = `❌ Validation to Salesforce Org has been failed`
}
else{
    summaryText = `✅ Validation to Salesforce Org has been passed 🎉 `
}

let slackPayload = {
      "text": summaryText,
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            text: '`'+ result.message + result.status + ( typeof result.status ) + '`'
          }
        }
      ]
};

// Convert the object to a JSON string
const jsonData = JSON.stringify(slackPayload); 

// Write the JSON string to the file
fs.writeFileSync('slackPayload.json', jsonData, 'utf-8');
