!function(){"use strict";function t(s){this.options=e.extend({},i.defaults,t.defaults,s),this.element=this.options.element,this.$element=e(this.element),this.createWrapper(),this.createWaypoint()}var e=window.jQuery,i=window.Waypoint;t.prototype.createWaypoint=function(){var t=this.options.handler;this.waypoint=new i(e.extend({},this.options,{element:this.wrapper,handler:e.proxy(function(e){var i=this.options.direction.indexOf(e)>-1,s=i?this.$element.outerHeight(!0):"";this.$wrapper.height(s),this.$element.toggleClass(this.options.stuckClass,i),t&&t.call(this,e)},this)}))},t.prototype.createWrapper=function(){this.options.wrapper&&this.$element.wrap(this.options.wrapper),this.$wrapper=this.$element.parent(),this.wrapper=this.$wrapper[0]},t.prototype.destroy=function(){this.$element.parent()[0]===this.wrapper&&(this.waypoint.destroy(),this.$element.removeClass(this.options.stuckClass),this.options.wrapper&&this.$element.unwrap())},t.defaults={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"},i.Sticky=t}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0aWNreS5qcyJdLCJuYW1lcyI6WyJ0IiwicyIsInRoaXMiLCJvcHRpb25zIiwiZSIsImV4dGVuZCIsImkiLCJkZWZhdWx0cyIsImVsZW1lbnQiLCIkZWxlbWVudCIsImNyZWF0ZVdyYXBwZXIiLCJjcmVhdGVXYXlwb2ludCIsIndpbmRvdyIsImpRdWVyeSIsIldheXBvaW50IiwicHJvdG90eXBlIiwiaGFuZGxlciIsIndheXBvaW50Iiwid3JhcHBlciIsInByb3h5IiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm91dGVySGVpZ2h0IiwiJHdyYXBwZXIiLCJoZWlnaHQiLCJ0b2dnbGVDbGFzcyIsInN0dWNrQ2xhc3MiLCJjYWxsIiwid3JhcCIsInBhcmVudCIsImRlc3Ryb3kiLCJyZW1vdmVDbGFzcyIsInVud3JhcCIsIlN0aWNreSJdLCJtYXBwaW5ncyI6IkNBQUMsV0FBVyxZQUFhLFNBQVNBLEdBQUVDLEdBQUdDLEtBQUtDLFFBQVFDLEVBQUVDLFVBQVVDLEVBQUVDLFNBQVNQLEVBQUVPLFNBQVNOLEdBQUdDLEtBQUtNLFFBQVFOLEtBQUtDLFFBQVFLLFFBQVFOLEtBQUtPLFNBQVNMLEVBQUVGLEtBQUtNLFNBQVNOLEtBQUtRLGdCQUFnQlIsS0FBS1MsaUJBQWlCLEdBQUlQLEdBQUVRLE9BQU9DLE9BQU9QLEVBQUVNLE9BQU9FLFFBQVNkLEdBQUVlLFVBQVVKLGVBQWUsV0FBVyxHQUFJWCxHQUFFRSxLQUFLQyxRQUFRYSxPQUFRZCxNQUFLZSxTQUFTLEdBQUlYLEdBQUVGLEVBQUVDLFVBQVVILEtBQUtDLFNBQVNLLFFBQVFOLEtBQUtnQixRQUFRRixRQUFRWixFQUFFZSxNQUFNLFNBQVNmLEdBQUcsR0FBSUUsR0FBRUosS0FBS0MsUUFBUWlCLFVBQVVDLFFBQVFqQixJQUFJLEVBQUVILEVBQUVLLEVBQUVKLEtBQUtPLFNBQVNhLGFBQVksR0FBSSxFQUFHcEIsTUFBS3FCLFNBQVNDLE9BQU92QixHQUFHQyxLQUFLTyxTQUFTZ0IsWUFBWXZCLEtBQUtDLFFBQVF1QixXQUFXcEIsR0FBR04sR0FBR0EsRUFBRTJCLEtBQUt6QixLQUFLRSxJQUFJRixVQUFVRixFQUFFZSxVQUFVTCxjQUFjLFdBQVdSLEtBQUtDLFFBQVFlLFNBQVNoQixLQUFLTyxTQUFTbUIsS0FBSzFCLEtBQUtDLFFBQVFlLFNBQVNoQixLQUFLcUIsU0FBU3JCLEtBQUtPLFNBQVNvQixTQUFTM0IsS0FBS2dCLFFBQVFoQixLQUFLcUIsU0FBUyxJQUFJdkIsRUFBRWUsVUFBVWUsUUFBUSxXQUFXNUIsS0FBS08sU0FBU29CLFNBQVMsS0FBSzNCLEtBQUtnQixVQUFVaEIsS0FBS2UsU0FBU2EsVUFBVTVCLEtBQUtPLFNBQVNzQixZQUFZN0IsS0FBS0MsUUFBUXVCLFlBQVl4QixLQUFLQyxRQUFRZSxTQUFTaEIsS0FBS08sU0FBU3VCLFdBQVdoQyxFQUFFTyxVQUFVVyxRQUFRLGlDQUFpQ1EsV0FBVyxRQUFRTixVQUFVLGNBQWNkLEVBQUUyQixPQUFPakMiLCJmaWxlIjoic3RpY2t5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIWZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChzKXt0aGlzLm9wdGlvbnM9ZS5leHRlbmQoe30saS5kZWZhdWx0cyx0LmRlZmF1bHRzLHMpLHRoaXMuZWxlbWVudD10aGlzLm9wdGlvbnMuZWxlbWVudCx0aGlzLiRlbGVtZW50PWUodGhpcy5lbGVtZW50KSx0aGlzLmNyZWF0ZVdyYXBwZXIoKSx0aGlzLmNyZWF0ZVdheXBvaW50KCl9dmFyIGU9d2luZG93LmpRdWVyeSxpPXdpbmRvdy5XYXlwb2ludDt0LnByb3RvdHlwZS5jcmVhdGVXYXlwb2ludD1mdW5jdGlvbigpe3ZhciB0PXRoaXMub3B0aW9ucy5oYW5kbGVyO3RoaXMud2F5cG9pbnQ9bmV3IGkoZS5leHRlbmQoe30sdGhpcy5vcHRpb25zLHtlbGVtZW50OnRoaXMud3JhcHBlcixoYW5kbGVyOmUucHJveHkoZnVuY3Rpb24oZSl7dmFyIGk9dGhpcy5vcHRpb25zLmRpcmVjdGlvbi5pbmRleE9mKGUpPi0xLHM9aT90aGlzLiRlbGVtZW50Lm91dGVySGVpZ2h0KCEwKTpcIlwiO3RoaXMuJHdyYXBwZXIuaGVpZ2h0KHMpLHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3ModGhpcy5vcHRpb25zLnN0dWNrQ2xhc3MsaSksdCYmdC5jYWxsKHRoaXMsZSl9LHRoaXMpfSkpfSx0LnByb3RvdHlwZS5jcmVhdGVXcmFwcGVyPWZ1bmN0aW9uKCl7dGhpcy5vcHRpb25zLndyYXBwZXImJnRoaXMuJGVsZW1lbnQud3JhcCh0aGlzLm9wdGlvbnMud3JhcHBlciksdGhpcy4kd3JhcHBlcj10aGlzLiRlbGVtZW50LnBhcmVudCgpLHRoaXMud3JhcHBlcj10aGlzLiR3cmFwcGVyWzBdfSx0LnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC5wYXJlbnQoKVswXT09PXRoaXMud3JhcHBlciYmKHRoaXMud2F5cG9pbnQuZGVzdHJveSgpLHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLnN0dWNrQ2xhc3MpLHRoaXMub3B0aW9ucy53cmFwcGVyJiZ0aGlzLiRlbGVtZW50LnVud3JhcCgpKX0sdC5kZWZhdWx0cz17d3JhcHBlcjonPGRpdiBjbGFzcz1cInN0aWNreS13cmFwcGVyXCIgLz4nLHN0dWNrQ2xhc3M6XCJzdHVja1wiLGRpcmVjdGlvbjpcImRvd24gcmlnaHRcIn0saS5TdGlja3k9dH0oKTsiXX0=