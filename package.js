Package.describe({
  summary: "A smart-package for integrating with Hammer.js for multi-touch gestures.",
  version: "2.0.3",
  git: "https://github.com/chriswessels/meteor-hammer.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles('hammer/hammer.js');
});

