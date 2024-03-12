function getOptionObject(text: string[]) {
  let init: { [index: string]: string[] } = {};
  let temp = '';

  return text.reduce((acc, cur) => {
    if (cur.startsWith('-')) {
      acc[cur] = [];
      temp = cur;
    } else {
      acc[temp]?.push(cur);
    }
    return acc;
  }, init);
}

export default function getCliOptions(text: string[]): [string[] | [], number] {
  const options = getOptionObject(text);

  let ignoreMemberNameList: string[] = [];
  if (options['-d']) {
    ignoreMemberNameList = options['-d'].map((el) => el.replace('@', ''));
  }
  let count = 1;
  if (options['-c']) {
    count = Number(options['-c'][0]);
  }

  return [ignoreMemberNameList, count];
}
