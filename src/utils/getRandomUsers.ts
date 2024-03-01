function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export default function getRandomUsers(members: string[], count = 1) {
  const selectedUsers = [];
  for (let i = 0; i < count; i++) {
    const target: string = members[getRandomNumber(0, members.length)];
    selectedUsers.push(target);
    members = members?.filter((name) => name !== target);
  }

  return selectedUsers;
}
