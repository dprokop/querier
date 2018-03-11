export const users = {
  1: { name: 'Mark' },
  2: { name: 'Paul' }
};

export default function request(url: string) {
  return new Promise((resolve, reject) => {
    const userID = parseInt(url.substr('/users/'.length), 10);
    process.nextTick(
      () =>
        users[userID]
          ? resolve(users[userID])
          : reject({
              error: 'User with ' + userID + ' not found.'
            })
    );
  });
}
