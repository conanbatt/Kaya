$(document).ready(function(){
    $.widget( "main.widget_name", {
        options: {
            //some functions you would use to operate the widget while its live.,
            function example(){ alert("i got called");  }
        },

        _create: function() {
            //The DOM effect of the widget
            (new MyWidget()).html.appendTo("#my-widget");
        },

        destroy: function() {
            $.Widget.prototype.destroy.call( this );
            //cleaning up the dom effects of the particular widget
            $(this.element).children().remove();
        },
    });
});