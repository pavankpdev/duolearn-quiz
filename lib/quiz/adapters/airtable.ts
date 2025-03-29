import Airtable from "airtable";

import { IQuizStorage } from "../interfaces/QuizStorage";
import {
  AIRTABLE_API_BASE_URL,
  AIRTABLE_API_DATABASE_ID,
  AIRTABLE_API_DATABASE_TABLE,
  AIRTABLE_API_KEY,
} from "../../../config/constants";
import { QuizData } from "../types";

export class AirtableAdapter implements IQuizStorage {
  private baseId: string;
  private tableName: string;
  private base: Airtable.Base;

  constructor() {
    this.baseId = AIRTABLE_API_DATABASE_ID;
    this.tableName = AIRTABLE_API_DATABASE_TABLE;

    Airtable.configure({
      apiKey: AIRTABLE_API_KEY,
      endpointUrl: AIRTABLE_API_BASE_URL,
    });
    this.base = Airtable.base(this.baseId);
  }

  async fetchQuizData() {
    const scheduledRecords = await this.base(this.tableName)
      .select({
        filterByFormula: `{status} = "Scheduled"`,
        sort: [{ field: "Created", direction: "asc" }],
        maxRecords: 1,
      })
      .firstPage();

    const doneRecords = await this.base(this.tableName)
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
              Options: [
                scheduledRecords[0]?.fields.Option1,
                scheduledRecords[0]?.fields.Option2,
                scheduledRecords[0]?.fields.Option3,
              ],
              Answer: Number(`${scheduledRecords[0]?.fields.Answer}`),
              ID: scheduledRecords[0]?.id,
            }
          : null,
      past: {
        ...doneRecords[0]?.fields,
        Options: [
          doneRecords[0]?.fields.Option1,
          doneRecords[0]?.fields.Option2,
          doneRecords[0]?.fields.Option3,
        ],
        Answer: Number(`${doneRecords[0]?.fields.Answer}`),
        ID: doneRecords[0]?.id,
      },
    } as QuizData;
  }

  async updateStatus(id: string, status: string) {
    this.base(this.tableName).update([
      {
        id,
        fields: {
          Status: status,
        },
      },
    ]);
  }
}
