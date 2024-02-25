import {
  AllMiddlewareArgs,
  GlobalShortcut,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt';

export const openModal = async ({
  shortcut,
  ack,
  client,
  logger,
}: SlackShortcutMiddlewareArgs<GlobalShortcut> & AllMiddlewareArgs) => {
  try {
    await ack();
    console.log(shortcut);

    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
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
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
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
            element: {
              type: 'plain_text_input',
              multiline: true,
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'Label',
              emoji: true,
            },
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};
