!function(t,e,r){"use strict";var i={title:"PlayKit",version:"1.0.1",navbar:{type:"light",skin:"bg-faded"},menubar:{type:"inverse",skin:"bg-primary",folded:!1,top:!1}};r.settings={defaults:i||{},current:null,storageKey:"PlayKit_Settings_Key",storage:t.localStorage,init:function(){this.isStored()||(this.current=this.defaults,this.storage.setItem(this.storageKey,this._stringify(this.current))),this.current=this.retrive()},isStored:function(){return this.storage.hasOwnProperty(this.storageKey)&&!r.isEmptyObject(this.retrive())},retrive:function(){return this._parse(this.storage.getItem(this.storageKey))},clear:function(){return this.storage.clear(),this},save:function(){return this.storage.setItem(this.storageKey,this._stringify(this.current)),this},get:function(t){return this.current[t]},set:function(t,e){return"object"==typeof this.current[t]&&"object"==typeof e?r.extend(this.current[t],e):this.current[t]=e,this},extend:function(t){return"object"==typeof t&&r.extend(!0,this.defaults,t),this},_parse:function(t){return"string"==typeof t?JSON.parse(t):void 0},_stringify:function(t){return JSON.stringify(t)}}}(window,document,jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2dsb2JhbC9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJ0IiwiZSIsInIiLCJpIiwidGl0bGUiLCJ2ZXJzaW9uIiwibmF2YmFyIiwidHlwZSIsInNraW4iLCJtZW51YmFyIiwiZm9sZGVkIiwidG9wIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsImN1cnJlbnQiLCJzdG9yYWdlS2V5Iiwic3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluaXQiLCJ0aGlzIiwiaXNTdG9yZWQiLCJzZXRJdGVtIiwiX3N0cmluZ2lmeSIsInJldHJpdmUiLCJoYXNPd25Qcm9wZXJ0eSIsImlzRW1wdHlPYmplY3QiLCJfcGFyc2UiLCJnZXRJdGVtIiwiY2xlYXIiLCJzYXZlIiwiZ2V0Iiwic2V0IiwiZXh0ZW5kIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5Iiwid2luZG93IiwiZG9jdW1lbnQiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiJDQUFDLFNBQVNBLEVBQUVDLEVBQUVDLEdBQUcsWUFBYSxJQUFJQyxJQUFHQyxNQUFNLFVBQVVDLFFBQVEsUUFBUUMsUUFBUUMsS0FBSyxRQUFRQyxLQUFLLFlBQVlDLFNBQVNGLEtBQUssVUFBVUMsS0FBSyxhQUFhRSxRQUFPLEVBQUdDLEtBQUksR0FBS1QsR0FBRVUsVUFBVUMsU0FBU1YsTUFBTVcsUUFBUSxLQUFLQyxXQUFXLHVCQUF1QkMsUUFBUWhCLEVBQUVpQixhQUFhQyxLQUFLLFdBQVdDLEtBQUtDLGFBQWFELEtBQUtMLFFBQVFLLEtBQUtOLFNBQVNNLEtBQUtILFFBQVFLLFFBQVFGLEtBQUtKLFdBQVdJLEtBQUtHLFdBQVdILEtBQUtMLFdBQVdLLEtBQUtMLFFBQVFLLEtBQUtJLFdBQVdILFNBQVMsV0FBVyxNQUFPRCxNQUFLSCxRQUFRUSxlQUFlTCxLQUFLSixjQUFjYixFQUFFdUIsY0FBY04sS0FBS0ksWUFBWUEsUUFBUSxXQUFXLE1BQU9KLE1BQUtPLE9BQU9QLEtBQUtILFFBQVFXLFFBQVFSLEtBQUtKLGNBQWNhLE1BQU0sV0FBVyxNQUFPVCxNQUFLSCxRQUFRWSxRQUFRVCxNQUFNVSxLQUFLLFdBQVcsTUFBT1YsTUFBS0gsUUFBUUssUUFBUUYsS0FBS0osV0FBV0ksS0FBS0csV0FBV0gsS0FBS0wsVUFBVUssTUFBTVcsSUFBSSxTQUFTOUIsR0FBRyxNQUFPbUIsTUFBS0wsUUFBUWQsSUFBSStCLElBQUksU0FBUy9CLEVBQUVDLEdBQUcsTUFBTSxnQkFBaUJrQixNQUFLTCxRQUFRZCxJQUFJLGdCQUFpQkMsR0FBRUMsRUFBRThCLE9BQU9iLEtBQUtMLFFBQVFkLEdBQUdDLEdBQUdrQixLQUFLTCxRQUFRZCxHQUFHQyxFQUFFa0IsTUFBTWEsT0FBTyxTQUFTaEMsR0FBRyxNQUFNLGdCQUFpQkEsSUFBR0UsRUFBRThCLFFBQU8sRUFBR2IsS0FBS04sU0FBU2IsR0FBR21CLE1BQU1PLE9BQU8sU0FBUzFCLEdBQUcsTUFBTSxnQkFBaUJBLEdBQUVpQyxLQUFLQyxNQUFNbEMsT0FBRyxJQUFRc0IsV0FBVyxTQUFTdEIsR0FBRyxNQUFPaUMsTUFBS0UsVUFBVW5DLE1BQU1vQyxPQUFPQyxTQUFTQyIsImZpbGUiOiJhZG1pbi9nbG9iYWwvc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO3ZhciBpPXt0aXRsZTpcIlBsYXlLaXRcIix2ZXJzaW9uOlwiMS4wLjFcIixuYXZiYXI6e3R5cGU6XCJsaWdodFwiLHNraW46XCJiZy1mYWRlZFwifSxtZW51YmFyOnt0eXBlOlwiaW52ZXJzZVwiLHNraW46XCJiZy1wcmltYXJ5XCIsZm9sZGVkOiExLHRvcDohMX19O3Iuc2V0dGluZ3M9e2RlZmF1bHRzOml8fHt9LGN1cnJlbnQ6bnVsbCxzdG9yYWdlS2V5OlwiUGxheUtpdF9TZXR0aW5nc19LZXlcIixzdG9yYWdlOnQubG9jYWxTdG9yYWdlLGluaXQ6ZnVuY3Rpb24oKXt0aGlzLmlzU3RvcmVkKCl8fCh0aGlzLmN1cnJlbnQ9dGhpcy5kZWZhdWx0cyx0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VLZXksdGhpcy5fc3RyaW5naWZ5KHRoaXMuY3VycmVudCkpKSx0aGlzLmN1cnJlbnQ9dGhpcy5yZXRyaXZlKCl9LGlzU3RvcmVkOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3RvcmFnZS5oYXNPd25Qcm9wZXJ0eSh0aGlzLnN0b3JhZ2VLZXkpJiYhci5pc0VtcHR5T2JqZWN0KHRoaXMucmV0cml2ZSgpKX0scmV0cml2ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2VLZXkpKX0sY2xlYXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdG9yYWdlLmNsZWFyKCksdGhpc30sc2F2ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VLZXksdGhpcy5fc3RyaW5naWZ5KHRoaXMuY3VycmVudCkpLHRoaXN9LGdldDpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5jdXJyZW50W3RdfSxzZXQ6ZnVuY3Rpb24odCxlKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgdGhpcy5jdXJyZW50W3RdJiZcIm9iamVjdFwiPT10eXBlb2YgZT9yLmV4dGVuZCh0aGlzLmN1cnJlbnRbdF0sZSk6dGhpcy5jdXJyZW50W3RdPWUsdGhpc30sZXh0ZW5kOmZ1bmN0aW9uKHQpe3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiB0JiZyLmV4dGVuZCghMCx0aGlzLmRlZmF1bHRzLHQpLHRoaXN9LF9wYXJzZTpmdW5jdGlvbih0KXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdD9KU09OLnBhcnNlKHQpOnZvaWQgMH0sX3N0cmluZ2lmeTpmdW5jdGlvbih0KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkodCl9fX0od2luZG93LGRvY3VtZW50LGpRdWVyeSk7Il19
