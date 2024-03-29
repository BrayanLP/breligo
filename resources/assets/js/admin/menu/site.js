! function(e, t, n) {
    "use strict";
    n.extend(e.site, {
        init: function() {
            "undefined" != typeof site.menubar && "undefined" != typeof site.navbar && (site.navbar.init(), site.menubar.init(), n(t).on("click", ".hamburger", function(e) {
                n(this).toggleClass("is-active")
            }), n(t).on("click", '[data-toggle="menubar-fold"]', function(e) {
                site.menubar.toggleFold(), e.preventDefault()
            }), n(t).on("click", '[data-toggle="menubar"]', function(e) {
                site.menubar.toggle(), e.preventDefault()
            }), n(e).on("resize orientationchange", function() {
                site.menubar.scroll.update()
            }), n(t).on("click", ".submenu-toggle", function(e) {
                site.menubar.menu.toggleOnClick(n(this)), e.preventDefault()
            }), n(t).on("mouseenter mouseleave", "body.menubar-fold .site-menu > li", function(e) {
                site.menubar.menu.toggleOnHover(n(this)), e.preventDefault()
            }), n(t).on("click", '[data-toggle="collapse"]', function(e) {
                var t = n(e.target);
                t.is('[data-toggle="collapse"]') || (t = t.parents('[data-toggle="collapse"]'));
                var i = n(t.attr("data-target"));
                "site-navbar-collapse" === i.attr("id") && n("body").toggleClass("navbar-collapse-in"), e.preventDefault()
            }), n(t).on("click", '[data-toggle="navbar-search"]', function(e) {
                n(".navbar-search").toggleClass("show"), e.preventDefault()
            }), Breakpoints.on("change", function() {
                site.navbar.change(), site.menubar.change(), n('[data-toggle="menubar"]').toggleClass("is-active", site.menubar.opened), n('[data-toggle="menubar-fold"]').toggleClass("is-active", !site.menubar.folded)
            })), "undefined" != typeof n.settings && "undefined" != typeof n.customizer && (n.settings.init(), n.customizer.init(), n(t).on("change, click", '[data-toggle="theme"]', function(e) {
                n.customizer.setTheme(this)
            }), n(t).on("click", "#customizerSaveButton", function() {
                var e = n(this);
                n.customizer.save(), e.closest("section").append('<div class="flash-msg mt-4 text-success">Your Settings Saved!</div>'), setTimeout(function() {
                    e.closest("section").find("div.flash-msg").fadeOut()
                }, 2e3)
            }), n(t).on("click", "#customizerResetButton", function() {
                n.customizer.reset()
            })), !/xs|sm/.test(Breakpoints.current().name) && n(".scroll-container").perfectScrollbar(), this.initHeaderCharts(), this.initPlugins()
        }
    })
}(window, document, jQuery), $(function() {
    site.init()
});