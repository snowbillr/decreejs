# Decree JS
A fluent API for responding to keyboard input.

Decree JS provides you the functionality to execute a function when a specified key sequence is pressed. To register 
a key sequence with Decree JS, you must use the one method the library puts on the `window` object: `when`.

The `when` method takes in one argument, which is a string consisting of one key. The argument can be almost any key on 
the keyboard. See [the full list](#list-of-supported-keys) of supported keys. This method starts the definition of 
the key sequence you want to register with Decree JS.

To continue the key sequence definition, you have to chain off of the returned value from `when`. Three methods are 
available to chain off of `when`:
- `then`
- `withModifier`
- `decree`

The `when`, `then`, and `withModifier` methods all take the same single argument, and all are chainable with the same
 three methods returned by `when`. These three methods are how you define the sequence of key presses you want to 
 Decree JS to listen for.
 
The `decree` method also takes a single argument, a function to be called when Decree JS notices that the 
key sequence you registered is pressed while the browser is in focus. This method has no return value, and when it is
 called, ends the key sequence you are registering.

The `then` method will register a **sequential** key press that comes after the key given to the previous method. So if 
you execute `when('a').then('b')`, you need to *press and release* the `a` key, and then *press and release* the `b` 
key 
for Decree JS to match your registered decree with keys pressed in the browser.

The `withModifier` method attaches a modifier key to the previously defined key. A modifier key must be pressed 
**before** the key it is attached to. So if you execute `when('a').withModifier('b')`, you need to *press and hold* 
the `b` key, and then *press and release* the `a` key. Technically you could release either key after the `a` key is 
pressed. If the `then` method is called after the `withModifier` method, it starts a new sequential state that 
doesn't expect the previous modifier key to be held down.


## API

### `when`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `decree`.

### `then`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `decree`.

### `withModifier`

#### Parameters
| parameter |  type  |
|-----------|--------|
|    key    | string |

#### Returns
An object containing the methods `then`, `withModifier`, and `decree`.

### `decree`

#### Parameters
| parameter |   type   |
|-----------|----------|
| callback  | function |

#### Returns
Nothing.

## Examples

### A single key
```
when('a').decree(function() {
    console.log('"a" was pressed and released.');
});
```

### A two key sequence
```
when('a').then('s').decree(function() {
    console.log('"a" was pressed and released, then "s" was pressed and released');
});
```

### A single key with a modifier
```
when('a').withModifier('b').decree(function() {
    console.log('"b" was pressed and held, then "a" was pressed and released.');
});
```

### A two key sequence, both with modifiers
```
when('q').withModifier('a').then('w').withModifier('s').decree(function() {
    console.log('"a" was pressed and held, then "q" was pressed and released, then "a" was released". Then, "s" was 
    pressed and held, then "w" was pressed and released, then "s" was released.');
});
```

## Configuring Decree JS
You can configure Decree JS by calling the `window.decreeConfig` method. This method takes one parameter, a JSON 
object. The list of configurable properties, along with their defaults, is shown below in the sample code:
 ```
 window.decreeConfig({
    timeThreshold: 500      //the time Decree JS waits between key presses to continue the current key sequence
                            //this property is in milliseconds
 });
 ```

## Questions

### What happens if I register two modifiers on a key?
Currently, a modifier registers itself as the first key required to be pressed for the state it is attached to. So if
 I execute `when('c').withModifier('b').withModifier('a')`, I'll need to *press and hold* "a", then *press and hold* 
 "b", and then *press and release* "c", then *release* "a" and "b". Decree sees the state start its definition with 
 "a", then sees that we are adding a modifier of "b" to that, so it will put the modifier key in front of the main 
 key for the state, which looks like `["b", "c"]`. Then, it sees we're adding a second modifier, so it will put the 
 second modifier key in front of the key sequence, which will look like `["a", "b", "c"]`.
 
 I'm planning on adding in the functionality to be able to press the modifier keys in any order in a future release.
 

## List of Supported Keys
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
