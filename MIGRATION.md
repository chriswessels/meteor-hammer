# Migration guide

## New API (4.0.0+)

The new API includes the introduction of a `HammerTouchArea` Spacebars block helper. An instance of Hammer.js will be attached to any occurrence of this block helper.

Read more about the new API in [README.md](https://github.com/chriswessels/meteor-hammer/blob/master/README.md).

### How to migrate

#### Template.foo.gestures

There is no longer a `Template.foo.gestures` function. The object that you had previously passed into that function should now be returned by a helper, and passed into an instance of `HammerTouchArea` in your template code.

##### Example:

Implementing the old API, your code looked similar to the following:

```javascript
Template.foo.gestures({
  'swipeleft .bar': function (event, template) {
    /* ... */
  }
});
```

```html
<template name="foo">
  <div class="bar">
    <!-- ... -->
  </div>
</template>
```

It should become the following when implementing the new API:

```javascript
Template.foo.helpers({
  fooGestures: {
    'swipeleft .bar': function (event, template) {
      /* ... */
    }
  }
});
```

```html
<template name="foo">
  {{#HammerTouchArea gestureMap=fooGestures}}
    <div class="bar">
      <!-- ... -->
    </div>
  {{/HammerTouchArea}}
</template>
```

#### $('body').data('hammer')

Previous versions of chriswessels:hammer used a global instance of Hammer.js attached to the `body` element. The new API creates an instance of Hammer.js for each occurrence of `HammerTouchArea` in your templates. This gives you much finer grained control over gesture behaviour.

The new API provides you a callback that allows you to configure the Hammer.js instance in any way you desire. This is how you replicate functionality previously implemented using `$('body').data('hammer')`.

There is also an `initOptions` property on `HammerTouchArea` that lets you set initialisation options. To learn more see [README.md](https://github.com/chriswessels/meteor-hammer/blob/master/README.md).

##### Example:

Implementing the old API, your code looked similar to the following:

```javascript
// Instantiating and attaching the Recognizers to the `Hammer.Manager` instance.
// client/app.js
Meteor.startup(function () {
  var manager = $('body').data('hammer');
  var twoFingerSwipe = new Hammer.Swipe({
    event: '2fingerswipe', /* prefix for custom swipe events, e.g. 2fingerswipeleft, 2fingerswiperight */
    pointers: 2,
    velocity: 0.5
  });
  manager.add(twoFingerSwipe);
});

// Using the custom recognizers in your templates
// client/views/foo/foo.js
Template.foo.gestures({
  '2fingerswiperight .bar': function (event, template) {
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */
  }
});
```

It should become the following when implementing the new API:

*Remember that configuration now applies to individual instances of Hammer.js as opposed to the global instance that previously existed.*

```html
<template name="baz">
  {{#HammerTouchArea configureCallback=configureHammer gestureMap=templateGestures}}
    <div class="hello">
      <!-- ... -->
    </div>
  {{/HammerTouchArea}}
</template>
```

```javascript
Template.baz.helpers({
  configureHammer: function () {
    return function (hammer, templateInstance) {
      var twoFingerSwipe = new Hammer.Swipe({
        event: '2fingerswipe', /* prefix for custom swipe events, e.g. 2fingerswipeleft, 2fingerswiperight */
        pointers: 2,
        velocity: 0.5
      });
      hammer.add(twoFingerSwipe);
      return hammer;
    }
  },
  templateGestures: {
    '2fingerswiperight hello': function (event, templateInstance) {
      /* `event` is the Hammer.js event object */
      /* `templateInstance` is the `Blaze.TemplateInstance` */
      /* `this` is the data context of the element in your template */
    }
  }
});
```

#### Template.foo.hammerOptions

There is no longer a `Template.foo.hammerOptions` function. See the above section for how to configure Hammer.js. Also see [README.md](https://github.com/chriswessels/meteor-hammer/blob/master/README.md).

## Backwards compat.

4.0.0 will not be backwards compatible. Points of interest:

- Hammer.js jQuery plugin will no longer be bundled in the package (any user calls to `$(element).hammer(...)` will fail).
- No more `Template.foo.gestures`. See `gestureMap` option for `HammerTouchArea` above.
- No more `Template.foo.hammerOptions`. See `configureCallback` option for `HammerTouchArea` above.

## Why the new API?

Read this: [https://forums.meteor.com/t/guidance-needed-for-chriswessels-hammer-hammer-js-blaze-integration/3532](https://forums.meteor.com/t/guidance-needed-for-chriswessels-hammer-hammer-js-blaze-integration/3532)

Associated GitHub issue: [https://github.com/chriswessels/meteor-hammer/issues/14](https://github.com/chriswessels/meteor-hammer/issues/14)
