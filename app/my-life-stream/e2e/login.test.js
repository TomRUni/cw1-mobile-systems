const { reloadApp } = require('detox-expo-helpers');

const expectToBeVisible = async (id) => {
  try {
    await expect(element(by.id(id))).toBeVisible();
    return true;
  } catch (e) {
    return false;
  }
};

describe('Login Screen', () => {
  beforeAll(async () => {
    await reloadApp();
    if (await expectToBeVisible('home-page')) {
      await element(by.text('Settings')).tap();
      await element(by.id('logout')).tap();
      await reloadApp();
    }
  });

  beforeEach(async () => {
    await reloadApp();
  })

  it('should have the correct UI', async () => {
    await expect(element(by.text('Login'))).toBeVisible();
    await expect(element(by.text('Username'))).toBeVisible();
    await expect(element(by.text('Password'))).toBeVisible();
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('lottie-anim'))).toBeVisible();
  });

  it('should allow typing into the input boxes', async () => {
    await element(by.id('username')).typeText('e2e');
    await element(by.id('password')).typeText('e2e');
  });

  it('should show an error on invalid login', async () => {
    await element(by.id('username')).typeText('e2e');
    await element(by.id('password')).typeText('badPass');
    await element(by.id('login-btn')).tap();
    await waitFor(element(by.label('OK').and(by.type('_UIAlertControllerActionView')))).toBeVisible().withTimeout(3000);
    await element(by.label('OK').and(by.type('_UIAlertControllerActionView'))).tap();
  });

  it('should not show an error and login with valid credentials', async () => {
    await element(by.id('username')).typeText('e2e');
    await element(by.id('password')).typeText('e2e');
    await element(by.id('login-btn')).tap();
    await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(3000);
  });

  it('should auto login given the user has previously logged in succesfully', async () => {
    await waitFor(element(by.id('home-page'))).toBeVisible().withTimeout(5000);
  });

});
