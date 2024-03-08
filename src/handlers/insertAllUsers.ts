import {
  BlockAction,
  BlockElementActions,
  DataSubmissionView,
  SlackAppContextWithOptionalRespond,
  SlackAppContextWithRespond,
} from 'slack-cloudflare-workers';
import generateBlocks from '../utils/generateBlocks';

export default async function insertAllUsers({
  context,
  payload,
}: {
  context: SlackAppContextWithOptionalRespond;
  payload: BlockAction<BlockElementActions>;
}) {
  const { client } = context;
  const { members, channelId } = JSON.parse(
    payload.view?.private_metadata || '{}'
  );

  try {
    await client.views.update({
      view_id: payload?.view?.id,
      hash: payload?.view?.hash,
      view: generateBlocks({ members, channelId, isInitModal: true }),
    });
  } catch (e) {
    console.log(e);
  }
}
