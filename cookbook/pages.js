/*
=========================================================
BBN COOKBOOK — XML + PDF READER
pages.js — Step 2

STEP 1:
    Read recipes.xml

STEP 2:
    Open the PDF specified by recipes.xml
    Read only the information needed for Page 1
    Inspect PDF images

STEP 3:
    Cookbook Page building in progress...
    -- Page 1 --  DONE
    -- Nutrition Data Popup -- DONE
    -- Ingredients -- HARDCODED
    -- Directions -- HARDCODED

NO FLIPBOOK CHANGES.
=========================================================
*/

const XML_FILE = "./xml/recipes.xml";

/* ======================================================
   STEP 1 — READ XML
====================================================== */

async function readRecipesXML() {

    const response = await fetch(XML_FILE);
    if (!response.ok) {
        throw new Error(
            `Unable to read ${XML_FILE} — HTTP ${response.status}`
        );
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(
        xmlText,
        "application/xml"
    );

    const parserError = xml.querySelector("parsererror");
    if (parserError) {
        throw new Error(
            "XML parsing error:\n" +
            parserError.textContent
        );
    }

    const recipeNodes = xml.querySelectorAll("recipe");
    const recipes = [];
    recipeNodes.forEach((recipe, index) => {
        const title =
            recipe.querySelector("title")?.textContent.trim() || "";
        const type =
            recipe.querySelector("type")?.textContent.trim() || "";
        const pdf =
            recipe.querySelector("pdf")?.textContent.trim() || "";
        recipes.push({
            number: index + 1,
            title,
            type,
            pdf
        });
    });

    return recipes;
}


/* ======================================================
   STEP 2 — READ PDF
====================================================== */

async function readRecipePDF(pdfPath, recipeTitle) {

    console.log("");
    console.log("=================================");
    console.log("BBN PDF READER — START");
    console.log("=================================");
    console.log("PDF:", pdfPath);
    console.log("");

    /*
       Load PDF.js.

       We load it here rather than changing the HTML yet.
    */
    const pdfjsLib = await import(
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
    );

    /*
       Tell PDF.js where its worker lives.
    */
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

    /*
       Open the PDF.
    */
    const pdf = await pdfjsLib.getDocument(pdfPath).promise;

    console.log("PDF opened successfully.");
    console.log("Number of pages:", pdf.numPages);
    console.log("");

    /* ==================================================
       PAGE 1 — GET TEXT
    ================================================== */

    const page1 = await pdf.getPage(1);
    const page1TextContent =
        await page1.getTextContent();
    const page1Text = page1TextContent.items
        .map(item => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    console.log("=================================");
    console.log("PAGE 1 TEXT");
    console.log("=================================");
    console.log(page1Text);
    console.log("");

    /* ==================================================
       EXTRACT PAGE 1 FIELDS
    ================================================== */
    const page1Data = {
        image: "",
        title: "BBN " + recipeTitle,
        description: extractRecipeDescription(
            page1Text,
            "BBN " + recipeTitle
        ),

        yield: extractLabeledValue(
            page1Text,
            "Yield:",
            "Serving Size:"
        ),

        servingSize: extractLabeledValue(
            page1Text,
            "Serving Size:",
            "Prep Time:"
        ),

        prepTime: extractLabeledValue(
            page1Text,
            "Prep Time:",
            "Cook Time:"
        ),

        cookTime: extractLabeledValue(
            page1Text,
            "Cook Time:",
            "Total Time:"
        ),

        totalTime: extractLabeledValue(
            page1Text,
            "Total Time:",
            "Ingredients"
        )
    };

    console.log("=================================");
    console.log("PAGE 1 DATA");
    console.log("=================================");
    console.log("Title:", page1Data.title);
    console.log("Description:", page1Data.description);
    console.log("Yield:", page1Data.yield);
    console.log("Serving Size:", page1Data.servingSize);
    console.log("Prep Time:", page1Data.prepTime);
    console.log("Cook Time:", page1Data.cookTime);
    console.log("Total Time:", page1Data.totalTime);
    console.log("");

/* ==================================================
   PAGE 2 — FIND BBN NUTRIENT DENSITY SCORE
================================================== */

if (pdf.numPages >= 2) {
    const page2 = await pdf.getPage(2);
    const page2TextContent =
        await page2.getTextContent();

    /*
       Keep the individual PDF text items intact.
       This is important because PDF.js may split
       the label and stars into separate items.
    */
    const page2Items =
        page2TextContent.items.map(item => item.str);

    const page2Text =
        page2Items.join(" ").replace(/\s+/g, " ").trim();

     const nutrientScoreLabel =
        extractNutrientScoreLabel(page2Text);

    const starCount =
        (page2Text.match(/★/g) || []).length;

    page1Data.nutrientScoreLabel =
        nutrientScoreLabel;

    page1Data.nutrientScore =
        "⭐".repeat(starCount);   

    /* ==================================================
       PAGE 2 — EXTRACT NUTRITION INFORMATION

       The PDF second page contains the nutrition
       information and Functional Nutrition Snapshot
       used by the final cookbook page.
    ================================================== */
    page1Data.nutrition = extractNutritionData(page2Text);

    console.log("=================================");
    console.log("PAGE 2 — NUTRITION DATA");
    console.log("=================================");
    console.log(page1Data.nutrition);

}
    /* ==================================================
       INGREDIENTS + DIRECTIONS — SECOND PASS TEST

       Find sections by their markers, not page number.
       Remove blank lines.
       Concatenate wrapped text.

       Still no screen formatting.
    ================================================== */

    const ingredients = [];
    const directions = [];

    let readingIngredients = false;
    let readingDirections = false;
    let currentLine = "";
    let waitingForDirectionStep = false;


    const finishCurrentLine = () => {
        if (currentLine !== "") {
            if (readingIngredients) {
                ingredients.push(currentLine);
            } else if (readingDirections) {
                directions.push(currentLine);
            }
        }

        currentLine = "";
    };

    const processTextItem = (textItem) => {

        const cleanLine = textItem.str.trim();

        if (readingIngredients || readingDirections) {
            console.log(
                "SECTION ITEM:",
                JSON.stringify(textItem.str),
                "hasEOL:",
                textItem.hasEOL
            );
        }



        if (cleanLine === "") {
            return;
        }

        if (cleanLine === "Ingredients") {
            finishCurrentLine();
            readingIngredients = true;
            readingDirections = false;
            return;
        }

        if (cleanLine === "Directions") {
            finishCurrentLine();
            readingIngredients = false;
            readingDirections = true;
            return;
        }

        if (
            readingDirections &&
            cleanLine === "Approximate Nutrition"
        ) {
            finishCurrentLine();
            readingDirections = false;
            return;
        }

        if (readingIngredients) {

            /*
               Rev 1 Ingredients rule:
               A bullet begins a new ingredient.
               Wrapped PDF text is accumulated until
               the next bullet is encountered.
            */
            if (cleanLine.startsWith("•")) {

                if (currentLine !== "") {
                    ingredients.push(currentLine);
                }

                currentLine = cleanLine;

            } else if (currentLine !== "") {

                currentLine += " " + cleanLine;

            }

            return;
        }

if (readingDirections) {

    const isNumberedStep =
        /^\d+\.\s*/.test(cleanLine);

    /*
       When Directions continue onto a new PDF page,
       ignore page-header text until the next numbered step.
    */
    if (waitingForDirectionStep) {

        if (!isNumberedStep) {
            return;
        }

        waitingForDirectionStep = false;
    }

    if (isNumberedStep) {

        if (currentLine !== "") {
            directions.push(currentLine);
        }

        currentLine = cleanLine;
        return;
    }

    const nutritionIndex =
        cleanLine.indexOf("Approximate Nutrition");

    if (nutritionIndex !== -1) {

        const directionText =
            cleanLine
                .substring(0, nutritionIndex)
                .trim();

        if (directionText !== "") {
            currentLine +=
                (currentLine === "" ? "" : " ") +
                directionText;
        }

        finishCurrentLine();
        readingDirections = false;
        return;
    }

    if (currentLine !== "") {
        currentLine += " " + cleanLine;
    }

    return;
}


    };

    /*
       Scan every PDF page so section locations are not
       tied to Page 1 or Page 2.
    */
    const allPdfTextParts = [];

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {




        
        const recipePage =
            await pdf.getPage(pageNumber);

        const recipeTextContent =
            await recipePage.getTextContent();

        const recipeTextItems =
            recipeTextContent.items;

        allPdfTextParts.push(
            recipeTextItems.map(item => item.str).join(" ")
        );

        /*
           PDF PAGE BOUNDARY — DIRECTIONS

           A Directions step may span a PDF page boundary, but
           this PDF places a repeated page header before Step 6.
           Tell the parser to ignore non-numbered text at the
           start of the new page until the next numbered step.

           Do NOT clear currentLine here. It still contains the
           previous numbered step and must be pushed when the next
           numbered step is encountered.
        */
        if (pageNumber > 1 && readingDirections) {
            waitingForDirectionStep = true;
        }

        for (const textItem of recipeTextItems) {
            processTextItem(textItem);
        }
    }

    finishCurrentLine();

    /*
       Preserve the parsed recipe sections for the
       dynamic cookbook page builders.
    */
    page1Data.ingredients = ingredients;
    page1Data.directions = directions;
    page1Data.scoreExplanation =
        extractScoreExplanation(
            allPdfTextParts.join(" ")
        );

    console.log("");
    console.log("=================================");
    console.log("INGREDIENTS — CONCATENATED TEST");
    console.log("=================================");
    console.log(ingredients);

    console.log("");
    console.log("=================================");
    console.log("DIRECTIONS — REV 1 NUMBERED-STEP TEST");
    console.log("=================================");
    console.log(directions);

    console.log("");

    /* ==================================================
       INSPECT PDF IMAGES
    ================================================== */
    console.log("=================================");
    console.log("PDF IMAGE INSPECTION");
    console.log("=================================");

    const recipeImage =
        await inspectPageImages(page1);

        page1Data.image = recipeImage;
        console.log("PAGE 1 RECIPE IMAGE:", page1Data.image);

    /* ==================================================
       FINAL RESULT
    ================================================== */
    console.log("=================================");
    console.log("BBN PDF READER — COMPLETE");
    console.log("=================================");
    console.log("Final Page 1 data:");
    console.log(page1Data);

    return page1Data;
}


/* ======================================================
   IMAGE INSPECTION

   This does NOT alter the PDF.

   We are simply asking PDF.js what image objects
   exist on Page 1 and what dimensions they have.
====================================================== */
async function inspectPageImages(page) {

    try {

        const operatorList = await page.getOperatorList();

        let imageCount = 0;

        for (let i = 0; i < operatorList.fnArray.length; i++) {

            const fn = operatorList.fnArray[i];

            if (
                fn === 85 ||
                fn === 86 ||
                fn === 87 ||
                fn === 88 ||
                fn === 89
            ) {

                imageCount++;

                const args = operatorList.argsArray[i];

                const imageName = args[0];

                if (imageName === "img_p0_4") {
                    console.log("FOUND RECIPE IMAGE:", imageName);
                    const image = await page.objs.get(imageName);

                    console.log("RECIPE IMAGE OBJECT:", image);

                    const canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;

                    const ctx = canvas.getContext("2d");

                    ctx.drawImage(
                        image.bitmap,
                        0,
                        0,
                        image.width,
                        image.height
                    );

                    return canvas.toDataURL("image/png");
                }

                console.log(
                    `IMAGE ${imageCount}`,
                    {
                        operator: fn,
                        arg0: args[0],
                        arg1: args[1],
                        arg2: args[2]
                    }
                );
            }
        }

        console.log(
            `Total image operators found: ${imageCount}`
        );

    }

    catch (error) {

        console.warn(
            "Image inspection could not be completed:",
            error
        );
    }
}


/* ======================================================
   TEXT HELPERS
====================================================== */

function extractBetween(text, start, end) {

    const startIndex =
        text.indexOf(start);

    if (startIndex === -1) {
        return "";
    }

    const valueStart =
        startIndex + start.length;

    const endIndex =
        text.indexOf(end, valueStart);

    if (endIndex === -1) {
        return text.substring(valueStart).trim();
    }

    return text
        .substring(valueStart, endIndex)
        .trim();
}


function extractAfter(text, start) {

    const startIndex =
        text.indexOf(start);

    if (startIndex === -1) {
        return "";
    }

    return text
        .substring(startIndex + start.length)
        .trim();
}



function extractRecipeDescription(text, recipeTitle) {

    const titleIndex =
        text.indexOf(recipeTitle);

    const creatorMatch = text.match(
        /Creator\s*:/i
    );

    const creatorIndex =
        creatorMatch
            ? creatorMatch.index
            : -1;

    console.log("===== DESCRIPTION DEBUG =====");
    console.log("recipeTitle:", recipeTitle);
    console.log("titleIndex:", titleIndex);
    console.log("text around title:",
        text.substring(
            Math.max(0, titleIndex - 20),
            titleIndex + recipeTitle.length + 200
        )
    );
    console.log("creatorIndex:", creatorIndex);

    if (titleIndex === -1) {
        console.log("TITLE NOT FOUND");
        return "";
    }

    if (creatorIndex === -1) {
        console.log("CREATOR NOT FOUND");
        return "";
    }

    const description =
        text
            .substring(
                titleIndex + recipeTitle.length,
                creatorIndex
            )
            .trim();

    console.log("EXTRACTED DESCRIPTION:", description);
    console.log("============================");

    return description;
}

function extractScoreExplanation(text) {

    const match = text.match(
        /Why\s+(\d+)\s+out\s+of\s+(\d+)\s+stars\?\s*(.*?)(?=Disclaimer|$)/is
    );

    if (!match) {
        return {
            heading: "",
            text: ""
        };
    }

    return {
        heading: `Why ${match[1]} out of ${match[2]} stars?`,
        text: match[3]
            .replace(/\s+/g, " ")
            .trim()
    };
}


function extractNutritionCalculationNote(text) {
    const match = text.match(
        /(?:NOTE|Nutrition Calculation Note)\s*:\s*(.*?)(?=(?:High In:|Good Source:|Also Provides:|BBN Functional Nutrition Snapshot|Functional Nutrition Snapshot|Disclaimer|$))/is
    );

    if (!match) {
        return "";
    }

    return match[1]
        .replace(/\s+/g, " ")
        .trim();
}


function normalizeNutritionText(text) {
    return text
        .replace(/Good\s+Source\s*:/gi, "Good Source:")
        .replace(/High\s+In\s*:/gi, "High In:")
        .replace(/Excellent\s+Source\s*:/gi, "Excellent Source:")
        .replace(/Also\s+Provides\s*:/gi, "Also Provides:")
        .replace(/Functional\s+Nutrition\s+Snapshot/gi, "Functional Nutrition Snapshot")

        .replace(/Functional\s+Nutrition\s+Focus\s*:/gi, "Functional Nutrition Focus:")
        .replace(/BBN\s+Nutrition\s+Pillars\s*:/gi, "BBN Nutrition Pillars:")
        .replace(/Freezer\s+Friendly\s*:/gi, "Freezer Friendly:")
        .replace(/Gluten\s+Free\s*:/gi, "Gluten Free:")
        .replace(/BBN\s+Nutrient\s+Density\s+Score\s*:/gi, "BBN Nutrient Density Score:");
}



function extractNutritionData(text) {

    text = normalizeNutritionText(text);

    const nutrition = {
        servingSize: extractLabelValue(text, "Serving Size:", ["Calories"]),
        calories: extractLabelValue(text, "Calories", ["Protein"]),
        protein: extractLabelValue(text, "Protein", ["Carbohydrates"]),
        carbohydrates: extractLabelValue(text, "Carbohydrates", ["Fiber"]),
        fiber: extractLabelValue(text, "Fiber", ["Net Carbohydrates"]),
        netCarbohydrates: extractLabelValue(text, "Net Carbohydrates", ["Healthy Fat"]),
        healthyFat: extractLabelValue(text, "Healthy Fat", [
            "Excellent Source:", "High In:", "Good Source:",
            "Also Provides:", "Functional Nutrition Snapshot"
        ]),

        nutritionCalculationNote:
            extractNutritionCalculationNote(text),

        excellentSource: extractLabelValue(text, "Excellent Source:", ["High In:"]),
        highIn: extractLabelValue(text, "High In:", ["Good Source:"]),
        goodSource: extractLabelValue(text, "Good Source:", ["Also Provides:"]),

        alsoProvides: extractLabelValue(text, "Also Provides:", ["Functional Nutrition Snapshot"]),

        functionalNutritionFocus: extractLabelValue(text, "Functional Nutrition Focus:", ["BBN Nutrition Pillars:"]),
        bbnNutritionPillars: extractLabelValue(text, "BBN Nutrition Pillars:", ["Freezer Friendly:"]),
        freezerFriendly: extractLabelValue(text, "Freezer Friendly:", ["Gluten Free:"]),
        glutenFree: extractLabelValue(text, "Gluten Free:", ["BBN Nutrient Density Score:"])
    };

    return nutrition;
}

/* ======================================================
   BBN NUTRITION POPUP
   Uses the same simple hidden/show pattern as Accessibility.
   ====================================================== */

function setupNutritionPopup(page1Data) {

    const button = document.getElementById("bbnNutritionButton");

console.log("===== setupNutritionPopup CALLED =====");
console.log("Nutrition button found:", button);
console.log("Nutrition data:", page1Data.nutrition);

    if (!button) {
        console.warn("BBN Nutrition button not found.");
        return;
    }

    if (document.getElementById("bbnNutritionModal")) {
        return;
    }

    const nutrition = {
        ...(page1Data.nutrition || {}),
        scoreExplanation: page1Data.scoreExplanation || { heading: "", text: "" }
    };

    const modal = document.createElement("div");
    modal.id = "bbnNutritionModal";
    modal.className = "bbn-nutrition-modal";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div class="bbn-nutrition-popup" role="dialog" aria-modal="true" aria-labelledby="bbnNutritionTitle">
            <button type="button" class="bbn-nutrition-close" aria-label="Close nutritional information" onclick="closeNutritionPopup(); return false;">×</button>
            <h2 id="bbnNutritionTitle">BBN Nutritional Information</h2>
            <p class="bbn-nutrition-serving"><strong>Serving Size</strong><span id="bbnNutritionServing"></span></p>
            <div class="bbn-nutrition-table">
                <div><strong>Calories</strong><span id="bbnCalories"></span></div>
                <div><strong>Protein</strong><span id="bbnProtein"></span></div>
                <div><strong>Carbohydrates</strong><span id="bbnCarbohydrates"></span></div>
                <div><strong>Fiber</strong><span id="bbnFiber"></span></div>
                <div><strong>Net Carbohydrates</strong><span id="bbnNetCarbs"></span></div>
                <div><strong>Healthy Fat</strong><span id="bbnHealthyFat"></span></div>
            </div>
            ${nutrition.nutritionCalculationNote ? `
            <div class="bbn-nutrition-calculation-note">
                <h3>Nutrition Calculation Note</h3>
                <p>${nutrition.nutritionCalculationNote}</p>
            </div>` : ""}

            <div class="bbn-nutrition-highlights">
                ${nutrition.excellentSource ? `<p><strong>Excellent Source:</strong> ${nutrition.excellentSource}</p>` : ""}
                ${nutrition.highIn ? `<p><strong>High In:</strong> ${nutrition.highIn}</p>` : ""}
                ${nutrition.goodSource ? `<p><strong>Good Source:</strong> ${nutrition.goodSource}</p>` : ""}
                ${nutrition.alsoProvides ? `<p><strong>Also Provides:</strong> ${nutrition.alsoProvides}</p>` : ""}
            </div>
            <div class="bbn-nutrition-snapshot">
                <h3>Functional Nutrition Snapshot</h3>
                <p><strong>Functional Nutrition Focus</strong>: <span id="bbnFunctionalFocus"></span><br /></p>
                <p><strong>BBN Nutrition Pillars</strong>: <span id="bbnNutritionPillars"></span><br /></p>
                <p><strong>Freezer Friendly</strong>: <span id="bbnFreezerFriendly"></span><br /></p>
                <p><strong>Gluten Free</strong>: <span id="bbnGlutenFree"></span><br /></p>
            </div>

            ${nutrition.scoreExplanation?.heading ? `
            <div class="bbn-nutrition-score-explanation">
                <h3>${nutrition.scoreExplanation.heading}</h3>
                <p>${nutrition.scoreExplanation.text}</p>
            </div>` : ""}
        </div>`;

    document.body.appendChild(modal);

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value || "";
    };

    setText("bbnNutritionServing", nutrition.servingSize);
    setText("bbnCalories", nutrition.calories);
    setText("bbnProtein", nutrition.protein);
    setText("bbnCarbohydrates", nutrition.carbohydrates);
    setText("bbnFiber", nutrition.fiber);
    setText("bbnNetCarbs", nutrition.netCarbohydrates);
    setText("bbnHealthyFat", nutrition.healthyFat);
    setText("bbnFunctionalFocus", nutrition.functionalNutritionFocus);
    setText("bbnNutritionPillars", nutrition.bbnNutritionPillars);
    setText("bbnFreezerFriendly", nutrition.freezerFriendly);
    setText("bbnGlutenFree", nutrition.glutenFree);

    button.setAttribute("onclick", "showNutritionPopup(); return false;");
}



function showNutritionPopup() {
    const modal = document.getElementById("bbnNutritionModal");
    modal.classList.add("open");
    if (modal) {
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
    }
}

function closeNutritionPopup() {
    const modal = document.getElementById("bbnNutritionModal");
    if (modal) {
        modal.classList.remove("open");
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
    }
}





function extractLabelValue(text, label, possibleEnds) {

    const startIndex = text.indexOf(label);

    if (startIndex === -1) {
        return "";
    }

    const valueStart = startIndex + label.length;
    let valueEnd = text.length;

    possibleEnds.forEach(endLabel => {
        const endIndex = text.indexOf(endLabel, valueStart);
        if (endIndex !== -1 && endIndex < valueEnd) {
            valueEnd = endIndex;
        }
    });

    return text
        .substring(valueStart, valueEnd)
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\s*BBN\s*$/i, "")
        .replace(/^:\s*/, "")
        .trim();
}


function extractNutrientScoreLabel(text) {

    const match = text.match(
        /(BBN\s+Nutrient\s+Density\s+Score)\s*:?/i
    );

    return match
        ? match[1].trim() + ":"
        : "";
}

function extractLabeledValue(text, startLabel, endLabel) {

    const startIndex =
        text.search(
            new RegExp(
                startLabel.replace(":", "\\s*:\\s*"),
                "i"
            )
        );

    if (startIndex === -1) {
        return "";
    }

    const startMatch =
        text.match(
            new RegExp(
                startLabel.replace(":", "\\s*:\\s*"),
                "i"
            )
        );

    const valueStart =
        startIndex + startMatch[0].length;

    const endIndex =
        text.search(
            new RegExp(
                endLabel.replace(":", "\\s*:\\s*"),
                "i"
            )
        );

    if (endIndex === -1 || endIndex <= valueStart) {
        return "";
    }

    return text
        .substring(valueStart, endIndex)
        .trim();
}








/* ======================================================
   BUILD PAGE 1 HTML — TEST ONLY

   This builds Page 1 from the PDF data but DOES NOT
   put it into the cookbook yet.

   The existing pages.html remains untouched.
====================================================== */

function buildPage1HTML(page1Data) {

    const starCount =
        (page1Data.nutrientScore.match(/⭐/g) || []).length;

   const stars =
    "⭐".repeat(starCount);


    const page1HTML = `
<section class="page left-page active" data-page="0" aria-label="Recipe introduction">

    <div class="temp-page-guide" aria-hidden="true">
        <span class="temp-overflow-flag">OVERFLOWED</span>
    </div>

    <div class="eyebrow">Basic Biblical Nutrition</div>

    <div class="rule"></div>

    <img
        class="recipe-photo"
        src="${page1Data.image}"
        alt="Bowl of Sweet Gypsy Pepper and Chicken Soup garnished with avocado and fresh basil"
    >

    <div class="title soup-title">${page1Data.title}</div>

    <p class="story">${page1Data.description}</p>

    <div class="recipe-meta">

        <div>
            <strong>Yield:</strong>
            ${page1Data.yield}
        </div>

        <div>
            <strong>Serving Size:</strong>
            ${page1Data.servingSize}
        </div>

        <div>
            <strong>Prep Time:</strong>
            ${page1Data.prepTime}
        </div>

        <div>
            <strong>Cook Time:</strong>
            ${page1Data.cookTime}
        </div>

        <div>
            <strong>Total Time:</strong>
            ${page1Data.totalTime}
        </div>

    </div>

    <div class="recipe-rating">
        ❧ • ${page1Data.nutrientScoreLabel || "Nutrient Density Score:"}
        <span
            class="stars"
            aria-label="${starCount} stars"
            style="text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;"
        >${stars}</span>
    </div>

    <button
        id="bbnNutritionButton"
        type="button"
        onclick="showNutritionPopup(); return false;"
    >
        BBN Nutritional Information →
    </button>

    <div class="temp-page-number" aria-hidden="true">
        Page <span class="temp-page-number-value"></span>
    </div>

</section>
`;


    return page1HTML;
}




/* ======================================================
   BUILD PAGE 2 — INGREDIENTS
====================================================== */

function buildIngredientsPageHTML(page1Data) {

    const ingredientsHTML =
        (page1Data.ingredients || [])
            .map(ingredient => {
                const cleanIngredient =
                    ingredient.replace(/^•\s*/, "");

                return `<li>${cleanIngredient}</li>`;
            })
            .join("");

    return `
<section class="page right-page" data-page="1" aria-label="Ingredients">
    <div class="temp-page-guide" aria-hidden="true">
        <span class="temp-overflow-flag">OVERFLOWED</span>
    </div>

    <div class="eyebrow">${page1Data.title}</div>
    <h2>Ingredients</h2>

    <ul class="ingredients">
        ${ingredientsHTML}
    </ul>

    <div class="temp-page-number" aria-hidden="true">
        Page <span class="temp-page-number-value"></span>
    </div>
</section>
`;
}


/* ======================================================
   BUILD PAGE 3 — DIRECTIONS
====================================================== */

function buildDirectionsPageHTML(page1Data) {

    const directionsHTML =
        (page1Data.directions || [])
            .map(direction => {

                const match =
                    direction.match(/^(\d+)\.\s*(.*)$/);

                if (match) {
                    return `<li value="${match[1]}">${match[2]}</li>`;
                }

                return `<li>${direction}</li>`;
            })
            .join("");

    return `
<section class="page" data-page="2" aria-label="Directions">
    <div class="temp-page-guide" aria-hidden="true">
        <span class="temp-overflow-flag">OVERFLOWED</span>
    </div>

    <div class="eyebrow">${page1Data.title}</div>
    <h2>Directions</h2>

    <ol class="directions">
        ${directionsHTML}
    </ol>

    <div class="temp-page-number" aria-hidden="true">
        Page <span class="temp-page-number-value"></span>
    </div>
</section>
`;
}


/* ======================================================
   BUILD ALL DYNAMIC RECIPE PAGES

   cookbook.js loads the legacy page markup
   asynchronously. Once those source pages exist,
   replace them with the three dynamic recipe pages.
====================================================== */

function buildDynamicRecipePages(page1Data) {

    const container =
        document.querySelector("#recipePages");

    if (!container) {
        console.error(
            "Dynamic recipe page container #recipePages was not found."
        );
        return;
    }



    const dynamicPage1 =
        buildPage1HTML(page1Data);

    const dynamicPage2 =
        buildIngredientsPageHTML(page1Data);

    const dynamicPage3 =
        buildDirectionsPageHTML(page1Data);

    container.innerHTML =
        dynamicPage1 +
        dynamicPage2 +
        dynamicPage3;

    pages = [
        ...container.querySelectorAll(".page")
    ];

    pages.forEach((page, index) => {
        const number =
            page.querySelector(".temp-page-number-value");

        if (number) {
            number.textContent = index + 1;
        }
    });

    setupNutritionPopup(page1Data);

    if (typeof render === "function") {
        render(0, "", false);
    }

    console.log("");
    console.log("=================================");
    console.log("DYNAMIC RECIPE PAGES COMPLETE");
    console.log("=================================");
    console.log("Dynamic pages:", pages.length);
}


/* ======================================================
   START
====================================================== */

async function runCookbookReaderTest() {

    try {

        console.log("");
        console.log("#################################");
        console.log("BBN COOKBOOK READER TEST");
        console.log("#################################");


        /*
           Read XML first.
        */

        const recipes =
            await readRecipesXML();


        console.log(
            `XML Reader found ${recipes.length} recipes.`
        );


        /*
           Find Pepper Soup.

           This is our controlled Step 2 test.
        */

        const pepperSoup =
            recipes.find(recipe =>
                recipe.title.toLowerCase() ===
                "sweet gypsy pepper and chicken soup"
            );


        if (!pepperSoup) {

            throw new Error(
                "Sweet Gypsy Pepper and Chicken Soup was not found in recipes.xml."
            );
        }


        console.log("");
        console.log("Test recipe:");
        console.log("Title:", pepperSoup.title);
        console.log("Type:", pepperSoup.type);
        console.log("PDF:", pepperSoup.pdf);

        /*
           Open the PDF specified by XML.
        */

        const page1Data =
        await readRecipePDF(
            pepperSoup.pdf,
            pepperSoup.title
        );

        console.log("");
        console.log("#################################");
        console.log("DYNAMIC RECIPE PAGE BUILD");
        console.log("#################################");

        window.BBN_RECIPE_TEST = {
            recipe: pepperSoup,
            page1: page1Data
        };

        buildDynamicRecipePages(page1Data);

                }

    catch (error) {

        console.error(
            "#################################"
        );

        console.error(
            "BBN COOKBOOK READER ERROR"
        );

        console.error(
            "#################################"
        );

        console.error(error);
    }
}


/* ======================================================
   GO!
====================================================== */

runCookbookReaderTest();


console.log("===== BBN PAGES.JS LOADED =====");
console.log("pages.js timestamp test: 2026-08-22");
console.log("Nutrition button at script end:",
    document.getElementById("bbnNutritionButton")
);