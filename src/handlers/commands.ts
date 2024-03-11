import openModal from '../interactions/openModal';
import getCliOptions from '../utils/getCliOptions';
import getGroupId from '../utils/getGroupId';
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
  const [groupId, rest] = getGroupId(payload.text);

  const { client } = context;
  const { trigger_id, channel_id, user_id } = payload;

  try {
    if (!groupId) {
      // 모달 open
      await openModal(client, trigger_id, channel_id);
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
