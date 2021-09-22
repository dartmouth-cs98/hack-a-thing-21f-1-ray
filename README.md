# Hack Technology / Project Attempted

Botkit with Natural Language Processing

## What you built? 

I have previously used Botkit to make simple chatbots, but I wanted to add NLP to a bot, to see how far we could go with AI assistants. NLP has a major advantage over RegEx for chatbots -- you don't need to know exactly how a user will say something in order to reply. 

It didn't work perfect, see below, but I can see how adding large amounts of training data can make this assistant very powerful, and definetly usable for a final project.

![Botkit Show](https://github.com/dartmouth-cs98/hack-a-thing-21f-1-ray/blob/main/img/bot-example.png)

## What you learned

Botkit has a way to add "middlewares" which can process messages in all sorts of ways before you reply. There was a pre-existing middleware for Luis.ai which could be downloaded via NPM -- I spent a couple hours tryinig to use it, before realizing it was outdated and thus broken.

Therefore, I had to learn to write my own Botkit middleware -- which was basically 1 function that called the Luis API to make a prediction to tack it onto the message object (luisMiddleware, in bot.js), and 2 more functions which helped the bot decide what to say given Luis' prediction (meanLuis and hearLuis). 

I didn't end up writing a ton of code; the major challenges were a) setting up Microsoft Azure Services (what's a resource! a resource provider! so many settings??) and b) figuring out the syntax for writing a middleware, as Botkit's docs are not exhaustive.

In addition to my code (in bot-convo.js and bot.js), I had to build Luis' model in Azure Services. The Luis API allows you to develop training models in a low-code interface.

![Luis.AI](https://github.com/dartmouth-cs98/hack-a-thing-21f-1-ray/blob/main/img/training.png)

## Authors

Ray Crist!

## Acknowledgments

Botkit's [Get Started tutorial](https://botkit.ai/getstarted.html) generated much of the set-up code.
The [Luis docs](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-get-started-create-app) were helpful.
I was originally going to use the prebuilt Botkit-Luis middleware [here](https://github.com/Stevenic/botkit-middleware-luis/issues) but didn't end up using.

### Example of Luis API Return Data
```
{
  topIntent: 'Learn More',
  intents: {
    'Learn More': { score: 0.97574174 },
    Hello: { score: 0.013183255 },
    None: { score: 0.00700506 }
  },
  entities: {
    'Topic To Learn': [ 'the weather' ],
    '$instance': { 'Topic To Learn': [Array] }
  },
  sentiment: { label: 'neutral', score: 0.5 }
}
{
  topIntent: 'Learn More',
  intents: {
    'Learn More': { score: 0.97574174 },
    Hello: { score: 0.013183255 },
    None: { score: 0.00700506 }
  },
  entities: {
    'Topic To Learn': [ 'the weather' ],
    '$instance': { 'Topic To Learn': [Array] }
  },
  sentiment: { label: 'neutral', score: 0.5 }
}

```
