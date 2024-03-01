import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import generateBlocks from '../utils/generateBlocks';
import openModal from '../interactions/openModal';
import getResponseMessage from '../utils/getResponseResult';

export default async function commands({
  body,
  ack,
  client,
  logger,
  payload,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>) {
  // NOTE: payload.text: '<!subteam^S06MDLGF4RY|@product>',
  const groupId = payload.text.match(/(?<=subteam\^)(.*?)(?=\|)/gm)?.[0];

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

      const message = getResponseMessage(users, 1);
      const result = await client.chat.postMessage({
        channel: body.channel_id,
        text: message,
      });
      logger.info(result);
    }
  } catch (error) {
    logger.error(error);
  }
}
