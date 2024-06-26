const { Status } = require("whatsapp-web.js")
const { NOTION_QUIZ_DATABASE_ID, NOTION_SECRET } = require("../config/IDs")

const n = require("@notionhq/client")

const notion = new n.Client({
    auth: NOTION_SECRET
})

const moveQuizStatusToDone = async (pageId) => {
    return notion.pages.update({
        page_id: pageId,
        properties: {
            Status: {
                select: {
                    name: "Done ✨"
                }
            }
        }
    })

}

module.exports = {
    moveQuizStatusToDone
}