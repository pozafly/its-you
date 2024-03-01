import type { AllMiddlewareArgs, SlashCommand } from '@slack/bolt';
import generateBlocks from '../utils/generateBlocks';

export default async function openModal(
  client: AllMiddlewareArgs['client'],
  body: SlashCommand
) {
  const { members } = await client.conversations.members({
    channel: body.channel_id,
  });

  const result = await client.views.open({
    trigger_id: body.trigger_id,
    view: generateBlocks({ members, channelId: body.channel_id }),
  });

  return result;
}
