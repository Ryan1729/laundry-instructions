var LaundryInstructions = (function() {
    "use strict";

    const RANDOM_0_1 = Math.random

    // Could make a grammar of these with things like "Setting phrase", "Heat phrase" "Do-not"
    // Things to do with grammar:
    // * prove that each attested instruction can be generated
    // * investigate which other production are possible
    //     * if needed, loosen things to make more productions possible
    // extend with new non-laundry productions. e.g "Dry heaves", "Low acidity", "Under moonlight", "Broil"
    const CORPUS = [
      "Machine Wash, Normal",
      "Machine Wash, Cold",
      "Machine Wash, Warm",
      "Machine Wash, Hot",
      "Machine Wash, Permanent Press",
      "Machine Wash, Gentle or Delicate",
      "Hand Wash",
      "Do Not Wash",
      "Bleach When Needed",
      "Non-Chlorine Bleach When Needed",
      "Do Not Bleach",
      "Tumble Dry, Normal",
      "Tumble Dry, Normal, Low Heat",
      "Tumble Dry, Normal, Medium Heat",
      "Tumble Dry, Normal, High Heat",
      "Tumble Dry, Normal, No Heat",
      "Tumble Dry, Permanent Press",
      "Tumble Dry, Gentle",
      "Do Not Tumble Dry",
      "Do Not Dry",
      "Line Dry",
      "Drip Dry",
      "Dry Flat",
      "Dry In Shade",
      "Line Dry In Shade",
      "Dry Flat In Shade",
      "Drip Dry In Shade",
      "Do Not Wring",
      "Iron At Low Temperature",
      "Iron At Medium Temperature",
      "Iron",
      "Iron At High Temperature",
      "Do Not Iron",
      "Do Not Steam",
      "Dryclean",
      "Do Not Dryclean"
    ]

    var sampleLineFromGenerator = function(randomFloat01) {
        if (!randomFloat01) {
            randomFloat01 = RANDOM_0_1
        }

        const TRIES = 16
        for (let i = 0; i < TRIES; i += 1) {
            const line = sampleLineFromGeneratorUnfiltered(cachedGenerator, randomFloat01)

            if (!generator.linesSet[line]) {
                return line
            }
        }

        return "Found no line not present in corpus after " + TRIES + " tries"
    }

    var sampleLineFromGrammar = function(randomFloat01) {
        if (!randomFloat01) {
            randomFloat01 = RANDOM_0_1
        }

        let tokens = []

        let { token, children } = selectFromArray(cachedGrammar, randomFloat01)
        tokens.push(token)

        while (children.length > 0) {
            const entry = selectFromArray(children, randomFloat01)
            tokens.push(entry.token)
            children = entry.children
        }

        return tokens.reduce(reduceToken, "")
    }

    // private

    const BLANK = 0
    const DO_NOT = 1
    const SETTING = 2
    const WASH = 3
    const DRY = 4
    const BLEACH = 5
    const NORMAL = 6
    const WRING = 7
    const STEAM = 8
    const DRYCLEAN = 9
    const IRON = 10

    const WASH_VERBS = [
        "",
        "Machine ",
        "Hand "
    ]

    const DRY_SUFFIXES_1 = [
        "",
        " Flat",
    ]

    const DRY_SUFFIXES_2 = [
        "",
        " In Shade"
    ]

    const DRY_PREFIXES = [
        "",
        "Tumble ",
        "Line ",
        "Drip "
    ]

    const BLEACH_PREFIXES = [
        "",
        "Non-Chlorine ",
    ]

    const BLEACH_SUFFIXES = [
        "",
        " When Needed",
    ]

    const IRON_SUFFIXES = [
        "",
        " At Low Temperature",
        " At Medium Temperature",
        " At High Temperature",
    ]

    const HEATS = [
        "",
        ", Low Heat",
        ", Medium Heat",
        ", High Heat",
        ", No Heat",
    ]

    const SETTINGS = [
        "Cold",
        "Warm",
        "Hot",
        "Permanent Press",
        "Gentle",
        "Gentle or Delicate",
    ]

    const reduceToken = (acc, token) => {
        switch (token) {
            case BLANK:
            break
            case DO_NOT:
                acc += "Do Not "
            break
            case WRING:
                acc += "Wring"
            break
            case NORMAL:
                acc += ", Normal" + selectFromArray(HEATS)
            break
            case SETTING:
                acc += ", " + selectFromArray(SETTINGS)
            break
            case WASH:
                acc += selectFromArray(WASH_VERBS) + "Wash"
            break
            case DRY:
                acc += selectFromArray(DRY_PREFIXES) + "Dry" + selectFromArray(DRY_SUFFIXES_1) + selectFromArray(DRY_SUFFIXES_2)
            break
            case BLEACH:
                acc += selectFromArray(BLEACH_PREFIXES) + "Bleach" + selectFromArray(BLEACH_SUFFIXES)
            break
            case STEAM:
                acc += "Steam"
            break
            case DRYCLEAN:
                acc += "Dryclean"
            break
            case IRON:
                acc += "Iron" + selectFromArray(IRON_SUFFIXES)
            break
            default:
                acc += " Invalid default case! "
            break
        }
        return acc
    }

    var leaf = function(token) {
        return {
            token,
            children: []
        }
    }

    var initGrammar = function() {
        const after = [
            leaf(BLANK),
            leaf(SETTING),
            {
                token: NORMAL,
                children: [],
            },
        ]
        const doings = [
            {
                token: WASH,
                children: after,
            },
            {
                token: DRY,
                children: after,
            },
            leaf(BLEACH),
            leaf(WRING),
            leaf(STEAM),
            leaf(DRYCLEAN),
            leaf(IRON),
        ]

        return [
            {
                token: DO_NOT,
                children: doings,
            },
            ...doings
        ];
    };

    var dedupStringArray = function (array) {
        return dedupStringArrayAndReturnSet(array).array
    };

    var dedupStringArrayAndReturnSet = function (array) {
        var set = array.reduce(function (acc, str) {
                    acc[str] = true;
                    return acc;
                }, {});


        var filteredArray = [];
        for (var str in set) {
            if (!set.hasOwnProperty(str)) {
                continue;
            }

            filteredArray.push(str);
        }

        return {
            array: filteredArray,
            set: set
        }
    }

    var addTokens = function (allTokens, newTokens) {
        for (var i = 0; i < newTokens.length; i += 1) {
            if (!allTokens[i]) {
                allTokens[i] = [];
            }

            allTokens[i].push(newTokens[i]);
        }
    }

    var initGenerator = function() {
        let allTokens = [];
        const linesSet = {}

        for (var i = 0; i < CORPUS.length; i += 1) {
            var line = CORPUS[i];

            var tokens = line.split(/\s+/).filter(function (token){
                return token.length > 0;
            });

            linesSet[tokens.join(" ")] = 1

            addTokens(allTokens, tokens);
        }

        allTokens = allTokens.map(dedupStringArray);

        return {
            linesSet,
            allTokens,
        };
    };

    var cachedGenerator = initGenerator();
    var cachedGrammar = initGrammar();

    var sampleLineFromGeneratorUnfiltered = function(generator, randomFloat01) {
        const output = []

        for (let i = 0; ; i += 1) {
            const words = generator.allTokens[i]
            if (!words) {
                break
            }

            const word = selectFromArray(words, randomFloat01)

            if (!word) {
                break
            }
            output.push(word)
        }

        return output.join(" ")
    }

    // TODO consider whether it's really worth it to keep this randomFloat01 parameter around
    const selectFromArray = (array, randomFloat01 = RANDOM_0_1) => (array[selectIndexForArray(array, randomFloat01)])
    const selectIndexForArray = (array, randomFloat01) => (Math.floor( randomFloat01() * array.length ))

    return {
        CORPUS,
        sampleLineFromGenerator,
        sampleLineFromGrammar,
    }
}())
