/* IRON & FAITH — main.js : bootstrap */
(function () {
  'use strict';
  function boot(){ window.UI.init(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
