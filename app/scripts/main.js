decree('a').perform(function() {
    console.log('"a" was pressed');
});

decree('q').then('w').then('e').then('r').then('t').then('y').perform(function() {
    console.log('"qwerty" was pressed');
});

decree('w').then('o').perform(function() {
    console.log('I will be called because the "wo" key sequence is shorter than "woo".');
});

decree('w').then('o').then('o').perform(function() {
    console.log('I will never be called because the "wo" key sequence is shorter than "woo".');
});

decree('up').then('up').then('down').then('down').then('left').then('right').then('left').then('right').then('b').then('a').then('enter').perform(function() {
    alert('konami code!');
});