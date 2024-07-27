const { NOTION_QUIZ_DATABASE_ID, NOTION_SECRET } = require("../config/IDs")

const n = require("@notionhq/client")

const notion = new n.Client({
    auth: NOTION_SECRET
})

const extractQuizComponents = (blocks) => {
    const components = {
        code: '',
        question: '',
        options: [],
        answer: ''
    };

    let currentSection = '';

    blocks.forEach(block => {
        switch (block.type) {
            case 'heading_3':
                currentSection = block.heading_3.rich_text[0].plain_text.toLowerCase();
                break;
            case 'code':
                if (currentSection === 'code') {
                    components.code = block.code.rich_text.length > 0 ? block.code.rich_text[0].plain_text : "";
                }
                break;
            case 'paragraph':
                const textContent = block.paragraph.rich_text.map(rt => rt.plain_text).join('');
                if (currentSection === 'question') {
                    components.question = textContent;
                } else if (currentSection === 'options') {
                    components.options.push(textContent);
                } else if (currentSection === 'answer') {
                    components.answer += textContent;
                }
                break;
            case 'divider':
                // Optional: Handle divider if needed
                break;
            default:
                break;
        }
    });

    return components;
};

const getQuizData = async () => {
    const cursor = 1;
    const quizDbResults = await notion.databases.query({
        database_id: NOTION_QUIZ_DATABASE_ID,
        filter: {
            property: "Status",
            select: {
                equals: "Ready 🤩"
            }
        },
        sorts: [
            {
                timestamp: "created_time",
                direction: "ascending"
            }
        ]
    });

    const currentQuizPageId = quizDbResults.results[cursor].id

    const currentQuizBlockContents = await notion.blocks.children.list({
        block_id: currentQuizPageId
    })

    const currentQuizComponents = extractQuizComponents(currentQuizBlockContents.results);

    if (cursor) {
        const previousQuizPageId = quizDbResults.results[cursor - 1].id

        const previousBlockContents = await notion.blocks.children.list({
            block_id: previousQuizPageId
        })

        const previousQuizComponents = extractQuizComponents(previousBlockContents.results);

        return {
            previous: previousQuizComponents,
            current: currentQuizComponents,
            pageIdToBeMoved: previousQuizPageId,
            answer: currentQuizComponents.answer
        }
    }

    return {
        previous: null,
        current: currentQuizComponents,
        pageIdToBeMoved: currentQuizPageId,
        answer: currentQuizComponents.answer
    }
}

module.exports = { getQuizData }

