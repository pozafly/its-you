import type {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import generateBlocks from '../utils/generateBlocks';

export default async function insertAllUsers({
  ack,
  client,
  body,
}: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) {
  await ack();

  const { members, channelId } = JSON.parse(
    body.view?.private_metadata || '{}'
  );

  try {
    await client.views.update({
      view_id: body?.view?.id,
      hash: body?.view?.hash,
      view: generateBlocks({ members, channelId, isInitModal: true }),
    });
  } catch (e) {
    console.log(e);
  }
}
