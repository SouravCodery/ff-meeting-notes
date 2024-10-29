export const generateSummaryAndActionItemsUsingAI = async ({
  meetingId,
}: {
  meetingId: string;
}) => {
  return {
    summary: `This is a summary for ${meetingId}`,
    actionItems: ['Action item 1', 'Action item 2'],
  };
};
