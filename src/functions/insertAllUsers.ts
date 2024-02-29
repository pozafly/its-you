import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';

export const insertAllUsers = async ({
  ack,
  client,
  body,
  payload,
}: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
  await ack();

  console.log('payload.value', payload);
  console.log('body', body);

  const members = body.view?.private_metadata;

  try {
    await client.views.update({
      view_id: body?.view?.id,
      hash: body?.view?.hash,

      view: {
        type: 'modal',
        callback_id: 'random',
        private_metadata: members,

        title: {
          type: 'plain_text',
          text: '오호! 아하!',
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
              initial_users: members?.split(','),
            },
            label: {
              type: 'plain_text',
              text: 'Label',
              emoji: true,
            },
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
              value: 'click_me',
              action_id: 'insert_all_users',
              style: 'danger',
            },
          },
          {
            type: 'input',
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
  } catch (e) {
    console.log(e);
  }
};
