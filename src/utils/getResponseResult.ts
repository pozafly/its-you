import getRandomUsers from './getRandomUsers';

type Props = {
  author: string;
  members: string[];
  count: number;
};

export default function getResponseMessage({
  author = '',
  members = [],
  count = 1,
}: Props) {
  const selectedUsers = getRandomUsers(members, count);
  const mentionedUser = selectedUsers
    .map((name, index) => `>• ${index + 1}등 : <@${name}>`)
    .join('\n');
  const authorUser = `<@${author}>`;

  return `🥳 *당첨! 축하드립니다.* 🎉- by ${authorUser}\n${mentionedUser}`;
}
