import openModal from '../interactions/openModal';
import getResponseMessage from '../utils/getResponseResult';
import type {
  SlackAppContextWithRespond,
  SlashCommand,
} from 'slack-cloudflare-workers';

export default async function commands({
  context,
  payload,
}: {
  context: SlackAppContextWithRespond;
  payload: SlashCommand;
}) {
  const [rawGroupText, count = 1] = payload.text.split(' ');
  // NOTE: rawGroupText: '<!subteam^S06MDLGF4RY|@product>',
  const groupId = rawGroupText?.match(/(?<=subteam\^)(.*?)(?=\|)/gm)?.[0];

  const { client } = context;
  const { trigger_id, channel_id, user_id } = payload;

  try {
    if (!groupId) {
      // 모달 open
      await openModal(client, trigger_id, channel_id);
    } else {
      // 즉시 결과 return
      const { users } = await client.usergroups.users.list({
        usergroup: groupId,
      });
      if (!users || users.length <= 0) {
        throw new Error('no users');
      }

      const message = getResponseMessage({
        author: user_id,
        members: users,
        count: Number(count),
      });

      await client.chat.postMessage({
        channel: channel_id,
        text: message,
        mrkdwn: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
