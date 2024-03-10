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

// tests
it(() => {
    const samples = {}
    for (var i = 0; i < (1 << 19); i += 1) {
        samples[LaundryInstructions.sampleLineFromGrammar({filterCorpus: false})] = 1;
    }

    for (const line of LaundryInstructions.CORPUS) {
        if (!samples[line]){
            assert(false, "line was missing: \"" + line + "\" in " + JSON.stringify(samples))
        }
    }
})

// test runner
for (const test of allTests) {
    test()
}
