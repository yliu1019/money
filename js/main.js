$(document).ready(function() {
    var resizable = new Resizable('my-element', {
        direction: 'bottom'
    });

    resizable.setSize(200, 200);

    resizable.destroy(); // the destructo
})
