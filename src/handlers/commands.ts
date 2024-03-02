import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import type { StringIndexed } from '@slack/bolt/dist/types/helpers';
import openModal from '../interactions/openModal';
import getResponseMessage from '../utils/getResponseResult';

export default async function commands({
  body,
  ack,
  client,
  logger,
  payload,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>) {
  const [rawGroupText, count = 1] = payload.text.split(' ');
  // NOTE: rawGroupText: '<!subteam^S06MDLGF4RY|@product>',
  const groupId = rawGroupText?.match(/(?<=subteam\^)(.*?)(?=\|)/gm)?.[0];

  try {
    await ack();

    if (!groupId) {
      // 모달 open
      const result = openModal(client, body);
      logger.info(result);
    } else {
      // 즉시 결과 return
      const { users } = await client.usergroups.users.list({
        usergroup: groupId,
      });
      if (!users || users.length <= 0) {
        throw new Error('no users');
      }

      const message = getResponseMessage({
        author: body.user_id,
        members: users,
        count: Number(count),
      });
      const result = await client.chat.postMessage({
        channel: body.channel_id,
        text: message,
        mrkdwn: true,
      });
      logger.info(result);
    }
  } catch (error) {
    logger.error(error);
  }
}
