! function(e, i, n) {
    "use strict";
    var s = n(i.body),
        t = n(".site-menu"),
        l = n(".site-menubar");
    site.menubar = {
        opened: !1,
        folded: !1,
        init: function() {
            var e = Breakpoints.current().name;
            s.is(".menubar-fold") && (this.folded = !0), /xs|sm/.test(e) && this.folded === !0 && s.removeClass("menubar-fold"), !/xs|sm/.test(e) && this.folded === !1 && this.scroll.init(), /md|lg/.test(e) && this.fold(), !/xs|sm/.test(e) && this.menu.addMenuName(), n('[data-toggle="menubar"]').toggleClass("is-active", this.opened), n('[data-toggle="menubar-fold"]').toggleClass("is-active", !this.folded)
        },
        fold: function() {
            s.addClass("menubar-fold"), this.scroll.disable(), this.folded = !0
        },
        unFold: function() {
            this.scroll.initialized === !1 && this.scroll.init(), s.removeClass("menubar-fold"), this.scroll.enable().update(), this.folded = !1
        },
        toggleFold: function() {
            this.folded === !0 ? this.unFold() : this.fold()
        },
        hide: function() {
            s.removeClass("menubar-open"), this.opened = !1
        },
        open: function() {
            s.addClass("menubar-open"), this.opened = !0
        },
        toggle: function() {
            this.opened === !0 ? this.hide() : this.open()
        },
        change: function() {
            var e = Breakpoints.current().name;
            /xl/.test(e) ? this.unFold() : /md|lg/.test(e) ? this.fold() : (this.hide(), this.folded === !0 && this.unFold(), this.scroll.disable()), /xs|sm/.test(e) ? this.menu.removeMenuName() : this.menu.addMenuName()
        },
        scroll: {
            initialized: !1,
            enabled: !1,
            $scrollContainer: n("body.menubar-left .site-menubar-inner"),
            init: function() {
                this.initialized === !1 && this.$scrollContainer.slimScroll({
                    height: "auto",
                    position: "right",
                    size: "5px",
                    color: "#98a6ad",
                    wheelStep: 10,
                    touchScrollStep: 50
                }) && (this.initialized = !0, this.enabled = !0)
            },
            update: function() {
                var e = l.height();
                this.enabled === !0 && this.$scrollContainer.height(e).parent().height(e)
            },
            enable: function() {
                return this.initialized === !0 && this.enabled === !1 && this.$scrollContainer.parent().removeClass("disabled").find(".slimScrollBar").css("visibility", "visible"), this.enabled = !0, this
            },
            disable: function() {
                this.enabled === !0 && this.$scrollContainer.parent().addClass("disabled").find(".slimScrollBar").css("visibility", "hidden") && (this.enabled = !1)
            }
        },
        menu: {
            slideSpeed: 500,
            addMenuName: function() {
                t.find(".submenu-fake").length > 0 || t.children("li:not(.menu-section-heading)").each(function() {
                    var e = n(this),
                        i = e.find("> a"),
                        s = i.attr("href"),
                        t = i.find("> .menu-text").text();
                    e.find("> .submenu").length > 0 || e.append('<ul class="submenu submenu-fake"></ul>'), e.find("> .submenu").prepend('<li class="menu-heading"><a href="' + s + '">' + t + "</a></li>")
                })
            },
            removeMenuName: function() {
                t.find(".submenu-fake").remove()
            },
            toggleOnClick: function(e) {
                e.parent().toggleClass("open").find("> .submenu").slideToggle(this.slideSpeed).end().siblings().removeClass("open").find("> .submenu").slideUp(this.slideSpeed)
            },
            toggleOnHover: function(e) {
                /md|lg|xl/.test(Breakpoints.current().name) && e.toggleClass("open").siblings("li").removeClass("open")
            }
        }
    }
}(window, document, jQuery);