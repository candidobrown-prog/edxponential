# edXponential Deployment Guide

## Pre-Launch Checklist

### Code Quality
- [ ] All tests passing (100% critical path coverage)
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Security audit completed
- [ ] Dependency audit completed

### App Store Compliance
- [ ] Privacy policy reviewed and updated
- [ ] Terms of service reviewed and updated
- [ ] FERPA compliance verified
- [ ] GDPR compliance verified
- [ ] CCPA compliance verified
- [ ] PCI DSS compliance verified
- [ ] All metadata translated (if international)

### Assets
- [ ] App icons created (all sizes)
- [ ] Splash screens created
- [ ] Store screenshots designed (all locales)
- [ ] Store descriptions written
- [ ] Preview video created (optional)
- [ ] Press kit prepared

### Infrastructure
- [ ] SSL/TLS certificates configured
- [ ] CDN configured
- [ ] Monitoring and alerting set up
- [ ] Crash reporting configured
- [ ] Analytics configured
- [ ] Payment processing configured
- [ ] Backup and disaster recovery tested

### iOS App Store Deployment

#### Step 1: Prepare for Submission
```bash
# Increment build number
npm run ios:version:bump

# Generate signing certificates and provisioning profiles
# (Use Xcode or App Store Connect)

# Create archive
npm run build:ios -- --archive

# Validate archive
npm run ios:validate
```

#### Step 2: Submit to App Store
1. Go to App Store Connect
2. Navigate to your app
3. Go to "Testflight" → Upload build
4. Wait for processing (5-10 minutes)
5. Test internally
6. Invite external testers
7. After testing, submit for review

#### Step 3: App Review
- Apple typically reviews within 24-48 hours
- Respond to any rejections promptly
- Common issues: Privacy, permissions, crashes
- Once approved, schedule for release

### Android Play Store Deployment

#### Step 1: Prepare Build
```bash
# Create signed APK
npm run build:android -- --signed

# Create App Bundle (preferred)
npm run build:android -- --bundle

# Validate signing
npm run android:validate:signing
```

#### Step 2: Submit to Play Store
1. Go to Google Play Console
2. Create new app release
3. Upload AAB (app bundle)
4. Add store listing details
5. Set pricing and distribution
6. Submit for review

#### Step 3: Play Store Review
- Google typically reviews within 2-3 hours
- Address any policy violations
- Once approved, schedule release

### PWA Deployment

```bash
# Build PWA
npm run build:pwa

# Deploy to production server
npm run deploy:pwa

# Verify service worker
npm run verify:pwa

# Test offline functionality
npm run test:offline
```

## Post-Launch Monitoring

### Critical Metrics

**Performance**
- Page load time < 3s
- Time to interactive < 5s
- Largest contentful paint < 2.5s
- Cumulative layout shift < 0.1

**Reliability**
- Uptime > 99.9%
- Error rate < 0.1%
- Crash rate < 0.01%
- Zero security incidents

**User Experience**
- Session duration > 10 minutes
- Daily active users growing
- Retention rate > 40% (Day 7)
- Net Promoter Score > 50

### Monitoring Setup

```bash
# Enable monitoring
npm run monitoring:enable

# Configure alerts
npm run alerts:configure

# Set up dashboards
npm run dashboards:setup

# Enable performance tracking
npm run perf:tracking:enable
```

## Rollback Procedures

### If Critical Issues Occur

1. **Immediate Actions**
   - Stop new deployments
   - Enable error boundaries
   - Roll back to last stable version
   - Notify support team
   - Update status page

2. **Rollback Command**
   ```bash
   npm run rollback:production
   npm run rollback:ios
   npm run rollback:android
   ```

3. **Post-Rollback**
   - Verify stability
   - Investigate root cause
   - Fix and test thoroughly
   - Deploy again when confident

## Update & Patch Process

### Minor Updates (1-2 weeks)
1. Test thoroughly
2. Submit to app stores
3. Schedule staggered rollout
4. Monitor carefully

### Major Updates (4-12 weeks)
1. Extensive testing (6+ weeks)
2. Beta testing with users
3. Staged rollout (10%, 25%, 50%, 100%)
4. Daily monitoring and adjustments

### Security Patches (ASAP)
1. Test immediately
2. Deploy to production within 24 hours
3. Notify users of security fix
4. Patch all platforms simultaneously

## Version Management

```
MAJOR.MINOR.PATCH+BUILD

Example: 1.2.3+145
- 1 = Major version
- 2 = Minor version
- 3 = Patch version
- 145 = Build number
```

### Release Branches
- `main` — Production releases only
- `staging` — Pre-release testing
- `develop` — Active development

## Documentation

- [Build Configuration](./build.config.js)
- [App Store Metadata](./src/config/appStoreMetadata.js)
- [Compliance Requirements](./src/config/appStoreCompliance.js)
- [Performance Targets](./src/config/performanceOptimization.js)

---

**Last Updated**: May 2026  
**Status**: Production Ready