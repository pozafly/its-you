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
  if (selectedUsers.length === 0) {
    return '*아무도 뽑히지 않았습니다 ;(*';
  }
  const mentionedUser = selectedUsers
    .filter((name) => name !== undefined)
    .map((name, index) => `>• ${index + 1}등 : <@${name}>`);

  const authorUser = `<@${author}>`;

  if (mentionedUser.length === 0) {
    return '*아무도 뽑히지 않았습니다 ;(* - by ${authorUser}';
  }

  return `🥳 *당첨! 축하드립니다.* 🎉- by ${authorUser}\n${mentionedUser.join(
    '\n'
  )}`;
}
