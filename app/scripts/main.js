decree('a').then('s').then('d').then('f').perform(function() {
    console.log('"asdf" was pressed');
});

decree('a').then('a').then('a').then('a').perform(function() {
    console.log('"aaaa" was pressed');
});

decree('up').then('up').then('down').then('down').then('left').then('right').then('left').then('right').then('b').then('a').then('enter').perform(function() {
    alert('konami code!');
});