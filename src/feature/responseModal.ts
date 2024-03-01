import type {
  AllMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import getResponseMessage from '../utils/getResponseResult';

export default async function responseModal({
  ack,
  view,
  client,
  logger,
  body,
}: SlackViewMiddlewareArgs<SlackViewAction> & AllMiddlewareArgs) {
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

    const message = getResponseMessage(members, count);
    const result = await client.chat.postMessage({
      channel: channelId,
      text: message,
    });
  } catch (error) {
    logger.error(error);
  }
}
