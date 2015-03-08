# Decree JS

Decree JS allows you to execute a function when a specified key sequence is pressed. To register
a key sequence with Decree JS, you use the `decree.when` method.

The `decree.when` method takes in one argument, which is a string consisting of one key. The argument can be almost any
 key on the keyboard. See [the full list](#list-of-supported-keys) of supported keys. This method starts the definition of
the key sequence you want to register with Decree JS.

To continue the key sequence definition, you have to chain off of the returned value from `decree.when`. Three methods
are available to chain off of `decree.when`:
- `then`
- `withModifier`
- `perform`

The `decree.when`, `then`, and `withModifier` methods all take the same single argument, and all are chainable with the
same three methods returned by `decree.when`. These three methods are how you define the sequence of key presses you
want to Decree JS to listen for.
 
The `perform` method also takes a single argument, a function to be called when Decree JS notices that the
key sequence you registered is pressed while the browser is in focus. This method has no return value, and when it is
 called, ends the key sequence you are registering.

The `then` method will register a **sequential** key press that comes after the key given to the previous method. So if 
you execute `decree.when('a').then('b')`, you need to *press and release* the `a` key, and then *press and release* the
`b` key for Decree JS to match your registered decree with keys pressed in the browser.

The `withModifier` method attaches a modifier key to the previously defined key. A modifier key must be pressed 
**before** the key it is attached to. So if you execute `decree.when('a').withModifier('b')`, you need to *press and
hold* the `b` key, and then *press and release* the `a` key. You'll also need to release the modifier key before the next part of the key sequence, if one exists. You can release the modifier key or the main key in any order. If the `then` method is called after the `withModifier` method, it starts a new sequential state that 
doesn't expect the previous modifier key to be held down.


## API

### `decree.when`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `perform`.

### `then`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `perform`.

### `withModifier`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `perform`.

### `perform`

#### Parameters
| parameter |   type   |
|-----------|----------|
| callback  | function |

#### Returns
Nothing.

## Examples

### A single key
```
decree.when('a').perform(function() {
    console.log('"a" was pressed and released.');
});
```

### A two key sequence
```
decree.when('a').then('s').perform(function() {
    console.log('"a" was pressed and released, then "s" was pressed and released');
});
```

### A single key with a modifier
```
decree.when('a').withModifier('b').perform(function() {
    console.log('"b" was pressed and held, then "a" was pressed and released.');
});
```

### A single key with two modifiers
```
decree.when('a').withModifier('b').withModifier('c').perform(function() {
    console.log('"b" and "c" were both pressed and held (in any order), then "a" was pressed and released.');
});
```

### A two key sequence, both with modifiers
```
decree.when('q').withModifier('a').then('w').withModifier('s').perform(function() {
    console.log('"a" was pressed and held, then "q" was pressed and released, then "a" was released". Then, "s" was 
    pressed and held, then "w" was pressed and released, then "s" was released.');
});
```

## Configuring Decree JS
You can configure Decree JS by calling the `decree.config` method. This method takes one parameter, a JSON
object. The list of configurable properties, along with their defaults, is shown below in the sample code:
 ```
 decree.config({
    timeThreshold: 500      //the time Decree JS waits between key presses to continue the current key sequence
                            //this property is in milliseconds
 });
 ```

## List of Supported Keys
These are the strings that the `decree.when`, `then`, and `withModifier` methods can take as a parameter.
- "space"
- "enter"
- "return"
- "tab"
- "esc"
- "escape"
- "backspace"
- "shift"
- "control"
- "ctrl"
- "alt"
- "0"
- "1"
- "2"
- "3"
- "4"
- "5"
- "6"
- "7"
- "8"
- "9"
- "left"
- "up"
- "right"
- "down"
- "a"
- "b"
- "c"
- "d"
- "e"
- "f"
- "g"
- "h"
- "i"
- "j"
- "k"
- "l"
- "m"
- "n"
- "o"
- "p"
- "q"
- "r"
- "s"
- "t"
- "u"
- "v"
- "w"
- "x"
- "y"
- "z"
