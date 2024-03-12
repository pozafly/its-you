import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import type { StringIndexed } from '@slack/bolt/dist/types/helpers';
import openModal from '../interactions/openModal';
import getResponseMessage from '../utils/getResponseResult';
import getGroupId from '../utils/getGroupId';
import getCliOptions from '../utils/getCliOptions';

export default async function commands({
  body,
  ack,
  client,
  logger,
  payload,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>) {
  try {
    await ack();

    const [groupId, rest] = getGroupId(payload.text);
    if (!groupId) {
      // 모달 open
      const result = await openModal(client, body);
      logger.info(result);
    } else {
      // 즉시 결과 return
      const [ignoreMemberNameList, count] = getCliOptions(rest);
      let { users } = await client.usergroups.users.list({
        usergroup: groupId,
      });

      const ignoreUsers: string[] = [];
      if (ignoreMemberNameList.length > 0) {
        const userInfoList = await client.users.list();
        userInfoList?.members?.forEach((el) => {
          if ((ignoreMemberNameList as string[]).includes(el.name || '')) {
            ignoreUsers.push(el?.id ?? '');
          }
        });
      }

      if (!users || users.length <= 0) {
        throw new Error('no users');
      }

      if (ignoreUsers?.length > 0) {
        ignoreUsers.forEach((el) => {
          users = users?.filter((user) => user !== el);
        });
      }

      const message = getResponseMessage({
        author: body.user_id,
        members: users,
        count: Number(count),
      });

      await client.chat.postMessage({
        channel: body.channel_id,
        text: message,
        mrkdwn: true,
      });
    }
  } catch (error) {
    logger.error(error);
  }
}
