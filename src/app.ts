import { App, GlobalShortcut, LogLevel } from '@slack/bolt';
import './utils/env';
import { openModal } from './utils/openModal';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

app.message('hello', async ({ message, say }) => {
  console.log('message', message);
  console.log('say', say);
});

app.shortcut<GlobalShortcut>('random', openModal);
app.command('/random', async ({ ack, respond }) => {
  console.log('들어옴@@@@@@@@@@@@@@@', respond);
  try {
    await ack();
  } catch (error) {}
});

// app.action('button_click', async ({ message, say }) => {
//   /* ... */
// });
// app.event('reaction_added', async ({ event, client }) => {
//   /* ... */
// });

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

// app.use(async ({ next }) => {
//   await next();
// });

// app.message('hello', async ({ message, say }) => {
//   // Filter out message events with subtypes (see https://api.slack.com/events/message)
//   if (message.subtype === undefined || message.subtype === 'bot_message') {
//     // say() sends a message to the channel where the event was triggered
//     await say({
//       blocks: [
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: `Hey there <@${message.user}>!`,
//           },
//           accessory: {
//             type: 'button',
//             text: {
//               type: 'plain_text',
//               text: 'Click Me',
//             },
//             action_id: 'button_click',
//           },
//         },
//       ],
//       text: `Hey there <@${message.user}>!`,
//     });
//   }
// });

// app.action('button_click', async ({ body, ack, say }) => {
//   // Acknowledge the action
//   await ack();
//   await say(`<@${body.user.id}> clicked the button`);
// });

// (async () => {
//   // Start your app
//   await app.start(Number(process.env.PORT) || 3000);

//   console.log('⚡️ Bolt app is running!');
// })();
