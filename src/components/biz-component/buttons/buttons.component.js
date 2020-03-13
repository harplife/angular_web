(function() {
  ButtonsController.$inject = [];

  function ButtonsController() {}
  var buttons = {
    bindings: {},
    controller: ButtonsController,
    controllerAs: "buttons",
    templateUrl: "components/biz-component/buttons/buttons.html"
  };
  webapp.component("buttons", buttons);
})();
