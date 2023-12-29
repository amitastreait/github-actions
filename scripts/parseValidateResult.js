const fs = require('fs')

let result = JSON.parse(fs.readFileSync('validate.json'));

let slackPayload = {
    text: 'Salesforce Validation Finished',
    blocks: []
}

let summaryText = '';

if(result.status === 1){
     summaryText = `❌ Validation to Salesforce Org has been failed`
}
else{
    summaryText = `✅ Validation to Salesforce Org has been passed 🎉 `
}


let summaryBlock = {
    type: 'section',
    text: {
        type: 'mrkdwn',
        text: summaryText
    }
}

slackPayload.blocks.push(summaryBlock);

// Add the error message 
let block = {
      type: 'section',
      text: {
          type: 'mrkdwn',
          text: '`'+result.message+'`'
      }
  }

  slackPayload.blocks.push(block);

// Convert the object to a JSON string
const jsonData = JSON.stringify(slackPayload); 

// Write the JSON string to the file
fs.writeFileSync('slackPayload.json', jsonData, 'utf-8');
