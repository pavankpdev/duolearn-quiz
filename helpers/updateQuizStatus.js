const { Status } = require("whatsapp-web.js");
const { NOTION_QUIZ_DATABASE_ID, NOTION_SECRET } = require("../config/IDs");

const n = require("@notionhq/client");
const Airtable = require("airtable");

const notion = new n.Client({
  auth: NOTION_SECRET,
});

const moveQuizStatusToDone = async (recordId) => {
  Airtable.configure({
    apiKey:
      "patkmOoiTsoEncDON.2602e1a475c01407ecdee696a5df6ae4512008e88da5da4997b4101aec6cab56",
    endpointUrl: "https://api.airtable.com",
  });
  const base = Airtable.base("appAMjOmbK8EmBM6i");

  return base("Collection A").update([
    {
      id: recordId,
      fields: {
        Status: "Done",
      },
    },
  ]);
};

module.exports = {
  moveQuizStatusToDone,
};
