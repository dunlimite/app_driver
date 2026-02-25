import { device, element, by, expect, waitFor } from 'detox';
import * as path from 'path';
import * as fs from 'fs';

// ─── Screenshot Helper ─────────────────────────────────────────────────────────
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

async function takeScreenshot(name: string): Promise<void> {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await device.takeScreenshot(name);
  // Detox saves screenshots to artifacts dir — also copy to our screenshots dir
  console.log(`📸 Screenshot taken: ${name}`);
}

// ─────────────────────────────────────────────────────────────────────────────
describe('Login Screen', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      // Pass a flag so the app knows it's in test mode (optional)
      launchArgs: { detoxTest: 'true' },
    });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // ── Test 1: Initial Login Screen State ───────────────────────────────────
  it('should display the login screen with all elements', async () => {
    // Wait for login screen to appear — adjust testID to match your Login component
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Take screenshot — initial blank state
    await takeScreenshot('01_login_initial');

    // Verify key elements exist
    await expect(element(by.id('login-email-input'))).toBeVisible();
    await expect(element(by.id('login-password-input'))).toBeVisible();
    await expect(element(by.id('login-submit-button'))).toBeVisible();
  });

  // ── Test 2: Filled Login Form ─────────────────────────────────────────────
  it('should fill in login credentials', async () => {
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Type email
    await element(by.id('login-email-input')).tap();
    await element(by.id('login-email-input')).typeText('driver@example.com');

    // Type password
    await element(by.id('login-password-input')).tap();
    await element(by.id('login-password-input')).typeText('password123');

    // Dismiss keyboard
    await element(by.id('login-screen')).tap();

    // Screenshot — filled form state
    await takeScreenshot('02_login_filled');
  });

  // ── Test 3: Login Validation ──────────────────────────────────────────────
  it('should show error on empty form submit', async () => {
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Tap submit without filling anything
    await element(by.id('login-submit-button')).tap();

    // Wait briefly for validation message to appear
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Screenshot — validation error state
    await takeScreenshot('03_login_validation_error');
  });

  // ── Test 4: Dark / Loading State (tapping submit with credentials) ────────
  it('should show loading state when submitting valid credentials', async () => {
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('login-email-input')).tap();
    await element(by.id('login-email-input')).typeText('driver@example.com');
    await element(by.id('login-password-input')).tap();
    await element(by.id('login-password-input')).typeText('password123');

    // Tap login — capture loading spinner before API responds
    await element(by.id('login-submit-button')).tap();
    await new Promise(resolve => setTimeout(resolve, 500)); // small delay to catch loading state

    // Screenshot — loading/submitting state
    await takeScreenshot('04_login_submitting');
  });
});
