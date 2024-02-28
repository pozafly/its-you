import { AllMiddlewareArgs, SlashCommand } from '@slack/bolt';

export const getUsers = async ({
  client,
  channelId,
}: {
  channelId: string;
  client: AllMiddlewareArgs['client'];
}) => {
  console.log('@@@@@@@@channelID', channelId);
  const { members } = await client.conversations.members({
    channel: channelId,
  });

  const memberNames = await Promise.all(
    (members || []).map(async (userId: string) => {
      const userInfo = await client.users.info({ user: userId });
      return userInfo.user?.real_name || userInfo.user?.name;
    })
  );

  return memberNames;
};
