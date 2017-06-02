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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnUuanMiLCJuYXZiYXIuanMiLCJzaXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhIGZ1bmN0aW9uKGUsIGksIG4pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgcyA9IG4oaS5ib2R5KSxcbiAgICAgICAgdCA9IG4oXCIuc2l0ZS1tZW51XCIpLFxuICAgICAgICBsID0gbihcIi5zaXRlLW1lbnViYXJcIik7XG4gICAgc2l0ZS5tZW51YmFyID0ge1xuICAgICAgICBvcGVuZWQ6ICExLFxuICAgICAgICBmb2xkZWQ6ICExLFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlID0gQnJlYWtwb2ludHMuY3VycmVudCgpLm5hbWU7XG4gICAgICAgICAgICBzLmlzKFwiLm1lbnViYXItZm9sZFwiKSAmJiAodGhpcy5mb2xkZWQgPSAhMCksIC94c3xzbS8udGVzdChlKSAmJiB0aGlzLmZvbGRlZCA9PT0gITAgJiYgcy5yZW1vdmVDbGFzcyhcIm1lbnViYXItZm9sZFwiKSwgIS94c3xzbS8udGVzdChlKSAmJiB0aGlzLmZvbGRlZCA9PT0gITEgJiYgdGhpcy5zY3JvbGwuaW5pdCgpLCAvbWR8bGcvLnRlc3QoZSkgJiYgdGhpcy5mb2xkKCksICEveHN8c20vLnRlc3QoZSkgJiYgdGhpcy5tZW51LmFkZE1lbnVOYW1lKCksIG4oJ1tkYXRhLXRvZ2dsZT1cIm1lbnViYXJcIl0nKS50b2dnbGVDbGFzcyhcImlzLWFjdGl2ZVwiLCB0aGlzLm9wZW5lZCksIG4oJ1tkYXRhLXRvZ2dsZT1cIm1lbnViYXItZm9sZFwiXScpLnRvZ2dsZUNsYXNzKFwiaXMtYWN0aXZlXCIsICF0aGlzLmZvbGRlZClcbiAgICAgICAgfSxcbiAgICAgICAgZm9sZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzLmFkZENsYXNzKFwibWVudWJhci1mb2xkXCIpLCB0aGlzLnNjcm9sbC5kaXNhYmxlKCksIHRoaXMuZm9sZGVkID0gITBcbiAgICAgICAgfSxcbiAgICAgICAgdW5Gb2xkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsLmluaXRpYWxpemVkID09PSAhMSAmJiB0aGlzLnNjcm9sbC5pbml0KCksIHMucmVtb3ZlQ2xhc3MoXCJtZW51YmFyLWZvbGRcIiksIHRoaXMuc2Nyb2xsLmVuYWJsZSgpLnVwZGF0ZSgpLCB0aGlzLmZvbGRlZCA9ICExXG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZUZvbGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5mb2xkZWQgPT09ICEwID8gdGhpcy51bkZvbGQoKSA6IHRoaXMuZm9sZCgpXG4gICAgICAgIH0sXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcy5yZW1vdmVDbGFzcyhcIm1lbnViYXItb3BlblwiKSwgdGhpcy5vcGVuZWQgPSAhMVxuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHMuYWRkQ2xhc3MoXCJtZW51YmFyLW9wZW5cIiksIHRoaXMub3BlbmVkID0gITBcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbmVkID09PSAhMCA/IHRoaXMuaGlkZSgpIDogdGhpcy5vcGVuKClcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlID0gQnJlYWtwb2ludHMuY3VycmVudCgpLm5hbWU7XG4gICAgICAgICAgICAveGwvLnRlc3QoZSkgPyB0aGlzLnVuRm9sZCgpIDogL21kfGxnLy50ZXN0KGUpID8gdGhpcy5mb2xkKCkgOiAodGhpcy5oaWRlKCksIHRoaXMuZm9sZGVkID09PSAhMCAmJiB0aGlzLnVuRm9sZCgpLCB0aGlzLnNjcm9sbC5kaXNhYmxlKCkpLCAveHN8c20vLnRlc3QoZSkgPyB0aGlzLm1lbnUucmVtb3ZlTWVudU5hbWUoKSA6IHRoaXMubWVudS5hZGRNZW51TmFtZSgpXG4gICAgICAgIH0sXG4gICAgICAgIHNjcm9sbDoge1xuICAgICAgICAgICAgaW5pdGlhbGl6ZWQ6ICExLFxuICAgICAgICAgICAgZW5hYmxlZDogITEsXG4gICAgICAgICAgICAkc2Nyb2xsQ29udGFpbmVyOiBuKFwiYm9keS5tZW51YmFyLWxlZnQgLnNpdGUtbWVudWJhci1pbm5lclwiKSxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPT09ICExICYmIHRoaXMuJHNjcm9sbENvbnRhaW5lci5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcImF1dG9cIixcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCI1cHhcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk4YTZhZFwiLFxuICAgICAgICAgICAgICAgICAgICB3aGVlbFN0ZXA6IDEwLFxuICAgICAgICAgICAgICAgICAgICB0b3VjaFNjcm9sbFN0ZXA6IDUwXG4gICAgICAgICAgICAgICAgfSkgJiYgKHRoaXMuaW5pdGlhbGl6ZWQgPSAhMCwgdGhpcy5lbmFibGVkID0gITApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGwuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVkID09PSAhMCAmJiB0aGlzLiRzY3JvbGxDb250YWluZXIuaGVpZ2h0KGUpLnBhcmVudCgpLmhlaWdodChlKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQgPT09ICEwICYmIHRoaXMuZW5hYmxlZCA9PT0gITEgJiYgdGhpcy4kc2Nyb2xsQ29udGFpbmVyLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIikuZmluZChcIi5zbGltU2Nyb2xsQmFyXCIpLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpLCB0aGlzLmVuYWJsZWQgPSAhMCwgdGhpc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9PT0gITAgJiYgdGhpcy4kc2Nyb2xsQ29udGFpbmVyLnBhcmVudCgpLmFkZENsYXNzKFwiZGlzYWJsZWRcIikuZmluZChcIi5zbGltU2Nyb2xsQmFyXCIpLmNzcyhcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIikgJiYgKHRoaXMuZW5hYmxlZCA9ICExKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZW51OiB7XG4gICAgICAgICAgICBzbGlkZVNwZWVkOiA1MDAsXG4gICAgICAgICAgICBhZGRNZW51TmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdC5maW5kKFwiLnN1Ym1lbnUtZmFrZVwiKS5sZW5ndGggPiAwIHx8IHQuY2hpbGRyZW4oXCJsaTpub3QoLm1lbnUtc2VjdGlvbi1oZWFkaW5nKVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IG4odGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gZS5maW5kKFwiPiBhXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IGkuYXR0cihcImhyZWZcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gaS5maW5kKFwiPiAubWVudS10ZXh0XCIpLnRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5maW5kKFwiPiAuc3VibWVudVwiKS5sZW5ndGggPiAwIHx8IGUuYXBwZW5kKCc8dWwgY2xhc3M9XCJzdWJtZW51IHN1Ym1lbnUtZmFrZVwiPjwvdWw+JyksIGUuZmluZChcIj4gLnN1Ym1lbnVcIikucHJlcGVuZCgnPGxpIGNsYXNzPVwibWVudS1oZWFkaW5nXCI+PGEgaHJlZj1cIicgKyBzICsgJ1wiPicgKyB0ICsgXCI8L2E+PC9saT5cIilcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbW92ZU1lbnVOYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0LmZpbmQoXCIuc3VibWVudS1mYWtlXCIpLnJlbW92ZSgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlT25DbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJvcGVuXCIpLmZpbmQoXCI+IC5zdWJtZW51XCIpLnNsaWRlVG9nZ2xlKHRoaXMuc2xpZGVTcGVlZCkuZW5kKCkuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcIm9wZW5cIikuZmluZChcIj4gLnN1Ym1lbnVcIikuc2xpZGVVcCh0aGlzLnNsaWRlU3BlZWQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlT25Ib3ZlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIC9tZHxsZ3x4bC8udGVzdChCcmVha3BvaW50cy5jdXJyZW50KCkubmFtZSkgJiYgZS50b2dnbGVDbGFzcyhcIm9wZW5cIikuc2libGluZ3MoXCJsaVwiKS5yZW1vdmVDbGFzcyhcIm9wZW5cIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTsiLCIhIGZ1bmN0aW9uKGUsIG4sIG8pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgciA9IG8obi5ib2R5KSxcbiAgICAgICAgdCA9IG8oXCIuc2l0ZS1uYXZiYXJcIik7XG4gICAgc2l0ZS5uYXZiYXIgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgIS94bC8udGVzdChCcmVha3BvaW50cy5jdXJyZW50KCkubmFtZSkgJiYgdGhpcy5zZWFyY2hGb3JtLmNsb25lKClcbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC94bC8udGVzdChCcmVha3BvaW50cy5jdXJyZW50KCkubmFtZSkgPyB0aGlzLnNlYXJjaEZvcm0ucmVtb3ZlKCkgOiB0aGlzLnNlYXJjaEZvcm0uY2xvbmUoKVxuICAgICAgICB9LFxuICAgICAgICBzZWFyY2hGb3JtOiB7XG4gICAgICAgICAgICBjbG9uZWQ6ICExLFxuICAgICAgICAgICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvbmVkIHx8ICh0LmZpbmQoXCIubmF2YmFyLXNlYXJjaFwiKS5jbG9uZSgpLmFwcGVuZFRvKFwiYm9keVwiKSwgdGhpcy5jbG9uZWQgPSAhMClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHIuZmluZChcIj4gLm5hdmJhci1zZWFyY2hcIikucmVtb3ZlKCksIHRoaXMuY2xvbmVkID0gITFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0od2luZG93LCBkb2N1bWVudCwgalF1ZXJ5KTsiLCIhIGZ1bmN0aW9uKGUsIHQsIG4pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBuLmV4dGVuZChlLnNpdGUsIHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBzaXRlLm1lbnViYXIgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2Ygc2l0ZS5uYXZiYXIgJiYgKHNpdGUubmF2YmFyLmluaXQoKSwgc2l0ZS5tZW51YmFyLmluaXQoKSwgbih0KS5vbihcImNsaWNrXCIsIFwiLmhhbWJ1cmdlclwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgbih0aGlzKS50b2dnbGVDbGFzcyhcImlzLWFjdGl2ZVwiKVxuICAgICAgICAgICAgfSksIG4odCkub24oXCJjbGlja1wiLCAnW2RhdGEtdG9nZ2xlPVwibWVudWJhci1mb2xkXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHNpdGUubWVudWJhci50b2dnbGVGb2xkKCksIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSksIG4odCkub24oXCJjbGlja1wiLCAnW2RhdGEtdG9nZ2xlPVwibWVudWJhclwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBzaXRlLm1lbnViYXIudG9nZ2xlKCksIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSksIG4oZSkub24oXCJyZXNpemUgb3JpZW50YXRpb25jaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2l0ZS5tZW51YmFyLnNjcm9sbC51cGRhdGUoKVxuICAgICAgICAgICAgfSksIG4odCkub24oXCJjbGlja1wiLCBcIi5zdWJtZW51LXRvZ2dsZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgc2l0ZS5tZW51YmFyLm1lbnUudG9nZ2xlT25DbGljayhuKHRoaXMpKSwgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KSwgbih0KS5vbihcIm1vdXNlZW50ZXIgbW91c2VsZWF2ZVwiLCBcImJvZHkubWVudWJhci1mb2xkIC5zaXRlLW1lbnUgPiBsaVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgc2l0ZS5tZW51YmFyLm1lbnUudG9nZ2xlT25Ib3ZlcihuKHRoaXMpKSwgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KSwgbih0KS5vbihcImNsaWNrXCIsICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IG4oZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHQuaXMoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJykgfHwgKHQgPSB0LnBhcmVudHMoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJykpO1xuICAgICAgICAgICAgICAgIHZhciBpID0gbih0LmF0dHIoXCJkYXRhLXRhcmdldFwiKSk7XG4gICAgICAgICAgICAgICAgXCJzaXRlLW5hdmJhci1jb2xsYXBzZVwiID09PSBpLmF0dHIoXCJpZFwiKSAmJiBuKFwiYm9keVwiKS50b2dnbGVDbGFzcyhcIm5hdmJhci1jb2xsYXBzZS1pblwiKSwgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KSwgbih0KS5vbihcImNsaWNrXCIsICdbZGF0YS10b2dnbGU9XCJuYXZiYXItc2VhcmNoXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIG4oXCIubmF2YmFyLXNlYXJjaFwiKS50b2dnbGVDbGFzcyhcInNob3dcIiksIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSksIEJyZWFrcG9pbnRzLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNpdGUubmF2YmFyLmNoYW5nZSgpLCBzaXRlLm1lbnViYXIuY2hhbmdlKCksIG4oJ1tkYXRhLXRvZ2dsZT1cIm1lbnViYXJcIl0nKS50b2dnbGVDbGFzcyhcImlzLWFjdGl2ZVwiLCBzaXRlLm1lbnViYXIub3BlbmVkKSwgbignW2RhdGEtdG9nZ2xlPVwibWVudWJhci1mb2xkXCJdJykudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIiwgIXNpdGUubWVudWJhci5mb2xkZWQpXG4gICAgICAgICAgICB9KSksIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIG4uc2V0dGluZ3MgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2Ygbi5jdXN0b21pemVyICYmIChuLnNldHRpbmdzLmluaXQoKSwgbi5jdXN0b21pemVyLmluaXQoKSwgbih0KS5vbihcImNoYW5nZSwgY2xpY2tcIiwgJ1tkYXRhLXRvZ2dsZT1cInRoZW1lXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIG4uY3VzdG9taXplci5zZXRUaGVtZSh0aGlzKVxuICAgICAgICAgICAgfSksIG4odCkub24oXCJjbGlja1wiLCBcIiNjdXN0b21pemVyU2F2ZUJ1dHRvblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IG4odGhpcyk7XG4gICAgICAgICAgICAgICAgbi5jdXN0b21pemVyLnNhdmUoKSwgZS5jbG9zZXN0KFwic2VjdGlvblwiKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJmbGFzaC1tc2cgbXQtNCB0ZXh0LXN1Y2Nlc3NcIj5Zb3VyIFNldHRpbmdzIFNhdmVkITwvZGl2PicpLCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBlLmNsb3Nlc3QoXCJzZWN0aW9uXCIpLmZpbmQoXCJkaXYuZmxhc2gtbXNnXCIpLmZhZGVPdXQoKVxuICAgICAgICAgICAgICAgIH0sIDJlMylcbiAgICAgICAgICAgIH0pLCBuKHQpLm9uKFwiY2xpY2tcIiwgXCIjY3VzdG9taXplclJlc2V0QnV0dG9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG4uY3VzdG9taXplci5yZXNldCgpXG4gICAgICAgICAgICB9KSksICEveHN8c20vLnRlc3QoQnJlYWtwb2ludHMuY3VycmVudCgpLm5hbWUpICYmIG4oXCIuc2Nyb2xsLWNvbnRhaW5lclwiKS5wZXJmZWN0U2Nyb2xsYmFyKCksIHRoaXMuaW5pdEhlYWRlckNoYXJ0cygpLCB0aGlzLmluaXRQbHVnaW5zKClcbiAgICAgICAgfVxuICAgIH0pXG59KHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSksICQoZnVuY3Rpb24oKSB7XG4gICAgc2l0ZS5pbml0KClcbn0pOyJdfQ==
