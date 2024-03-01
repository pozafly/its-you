import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import generateBlocks from '../utils/generateBlocks';

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
      view: generateBlocks({ members, channelId: body.channel_id }),
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};
