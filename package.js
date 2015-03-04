Package.describe({
  name: 'chriswessels:hammer',
  summary: "Bundles Hammer.js and provides Template.templateName.gestures() for easy use of multitouch gestures.",
  version: "3.0.0-rc1",
  git: "https://github.com/chriswessels/meteor-hammer.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'underscore@1.0.2',
    'aldeed:template-extension@3.1.1',
    'templating@1.0.0',
    'blaze@2.0.0',
    'jquery@1.0.0'
  ]);

  api.addFiles('lib/hammer.js', 'client');
  api.addFiles('jquery.hammer.js', 'client');
  api.addFiles('template_integration.js', 'client');
});

