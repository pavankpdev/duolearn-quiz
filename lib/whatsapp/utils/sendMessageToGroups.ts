import { waClient } from "@config/wa";
import { readFromCache } from "@config/cache";

export const sendMessageToGroups = async (
  groupIds: string[],
  message: string
) => {
  const previousQuizMessageIds = await Promise.all(
    groupIds.map((id) => readFromCache(id))
  );

  for (let index = 0; index < groupIds.length; index++) {
    const gid = groupIds[index];
    const quotedMessageId = previousQuizMessageIds[index]?.result;
    console.log(quotedMessageId);

    if (quotedMessageId) {
      await waClient.getMessageById(quotedMessageId);
    }
    await waClient.sendMessage(
      gid,
      message,
      quotedMessageId ? { quotedMessageId } : undefined
    );
  }
};
