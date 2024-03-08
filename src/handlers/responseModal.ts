import getResponseMessage from '../utils/getResponseResult';
import {
  SlackEdgeAppEnv,
  SlackRequest,
  ViewClosed,
  ViewSubmission,
} from 'slack-cloudflare-workers';

export default async function responseModal({
  context,
  payload,
}: SlackRequest<SlackEdgeAppEnv, ViewClosed | ViewSubmission>) {
  const { client } = context;
  const { view, user } = payload;
  const { channelId } = JSON.parse(view?.private_metadata || '{}');

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
      // return {
      //   response_action: 'errors',
      //   errors: {
      //     ['number_input']: '숫자의 범위가 맞지 않습니다.',
      //   },
      // };
    }

    const message = getResponseMessage({
      author: user.id,
      members,
      count,
    });
    const result = await client.chat.postMessage({
      channel: channelId,
      text: message,
      mrkdwn: true,
    });
  } catch (error) {
    console.error(error);
  }
}
