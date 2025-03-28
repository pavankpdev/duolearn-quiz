import Airtable from "airtable";
import {
  AIRTABLE_API_KEY,
  AIRTABLE_API_BASE_URL,
  AIRTABLE_API_DATABASE_ID,
  AIRTABLE_API_DATABASE_TABLE,
} from "../config/IDs";
console.log(
  AIRTABLE_API_KEY,
  AIRTABLE_API_BASE_URL,
  AIRTABLE_API_DATABASE_ID,
  AIRTABLE_API_DATABASE_TABLE
);

export const getQuizData = async () => {
  Airtable.configure({
    apiKey: AIRTABLE_API_KEY,
    endpointUrl: AIRTABLE_API_BASE_URL,
  });
  const base = Airtable.base(AIRTABLE_API_DATABASE_ID);

  const scheduledRecords = await base(AIRTABLE_API_DATABASE_TABLE)
    .select({
      filterByFormula: `{status} = "Scheduled"`,
      sort: [{ field: "Created", direction: "asc" }],
      maxRecords: 1,
    })
    .firstPage();

  const doneRecords = await base(AIRTABLE_API_DATABASE_TABLE)
    .select({
      filterByFormula: `{status} = "Done"`,
      sort: [{ field: "Last Modified", direction: "desc" }],
      maxRecords: 1,
    })
    .firstPage();

  return {
    current:
      scheduledRecords.length > 0
        ? {
            ...scheduledRecords[0]?.fields,
            ID: scheduledRecords[0]?.id,
          }
        : null,
    past: {
      ...doneRecords[0]?.fields,
      ID: doneRecords[0]?.id,
    },
  };
};
