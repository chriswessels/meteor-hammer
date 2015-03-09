# meteor-hammer

A smart-package for integrating with Hammer.js for multi-touch gestures. Bundles Hammer.js and provides `Template.templateName.gestures()` for easy use.

## Example

```javascript
Template.yourTemplate.gestures({
  'swipeleft .item .panel': function (event, template) {
    /* Do something when user swipes left on .item .panel (elements(s) inside the template html) */
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */
  }
});
```

## Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:hammer

## Template interface

The interface for `Template.templateName.gestures()` is the same as `Template.templateName.events()`.

Specifically, you should pass an object into `Template.templateName.events()`. The object keys should follow the format `gestureName cssSelector` and the value should be a callback function that is executed when the specified gesture is performed on the element(s) matching the CSS selector.

## Setting Hammer.js options

You can set Hammer.js options application-wide by using `$('body').data('hammer').set({ /* Hammer Options */ });`.

## Gesture Callback Function

The callback function you specify will be passed two arguments: `event`, the event object provided by Hammer.js and `template`, the `Blaze.TemplateInstance`.

The `this` context of the callback function will be set to the data context of the matching element in your template.

## License

Please see the `LICENSE` file for more information.
