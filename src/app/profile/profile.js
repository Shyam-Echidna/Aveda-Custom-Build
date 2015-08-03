angular.module( 'orderCloud.profile',[] )

	.config( ProfileConfig )
	.controller( 'profileController', ProfileController )
	.filter( 'dash', dashFilter )

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

function ProfileController(userDetails, UserFactory) {
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
			UserFactory.saveUser({ ID : vm.user.ID , password : this.getPassword() }).then(function(data){
				vm.passwordForm.cancel();
				alert("Password Changed");
			});
		}
	};
}

function dashFilter() {
	return function(input){
		return input || '---';
	};
}