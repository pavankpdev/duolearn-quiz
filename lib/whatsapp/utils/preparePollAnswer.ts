export const preparePollAnswer = (
  answer: string,
  explanation: string,
  resource: string
): string => {
  return (
    `*The answer is*\n${answer}\n\n` +
    `${explanation}\n\n` +
    `*Learn more here*\n${resource}`
  );
};
