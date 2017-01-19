app.controller('accounts.profile', ['$scope', '$http', '$cookies', 'Upload', '$mdToast', '$window', '$state',function($scope, $http, $cookies,Upload,$mdToast,$window,$state) {
    // $scope.profilepic = emptyFile;
    // $scope.licensepic = emptyFile;
    var mainsrc='images/avatar.png';
    var c;
    $scope.showProfileImage=true;
    $scope.userProfileEdit=false;
    $scope.userDetailsEditAnim="user-details-edit";
    $scope.buttonStateOnhoverProfile="accounts-profile-icon";
    $scope.dataConfirm=false;
    $scope.profileChangeButtonAppear=function(){
      $scope.buttonStateOnhoverProfile="accounts-profile-iconhover";
    }
    $scope.profileChangeButtonHide=function(){
      $scope.buttonStateOnhoverProfile="accounts-profile-icon";
    }
    $scope.toggleProfileEdit=function(){
      if(!$scope.userProfileEdit){
        $scope.userDetailsEditAnim="user-details-edit-anim";
        $scope.userProfileEdit=true;
      }
      else{
        $scope.userDetailsEditAnim="user-details-edit";
        $scope.userProfileEdit=false;
      }
    }
    $scope.clearAlluserDetails=function(){
      $scope.firstname =null;
      $scope.lastname = null;
      $scope.mobileno =null;
    }
      $scope.dataURItoBlob=function(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
              byteString = atob(dataURI.split(',')[1]);
          else
              byteString = unescape(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type:mimeString});
      };

    httpConfig['Content-Type'] = 'application/json';

    $scope.prof = "";
    $http({
        method: 'GET',
        url: URL_PREFIX + '/api/users/profile/?mode=self',
        headers: httpConfig
    }).then(function(response) {
        $scope.prof = response.data;
        $scope.updateUI();
    });

    $scope.updateUI = function() {
        // $scope.prof = $scope.profile;
        $scope.firstname = $scope.prof.user.first_name;
        $scope.lastname = $scope.prof.user.last_name;
        $scope.mobileno = $scope.prof.mobile;
        $scope.profileImage = $scope.prof.dp;
        $scope.username = $scope.prof.user.username;
        $scope.licenseImage = $scope.prof.dl;
        $scope.IDImage  = $scope.prof.idProof;
    };
    $scope.changing_username = false;
    $scope.changing_firstname = false;
    $scope.changing_lastname = false;
    $scope.changing_mobno = false;

    $scope.editusername = function() {
        if ($scope.changing_username === false) {
            $scope.changing_username = true;
        } else {
            $scope.prof.user.username = $scope.username;
            $scope.changing_username = false;
        }
    };
    $scope.editfirstname = function() {
        if ($scope.changing_firstname === false) {
            $scope.changing_firstname = true;
        } else {
            $scope.prof.user.first_name = $scope.firstname;
            $scope.changing_firstname = false;
        }
    };
    $scope.editlastname = function() {
        if ($scope.changing_lastname === false) {
            $scope.changing_lastname = true;
        } else {
            $scope.prof.user.last_name = $scope.lastname;
            $scope.changing_lastname = false;
        }
    };

    $scope.editmobno = function() {
        if ($scope.changing_mobno === false) {
            $scope.changing_mobno = true;
        } else {
            $scope.prof.mobile = $scope.mobileno;
            $scope.changing_mobno = false;
        }
    };
    $scope.readURL=function(dp){

      var reader=new FileReader();

      reader.onload=function(e){
        mainsrc=e.target.result;
        var el=document.getElementById('item');
        var ne=null;
        c = new Croppie(el,{
          enableExif: true,
          customClass:'cropped',
          viewport: { width: 300, height: 300 },
          boundary: { width: 300, height: 300 },
          showZoomer: true,
          enableOrientation: true
        });
        c.bind({
          url:mainsrc
        }).then(function(e){
          $scope.crop();
        });
      };

      reader.readAsDataURL(dp);

    };

    $scope.crop=function(){
      c.result({type:'canvas',size:'original',format:'png'}).then(function(img){
        $scope.i=img;
        var myBlob=$scope.dataURItoBlob($scope.i);
        $scope.myFile=new File([myBlob],"finaldp");
        $scope.showProfileImage=false;
      });

    };

    $scope.postEditedProfile = function(dp1,dl1,id1) {
      $scope.loadingIconUpdateProfile=true;
      dp1=$scope.myFile;
        var fd = {
          first_name: $scope.firstname,
          last_name: $scope.lastname,
          mobile:$scope.mobileno
        };
        $http({
          method: 'PUT',
          url: URL_PREFIX + '/api/users/profile/'+ $scope.prof.pk +'/',
          data: fd,
          headers: httpConfig
        }).then(function(response) {
          // $scope.prof = response.data;
          $scope.loadingIconUpdateProfile=false;
          $scope.updateUI();
          $mdToast.show(
            $mdToast.simple()
            .textContent('Success!')
            .hideDelay(3000)
            .position('top right')
          );
          $state.go('accounts.profile');
          $window.setTimeout(function(){location.reload();},3000);
        });
        if(dp1!==undefined){
          Upload.upload({
            method: 'PUT',
            url: URL_PREFIX + '/api/users/profile/'+ $scope.prof.pk +'/',
            data:{
              dp: dp1
            },
            headers: httpConfig
          }).
          then((function() {
            return function(response) {
            };
          })(), function(error) {
            $scope.loadingIconUpdateProfile=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Error!')
              .hideDelay(3000)
              .position('top right')
            );
          });
        }
        if(dl1!==undefined){
          Upload.upload({
            method: 'PUT',
            url: URL_PREFIX + '/api/users/profile/'+ $scope.prof.pk +'/',
            data:{
              dl: dl1[0]
            },
            headers: httpConfig
          }).
          then(function(response) {
            $scope.loadingIconUpdateProfile=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Success,we will verify you shortly!')
              .hideDelay(3000)
              .position('top right')
            );
          }, function(error) {
            $scope.loadingIconUpdateProfile=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Error!')
              .hideDelay(3000)
              .position('top right')
            );
          });
        }
        if(id1!==undefined){
          Upload.upload({
            method: 'PUT',
            url: URL_PREFIX + '/api/users/profile/'+ $scope.prof.pk +'/',
            data:{
              idProof: id1[0]
            },
            headers: httpConfig
          }).then(function(response) {
            $scope.loadingIconUpdateProfile=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Success,we will verify it shortly!')
              .hideDelay(3000)
              .position('top right')
            );
          }, function(error) {
            $scope.loadingIconUpdateProfile=false;
            $mdToast.show(
              $mdToast.simple()
              .textContent('Error!')
              .hideDelay(3000)
              .position('top right')
            );
          });
        }
    };

}]);
