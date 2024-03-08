import type { AllMiddlewareArgs, SlashCommand } from '@slack/bolt';
import generateBlocks from '../utils/generateBlocks';
import { SlackAPIClient } from 'slack-cloudflare-workers';

export default async function openModal(
  client: SlackAPIClient,
  trigger_id: string,
  channel_id: string
) {
  const { members } = await client.conversations.members({
    channel: channel_id,
  });

  const result = await client.views.open({
    trigger_id: trigger_id,
    view: generateBlocks({ members, channelId: channel_id }),
  });

  return result;
}
