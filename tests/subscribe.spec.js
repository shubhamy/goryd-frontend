describe('subscribe', function() {
  beforeEach(module('app'));

  var $controller, $scope, ctrl, $httpBackend;

  beforeEach(inject(function(_$controller_, $rootScope, _$httpBackend_) {
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    ctrl = $controller('subscribe', {
      $scope: $scope,
    });
  }));

  it('should send message to server successfully and change thanks value', function() {
    $scope.email = 'test@goryd.in';
    $scope.thanks = false;

    $httpBackend.expectPOST('http://localhost:8001/subscribe/?email=test@goryd.in').respond(200, {});
    $httpBackend.when('GET', '/app/templates/home.search.html').respond(200, {});

    $scope.subscribeUser();
    expect($scope.thanks).toEqual(true);
    $httpBackend.flush();
    expect($scope.status).toBe('Success response');
  });

  it('should not send message to server', function() {
    $scope.email = 'test@goryd.in';
    $httpBackend.expectPOST('http://localhost:8001/subscribe/?email=test@goryd.in').respond(400, {});
    $httpBackend.when('GET', '/app/templates/home.search.html').respond(200, {});

    $scope.subscribeUser();
    $httpBackend.flush();
    expect($scope.status).toBe('Failed response');
  });
});
