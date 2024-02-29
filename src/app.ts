import { App, GlobalShortcut, ViewSubmitAction } from '@slack/bolt';
import './utils/env';
import { openModal } from './functions/openModal';
import { commandOpenModal } from './functions/commandOpenModal';
import { insertAllUsers } from './functions/insertAllUsers';
import { responseModal } from './functions/responseModal';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message('hello', async ({ message, say }) => {
  console.log('message', message);
  console.log('say', say);
});

app.shortcut<GlobalShortcut>('random', openModal);
app.command('/random', commandOpenModal);

// https://api.slack.com/methods/views.update
app.action('insert_all_users', insertAllUsers);
app.view<ViewSubmitAction>('random', responseModal);

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
