var LaundryInstructions = (function() {
    "use strict";

    var init = function() {
        var lines = [
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


        let allTokens = [];
        const linesSet = {}

        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];

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

    var sampleLineFromGraph = function(graph, randomFloat01) {
        if (!randomFloat01) {
            randomFloat01 = Math.random
        }

        const TRIES = 16
        for (let i = 0; i < TRIES; i += 1) {
            const line = sampleLineFromGraphUnfiltered(graph, randomFloat01)

            if (!graph.linesSet[line]) {
                return line
            }
        }

        return "Found no line not present in corpus after " + TRIES + " tries"
    }

    // private

    var sampleLineFromGraphUnfiltered = function(graph, randomFloat01) {
        const output = []

        for (let i = 0; ; i += 1) {
            const words = graph.allTokens[i]
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
    
    var addTokens = function (allTokens, newTokens) {
        for (var i = 0; i < newTokens.length; i += 1) {
            if (!allTokens[i]) {
                allTokens[i] = [];
            }

            allTokens[i].push(newTokens[i]);
        }
    }

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

    return {
        init,
        sampleLineFromGenerator: sampleLineFromGraph,
    }
}())
