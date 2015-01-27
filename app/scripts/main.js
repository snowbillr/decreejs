when('a').decree(function() {
    console.log('"a" was pressed');
});

when('q').then('w').then('e').then('r').then('t').then('y').decree(function() {
    console.log('"qwerty" was pressed');
});

when('w').then('o').decree(function() {
    console.log('I will be called because the "wo" key sequence is shorter than "woo".');
});

when('w').then('o').then('o').decree(function() {
    console.log('I will never be called because the "wo" key sequence is shorter than "woo".');
});

when('up').then('up').then('down').then('down').then('left').then('right').then('left').then('right').then('b').then('a').then('enter').decree(function() {
    alert('konami code!');
});
