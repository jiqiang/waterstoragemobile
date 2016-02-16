describe('Controller Tests', function() {

  var ctr, scope;

  beforeEach(module('watsto.controllers'));
  
  beforeEach(inject(function($controller, $rootScope) {

    // create a scope
    $rootScope.scopeState = {};
    scope = $rootScope.$new();

    // create a controller
    ctrl = $controller('AppCtrl', { $scope : scope });

  }));

  it('Should have a platform assigned', function() {
    expect(scope.platform).not.toBe(null);
  });
});
