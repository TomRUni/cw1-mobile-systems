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

describe('Search Screen', () => {
    beforeEach(async () => {
        await reloadApp();
        if (await expectToBeVisible('login-screen')) {
            await element(by.id('username')).typeText('e2e');
            await element(by.id('password')).typeText('e2e');
            await element(by.id('login-btn')).tap();
            await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(3000);
        } else {
            await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(3000);
        }
        await element(by.text('Search')).tap();
    });

    it('should have the correct UI', async () => {
        await expect(element(by.id('search-page'))).toBeVisible();
        await expect(element(by.id('search-bar'))).toBeVisible();
    });

    it('should allow typing into the search bar', async () => {
        await element(by.id('search-bar')).typeText('test');
    });

    it('should not show any movies before anything is typed', async () => {
        await expect(element(by.id('card'))).not.toBeVisible();
    });

    it('should show the search results after typing and pressing enter', async () => {
        await element(by.id('search-bar')).typeText('title\n');
        await waitFor(element(by.id('card'))).toBeVisible().withTimeout(3000);
    });

    it('should show multiple search results after typing and pressing enter', async () => {
        await element(by.id('search-bar')).typeText('video\n');
        const cards = await element(by.id('card')).getAttributes();
        await jestExpect.expect(cards.elements.length).toBe(2);
    });

    it('should show the film page after searching and pressing a card', async () => {
        await element(by.id('search-bar')).typeText('title\n');
        await waitFor(element(by.id('card'))).toBeVisible().withTimeout(3000);
        await element(by.id('card')).tap();
        await expect(element(by.id('film-page'))).toBeVisible();
    });

    it('should show the default text after searching and pressing cancel', async () => {
        await element(by.id('search-bar')).typeText('title\n');
        await element(by.text('Cancel')).tap();
        await expect(element(by.id('card'))).not.toBeVisible();
    });

});