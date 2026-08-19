/*
=========================================================
BBN COOKBOOK — XML READER
pages.js — Step 1
=========================================================

STEP 1:
Read recipes.xml and prove that we can retrieve:

    Title
    Type
    PDF path

The result is displayed in the browser console.

No PDF reading.
No page building.
No flipbook changes.
=========================================================
*/

const XML_FILE = "./recipes.xml";

async function readRecipesXML() {

    try {

        console.log("=================================");
        console.log("BBN XML READER — START");
        console.log("=================================");

        // Read the XML file
        const response = await fetch(XML_FILE);

        if (!response.ok) {
            throw new Error(
                `Unable to read ${XML_FILE} — HTTP ${response.status}`
            );
        }

        const xmlText = await response.text();

        // Parse XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(
            xmlText,
            "application/xml"
        );

        // Check for XML parsing errors
        const parserError = xml.querySelector("parsererror");

                if (parserError) {
            throw new Error(
                "XML parsing error:\n" +
                parserError.textContent
            );
        }

        // Find all recipes
        const recipeNodes = xml.querySelectorAll("recipe");

        console.log(`Recipes found: ${recipeNodes.length}`);
        console.log("");

        // Read each recipe
        recipeNodes.forEach((recipe, index) => {

            const title =
                recipe.querySelector("title")?.textContent.trim() || "";

            const type =
                recipe.querySelector("type")?.textContent.trim() || "";

            const pdf =
                recipe.querySelector("pdf")?.textContent.trim() || "";

            console.log(`Recipe ${index + 1}`);
            console.log("-------------------------");
            console.log("Title:", title);
            console.log("Type:", type);
            console.log("PDF:", pdf);
            console.log("");
        });

        console.log("=================================");
        console.log("BBN XML READER — COMPLETE");
        console.log("=================================");

    }

    catch (error) {

        console.error(
            "BBN XML READER ERROR:",
            error
        );

    }
}


// Start XML reader
readRecipesXML();



