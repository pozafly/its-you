import {
  AllMiddlewareArgs,
  App,
  BlockAction,
  GlobalShortcut,
  InteractiveMessage,
  LogLevel,
  SlackCommandMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt';
import './utils/env';
import { openModal } from './functions/openModal';
import { commandOpenModal } from './functions/commandOpenModal';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { getUsers } from './getUsers';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // logLevel: LogLevel.DEBUG,
});

app.message('hello', async ({ message, say }) => {
  console.log('message', message);
  console.log('say', say);
});

app.shortcut<GlobalShortcut>('random', openModal);
app.command('/random', commandOpenModal);

// https://api.slack.com/methods/views.update
app.action<BlockAction>(
  /^user_button_.*/g,
  async ({ action, ack, client, body, payload }) =>
    // : {
    //   payload: any;
    //   action: BlockAction['actions'][0];
    //   ack: any;
    //   client: any;
    //   body: any;
    // }
    {
      await ack();

      console.log(body?.view?.state.values);

      console.log('keys', Object.keys(body?.view?.state.values));

      const property = Object.keys(body?.view?.state.values).find((value) =>
        value.startsWith('member_input')
      );
      console.log('property@@', property);
      const memberNames = JSON.parse(payload.value);
      const inputValue =
        body.view?.state.values[property].member_input.value || '';
      console.log('inputValue@@@@@@@@@@@@@@', inputValue);
      const clickTargetName = payload.text.text;

      let inputValueArray = inputValue
        ?.split(',')
        .map((name: string) => name.trim());

      console.log('@@@@@@inputValueArray', inputValueArray);

      if (inputValueArray.includes(clickTargetName)) {
        inputValueArray = inputValueArray.filter(
          (name: string) => name !== clickTargetName
        );
      } else {
        if (inputValueArray[0] === '') {
          inputValueArray.pop();
        }
        inputValueArray.push(clickTargetName);
      }

      console.log('insert @ value', inputValueArray.join(', '));

      try {
        await client.views.update({
          view_id: body?.view?.id,
          hash: body?.view?.hash,

          view: {
            type: 'modal',
            callback_id: 'random',

            title: {
              type: 'plain_text',
              text: '안녕!',
              emoji: true,
            },
            submit: {
              type: 'plain_text',
              text: '제출',
              emoji: true,
            },
            close: {
              type: 'plain_text',
              text: '취소',
              emoji: true,
            },

            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '뽑고 싶은 대상을 `,` 로 구분해 입력해주세요.',
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Test block with users select',
                },
                accessory: {
                  type: 'users_select',
                  placeholder: {
                    type: 'plain_text',
                    text: 'Select a user',
                    emoji: true,
                  },
                  action_id: 'users_select-action',
                },
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Click Me',
                      emoji: true,
                    },
                    value: 'click_me_123',
                    action_id: 'actionId-0',
                  },
                ],
              },
              {
                type: 'input',
                // NOTE: block_id가 달라져야 initial_value가 새롭게 들어간다.
                // https://stackoverflow.com/questions/72788906/slack-block-kit-plain-text-input-element-update-text-value
                block_id: `member_input_block_${new Date().getMilliseconds()}`,
                element: {
                  type: 'plain_text_input',
                  multiline: true,
                  action_id: 'member_input',
                  focus_on_load: true,
                  placeholder: {
                    type: 'plain_text',
                    text: '인원을 입력해주세요.',
                  },
                  initial_value: inputValueArray.join(', '),
                },
                label: {
                  type: 'plain_text',
                  text: 'Label',
                  emoji: true,
                },
              },
              {
                type: 'actions',
                elements: memberNames.map((name: string | undefined) => {
                  return {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: name || '',
                      emoji: true,
                    },
                    value: JSON.stringify(memberNames),
                    action_id: `user_button_${name}`,
                  };
                }),
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '모든 인원을 선택합니다.',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '전체 선택',
                    emoji: true,
                  },
                  value: 'click_me_123',
                  action_id: 'insert_all_users',
                  style: 'primary',
                },
              },
            ],
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
);

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
