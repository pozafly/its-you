import getRandomUsers from './getRandomUsers';

export default function getResponseMessage(members: string[], count: number) {
  const selectedUsers = getRandomUsers(members, count);
  const mentionedUser = selectedUsers.map((name) => `<@${name}>`).join(', ');

  return `🎉 당첨! ${mentionedUser} 축하드립니다. 🥳`;
}
