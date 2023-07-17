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

describe('Navbar', () => {
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

    it('should change to the search screen when pressing the search button', async () => {
        await expect(element(by.text('Search'))).toBeVisible();
        await element(by.text('Search')).tap();
        await expect(element(by.id('search-page'))).toBeVisible();
    });

    it('should change to the upload screen when pressing the upload button', async () => {
        await expect(element(by.text('Upload'))).toBeVisible();
        await element(by.text('Upload')).tap();
        await expect(element(by.id('upload-page'))).toBeVisible();
    });

    it('should change to the settings screen when pressing the settings button', async () => {
        await expect(element(by.text('Settings'))).toBeVisible();
        await element(by.text('Settings')).tap();
        await expect(element(by.id('settings-page'))).toBeVisible();
    });

    it('should change back to the home screen when pressing the home button', async () => {
        await expect(element(by.text('Settings'))).toBeVisible();
        await element(by.text('Settings')).tap();
        await expect(element(by.id('settings-page'))).toBeVisible();

        await expect(element(by.text('Home'))).toBeVisible();
        await element(by.text('Home')).tap();
        await expect(element(by.id('home-page'))).toBeVisible();
    });

});