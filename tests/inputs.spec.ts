import { chromium, expect, test } from '@playwright/test';

import { ALL_CLEAR,
          CLEAR_ENTRY,
          DISPLAY_ELEMENT,
          DIVIDE,
          EQUALS,
          MINUS,
          MULTIPLY,
          PLUS,
          POINT
        } from './lookup.ts';

import { numberAsClicks } from './helpers.ts';

test.beforeEach(async ({ page }) => {
  if (await test.info().project.name == 'chromium')
  {await page.goto('http://google.com');
  await page.getByRole('combobox', { name: 'Search' }).fill('calculator');
  await page.keyboard.press('Enter');}
  
  else {await page.goto('http://google.com/search?q=calculator');}
  
  // wait for manual captcha clear
  await page.waitForTimeout(20000);
});

test('verify visible and AC - CE transitions', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await expect(page.getByRole('button', { name: '0' })).toBeVisible();
  await expect(page.getByRole('button', { name: '1' })).toBeVisible();
  await expect(page.getByRole('button', { name: '2' })).toBeVisible();
  await expect(page.getByRole('button', { name: '3' })).toBeVisible();
  await expect(page.getByRole('button', { name: '4' })).toBeVisible();
  await expect(page.getByRole('button', { name: '5' })).toBeVisible();
  await expect(page.getByRole('button', { name: '6' })).toBeVisible();
  await expect(page.getByRole('button', { name: '7' })).toBeVisible();
  await expect(page.getByRole('button', { name: '8' })).toBeVisible();
  await expect(page.getByRole('button', { name: '9' })).toBeVisible();
  await expect(page.getByRole('button', { name: '0' })).toBeVisible();
  await expect(page.getByRole('button', { name: POINT })).toBeVisible();
  await expect(page.getByRole('button', { name: EQUALS })).toBeVisible();
  await expect(page.getByRole('button', { name: PLUS })).toBeVisible();
  await expect(page.getByRole('button', { name: MINUS })).toBeVisible();
  await expect(page.getByRole('button', { name: MULTIPLY })).toBeVisible();
  await expect(page.getByRole('button', { name: DIVIDE })).toBeVisible();
  await expect(page.locator(DISPLAY_ELEMENT)).toBeVisible();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('0');
  await expect(page.getByRole('button', { name: CLEAR_ENTRY })).not.toBeVisible();
  await expect(page.getByRole('button', { name: ALL_CLEAR })).toBeVisible();
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.getByRole('button', { name: CLEAR_ENTRY })).toBeVisible();
  await expect(page.getByRole('button', { name: ALL_CLEAR })).not.toBeVisible();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.getByRole('button', { name: CLEAR_ENTRY })).not.toBeVisible();
  await expect(page.getByRole('button', { name: ALL_CLEAR })).toBeVisible();
  await expect(page).toHaveScreenshot({ maxDiffPixels: 8000 });
  await page.close();
  
});

test('verify display', async ({ page }) => {
  
  await page.screenshot({ path: 'example.png' });
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '4' }).click();
  await page.getByRole('button', { name: '5' }).click();
  await page.getByRole('button', { name: 'point' }).click();
  await page.getByRole('button', { name: '6' }).click();
  await page.getByRole('button', { name: '7' }).click();
  await page.getByRole('button', { name: '8' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '9' }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('12345.67809');
  await page.getByRole('button', { name: CLEAR_ENTRY }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('12345.6780');
  await page.close();
  
});

test('verify keyboard functions', async ({ page }) => {
  for(var i = 0;i<=21;i++) { await page.keyboard.press('Tab', { delay: 5 }) } //tab to the calculator
 
  await page.keyboard.press('Digit1');
  await page.keyboard.press('Digit2');
  await page.keyboard.press('Digit3');
  await page.keyboard.press('Digit4');
  await page.keyboard.press('Digit5');
  await page.keyboard.press('.');
  await page.keyboard.press('Digit6');
  await page.keyboard.press('Digit7');
  await page.keyboard.press('Digit8');
  await page.keyboard.press('Digit0');
  await page.keyboard.press('Digit9');
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('12345.67809');
  await page.keyboard.press('Backspace');
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('12345.6780');
  await page.keyboard.press('+');
  await page.keyboard.press('Minus');
  await page.keyboard.press('*');
  await page.keyboard.press('/');
  await page.keyboard.press('Digit2');
  await page.keyboard.press('Equal');
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('6172.839');
  await page.close();
  
});

test('test addition operation', async ({ page }) => {

  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: POINT }).click();
  await page.getByRole('button', { name: '6' }).click();
  await page.getByRole('button', { name: PLUS }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: POINT }).click();
  await page.getByRole('button', { name: '3' }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('1.6 + 2.3');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('3.9');
  await page.close();
  
});

test('test subtraction operation', async ({ page }) => {
  await numberAsClicks(-7.6,page);
  await page.getByRole('button', { name: MINUS }).click();
  await numberAsClicks(2.3,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-7.6 - 2.3');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-9.9');
  await page.close();
  //note pressing minus twice doesn't work!
});

test('test multiplication operation', async ({ page }) => {

  await numberAsClicks(8.7,page);
  await page.getByRole('button', { name: MULTIPLY }).click();
  await numberAsClicks(5.4,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('8.7 × 5.4');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('46.98');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(-7.6,page);
  await page.getByRole('button', { name: MULTIPLY }).click();
  await numberAsClicks(2.3,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-7.6 × 2.3');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-17.48');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(-1.4,page);
  await page.getByRole('button', { name: MULTIPLY }).click();
  await numberAsClicks(-5.8,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-1.4 × -5.8');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('8.12');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await page.close();
});

test('test division operation', async ({ page }) => {

  await numberAsClicks(6.8,page);
  await page.getByRole('button', { name: DIVIDE }).click();
  await numberAsClicks(5.6,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('6.8 ÷ 5.6');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('1.21428571429');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(-6.6,page);
  await page.getByRole('button', { name: DIVIDE }).click();
  await numberAsClicks(2.3,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-6.6 ÷ 2.3');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-2.86956521739');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(-1.4,page);
  await page.getByRole('button', { name: DIVIDE }).click();
  await numberAsClicks(-9.8,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('-1.4 ÷ -9.8');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('0.14285714285');
  await page.getByRole('button', { name: ALL_CLEAR }).click();
  
  await page.close();
});

test('test decimals disappear when result is whole numbers', async ({ page }) => {

  await numberAsClicks(6.8,page);
  await page.getByRole('button', { name: DIVIDE }).click();
  await numberAsClicks(6.8,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('6.8 ÷ 6.8');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('1');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(2.01,page);
  await page.getByRole('button', { name: CLEAR_ENTRY }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('2.0');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('2');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await page.close();
});

test('test display of very large and very small numbers and operations on them', async ({ page }) => {

  await numberAsClicks(999999999999,page);
  await page.getByRole('button', { name: DIVIDE }).click();
  await numberAsClicks(3,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('999999999999 ÷ 3');
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('333333333333');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await numberAsClicks(0.1111111111,page);
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('0.1111111111');
  await page.getByRole('button', { name: MULTIPLY }).click();
  await numberAsClicks(2,page);
  await page.getByRole('button', { name: EQUALS }).click();
  await expect(page.locator(DISPLAY_ELEMENT)).toHaveText('0.2222222222');
  await page.getByRole('button', { name: ALL_CLEAR }).click();

  await page.close();
});