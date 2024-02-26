import {
  AllMiddlewareArgs,
  GlobalShortcut,
  SlackCommandMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

export const commandOpenModal = async ({
  body,
  ack,
  client,
  logger,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>) => {
  try {
    await ack();
    const { members } = await client.conversations.members({
      channel: body.channel_id,
    });

    const memberNames = await Promise.all(
      (members || []).map(async (userId: string) => {
        const userInfo = await client.users.info({ user: userId });
        return userInfo.user?.real_name || userInfo.user?.name;
      })
    );

    // NOTE: 예시
    memberNames.push('최득교', '정윤정', '장하나');

    const result = await client.views.open({
      trigger_id: body.trigger_id,
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
                value: name,
              };
            }),
          },
        ],
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};
