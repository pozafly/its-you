import {
  AllMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import { getRandomNumber } from '../utils/numbers';

export const responseModal = async ({
  ack,
  view,
  client,
  logger,
  context,
  body,
}: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs) => {
  const { channelId } = JSON.parse(body.view?.private_metadata || '{}');

  try {
    const states = view['state'].values;
    const count = Number(states['number_input']['number_input-action'].value);

    let members: undefined | string[] = [];
    Object.keys(states).forEach((key) => {
      if (key.includes('member_input_block')) {
        members = states[key]['multi_users_select-action'].selected_users;
      }
    });

    if (count < 1 || count > members.length) {
      await ack({
        response_action: 'errors',
        errors: {
          ['number_input']: '숫자의 범위가 맞지 않습니다.',
        },
      });
    }
    await ack();

    const selectedUsers = [];
    for (let i = 0; i < count; i++) {
      const target: string = members[getRandomNumber(0, members.length)];
      selectedUsers.push(target);
      members = members?.filter((name) => name !== target);
    }

    const mentionedUser = selectedUsers.map((name) => `<@${name}>`).join(', ');
    await client.chat.postMessage({
      text: `당첨! ${mentionedUser} 축하드립니다!`,
      channel: channelId,
    });
  } catch (error) {
    logger.error(error);
  }
};
