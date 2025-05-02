# Calculator test demo

This is a demo of e2e tests of Google's calculator that is displayed when seaarching for the term calculator. Implemented using Playwright

## Pre-requisites

NPM
Node.js
Playwright insalled with dependencies

## Use

Use npx playwright to run. The example below will run the tests in headed mode to be able to skip the CAPCHA manually if your environment triggers it.

```bash
npx playwright test --headed
```

And individual test can be run with the following (you will need to fill in the name). I recommend this if captchas are getting triggerred for simplicity.

```bash
npx playwright test -g "name"
```

A failing test will open the report after completion, a passing test can be viewed by opening the report with

```bash
npx playwright show-report
```

One of the tests uses a screenshot for comparison. If it needs to be regenerated, it can be done like this

```bash
npx playwright test -g "verify visible and AC - CE transitions" --headed --update-snapshots
```

Each individual test in the suite has a video associated - sample videos are stored in the videos folder.

## Files

- readme.md - documentation
- tests/inputs.spec.ts - test definitions
- tests/helpers.ts - reusable functions to improve maintainability
- tests/lookup.ts - constants for parameters that are reused frequently, single point of change to improve maintainability. This would be much more important in a Cypress implementation!
- playwright.config.ts - configuration file, currently set to have video always on and to ignore HTTPS errors (helpful if using a proxy) and to run on a single runner
- playwright-report - contains the report and videos from the last run
- videos - conains sample videos from my runs

## Assumptions

### Starting point
- The user will always start from the base google search page and type in calculator to get the calculator displayed
- This is in the BeforeEach block - this makes the tests independent for any future parallel/concurrent runs

### No CAPTCHA handling.
- If it does pop up, there is a wait built it that allows the user to jump in and pass it.
- Unfortunately the Playwright Stealth was not able to bypass the implementation on Google.
- A proxy from Oxylabs did work to bypass but was introducing other instability due to throttling - the app was not loading in reasonable time.
- In a production scenario I would expect to be able to either whitelist my test runner environment or get a token to be allowed to bypass.

### Testing scope
- The following buttons only are tested: 0–9 . = + - × ÷ AC CE (AC and CE are the same button that switches depending on the state)

### Screenshot verification
- It would appear that there is about a 21000 pixel difference under normal conditions. A better comparison can be done using Applitools Eyes (AI tool) but it is a paid plugin so would not be using it here. The viewport is resized for this test to hide the ads and limit the viewport and the resulting screenshot to relevant data.

### Keyboard and accessibility test
- Could bring focus to the calculator by simply simulating a click but better to simulate a user without a mouse trying to get there and he would be doing it by pressing the Tab key

### Addition and Subtraction of negatives
- No testing of negative numbers as the second operand was done. The current implementation does not allow one to press a plus and a minus sequentially or a minus twice.
- In a production scenario I would raise this to the PM as a potential bug or a documentation task.
- So Addition and Subtraction cover two cases (first operand as positive or negative, second operand positive).
- Multiplication and Division cover three - also the second operand negative.

### Decimals
- All testing is done with decimal numbers, whole numbers (without a decimal) being a subset.
- One simple test to verify decimal specific events only is present.

### Sorting
- lookup.ts is not sorted but rather grouped
- import calls are sorted for readability

### Parallelism
- This runs on a single worker. Multiple runners can be turned on if CAPTCHA handling is implemented otherwise this will always trip the CAPTCHA

### Very large/small numbers (edge cases)
- The page begins to lag as very large numbers are entered so only verify the edge case as 999999999999 - one more digit switches to exponential notation anyway and will round off - consider that outside the scope (this is why this test is a division by 3, e.g. a division by 2 will cause a rounding off to happen - outside the scope)
0.1111111111 is the smallest number the display will accomodate - extra digit will be dropped - consider that outside the scope
- In a production environment this would be up to the PM to review and consider

### Viewports and mobile
- I used a regular chrome browser for the tests
- Using a mobile viewport does not work - there are significant differences - this will need a separate set of tests for mobile
- I did put the logic into the beforeEach to detect the environment though as I was checking into this.
- Mobile viewports remain disabled in playwright.config

## Stretch tasks
- Reusable method to accept the proposed operation and return random numbers for operations and the expected result of the operation - this creates a very interestig potential issue - if the test and the calculator use the same math library and it has a bug, this could mask the bug! Extremely unlikely of course but something to consider if in production!
- CAPTCHA handling
- Checking that past operation (right above the result) shows correct results
- Mobile viewport specific tests 