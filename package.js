Package.describe({
  name: 'meteor-hammer',
  summary: "Bundles Hammer.js and provides Template.templateName.gestures() for easy use of multitouch gestures.",
  version: "4.0.0-rc1",
  git: "https://github.com/chriswessels/meteor-hammer.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'underscore@1.0.3',
    'templating@1.1.1',
    'blaze@2.1.2',
    'random@1.0.3'
  ]);

  api.addFiles('lib/hammer.js', 'client');
  api.addFiles('export.js', 'client');

  api.addFiles([
    'hammer_touch_area.html',
    'hammer_touch_area.js'
  ], 'client');

  api.export('Hammer');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('chriswessels:hammer');
  api.addFiles('test.js', 'client');
});
