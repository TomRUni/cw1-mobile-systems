const { reloadApp } = require('detox-expo-helpers');

const expectToBeVisible = async (id) => {
    try {
      await expect(element(by.id(id))).toBeVisible();
      return true;
    } catch (e) {
      return false;
    }
};

describe('Upload Screen', () => {
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
        await element(by.text('Upload')).tap();
    });

    it('should have the correct UI', async () => {
        await expect(element(by.id('title'))).toBeVisible();
        await expect(element(by.id('step-one'))).toBeVisible();
        await expect(element(by.id('step-two'))).toBeVisible();
        await expect(element(by.id('title-input'))).toBeVisible();
        await expect(element(by.id('desc-input'))).toBeVisible();
        await expect(element(by.id('step-four'))).toBeVisible();
        await expect(element(by.id('img-btn'))).toBeVisible();
        await expect(element(by.id('upload-btn'))).toBeVisible();
    });

    it('should allow typing into the input boxes', async () => {
        await element(by.id('title-input')).typeText('e2e');
        await element(by.id('desc-input')).typeText('e2e');
    });

    it('should show an error when no title is supplied', async () => {
        await expect(element(by.id('upload-btn'))).toBeVisible();
        await element(by.id('upload-btn')).tap();
        await waitFor(element(by.id('error-text'))).toBeVisible().withTimeout(3000);
    });

    it('should remove an error when an input is updated', async () => {
        await expect(element(by.id('upload-btn'))).toBeVisible();
        await element(by.id('upload-btn')).tap();
        await waitFor(element(by.id('error-text'))).toBeVisible().withTimeout(3000);
        await element(by.id('title-input')).typeText('e2e');
        await expect(element(by.id('error-text'))).not.toBeVisible();
    });

});