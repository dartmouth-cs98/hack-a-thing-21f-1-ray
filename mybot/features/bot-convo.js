/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// Checks if the intent Luis detects matches the intent for a given reply.
 function hearLuis(msg, int) {
  if (!msg.luis.prediction) return false;
  console.log(msg.luis.prediction);
  return (msg.luis.prediction.topIntent == int && msg.luis.prediction.intents[int].score > 0.4);
}

// Checks Luis' sentiment
function meanLuis(msg) {
  if (!msg.luis.prediction) return false;
  console.log(msg.luis.prediction);
  if (msg.luis.prediction.sentiment.score < 0.2) return true;
}

// Dictionary for Luis intents (which were defined in Luis)
const LUIS_INT = {
  LEARN_MORE: 'Learn More',
  HEY: 'Hello',
}

// Each controller.hears is tested for a match, and Botkit skips to next option if false.
module.exports = function(controller) {

  // 1st, check mean.
  controller.hears((msg)=>meanLuis(msg),'message', (bot,message) => {
    console.log(message);
    bot.say("I'm detecting some negative emotions. Please be nice to me!");
  });

  // Check if someone wants to learn more.
  controller.hears((msg)=>hearLuis(msg, LUIS_INT.LEARN_MORE),'message', (bot,message) => {
    console.log(message);
    // Check if they asked about a topic.
    if (message.luis.prediction.entities['Topic To Learn']) {
      bot.say(`Yes, I'd love to tell you more about: ${message.luis.prediction.entities['Topic To Learn'][0]}`)
    }
    // Check if they asked for your favorite item.
    else if (message.luis.prediction.entities['Favorite']) {
      if (message.luis.prediction.entities['Favorite'][0] == 'class') {
        bot.say('CS98 is my favorite class!')
      } else {
        bot.say(`Oh I can't possibly pick a favorite ${message.luis.prediction.entities['Favorite'][0]}`)
      }
    } else {
      bot.say('What would you like to learn more about?')
    }
  });

  // Check if they said hi.
  controller.hears((msg)=>hearLuis(msg, LUIS_INT.HEY),'message', (bot,message) => {
    console.log(message);
    bot.say("Hi! I'm Ray's bot!");
  });

  // No matches? Ask for more input.
  controller.on('message,direct_message', async(bot, message) => {
    bot.say("Hmm, I'm not sure what you want. Try again.");
  });

}
