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

function ProfileController(userDetails) {
	var vm = this;
	vm.user = userDetails;
	vm.example = 'Example Data';
}

function dashFilter() {
	return function(input){
		return input || '---';
	};
}