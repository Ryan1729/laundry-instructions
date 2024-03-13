const fs = require('fs');

eval(fs.readFileSync('./laundry-instructions.js')+'')

// assertion framework
const assert = (bool, message) => {
    if (bool) {
        return
    }

    throw new Error(message || "Assertion failed")
}

// test framework
let allTests = []
const it = (test) => allTests.push(test)
const skipit = (test) => {}

// tests
it(() => {
    const samples = {}
    for (var i = 0; i < (1 << 20); i += 1) {
        samples[LaundryInstructions.sampleLineFromGrammar({filterCorpus: false})] = 1;
    }

    for (const line of LaundryInstructions.CORPUS) {
        if (!samples[line]){
            assert(false, "line was missing: \"" + line + "\" in " + JSON.stringify(samples))
        }
    }
})

it(() => {
    const samples = {}
    for (var i = 0; i < (1 << 9); i += 1) {
        const line = LaundryInstructions.nthTokensFromGrammar(i).join()

        if (samples[line]) {
            assert(false, "tokens were already there: \"" + line + "\" in " + JSON.stringify(samples) + " (" + Object.keys(samples).length + ")")
        }
        samples[line] = 1;
    }
})

// test runner
for (const test of allTests) {
    test()
}
