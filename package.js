Package.describe({
  name: 'chriswessels:hammer',
  summary: "A smart-package for integrating with Hammer.js for multi-touch gestures. Bundles Hammer.js and provides Template.templateName.gestures() for easy use.",
  version: "2.0.4_2",
  git: "https://github.com/chriswessels/meteor-hammer.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'aldeed:template-extension@3.1.1',
    'templating@1.0.0',
    'blaze@2.0.0',
    'jquery@1.0.0'
  ]);

  api.addFiles('lib/hammer.js', 'client');
  api.addFiles('jquery.hammer.js', 'client');
  api.addFiles('template_integration.js', 'client');
});

