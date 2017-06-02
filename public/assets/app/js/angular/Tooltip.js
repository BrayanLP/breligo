// ToolTipApp is the ng-app application in your web app
model.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVG9vbHRpcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRvb2xUaXBBcHAgaXMgdGhlIG5nLWFwcCBhcHBsaWNhdGlvbiBpbiB5b3VyIHdlYiBhcHBcbm1vZGVsLmRpcmVjdGl2ZSgndG9vbHRpcCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWVudGVyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlbGVhdmVcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyJdfQ==
