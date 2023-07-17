const { reloadApp } = require('detox-expo-helpers');
const jestExpect = require('expect');

const expectToBeVisible = async (id) => {
    try {
      await expect(element(by.id(id))).toBeVisible();
      return true;
    } catch (e) {
      return false;
    }
};

describe('Home Screen', () => {
    beforeEach(async () => {
        await reloadApp();
        if (await expectToBeVisible('login-screen')) {
            await element(by.id('username')).typeText('e2e');
            await element(by.id('password')).typeText('e2e');
            await element(by.id('login-btn')).tap();
            await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(5000);
        } else {
            await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(5000);
        }
    });

    it('should have the correct UI', async () => {
        await expect(element(by.id('home-page'))).toBeVisible();
        await expect(element(by.id('home-title'))).toBeVisible();
        await expect(element(by.id('carousel'))).toBeVisible();
        const cards = await element(by.id('card')).getAttributes();
        await jestExpect.expect(cards.elements.length).toBe(3);
    });

    it('should allow the carousel to scroll', async () => {
        await expect(element(by.id('carousel'))).toBeVisible();
        await element(by.id('carousel')).swipe('left', 'slow', 0.5);
        await expect(element(by.text('Completely Different Title'))).toBeVisible();
    });

    it('should show the film page after pressing a card', async () => {
        await expect(element(by.id('carousel'))).toBeVisible();
        await element(by.id('card')).atIndex(0).tap();
        await expect(element(by.id('film-page'))).toBeVisible();
    });

});