// NOTE: 꺽쇄 안의 모든 내용을 찾는다.
const rawGroupRegex = /<[^>]*>/gm;
// NOTE: '<!subteam^S06MDLGF4RY|@product>'와 같은 문자열에서 그룹 ID를 찾는다.
const groupIdRegex = /(?<=subteam\^)(.*?)(?=\|)/gm;

export default function getGroupId(
  text: string
): [string | undefined, string[]] {
  const rawGroup = text.match(rawGroupRegex)?.[0];
  const groupId = rawGroup?.match(groupIdRegex)?.[0];
  const rest = text
    .replace(rawGroupRegex, '')
    .split(' ')
    .filter((el) => el !== '');

  return [groupId, rest];
}
