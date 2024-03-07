var LaundryInstructions = (function() {
    "use strict";

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
      "Do-Not Wash",
      "Bleach When Needed",
      "Non-Chlorine Bleach When Needed",
      "Do-Not Bleach",
      "Tumble Dry, Normal",
      "Tumble Dry, Normal, Low Heat",
      "Tumble Dry, Normal, Medium Heat",
      "Tumble Dry, Normal, High Heat",
      "Tumble Dry, Normal, No Heat",
      "Tumble Dry, Permanent Press",
      "Tumble Dry, Gentle",
      "Do-Not Tumble Dry",
      "Do-Not Dry",
      "Line Dry",
      "Drip Dry",
      "Dry Flat",
      "Dry In Shade",
      "Line Dry In Shade",
      "Dry Flat In Shade",
      "Drip Dry In Shade",
      "Do-Not Wring",
      "Iron At Low Temperature",
      "Iron At Medium Temperature",
      "Iron",
      "Iron At High Temperature",
      "Do-Not Iron",
      "Do-Not Steam",
      "Dryclean",
      "Do-Not Dryclean"
    ]

    var sampleLineFromGenerator = function(randomFloat01) {
        if (!randomFloat01) {
            randomFloat01 = Math.random
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
            randomFloat01 = Math.random
        }
        //cachedGrammar
        return selectFromArray(CORPUS, randomFloat01)
    }

    // private

    var initGrammar = function() {
        return {
        };
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

    const selectFromArray = (array, randomFloat01) => (array[selectIndexForArray(array, randomFloat01)])
    const selectIndexForArray = (array, randomFloat01) => (Math.floor( randomFloat01() * array.length ))

    return {
        CORPUS,
        sampleLineFromGenerator,
        sampleLineFromGrammar,
    }
}())
