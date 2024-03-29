! function(e, n, o) {
    "use strict";
    var r = o(n.body),
        t = o(".site-navbar");
    site.navbar = {
        init: function() {
            !/xl/.test(Breakpoints.current().name) && this.searchForm.clone()
        },
        change: function() {
            /xl/.test(Breakpoints.current().name) ? this.searchForm.remove() : this.searchForm.clone()
        },
        searchForm: {
            cloned: !1,
            clone: function() {
                this.cloned || (t.find(".navbar-search").clone().appendTo("body"), this.cloned = !0)
            },
            remove: function() {
                r.find("> .navbar-search").remove(), this.cloned = !1
            }
        }
    }
}(window, document, jQuery);