/* global MENU */
var APP = (function () {
	var success = '<i class="icon ion-checkmark-circled"></i>';
	var error = '<i class="icon ion-minus-circled"></i>';

	// Bootstrapping after all necessary AJAX calls have been completed
	$(document).ready(function () {
		// Only do something when we know enough about user, groups and Kind (subscription info)
		$.when(FEIDE_CONNECT.readyUser(), FEIDE_CONNECT.readyGroups()).done(function (user, groups) {
			$.when(KIND.ready()).done(function () {
				if (KIND.isSubscriber()) {
					// Update UI
					updateUserUI();
					//
					MENU.init();
					//

					ADOBECONNECT.getOrgFolderNav().done(function () {
						ADOBECONNECT.orgFolderNav().length > 0 ? $('#acFolderCheck').html(success).removeClass('bg-yellow').addClass('bg-green') : $('#acFolderCheck').html(error).removeClass('bg-yellow').addClass('bg-red');
						// Only show menu item if we have required info
						if (FEIDE_CONNECT.isEmployee() && KIND.isSubscriber() && ADOBECONNECT.orgFolderNav().length > 0) {
							MENU.showServiceMenu();
						}
					})
						.fail(function () {
							$('#acFolderCheck').html(error).removeClass('bg-yellow').addClass('bg-red');
							$('#acFolderError').removeClass('hidden');
						});
				}
			});
		});
	});

	function updateUserUI() {
		// User-specific
		$('.userFirstName').html(' ' + FEIDE_CONNECT.user().name.first);
		$('.userFullName').html(' ' + FEIDE_CONNECT.user().name.full);
		$('.feideOrg').html(' ' + FEIDE_CONNECT.user().org.name);
		$('.feideOrgShortname').html(' ' + FEIDE_CONNECT.user().org.shortname);
		$('.feideAffiliation').html(' ' + FEIDE_CONNECT.user().affiliation);
		$('.userImage').attr('src', FEIDE_CONNECT.user().photo);
		$('.userRole').html(' ' + KIND.role());
		// Dev
		$('#connectSessionInfo').text(JSON.stringify(FEIDE_CONNECT.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
		//

		FEIDE_CONNECT.isEmployee() ? $('#employeeCheck').html(success).removeClass('bg-yellow').addClass('bg-green') : $('#employeeCheck').html(error).removeClass('bg-yellow').addClass('bg-red');
		KIND.isSubscriber() ? $('#subscriberCheck').html(success).removeClass('bg-yellow').addClass('bg-green') : $('#subscriberCheck').html(error).removeClass('bg-yellow').addClass('bg-red');

	}

})();