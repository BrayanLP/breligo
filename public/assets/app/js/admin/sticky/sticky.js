!function(){"use strict";function t(s){this.options=e.extend({},i.defaults,t.defaults,s),this.element=this.options.element,this.$element=e(this.element),this.createWrapper(),this.createWaypoint()}var e=window.jQuery,i=window.Waypoint;t.prototype.createWaypoint=function(){var t=this.options.handler;this.waypoint=new i(e.extend({},this.options,{element:this.wrapper,handler:e.proxy(function(e){var i=this.options.direction.indexOf(e)>-1,s=i?this.$element.outerHeight(!0):"";this.$wrapper.height(s),this.$element.toggleClass(this.options.stuckClass,i),t&&t.call(this,e)},this)}))},t.prototype.createWrapper=function(){this.options.wrapper&&this.$element.wrap(this.options.wrapper),this.$wrapper=this.$element.parent(),this.wrapper=this.$wrapper[0]},t.prototype.destroy=function(){this.$element.parent()[0]===this.wrapper&&(this.waypoint.destroy(),this.$element.removeClass(this.options.stuckClass),this.options.wrapper&&this.$element.unwrap())},t.defaults={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"},i.Sticky=t}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL3N0aWNreS9zdGlja3kuanMiXSwibmFtZXMiOlsidCIsInMiLCJ0aGlzIiwib3B0aW9ucyIsImUiLCJleHRlbmQiLCJpIiwiZGVmYXVsdHMiLCJlbGVtZW50IiwiJGVsZW1lbnQiLCJjcmVhdGVXcmFwcGVyIiwiY3JlYXRlV2F5cG9pbnQiLCJ3aW5kb3ciLCJqUXVlcnkiLCJXYXlwb2ludCIsInByb3RvdHlwZSIsImhhbmRsZXIiLCJ3YXlwb2ludCIsIndyYXBwZXIiLCJwcm94eSIsImRpcmVjdGlvbiIsImluZGV4T2YiLCJvdXRlckhlaWdodCIsIiR3cmFwcGVyIiwiaGVpZ2h0IiwidG9nZ2xlQ2xhc3MiLCJzdHVja0NsYXNzIiwiY2FsbCIsIndyYXAiLCJwYXJlbnQiLCJkZXN0cm95IiwicmVtb3ZlQ2xhc3MiLCJ1bndyYXAiLCJTdGlja3kiXSwibWFwcGluZ3MiOiJDQUFDLFdBQVcsWUFBYSxTQUFTQSxHQUFFQyxHQUFHQyxLQUFLQyxRQUFRQyxFQUFFQyxVQUFVQyxFQUFFQyxTQUFTUCxFQUFFTyxTQUFTTixHQUFHQyxLQUFLTSxRQUFRTixLQUFLQyxRQUFRSyxRQUFRTixLQUFLTyxTQUFTTCxFQUFFRixLQUFLTSxTQUFTTixLQUFLUSxnQkFBZ0JSLEtBQUtTLGlCQUFpQixHQUFJUCxHQUFFUSxPQUFPQyxPQUFPUCxFQUFFTSxPQUFPRSxRQUFTZCxHQUFFZSxVQUFVSixlQUFlLFdBQVcsR0FBSVgsR0FBRUUsS0FBS0MsUUFBUWEsT0FBUWQsTUFBS2UsU0FBUyxHQUFJWCxHQUFFRixFQUFFQyxVQUFVSCxLQUFLQyxTQUFTSyxRQUFRTixLQUFLZ0IsUUFBUUYsUUFBUVosRUFBRWUsTUFBTSxTQUFTZixHQUFHLEdBQUlFLEdBQUVKLEtBQUtDLFFBQVFpQixVQUFVQyxRQUFRakIsSUFBSSxFQUFFSCxFQUFFSyxFQUFFSixLQUFLTyxTQUFTYSxhQUFZLEdBQUksRUFBR3BCLE1BQUtxQixTQUFTQyxPQUFPdkIsR0FBR0MsS0FBS08sU0FBU2dCLFlBQVl2QixLQUFLQyxRQUFRdUIsV0FBV3BCLEdBQUdOLEdBQUdBLEVBQUUyQixLQUFLekIsS0FBS0UsSUFBSUYsVUFBVUYsRUFBRWUsVUFBVUwsY0FBYyxXQUFXUixLQUFLQyxRQUFRZSxTQUFTaEIsS0FBS08sU0FBU21CLEtBQUsxQixLQUFLQyxRQUFRZSxTQUFTaEIsS0FBS3FCLFNBQVNyQixLQUFLTyxTQUFTb0IsU0FBUzNCLEtBQUtnQixRQUFRaEIsS0FBS3FCLFNBQVMsSUFBSXZCLEVBQUVlLFVBQVVlLFFBQVEsV0FBVzVCLEtBQUtPLFNBQVNvQixTQUFTLEtBQUszQixLQUFLZ0IsVUFBVWhCLEtBQUtlLFNBQVNhLFVBQVU1QixLQUFLTyxTQUFTc0IsWUFBWTdCLEtBQUtDLFFBQVF1QixZQUFZeEIsS0FBS0MsUUFBUWUsU0FBU2hCLEtBQUtPLFNBQVN1QixXQUFXaEMsRUFBRU8sVUFBVVcsUUFBUSxpQ0FBaUNRLFdBQVcsUUFBUU4sVUFBVSxjQUFjZCxFQUFFMkIsT0FBT2pDIiwiZmlsZSI6ImFkbWluL3N0aWNreS9zdGlja3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KHMpe3RoaXMub3B0aW9ucz1lLmV4dGVuZCh7fSxpLmRlZmF1bHRzLHQuZGVmYXVsdHMscyksdGhpcy5lbGVtZW50PXRoaXMub3B0aW9ucy5lbGVtZW50LHRoaXMuJGVsZW1lbnQ9ZSh0aGlzLmVsZW1lbnQpLHRoaXMuY3JlYXRlV3JhcHBlcigpLHRoaXMuY3JlYXRlV2F5cG9pbnQoKX12YXIgZT13aW5kb3cualF1ZXJ5LGk9d2luZG93LldheXBvaW50O3QucHJvdG90eXBlLmNyZWF0ZVdheXBvaW50PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5vcHRpb25zLmhhbmRsZXI7dGhpcy53YXlwb2ludD1uZXcgaShlLmV4dGVuZCh7fSx0aGlzLm9wdGlvbnMse2VsZW1lbnQ6dGhpcy53cmFwcGVyLGhhbmRsZXI6ZS5wcm94eShmdW5jdGlvbihlKXt2YXIgaT10aGlzLm9wdGlvbnMuZGlyZWN0aW9uLmluZGV4T2YoZSk+LTEscz1pP3RoaXMuJGVsZW1lbnQub3V0ZXJIZWlnaHQoITApOlwiXCI7dGhpcy4kd3JhcHBlci5oZWlnaHQocyksdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcyh0aGlzLm9wdGlvbnMuc3R1Y2tDbGFzcyxpKSx0JiZ0LmNhbGwodGhpcyxlKX0sdGhpcyl9KSl9LHQucHJvdG90eXBlLmNyZWF0ZVdyYXBwZXI9ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMud3JhcHBlciYmdGhpcy4kZWxlbWVudC53cmFwKHRoaXMub3B0aW9ucy53cmFwcGVyKSx0aGlzLiR3cmFwcGVyPXRoaXMuJGVsZW1lbnQucGFyZW50KCksdGhpcy53cmFwcGVyPXRoaXMuJHdyYXBwZXJbMF19LHQucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LnBhcmVudCgpWzBdPT09dGhpcy53cmFwcGVyJiYodGhpcy53YXlwb2ludC5kZXN0cm95KCksdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuc3R1Y2tDbGFzcyksdGhpcy5vcHRpb25zLndyYXBwZXImJnRoaXMuJGVsZW1lbnQudW53cmFwKCkpfSx0LmRlZmF1bHRzPXt3cmFwcGVyOic8ZGl2IGNsYXNzPVwic3RpY2t5LXdyYXBwZXJcIiAvPicsc3R1Y2tDbGFzczpcInN0dWNrXCIsZGlyZWN0aW9uOlwiZG93biByaWdodFwifSxpLlN0aWNreT10fSgpOyJdfQ==