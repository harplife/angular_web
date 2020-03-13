(function() {
  var module,
    __slice = [].slice;

  module = angular.module("fa.directive.borderLayout", []);

  module.factory("paneManager", function() {
    return {
      panes: {},
      get: function(paneId) {
        return this.panes[paneId];
      },
      set: function(paneId, pane) {
        return this.panes[paneId] = pane;
      },
      remove: function(paneId) {
        return delete this.panes[paneId];
      }
    };
  });

  module.directive("faPane", [
    "$window", "$rootScope", "paneManager", function($window, $rootScope, paneManager) {
      var Region, generateSerialId, getHandleStyle, getOrientation, getScrollerStyle;
      Region = (function() {
        function Region(_at_width, _at_height, _at_top, _at_right, _at_bottom, _at_left) {
          this.width = _at_width != null ? _at_width : 0;
          this.height = _at_height != null ? _at_height : 0;
          this.top = _at_top != null ? _at_top : 0;
          this.right = _at_right != null ? _at_right : 0;
          this.bottom = _at_bottom != null ? _at_bottom : 0;
          this.left = _at_left != null ? _at_left : 0;
        }

        Region.prototype.clone = function() {
          return new Region(this.width, this.height, this.top, this.right, this.bottom, this.left);
        };

        Region.prototype.calculateSize = function(orientation, target) {
          var available, matches, terms, total;
          if (target == null) {
            target = 0;
          }
          total = this.getSize(orientation);
          available = this.getAvailableSize(orientation);
          if (angular.isNumber(target)) {
            if (target >= 1) {
              return Math.round(target);
            }
            if (target >= 0) {
              return Math.round(target * total);
            }
            return 0;
          }
          target = target.replace(/\s+/mg, "");
          if ((terms = target.split("-")).length > 1) {
            return this.calculateSize(orientation, terms.shift()) - this.calculateSize(orientation, terms.join("+"));
          }
          if ((terms = target.split("+")).length > 1) {
            return this.calculateSize(orientation, terms.shift()) + this.calculateSize(orientation, terms.join("+"));
          }
          if (matches = target.match(/^(\d+)px$/)) {
            return parseInt(matches[1], 10);
          }
          if (matches = target.match(/^(\d+)$/)) {
            return parseInt(matches[1], 10);
          }
          if (matches = target.match(/^(\d+(?:\.\d+)?)&$/)) {
            return Math.round(available * parseFloat(matches[1]) / 100);
          }
          if (matches = target.match(/^(\d+(?:\.\d+)?)%$/)) {
            return Math.round(total * parseFloat(matches[1]) / 100);
          }
          throw new Error("Unsupported size: " + target);
        };

        Region.prototype.consume = function(anchor, size) {
          var style;
          if (size == null) {
            size = 0;
          }

          switch (anchor) {
            case "north":
              style = {
                top: this.top + "px",
                right: this.right + "px",
                bottom: "auto",
                left: this.left + "px",
                height: size + "px",
                width: "auto"
              };
              this.top += size;
              break;
            case "east":
              style = {
                top: this.top + "px",
                right: this.right + "px",
                bottom: this.bottom + "px",
                left: "auto",
                width: size + "px",
                height: "auto"
              };
              this.right += size;
              break;
            case "south":
              style = {
                top: "auto",
                right: this.right + "px",
                bottom: this.bottom + "px",
                left: this.left + "px",
                height: size + "px",
                width: "auto"
              };
              this.bottom += size;
              break;
            case "west":
              style = {
                top: this.top + "px",
                right: "auto",
                bottom: this.bottom + "px",
                left: this.left + "px",
                width: size + "px",
                height: "auto"
              };
              this.left += size;
          }
          if (size === 0) {
            style.display = "none";
          }
          return style;
        };

        Region.prototype.getInnerRegion = function() {
          return new Region(this.width - this.right - this.left, this.height - this.top - this.bottom);
        };

        Region.prototype.getSize = function(orientation) {
          switch (orientation) {
            case "vertical":
              return this.height;
            case "horizontal":
              return this.width;
          }
        };

        Region.prototype.getAvailableSize = function(orientation) {
          switch (orientation) {
            case "vertical":
              return this.height - this.top - this.bottom;
            case "horizontal":
              return this.width - this.right - this.left;
          }
        };

        Region.prototype.toString = function() {
          return "{" + this.top + ", " + this.right + ", " + this.bottom + ", " + this.left + "}, {" + this.width + ", " + this.height + "}";
        };

        return Region;

      })();
      getOrientation = function(anchor) {
        switch (anchor) {
          case "north":
          case "south":
            return "vertical";
          case "east":
          case "west":
            return "horizontal";
        }
      };
      getScrollerStyle = function(anchor, size) {
        var style;
        style = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
        if (size) {
          switch (anchor) {
            case "north":
              style.bottom = "auto";
              style.height = size + "px";
              break;
            case "east":
              style.left = "auto";
              style.width = size + "px";
              break;
            case "south":
              style.top = "auto";
              style.height = size + "px";
              break;
            case "west":
              style.right = "auto";
              style.width = size + "px";
          }
        }
        return style;
      };
      getHandleStyle = function(anchor, region, handleSize) {
        switch (anchor) {
          case "north":
            return {
              height: (region.calculateSize('vertical', handleSize)) + "px",
              right: 0,
              left: 0,
              bottom: 0
            };
          case "south":
            return {
              height: (region.calculateSize('vertical', handleSize)) + "px",
              right: 0,
              left: 0,
              top: 0
            };
          case "east":
            return {
              width: (region.calculateSize('horizontal', handleSize)) + "px",
              top: 0,
              bottom: 0,
              left: 0
            };
          case "west":
            return {
              width: (region.calculateSize('horizontal', handleSize)) + "px",
              top: 0,
              bottom: 0,
              right: 0
            };
        }
      };
      generateSerialId = (function() {
        var counter, fun;
        counter = 0;
        fun = function() {
          return counter++;
        };
        fun.peek = function() {
          return counter;
        };
        return fun;
      })();
      return {
        restrict: "A",
        replace: true,
        require: "faPane",
        priority: 1,
        transclude: "element",
        scope: {
          anchor: "@paneAnchor",
          paneId: "@faPane",
          size: "@paneSize",
          min: "@paneMin",
          max: "@paneMax",
          handle: "@paneHandle",
          closed: "=paneClosed",
          closable: "@paneNoToggle"
        },
        template: "<div class=\"fa-pane pane-{{$pane.id}}\">\n  <div class=\"fa-pane-overlay\"></div>\n  <div class=\"fa-pane-handle\" fa-pane-resizer>\n    <div ng-if=\"!paneNotoggle\" class=\"fa-pane-toggle\" ng-click=\"$pane.toggle()\"></div>\n  </div>\n</div>",
        controllerAs: "$pane",
        controller: function() {
          var $pane, Pane;
          return $pane = new (Pane = (function() {
            function Pane() {
              this.children = [];
              this.closed = false;
              this.max = Number.MAX_VALUE;
              this.min = 0;
            }

            Pane.prototype.$scheduleReflow = function() {
              if ($pane.parent) {
                return $pane.parent.$scheduleReflow();
              } else if (!$pane.$reflowScheduled) {
                $pane.$reflowScheduled = true;
                return $rootScope.$evalAsync(function() {
                  if ($pane.$reflowScheduled) {
                    $pane.reflow();
                  }
                  return $pane.$reflowScheduled = false;
                });
              }
            };

            Pane.prototype.getOptions = function() {
              return {
                anchor: this.anchor,
                targetSize: this.targetSize,
                size: this.size,
                min: this.min,
                max: this.max,
                handle: {
                  open: this.handleSizeOpen || 0,
                  closed: this.handleSizeClosed || 0
                },
                closed: this.closed
              };
            };

            Pane.prototype.setOptions = function(options) {
              if (options == null) {
                options = {};
              }
              if (options.anchor != null) {
                this.setAnchor(options.anchor);
              }
              if (options.size != null) {
                this.setTargetSize(options.size);
              }
              if (options.min != null) {
                this.setMinSize(options.min);
              }
              if (options.max != null) {
                this.setMaxSize(options.max);
              }
              if (options.handle != null) {
                this.setHandleSize(options.handle);
              }
              if (options.closed != null) {
                return this.toggle(!options.closed);
              }
            };

            Pane.prototype.setAnchor = function(_at_anchor) {
              this.anchor = _at_anchor;
              return this.$scheduleReflow();
            };

            Pane.prototype.setTargetSize = function(_at_targetSize) {
              this.targetSize = _at_targetSize;
              return this.$scheduleReflow();
            };

            Pane.prototype.setMinSize = function(_at_min) {
              this.min = _at_min;
              return this.$scheduleReflow();
            };

            Pane.prototype.setMaxSize = function(_at_max) {
              this.max = _at_max;
              return this.$scheduleReflow();
            };

            Pane.prototype.setHandleSize = function(handleSize) {
              if ((handleSize != null ? handleSize.open : void 0) || (handleSize != null ? handleSize.closed : void 0)) {
                this.handleSizeOpen = handleSize.open || 0;
                this.handleSizeClosed = handleSize.closed || 0;
              } else {
                this.handleSizeOpen = this.handleSizeClosed = parseInt(handleSize, 10);
              }
              return this.$scheduleReflow();
            };

            Pane.prototype.addChild = function(child) {
              child.parent = $pane;
              this.children.push(child);
              if (this.children.length) {
                $pane.$containerEl.addClass("fa-pane-parent");
              }
              return $pane.$scheduleReflow();
            };

            Pane.prototype.getOrientation = function() {
              return getOrientation($pane.anchor);
            };

            Pane.prototype.onHandleDown = function() {
              return $pane.$containerEl.addClass("active");
            };

            Pane.prototype.onHandleUp = function() {
              $pane.$containerEl.removeClass("active");
              return $pane.$scheduleReflow();
            };

            Pane.prototype.removeChild = function(child) {
              var idx;
              if (!(0 > (idx = this.children.indexOf(child)))) {
                this.children.splice(idx, 1);
              }
              if (!this.children.length) {
                $pane.$containerEl.removeClass("fa-pane-parent");
              }
              return $pane.$scheduleReflow();
            };

            Pane.prototype.reflow = function(region) {
              var handleSize, height, orientation, size, styleContainer, styleHandle, styleScroller, width, _ref;
              width = $pane.$containerEl[0].offsetWidth;
              height = $pane.$containerEl[0].offsetHeight;
              region || (region = new Region(width, height));
              if ((_ref = $pane.anchor) === "north" || _ref === "east" || _ref === "south" || _ref === "west") {
                $pane.$containerEl.removeClass("fa-pane-orientation-vertical");
                $pane.$containerEl.removeClass("fa-pane-orientation-horizontal");
                orientation = getOrientation($pane.anchor);
                $pane.$containerEl.addClass("fa-pane-orientation-" + orientation);
                handleSize = region.calculateSize(orientation, !$pane.closed && $pane.handleSizeOpen || $pane.handleSizeClosed);
                if ($pane.closed) {
                  size = handleSize;
                } else {
                  size = region.calculateSize(orientation, !$pane.closed && $pane.targetSize || handleSize);
                  size = Math.min(size, region.calculateSize(orientation, $pane.max));
                  size = Math.max(size, region.calculateSize(orientation, $pane.min));
                  size = Math.min(size, region.getAvailableSize(orientation));
                  size = Math.max(size, handleSize);
                }
                this.size = size;
                styleContainer = region.consume($pane.anchor, size);
                styleScroller = getScrollerStyle($pane.anchor, size - handleSize);
                styleHandle = getHandleStyle($pane.anchor, region, handleSize);
                $pane.$containerEl.attr("style", "").css(styleContainer);
                $pane.$overlayEl.attr("style", "").css(styleScroller);
                $pane.$handleEl.attr("style", "").css(styleHandle);
                $pane.$scrollerEl.attr("style", "").css(styleScroller);
                if ($rootScope.gVariable && $rootScope.gVariable.layoutBoardSize) {
                  $rootScope.gVariable.layoutBoardSize = size + "px";
                }
              } else {

                // SZ Custom HJH GJ
                // 방향에 따라 사이즈 조절
                var offset = $pane.$containerEl.offset();
                var tempHeight = ($(window).height() - offset.top) + "px";
                var $parentObj = $pane.$containerEl.closest("[pane-wrap-anchor]")
                var anchor = $parentObj.attr("pane-wrap-anchor");
                var sheight = "auto";
                var swidth = "auto";
                if(!$pane.$containerEl.hasClass("pane-root")) sheight = "auto";
                else {
                  if(anchor != "west" && anchor != "north") {
                    swidth = "100%";
                    sheight = tempHeight;
                    $parentObj.find("[fa-pane]").css("height","auto");
                    $parentObj.find("[fa-pane]").css("width","auto");
                  } else {
                    sheight = tempHeight;
                  }
                }

                $pane.$containerEl.css({
                  top: region.top + "px",
                  right: region.right + "px",
                  bottom: region.bottom + "px",
                  left: region.left + "px",
                  width: swidth,
                  height: sheight
                });
              }

              $pane.$region = region.clone();


              // HJH HJ 19.07.02
              // anchor == west 일경우
              // 자식 엘리먼트의 사이즈 조절을 하기 위해 fapane-size Attribute 속성을 추가
              // 나머지는 CSS에서 작업
              if($pane.anchor == "west") {
                var $rootPane = $pane.parent;
                var $first = $rootPane.children[0];
                var $second = $rootPane.children[1];
                var fw = $rootPane.children[0].size, sw = $rootPane.$region.width - fw;
                if (fw > 992) $first.$containerEl.attr('fapane-size', "lg");
                else if (fw > 768) $first.$containerEl.attr('fapane-size', "md");
                else if (fw > 650) $first.$containerEl.attr('fapane-size', "sm");
                else $first.$containerEl.attr('fapane-size', "xs");
                if (sw > 992) $second.$containerEl.attr('fapane-size', "lg");
                else if (sw > 768) $second.$containerEl.attr('fapane-size', "md");
                else if (sw > 650) $second.$containerEl.attr('fapane-size', "sm");
                else $second.$containerEl.attr('fapane-size', "xs");
              } else {
                if($pane.anchor != undefined) $('[fapane-size]').removeAttr('fapane-size');
              }

              return $pane.reflowChildren(region.getInnerRegion());
            };

            Pane.prototype.reflowChildren = function(region) {
              var child, _i, _len, _ref, _results;
              region || (region = $pane.$region);
              $pane.children.sort(function(a, b) {
                return a.order - b.order;
              });
              _ref = $pane.children;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _results.push(child.reflow(region));
              }
              return _results;
            };

            Pane.prototype.resize = function(size) {
              if (size == null) {
                size = $pane.targetSize;
              }
              $pane.targetSize = size;
              $pane.parent.reflowChildren($pane.parent.$region.getInnerRegion());
              if (size !== $pane.size) {
                return $pane.$containerEl.addClass("fa-pane-constrained");
              } else {
                return $pane.$containerEl.removeClass("fa-pane-constrained");
              }
            };

            Pane.prototype.toggle = function(open) {
              var reflow;
              if (open == null) {
                open = !!$pane.closed;
              }
              $pane.closed = !open;
              reflow = function() {
                if ($pane.parent) {
                  return $pane.parent.$scheduleReflow();
                } else {
                  return $pane.$scheduleReflow();
                }
              };
              if ($pane.closed) {
                $pane.$containerEl.addClass("fa-pane-closed");
              } else {
                $pane.$containerEl.removeClass("fa-pane-closed");
              }
              return reflow();
            };

            return Pane;

          })());
        },
        compile: function($el, $attrs, $transclude) {
          var link, serialId;
          serialId = generateSerialId();
          return link = function($scope, $el, $attrs, $pane) {
            var $directiveScope, $transcludeScope;
            $directiveScope = $scope.$parent.$new();
            $directiveScope.$pane = $scope.$pane = $pane;
            $transcludeScope = $directiveScope.$new();
            if ($pane.order == null) {
              $pane.order = serialId;
            }
            $pane.$isolateScope = $scope;
            $pane.$directiveScope = $directiveScope;
            $pane.$transcludeScope = $transcludeScope;
            return $transclude($transcludeScope, function(clone) {
              clone.addClass("fa-pane-scroller");
              $el.append(clone);
              $pane.$containerEl = $el;
              $pane.$overlayEl = $el.children().eq(0);
              $pane.$handleEl = $el.children().eq(1);
              $pane.$scrollerEl = $el.children().eq(2);
              $scope.$watch("anchor", function(anchor) {
                return $pane.setAnchor(anchor);
              });
              $scope.$watch("size", function(targetSize) {
                return $pane.setTargetSize(targetSize);
              });
              $scope.$watch("closed", function(closed) {
                return $pane.toggle(!closed);
              });
              $scope.$watch("min", function(min) {
                return $pane.setMinSize(min != null ? min : 0);
              });
              $scope.$watch("max", function(max) {
                return $pane.setMaxSize(max != null ? max : Number.MAX_VALUE);
              });
              $scope.$watch("paneId", function(paneId, prevPaneId) {
                if (prevPaneId) {
                  paneManager.remove(prevPaneId);
                }
                paneManager.set(paneId, $pane);
                return $pane.id = paneId;
              });
              $scope.$watch("handle", function(handle) {
                return $pane.setHandleSize(handle);
              });
              $pane.$directiveScope.$on("fa-pane-attach", function(e, child) {
                if (child !== $pane) {
                  e.stopPropagation();
                  return $pane.addChild(child);
                }
              });
              $pane.$directiveScope.$on("fa-pane-detach", function(e, child) {
                if (child !== $pane) {
                  e.stopPropagation();
                  return $pane.removeChild(child);
                }
              });
              $window.addEventListener("resize", function(e) {
                e.stopPropagation();
                return $pane.$scheduleReflow();
              });
              $pane.$directiveScope.$on("$stateChangeSuccess", function() {

                return $pane.$scheduleReflow();
              });
              $pane.$directiveScope.$emit("fa-pane-attach", $pane);
              return $pane.$directiveScope.$on("$destroy", function() {
                return $pane.$directiveScope.$emit("fa-pane-detach", $pane);
              });
            });
          };
        }
      };
    }
  ]);

  module.directive("faPaneToggle", [
    "paneManager", function(paneManager) {
      return {
        link: function($scope, $el, $attrs) {
          return $attrs.$observe("faPaneToggle", function(paneId) {});
        }
      };
    }
  ]);

  module.directive("faPaneResizer", [
    "$window", function($window) {
      var throttle;
      throttle = function(delay, fn) {
        var throttled;
        throttled = false;
        return function() {
          if (throttled) {
            return;
          }
          throttled = true;
          setTimeout(function() {
            return throttled = false;
          }, delay);
          return fn.call.apply(fn, [this].concat(__slice.call(arguments)));
        };
      };
      return {
        restrict: "A",
        link: function($scope, $element, $attrs, $pane) {
          var clickRadius, clickTime, el;
          $pane || ($pane = $scope.$pane);
          el = $element[0];
          clickRadius = 5;
          clickTime = 300;
          $scope.$watch((function() {
            return $pane.getOrientation();
          }), function(orientation) {
            $element.removeClass("vertical");
            $element.removeClass("horizontal");
            switch (orientation) {
              case "vertical":
                return $element.addClass("vertical");
              case "horizontal":
                return $element.addClass("horizontal");
            }
          });
          return el.addEventListener("mousedown", function(e) {
            var anchor, coord, handleMouseMove, handleMouseMoveThrottled, handleMouseUp, scale, startCoord, startPos, startSize, startTime;
            if (e.button !== 0) {
              return;
            }
            anchor = $pane.anchor;
            if (anchor === "north" || anchor === "south") {
              coord = "screenY";
            } else if (anchor === "west" || anchor === "east") {
              coord = "screenX";
            }
            if (anchor === "north" || anchor === "west") {
              scale = 1;
            } else if (anchor === "south" || anchor === "east") {
              scale = -1;
            }
            startPos = {
              x: e.screenX,
              y: e.screenY
            };
            startCoord = e[coord];
            startSize = $pane.size;
            startTime = Date.now();
            el.unselectable = "on";
            el.onselectstart = function() {
              return false;
            };
            el.style.userSelect = el.style.MozUserSelect = "none";
            e.preventDefault();
            e.defaultPrevented = true;
            e = null;
            handleMouseMove = function(e) {
              $pane.$containerEl.addClass("fa-pane-resizing");

              $scope.$apply(function() {
                var targetSize;
                // by rohbi on 2019.06.17
                targetSize = startSize + scale * (e[coord] - startCoord);
                //targetSize = startSize + scale * (startCoord - e[coord]);
                return $pane.resize(targetSize);
              });
              e.preventDefault();
              e.defaultPrevented = true;
              return e = null;
            };
            handleMouseUp = function(e) {
              var cleanup, displacementSq, timeElapsed;
              displacementSq = Math.pow(e.screenX - startPos.x, 2) + Math.pow(e.screenY - startPos.y, 2);
              timeElapsed = Date.now() - startTime;
              $window.removeEventListener("mousemove", handleMouseMoveThrottled, true);
              $window.removeEventListener("mouseup", handleMouseUp, true);
              cleanup = function() {
                $pane.$containerEl.removeClass("fa-pane-resizing");
                e.preventDefault();
                e.defaultPrevented = true;
                return e = null;
              };
              if (displacementSq <= Math.pow(clickRadius, 2) && timeElapsed <= clickTime) {
                cleanup();
                return;
              }
              handleMouseMove(e);
              return cleanup();
            };
            handleMouseMoveThrottled = throttle(10, handleMouseMove);
            $window.addEventListener("mouseup", handleMouseUp, true);
            return $window.addEventListener("mousemove", handleMouseMoveThrottled, true);
          });
        }
      };
    }
  ]);

}).call(this);
