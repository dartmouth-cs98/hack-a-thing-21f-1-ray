//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the mybot bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');
const axios = require('axios');

// Import a platform-specific adapter for web.

const { WebAdapter } = require('botbuilder-adapter-web');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}


const adapter = new WebAdapter({});


const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

// RAY: My custom middleware function, to add on prediction data to Luis.
async function luisMiddleware(bot, message, next) { 
  try {
    link = `https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/${process.env.LUIS_APP}/slots/production/predict?subscription-key=${process.env.LUIS_SUB_KEY}&verbose=true&show-all-intents=true&log=true&query=${message.text}`
    await axios.get(link).then((r) => {
      message.luis = r.data;
    }).catch((err) => {
      message.luis = {};
      console.log(err);
    })
  } catch(err) {
    console.log(err);
  }
  next();
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    // RAY: set up my middleware
    controller.middleware.receive.use(luisMiddleware);

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }

});





