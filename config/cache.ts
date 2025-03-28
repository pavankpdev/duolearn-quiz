import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from "./IDs";

export const readFromCache = async (key: string) => {
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  return res.json();
};

export const writeToCache = async (key: string, value: string) => {
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${key}/${value}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  return res.json();
};
