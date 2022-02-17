const { Client, Intents } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const mySecret = process.env["DISCORD_TOKEN"];
client.on("ready", () => {
  console.log(`Logged is as ${client.user.tag}!`);
});

async function msgReply(textMsg) {
  projectId = process.env.PROJECT_ID;

  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = await sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textMsg,

        languageCode: "en-US",
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;
  console.log(`Query: ${result.queryText}`);

  return await result.fulfillmentText;
}

client.on("message", (message) => {
//  console.log(message.author.bot);
 // console.log(message.content);
  if (message.content === 'what is my avatar') {
    //  console.log(message.content);
   // console.log(message.author.displayAvatarURL());
    message.reply(message.author.displayAvatarURL());
  } else if (!message.author.bot) {
    //  console.log(message.content);
    msgReply(message.content).then((res) => {
      console.log(res);
      message.channel.send(res);
    });
  }
});

client.login(mySecret);
