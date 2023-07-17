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

describe('Film Screen', () => {
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
        await expect(element(by.id('carousel'))).toBeVisible();
        await element(by.id('card')).atIndex(0).tap();
        await expect(element(by.id('film-page'))).toBeVisible();

        await expect(element(by.id('film-page'))).toBeVisible();
        await expect(element(by.id('film-bg'))).toBeVisible();
        await expect(element(by.id('title'))).toBeVisible();
        await expect(element(by.id('description'))).toBeVisible();
        await expect(element(by.id('play-btn'))).toBeVisible();
        await expect(element(by.id('play-chromecast-btn'))).not.toBeVisible();
    });

    it('should have the film data', async () => {
        await expect(element(by.id('carousel'))).toBeVisible();
        await element(by.id('card')).atIndex(0).tap();
        await expect(element(by.id('film-page'))).toBeVisible();

        await expect(element(by.id('title'))).toHaveText("Example Video 1");
        await expect(element(by.id('description'))).toHaveText("Video of when the kid wears the VR headset, and wears it like a pro");
    });

    it('should have the default description when the film doesnt have a description', async () => {
        await expect(element(by.id('carousel'))).toBeVisible();
        await element(by.id('carousel')).swipe('left', 'slow', 0.5);
        await element(by.id('card')).atIndex(2).tap();
        await expect(element(by.id('film-page'))).toBeVisible();

        await expect(element(by.id('title'))).toHaveText("Completely Different Title");
        await expect(element(by.id('description'))).toHaveText("No description found");
    });
});