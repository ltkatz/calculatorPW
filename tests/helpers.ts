import { Page } from '@playwright/test';

export async function numberAsClicks (operand : number, page : Page)
{
  const strOperand = operand.toString();
  for (var i = 0, len = strOperand.length; i < len; i += 1) {
    switch(strOperand.charAt(i)) { 
      case '-': { 
        await page.getByRole('button', { name: 'minus' }).click();
         break; 
      } 
      case '.': { 
        await page.getByRole('button', { name: 'point' }).click();
         break; 
      } 
      default: { 
        await page.getByRole('button', { name: strOperand.charAt(i) }).click();
         break; 
      } 
   }      
  }
};