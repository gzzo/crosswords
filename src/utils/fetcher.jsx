export const STATUS_404 = 'STATUS_404';

export function puzzleFetcher(path, headers = {}) {
  return fetch(
    path,
    headers,
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      return STATUS_404;
    }
    throw new Error('invalid status', response.status);
  }).catch((error) => {
    console.error('failed to fetch puzzle: ', path, error);
  });
}
