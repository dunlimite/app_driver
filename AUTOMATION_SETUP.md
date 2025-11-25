# Automated Build and APK Distribution Setup

This guide will help you set up automated Android APK builds and distribution using GitHub Actions, Fastlane, and Firebase App Distribution.

## Prerequisites

1. **Firebase Project**: You need a Firebase project with App Distribution enabled
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Android Keystore**: For release builds (optional for testing)

## Setup Steps

### 1. Firebase App Distribution Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Navigate to **App Distribution** in the left sidebar
4. Click **Get Started** if you haven't set it up yet
5. Add your Android app:
   - Package name: `com.deliveryapp`
   - App nickname: `App Driver`
6. Note down your **App ID** (you'll need this for GitHub secrets)

### 2. Generate Firebase Token

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to **Service Accounts** tab
3. Click **Generate new private key**
4. Download the JSON file and keep it secure
5. Extract the `private_key` and `client_email` from the JSON file

### 3. GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

#### Required Secrets:
- `FIREBASE_APP_ID`: Your Firebase App ID (from step 1)
- `FIREBASE_TOKEN`: Firebase service account token (from step 2)
- `EMAIL_USERNAME`: Gmail address for sending notifications
- `EMAIL_PASSWORD`: Gmail app password (not your regular password)
- `NOTIFICATION_EMAIL`: Email address to receive build notifications

#### Optional Secrets (for release builds):
- `KEYSTORE_PASSWORD`: Password for your release keystore
- `KEY_ALIAS`: Alias for your release key
- `KEY_PASSWORD`: Password for your release key

### 4. Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Use this password as `EMAIL_PASSWORD` secret

### 5. Firebase App Distribution Groups

1. In Firebase Console → App Distribution
2. Go to **Testers & Groups** tab
3. Create a group called "testers" (or use the default)
4. Add email addresses of people who should receive the APK

## Workflow Files Created

### 1. Fastlane Configuration
- `fastlane/Fastfile`: Main Fastlane configuration
- `fastlane/Appfile`: App metadata configuration
- `fastlane/Pluginfile`: Fastlane plugins

### 2. GitHub Actions Workflows
- `.github/workflows/build-and-distribute.yml`: Basic build workflow
- `.github/workflows/fastlane-build.yml`: Advanced Fastlane workflow

## Usage

### Automatic Builds
- **Push to main/develop**: Triggers automatic build and distribution
- **Pull Request to main**: Triggers build for testing

### Manual Builds
1. Go to **Actions** tab in your GitHub repository
2. Select **Fastlane Build and Distribute**
3. Click **Run workflow**
4. Choose build type (debug/release)
5. Click **Run workflow**

### Build Types
- **Debug**: Quick build for testing, no distribution
- **Release**: Full build with Firebase App Distribution upload

## File Structure

```
app-driver/
├── .github/
│   └── workflows/
│       ├── build-and-distribute.yml
│       └── fastlane-build.yml
├── fastlane/
│   ├── Fastfile
│   ├── Appfile
│   └── Pluginfile
├── android/
│   └── app/
│       └── build.gradle
└── Gemfile
```

## Troubleshooting

### Common Issues

1. **Build fails with "Gradle not found"**
   - Ensure `android/gradlew` is executable
   - Check Android SDK setup in workflow

2. **Firebase upload fails**
   - Verify `FIREBASE_APP_ID` and `FIREBASE_TOKEN` secrets
   - Check Firebase project permissions

3. **Email notifications not working**
   - Verify Gmail app password (not regular password)
   - Check `EMAIL_USERNAME` and `NOTIFICATION_EMAIL` secrets

4. **APK not generated**
   - Check Android build configuration
   - Verify signing configuration for release builds

### Debug Steps

1. Check GitHub Actions logs for detailed error messages
2. Test Fastlane locally: `fastlane android build_debug`
3. Verify Firebase App Distribution setup
4. Check all required secrets are set

## Customization

### Modify Build Configuration
Edit `android/app/build.gradle` to customize:
- Version name and code
- Signing configuration
- Build variants

### Modify Fastlane Lanes
Edit `fastlane/Fastfile` to:
- Add custom build steps
- Modify distribution settings
- Add additional platforms

### Modify Workflow Triggers
Edit `.github/workflows/*.yml` to:
- Change trigger branches
- Add custom conditions
- Modify notification settings

## Security Notes

- Never commit sensitive information (keystores, passwords) to the repository
- Use GitHub Secrets for all sensitive data
- Regularly rotate Firebase tokens and app passwords
- Consider using environment-specific configurations

## Support

For issues with:
- **Fastlane**: Check [Fastlane documentation](https://docs.fastlane.tools/)
- **Firebase**: Check [Firebase App Distribution docs](https://firebase.google.com/docs/app-distribution)
- **GitHub Actions**: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
