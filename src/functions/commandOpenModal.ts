import {
  AllMiddlewareArgs,
  GlobalShortcut,
  SlackCommandMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { getUsers } from '../getUsers';

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

    const result = await client.views.open({
      trigger_id: body.trigger_id,

      view: {
        type: 'modal',
        callback_id: 'random',
        private_metadata: JSON.stringify({
          members: members?.join(','),
          channelId: body.channel_id,
        }),
        title: {
          type: 'plain_text',
          text: '울룰루!',
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
            type: 'input',
            block_id: `member_input_block_${new Date().getMilliseconds()}`,
            element: {
              type: 'multi_users_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select users',
                emoji: true,
              },
              action_id: 'multi_users_select-action',
              // initial_users: members,
            },
            label: {
              type: 'plain_text',
              text: '멤버를 선택해 주세요',
              emoji: true,
            },
          },

          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: '모든 인원을 선택합니다.',
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '전체 선택',
                emoji: true,
              },
              value: 'click_me',
              action_id: 'insert_all_users',
              style: 'danger',
            },
          },
          {
            type: 'input',
            block_id: 'number_input',
            element: {
              type: 'number_input',
              is_decimal_allowed: false,
              action_id: 'number_input-action',
              initial_value: '1',
            },
            label: {
              type: 'plain_text',
              text: '몇 명을 뽑을까요?',
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
