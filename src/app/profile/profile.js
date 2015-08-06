angular.module( 'orderCloud.profile',[] )

	.config( ProfileConfig )
	.controller( 'profileController', ProfileController )
	.filter( 'dash', dashFilter )
	.factory( 'profileFactory', profileFactory )

;

function ProfileConfig( $stateProvider ) {
	$stateProvider.state( 'base.profile', {
		url: '/MyProfile',
		resolve: {
			userDetails : function(UserFactory){
				return UserFactory.get();
			}
		},
		templateUrl:'profile/templates/profile.tpl.html',
		controller:'profileController',
		controllerAs: 'profile',
		data:{ pageTitle: 'My Profile' }
	});
}

function ProfileController(userDetails, UserFactory, profileFactory) {
	var vm = this;
	var userTmp = userDetails;
	vm.user = angular.copy(userDetails);
	vm.example = 'Example Data';
	vm.form = {
		isEdit : false,
		cancel : function(){
			vm.user = angular.copy(userDetails);
			this.isEdit = !this.isEdit;
		},
		save : function(){
			UserFactory.saveUser(vm.user).then(function(data){
				UserFactory.set().then(function(data){
					vm.form.cancel(); 
					vm.user = UserFactory.get();
				});
			});
		}
	};
	vm.passwordForm = {
		isEdit : false,
		password : '*******',
		cancel : function(){
			this.password = '*******';
			this.isEdit = !this.isEdit;
		},
		getPassword : function(){
			return (this.password !== '*******') ? this.password : "" ;
		},
		save : function(){
			// UserFactory.saveUser({ ID : vm.user.ID , password : this.getPassword() }).then(function(data){
			// 	vm.passwordForm.cancel();
			// 	alert("Password Changed");
			// });
			console.log(vm.user);
			var tmpObj = {
				username : vm.user.Username,
				ID : vm.user.ID,
				oldPass : vm.passwordForm.curPass,
				newPass : vm.passwordForm.cnfPass
			} ;
			//return;
			profileFactory.changePassword(tmpObj).then(function(){
				delete vm.passwordForm.error;
				vm.passwordForm.cancel();
				alert("Password Changed");
			}).catch(function(data){
				vm.passwordForm.error = data.error;
			});
		}
	};
}

function dashFilter() {
	return function(input){
		return input || '---';
	};
}

function profileFactory($q, LoginFact, UserFactory){
	return {
		changePassword : _changePassword
	};
	function _changePassword(userObj){
		var defferred = $q.defer();
		LoginFact.Get({ Username : userObj.username, Password : userObj.oldPass }).then(function(data){
			UserFactory.savePassword({ ID : userObj.ID, Password : userObj.newPass })
			.then(function(data){
				defferred.resolve("password changed");
			});
		}).catch(function(data){
			defferred.reject(data);
		});
		return defferred.promise;
	}
}