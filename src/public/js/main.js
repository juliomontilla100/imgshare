(function(exports) {
    'use strict';
 
    function PinterestGrid(options) {
       this.settings = Object.assign({
          delay: 100,
          shorterFirst: true,
          gutter: 6
       }, options);
 
       this.loaded = false;
       this.transform = _getTransformProperty();
 
       this.$container = options.container instanceof Node ?
          options.container :
          document.querySelector(options.container);
 
       if (!this.$container) {
          return false;
       }
 
       this.$itemCollection = options.item instanceof NodeList ?
          options.item :
          this.$container.querySelectorAll(options.item);
 
       if (!this.$itemCollection || this.$itemCollection.length === 0) {
          return false;
       }
 
       if (!this.loaded) { return this.init(); }
    }
 
    PinterestGrid.prototype.init = function() {
       this.loaded = true;
 
       var gutter = parseInt(this.settings.gutter);
       var callback = this.settings.callback;
 
       this.$container.style.width = '';
 
       var containerWidth = this.$container.getBoundingClientRect().width;
       var firstChildWidth = this.$itemCollection[0].getBoundingClientRect().width + gutter;
       var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
 
       containerWidth = (firstChildWidth * cols + gutter) + 'px';
       this.$container.style.width = containerWidth;
       this.$container.style.position = 'relative';
 
       var itemsGutter = [];
       var itemsPosX = [];
 
       for (var g = 0; g < cols; g++) {
          itemsPosX.push(g * firstChildWidth + gutter);
          itemsGutter.push(gutter);
       }
       
       Array.from(this.$itemCollection).forEach(function (item, i) {        
          if (this.settings.shorterFirst) {
             var itemIndex = itemsGutter.slice(0).sort(function(a, b) { return a - b }).shift();
             itemIndex = itemsGutter.indexOf(itemIndex);
          } else {
             var itemIndex = i % cols;
          }
          
          var posX = itemsPosX[itemIndex];
          var posY = itemsGutter[itemIndex];
 
          item.style.position = 'absolute';
          item.style.webkitBackfaceVisibility = item.style.backfaceVisibility = 'hidden';
          item.style[this.transform] = 'translate3D(' + posX + 'px,' + posY + 'px, 0)';
          
          itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
 
          if (!/loaded/.test(item.className)) {
             setTimeout(function() {
                item.classList.add(item.className.split(' ')[0] + '--loaded');
             }, (parseInt(this.settings.delay) * i));
          }
          
       }.bind(this));
 
       var containerHeight = itemsGutter.slice(0).sort(function(a, b) { return a - b }).pop();
       this.$container.style.height = containerHeight + 'px';
       
       if (!/loaded/.test(this.$container.className)) {
          this.$container.classList.add(this.$container.className.split(' ')[0] + '--loaded');
       }
 
       if (typeof callback === 'function') {
          callback(this.$itemCollection);
       }
    }
 
    function _getTransformProperty() {
       var style = document.createElement('div').style;
       var transform;
       var vendorProp;
 
       if (undefined !== style[vendorProp = 'webkitTransform']) {
          transform = vendorProp;
       }
 
       if (undefined !== style[vendorProp = 'msTransform']) {
          transform = vendorProp;
       }
 
       if (undefined !== style[vendorProp = 'transform']) {
          transform = vendorProp;
       }
 
       return transform;
    }
 
    // AMD
    if (typeof define === 'function' && define.amd) {
       define(function() {
          return PinterestGrid
       });
    }
 
    // CommonJS
    else if (typeof module !== 'undefined' && module.exports) {
       module.exports = PinterestGrid;
    }
 
    // Global Property
    else {
       exports.PinterestGrid = PinterestGrid;
    }
    
 }(this));
 
 (function() {
 
    var grid = new PinterestGrid({
       delay: 100,
       container: '.cards',
       item: '.card',
       gutter: 20
    });
 
    window.addEventListener('resize', function() {
       grid.init();
    });   
    
    Array.from(document.querySelectorAll('.card img')).forEach(function(item) {
       item.addEventListener('load', function() {
          grid.init();
       }, false);
    });
 
 })();