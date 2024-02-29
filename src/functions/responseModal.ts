import {
  AllMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';

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

    const mentionUser = members.map((name) => `<@${name}>`).join(', ');

    // TODO: 랜덤 추첨만 들어가면 된다.

    await client.chat.postMessage({
      text: `당첨! ${mentionUser}`,
      channel: channelId,
    });
  } catch (error) {
    logger.error(error);
  }
};
