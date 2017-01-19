app.controller('main', ['$scope', '$http', '$timeout', '$mdSidenav', '$mdComponentRegistry', '$log', '$mdToast', '$cookies', '$location', '$state', '$rootScope', '$window','$mdDialog','editList', 'ListingComplete', 'indexShare','fbData','reviewCar',function($scope, $http, $timeout, $mdSidenav, $mdComponentRegistry, $log, $mdToast, $cookies, $location, $state, $rootScope,$window,$mdDialog,editList,ListingComplete,indexShare,fbData,reviewCar) {
  httpConfig['Content-Type'] = 'application/json';

      $('#menuAccounts').tendina();
      $scope.firstheadActive = false;
      $scope.secondheadActive = false;
      $scope.moreEditActive=false;
      $scope.thanksForm = false;
      $scope.OTPform = false;
      $scope.isgridViewActive=false;
      $scope.listViewClass=null;
      $scope.accountsSidenav=null;
      $scope.isAccountsSidenavOpen=true;
      $scope.ownerHasListing=false;
      $scope.registrationConfirm=false;
      $scope.onSignIn = function(googleUser) {
          var profile = googleUser.getBasicProfile();
      };
      $scope.OTPformtrue = function(ev) {
        $scope.toggleLoginForm();
        $mdDialog.show({
        //  controller: DialogController,
         templateUrl: 'templates/login.forgotPasswordOTP.html',
         parent: angular.element(document.body),
         clickOutsideToClose:false,
         targetEvent:ev
       }).then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };
      $scope.toggleListGridView=function(){
        if(!$scope.isgridViewActive){
          $scope.isgridViewActive=true;
          $scope.listViewClass="full";
          $scope.accountsSidenav="full";
          $scope.isAccountsSidenavOpen=false;
      }
        else{
          $scope.isgridViewActive=false;
          $scope.listViewClass=null;
          $scope.isAccountsSidenavOpen=true;
        }
        console.log($scope.listViewClass);
      }
      $scope.toggleAccountsSidenav=function(){
        if($scope.isAccountsSidenavOpen){
            $scope.accountsSidenav="full";
            $scope.isAccountsSidenavOpen=false;
        }
        else{
          $scope.accountsSidenav=null;
          $scope.isAccountsSidenavOpen=true;
        }
      }
      $scope.registration=function(ev){
        $scope.toggleLoginForm();
        $mdDialog.show({
          //  controller: DialogController,
          templateUrl: 'templates/login.register.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true,
          targetEvent:ev
        }).then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };
      $scope.toggleProfilemenu = function() {
          $scope.firstheadActive = false;
          $scope.secondheadActive = false;
          $scope.listViewClass=null;
          $scope.isAccountsSidenavOpen=true;
          $scope.isgridViewActive=false;
      };

      $scope.toggleOrdermenu = function() {
          if ($scope.firstheadActive) {
              $scope.firstheadActive = false;
          } else {
              $scope.firstheadActive = true;
          }
          $scope.secondheadActive = false;
          $scope.listViewClass=null;
          $scope.isAccountsSidenavOpen=true;
          $scope.isgridViewActive=false;
      };
      $scope.toggleSupportmenu = function() {
          if ($scope.secondheadActive) {
              $scope.secondheadActive = false;
          } else {
              $scope.secondheadActive = true;
          }
          $scope.firstheadActive = false;
          $scope.listViewClass=null;
          $scope.isAccountsSidenavOpen=true;
          $scope.isgridViewActive=false;
      };
      $scope.contactSubmit = function(contactform) {
          var fd = {
            name: contactform.userName,
            email:contactform.userMail,
            message: contactform.userMessage
          };
          $http({
              url: URL_PREFIX + '/api/support/query/',
              method: 'POST',
              data: fd,
              headers: httpConfig
          }).then(function(response) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Thanks, Will get back to you shortly')
              .hideDelay(5000)
              .position('top right')
            );
            contactform.userName=null;
            contactform.userMail=null;
            contactform.userMessage=null;
          },function(error){
            $mdToast.show(
                  $mdToast.simple()
                  .textContent("Error, please try again later!")
                  .hideDelay(5000)
                  .position('top right')
              );
        });
      };
      $scope.registerForm = {
          password: '',
          email: '',
          name: '',
          mobile: ''
      };
      $scope.showPasswordField=false;
      $scope.showOTPField=false;
      $scope.showMobile = !$scope.showPasswordField && !$scope.showOTPField;
      $scope.showOTPfp = $scope.showOTPField && !$scope.showPasswordField;
      $scope.sendMobileno = function(m){
        console.log(m);
        if(m!==undefined)
        {
          $scope.mobileUser = m;
        var mobileno = {
          mobile: $scope.mobileUser
        };
        $http({
            method: 'POST',
            url: URL_PREFIX + '/forgotPassword/',
            data: mobileno,
            headers: httpConfig
        }).then(function(response) {
          $scope.userfppk = response.data.pk;
          $scope.showOTPField=true;
          $scope.showMobile = !$scope.showPasswordField && !$scope.showOTPField;
          $scope.showOTPfp = $scope.showOTPField && !$scope.showPasswordField;
        },function(error){
          $mdToast.show(
            $mdToast.simple()
            .textContent('Mobile no. doesnt exist, Try Again')
            .hideDelay(3000)
            .position('top right')
          );
        });
      }
      };
      $scope.resendOTPfp = function(){
        var a = $scope.userfppk;
        var datatosend = {
          pk: a
        };
        $http({
          method: 'POST',
          url: URL_PREFIX + '/forgotPassword/',
          data: datatosend,
          headers: httpConfig
        }).then(function(response){
        },function(error){
          $mdToast.show(
            $mdToast.simple()
            .textContent('Try Again')
            .hideDelay(3000)
            .position('top right')
          );
        });
      };
      $scope.validateOTPfp = function(otpSent){
        if(otpsent!==undefined){
          var ufp = $scope.userfppk;
        var d = {
          pk: ufp,
          otp: otpSent
        };
        $http({
            method: 'POST',
            url: URL_PREFIX + '/forgotPassword/validateOTP/',
            data: d,
            headers: httpConfig
        }).then(function(response) {
          if (window.localStorage.jwtToken !== undefined) {
            window.localStorage.removeItem('jwtToken');
          }
          window.localStorage.jwtToken = response.data.token;
          httpConfig = {
            'Authorization': 'JWT ' + window.localStorage.jwtToken,
            'Content-Type': 'application/json'
          };
          $scope.showPasswordField=true;
          $scope.showMobile = !$scope.showPasswordField && !$scope.showOTPField;
          $scope.showOTPfp = $scope.showOTPField && !$scope.showPasswordField;
        },function(error){
          $mdToast.show(
            $mdToast.simple()
            .textContent('Wrong OTP, Try Again')
            .hideDelay(3000)
            .position('top right')
          );
        });
      }
      };
      $scope.isFB = false;
      $scope.loginGoogle = function(){
        function onSignIn(googleUser) {
           // Useful data for your client-side scripts:
           var profile = googleUser.getBasicProfile();
       }
        var params = {
            client_id: '551396169237-ump9qf0icefif4nj2o7dto12rl3nenc7.apps.googleusercontent.com'
            // Additional optional params
          };
      };
      function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
          profile = auth2.currentUser.get().getBasicProfile();
        }
      }
      $scope.loginFB=function(){
        FB.login(function() {
          FB.api('/me', {
            fields: 'last_name,age_range,about,birthday,email,first_name,gender,picture,name'
          }, function(response) {
                if (response && !response.error) {
                  $scope.isFB = true;
                  indexShare.setProperty($scope.isFB);
                  var v  = response.birthday.split('/');
                  response.birthday = v[1]+'-'+v[0]+'-'+v[2];
                  fbData.setProperty(response);
                  $scope.registration();
                }else{
                  $mdToast.show(
                      $mdToast.simple()
                      .textContent('Error, please try again later!')
                      .hideDelay(3000)
                      .position('top right')
                  );
                }
          });
        }, {scope: 'public_profile,email,user_birthday'});
      };
      $scope.resetPw = function(p){
        if(p!==undefined){
        var ufp = $scope.userfppk;
        var d = {
          password:p
        };
        $http({
            method: 'POST',
            url: URL_PREFIX + '/changePassword/',
            data: d,
            headers: httpConfig
        }).then(function(response){
          $scope.showMobile = !$scope.showPasswordField && !$scope.showOTPField;
          $scope.showOTPfp = $scope.showOTPField && !$scope.showPasswordField;
          $mdDialog.cancel();
          $window.location.reload();
        },function(error) {
          $mdToast.show(
              $mdToast.simple()
              .textContent('Try Again')
              .hideDelay(3000)
              .position('top right')
          );
          // return;
        });
      }
      };
      $scope.isFB = indexShare.getProperty();
      $scope.form = fbData.getProperty();
      $scope.registerOTPtrue = function(r) {
        $scope.loadingIconRegister=true;
        console.log($scope.loadingIconRegister);
        if(r.password!==undefined && r.name!==undefined && r.birthday!==undefined && r.email!==undefined && r.mobile!==undefined){
        if (r.password != r.confirmPassword) {
          $mdToast.show(
              $mdToast.simple()
              .textContent('Passwords dont match!')
              .hideDelay(5000)
              .position('top right')
          );
          return;
        }
        var year = r.birthday.split('-')[2];
        if(year<1900){
          $mdToast.show(
              $mdToast.simple()
              .textContent('You are too old.Please rest.')
              .hideDelay(5000)
              .position('top right')
          );
          return;
        }
        var datatosend = {
          email: r.email,
          name: r.name,
          password: r.password,
          dob: r.birthday,
          mobile: r.mobile
        };
        $http({
            method: 'POST',
            url: URL_PREFIX + '/register/',
            data: datatosend,
        }).
        then(function(response) {
          var d = response.data;
          $scope.userpk = d.pk;
          editList.setProperty($scope.userpk);
          $mdDialog.show({
            templateUrl: 'templates/login.registerOTP.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false
          }).then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });

        },function(error){
          if (error.status==400){
            $scope.loadingIconRegister=false;
            console.log($scope.loadingIconRegister);
            $mdToast.show(
                $mdToast.simple()
                .textContent(error.data.error)
                .hideDelay(3000)
                .position('top right')
                .position('top right')
            );
          }else{
            $scope.loadingIconRegister=false;
            console.log($scope.loadingIconRegister);
            $mdToast.show(
              $mdToast.simple()
              .textContent('Internal Error!')
              .hideDelay(3000)
              .position('top right')
            );
          }
        });
      }
     };
     $scope.resendOTP = function(){
       var upk =  editList.getProperty();
       var datatosend = {
         pk: upk
       };
       $http({
         method: 'POST',
         url: URL_PREFIX + '/forgotPassword/',
         data: datatosend,
         headers: httpConfig
       }).then(function(response){
       },function(error){
         $mdToast.show(
             $mdToast.simple()
             .textContent('Try again')
             .hideDelay(3000)
             .position('top right')
         );
       });
     };
     $scope.getProfile = function() {
         $http({
             method: 'GET',
             url: URL_PREFIX + '/api/users/profile/?mode=self',
             headers: httpConfig
         }).
         then(function(response) {

            // Getting token on facebook login
             if (response.data.token !== null) {
               if (window.localStorage.jwtToken !== undefined) {
                 window.localStorage.removeItem('jwtToken');
               }
               window.localStorage.jwtToken = response.data.token;
               httpConfig = {
                 'Authorization': 'JWT ' + window.localStorage.jwtToken,
                 'Content-Type': 'application/json'
               };
             }

             $scope.profile = response.data;
             $rootScope.$broadcast('updateProfile', $scope.profile);
             $scope.logged = true;
             LOGGED = true;
             if($scope.profile.isOwner===true) {
              $scope.ownerHasListing=true;
             }
            else{
              $scope.ownerHasListing=false;
            }
            if($scope.profile.dl===null &&$scope.profile.idProof===null){
              $mdToast.show({
                template: '<md-toast><a href="#/accounts/profile" style="color: #ff4040">Please upload your Driving License and Identity Proof to become a verified renter</a></md-toast>',
                hideDelay:10000,
                position: 'top right'
              }
              );
            }
            else if($scope.profile.dl===null){
              $mdToast.show({
                template: '<md-toast><a href="#/accounts/profile" style="color: #ff4040">Please upload your Driving License to become a verified renter</a></md-toast>',
                hideDelay:10000,
                position: 'top right'
              }
              );
            }
            else if($scope.profile.idProof===null){
              $mdToast.show({
                template: '<md-toast><a href="#/accounts/profile" style="color: #ff4040">Please upload your Identity Proof to become a verified renter</a></md-toast>',
                hideDelay:10000,
                position: 'top right'
              }
                  // $mdToast.simple()
              );
            }
          },function(error) {
              if (error.status == 401) {
                }
                  return;
              });
           };
     $scope.validateOTP = function(otpSent){
       if(otpSent!==undefined){
       var upk =  editList.getProperty();
       var d = {
         pk: upk,
         otp: otpSent
       };
       $http({
           method: 'POST',
           url: URL_PREFIX + '/register/validateOTP/',
           data: d,
           headers: httpConfig
       }).then(function(response) {
         $mdDialog.cancel();
         if (window.localStorage.jwtToken !== undefined) {
           window.localStorage.removeItem('jwtToken');
         }
         window.localStorage.jwtToken = response.data.token;
         httpConfig = {
           'Authorization': 'JWT ' + window.localStorage.jwtToken,
           'Content-Type': 'application/json'
         };
         $scope.resetTempItems();
         $scope.getProfile();
         $rootScope.$broadcast('loginSuccess', {});
         $mdToast.show(
             $mdToast.simple()
             .textContent('Welcome!')
             .hideDelay(5000)
             .position('top right')
         );
         $window.location.reload();

       },function(error){
         $mdToast.show(
             $mdToast.simple()
             .textContent('Invalid OTP, try again')
             .hideDelay(3000)
             .position('top right')
         );
       });
     }
     };
     $scope.hide = function() {
       $mdDialog.hide();
     };
     $scope.cancel = function() {
       $mdDialog.cancel();
     };
     $scope.answer = function(answer) {
       $mdDialog.hide(answer);
     };
      $scope.loading = true;
      $scope.logged = false;
      $scope.testVar = "simple text";
      $scope.showLoginForm = false;
      $scope.data = {
          showRegister: false
      };
      $scope.isSidenavOpen = false;
      $scope.accountSidenavOpen = false;
      $scope.openLeftMenu = function() {
          if (!$scope.isSidenavOpen) {
              $scope.isSidenavOpen = true;
          } else {
              $scope.isSidenavOpen = false;
          }
      };
      $scope.accountLeftMenu = function() {
          if (!$scope.accountSidenavOpen) {
              $scope.accountSidenavOpen = true;
          } else {
              $scope.accountSidenavOpen = false;
          }
      };
      $scope.gotoAnchor = function(x) {

      };
      $scope.getProfile();
      $scope.logoclick = function() {
          if ($state.is('home')) {
              $window.location.reload();
          }else {
              $state.go('home');
          }
      };
      $scope.logout = function() {
          $http({
              method: 'POST',
              url: URL_PREFIX + '/logout/'
          }).
          then(function(response) {
              $state.go('home');
              $window.location.reload();
              $scope.logged = false;
              LOGGED = false;
              window.localStorage.removeItem('jwtToken');
              httpConfig = {
                'Content-Type': 'application/json'
              };
          });
      };
      $scope.loginForm = {
          username: '',
          password: '',
      };
      $scope.login = function() {
          $http({
              method: 'POST',
              url: URL_PREFIX + '/api-token-auth/login/',
              data: $scope.loginForm
          }).
          then(function(response) {
              $scope.logged = true;
              $scope.loginForm = {
                  username: '',
                  password: '',
              };
              $scope.resetTempItems();
              if (window.localStorage.jwtToken !== undefined) {
                window.localStorage.removeItem('jwtToken');
              }
              window.localStorage.jwtToken = response.data.token;
              httpConfig = {
                'Authorization': 'JWT ' + window.localStorage.jwtToken,
                'Content-Type': 'application/json'
              };
              $scope.getProfile();
              $rootScope.$broadcast('loginSuccess', {});
              $mdToast.show(
                  $mdToast.simple()
                  .textContent('Welcome!')
                  .hideDelay(5000)
                  .position('top right')
              );
              $scope.checkisReview();
          }, function(error) {
              if(error.status==400){
                $mdToast.show(
                  $mdToast.simple()
                  .textContent('Wrong username/password combination, try again')
                  .hideDelay(3000)
                  .position('top right')
                );
              }else{
                $mdToast.show(
                  $mdToast.simple()
                  .textContent('Oops!Try again after sometime')
                  .hideDelay(3000)
                  .position('top right')
                );
              }
          });
      };

      $scope.register = function() {
          if ($scope.registerForm.password != $scope.loginForm.password) {
            $mdToast.show(
                $mdToast.simple()
                .textContent('Passwords dont match!')
                .hideDelay(3000)
                .position('top right')
            );
            return;
          }
          $http({
              method: 'POST',
              url: URL_PREFIX + '/register/',
              data: $scope.registerForm
          }).
          then(function(response) {
              $scope.registerForm = {
                  password: '',
                  email: '',
                  name: '',
                  mobile: ''
              };
              $scope.getProfile();
              $scope.resetTempItems();
          }, function(error) {
              if (error.status == 400) {
                  $mdToast.show(
                      $mdToast.simple()
                      .textContent('Email id already exists. Please login!')
                      .hideDelay(3000)
                      .position('top right')
                  );
                  return;
              }
          });
      };

      $scope.$on('logout', function(evt, params) {
          $scope.logged = false;
      });

      $scope.profileForm = {
          mobile: '',
      };

      $scope.resetTempItems = function(input) {
          if ($state.is('list') && !$scope.logged) {
              return;
          }
          $scope.data.showLoginForm = false;
          $scope.data.showRegister = false;
          if (typeof input != 'undefined') {
              $state.go('home');
              var newHash = input;
              if ($location.hash() !== newHash) {
                  $location.hash(input);
              } else {
                  $anchorScroll();
              }
          }
      };

      $scope.$on('toggleLoginForm', function(evt, params) {
          if (params === false) {
              $scope.data.showLoginForm = false;
              return;
          }
          $scope.toggleLoginForm();
      });
      $scope.toggleLoginForm = function() {
        $mdDialog.cancel();
          $scope.data.showLoginForm = !$scope.data.showLoginForm;
          if (!$scope.data.showLoginForm) {
              $scope.data.showRegister = false;
          }
      };
      setTimeout(function() {
        $scope.loading = false;
      }, 200);
      $scope.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
      };
      $scope.checkLastlisting = function(){
        $scope.loadingIconShareNow=true;
        $http({
          method: 'GET',
          url: URL_PREFIX + '/api/listing/vehicle/?checkLastListing=true',
          headers: httpConfig
        }).
        then(function(response) {
          $scope.loadingIconShareNow=false;
          $scope.carpk = response.data;
          indexShare.setProperty($scope.carpk);
          if($scope.carpk>0){
            $http({
              method: 'GET',
              url: URL_PREFIX+ '/api/listing/vehicle/?pk=' +$scope.carpk,
              headers: httpConfig
            }).then(function(response){
              ListingComplete.setProperty(response.data);
              $mdDialog.show({
                templateUrl: 'templates/share.isListingComplete.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true
              }).then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });
            },function(error){
              $mdToast.show(
                $mdToast.simple()
                .textContent("Error, please try again later!")
                .hideDelay(3000)
                .position('top right')
              );
            });
          }else{
            $state.go('share');
          }
        },function(error){
          $scope.loadingIconShareNow=false;
          $state.go('share');
        // $scope.toggleLoginForm();
        //   $mdToast.show(
        //     $mdToast.simple()
        //     .textContent("Please login to list your car")
        //     .hideDelay(3000)
        //     .position('top right')
        //   );
        });

      };
      $scope.isListingcomp = ListingComplete.getProperty();
      $scope.yes = function(){
        $scope.isListingcomp = ListingComplete.getProperty();
        $scope.elisting = $scope.isListingcomp;
        editList.setProperty($scope.elisting);
        $mdDialog.cancel();
        $state.go('editmyListing');
      };
      $scope.no = function(){
        $mdDialog.cancel();
        $state.go('share');
      };
      $scope.delete = function() {
        $scope.carpk = indexShare.getProperty();
        $http({
          method: 'DELETE',
          url: URL_PREFIX+ '/api/listing/vehicle/?pk=' +$scope.carpk,
          headers: httpConfig
        }).then(function(response){
          $mdDialog.cancel();
          $mdToast.show(
            $mdToast.simple()
            .textContent("Listing deleted!")
            .hideDelay(3000)
            .position('top right')
          );
        },function(error){
          $mdDialog.cancel();
          $mdToast.show(
            $mdToast.simple()
            .textContent("Error, please contact support@goryd.in for help!")
            .hideDelay(8000)
            .position('top right')
          );
        });
      };
      $scope.checkisReview = function(){
        $http({
          method: 'GET',
          url: URL_PREFIX + '/api/booking/review/?checkPastBookings=true',
          headers: httpConfig
        }).
        then(function(response) {
          $scope.bookingpk = response.data.pk;
          if($scope.bookingpk>0){
            indexShare.setProperty(response.data);
            $http({
              method: 'GET',
              url: URL_PREFIX+ '/api/booking/mybooking/?pk=' +$scope.bookingpk,
              headers: httpConfig
            }).then(function(response){
              reviewCar.setProperty(response.data);
              $mdDialog.show({
                controller: 'reviewOrder',
                templateUrl: 'templates/reviewBooking.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false
              }).then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });
            },function(error){
              $mdToast.show(
                $mdToast.simple()
                .textContent("Error, please try again later!")
                .hideDelay(3000)
                .position('top right')
              );
            });
          }else{
            return;
          }
        },function(error){
          return;
        });
      };
      $scope.checkisReview();
  }]);
