import{slicedToArray as e,objectSpread2 as r,toConsumableArray as t,asyncToGenerator as n,regeneratorRuntime as a}from"./_virtual/_rollupPluginBabelHelpers.js";import o from"react";import{set as u,debounce as i,pick as s,omit as c,skipParams as l}from"./utils/index.js";var d=function(e,n){switch(n.type){case"set":return Array.isArray(e)?t(n.payload):r(r({},e),n.payload);case"update":var a=e[n.index];return e[n.index]=r(r({},a),n.value),t(e);case"add":return"number"==typeof n.position?e.splice(n.position,0,n.value):"start"===n.position?e.unshift(n.value):e.push(n.value),t(e);case"remove":return e.splice(e.findIndex(n.condition),1),t(e);default:return Array.isArray(e)?t(e):r(r({},e),n.payload)}},f=function(f){var p=new AbortController,y=o.useRef(!f.disabledOnDidMount),v=o.useState({}),m=e(v,2),h=m[0],A=m[1],b=o.useState(!1),g=e(b,2),x=g[0],w=g[1],j=o.useState(!1),D=e(j,2),E=D[0],O=D[1],k=o.useReducer(d,(null==f?void 0:f.defaultValue)||{}),S=e(k,2),C=S[0],M=S[1],R=o.useCallback((function(t){"function"==typeof t&&Object.assign(h,t(state)),A((function(n){for(var a=0,o=Object.entries(t);a<o.length;a++){var i=e(o[a],2),s=i[0],c=i[1];u(n,c,s)}return r({},n)}))}),[h]),T=function(){var e=n(a().mark((function e(){var r,t;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,O(!0),r={ctr:p,params:l(h)},e.next=5,f.service(r);case 5:t=e.sent,M({type:"set",payload:f&&f.selector(t)||t||{}}),f.getData&&f.getData(f&&f.selector(t)||t||{}),e.next=12;break;case 10:e.prev=10,e.t0=e.catch(0);case 12:return e.prev=12,O(!1),e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[0,10,12,15]])})));return function(){return e.apply(this,arguments)}}();o.useEffect((function(){return y.current?i(T,f.debounceTime||100)():y.current=!0,function(){p.abort()}}),[h,x].concat(t((null==f?void 0:f.deps)||[])));var I=o.useMemo((function(){return C}),[C]),P=o.useMemo((function(){return h}),[h]);return{isEmpty:Array.isArray(C)?0===C.length:0===Object.keys(C),loading:E,data:I,query:P,update:function(e,r){if(!Array.isArray(C))throw new Error("Data must Array");if(C.length>0){var t=C.findIndex(e);t>-1&&M({type:"update",index:t,value:r})}},add:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"end";if(!Array.isArray(C))throw new Error("Data must Array");M({type:"add",position:r,value:e})},destroy:function(e){if(!Array.isArray(C))throw new Error("Data must Array");M({type:"remove",condition:e})},getQuery:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return void 0===h[e]&&void 0!==r?r:h[e]},setQuery:R,clear:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;w((function(e){return!e})),A((function(r){return e&&e.except?s(r,e.except):e&&e.only?c(r,e.only):{}}))},refresh:function(){w((function(e){return!e}))},has:function(e){return h.hasOwnProperty(e)},cancel:function(){p.abort()}}};export{f as default};