/* global MENU */
var APP = (function () {
	var success = '<i class="icon ion-checkmark-circled"></i>';
	var error = '<i class="icon ion-minus-circled"></i>';

	// Bootstrapping after all necessary AJAX calls have been completed
	$(document).ready(function () {
		// Only do something when we know enough about user, groups and Kind (subscription info)
		
		// Removed readyGroups everywhere for now - Feide Connect does not provide reliable info for all orgs
		// $.when(FEIDE_CONNECT.readyUser(), FEIDE_CONNECT.readyGroups()).done(function (user, groups) {
		$.when(FEIDE_CONNECT.readyUser()).done(function (user, groups) {	
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
						// Removed isEmployee check - FeideConnect groups cannot be trusted at this stage - org group rarely exists, hence we do not get eduPersonAffiliation.
						// if (FEIDE_CONNECT.isEmployee() && KIND.isSubscriber() && ADOBECONNECT.orgFolderNav().length > 0) {
						if (KIND.isSubscriber() && ADOBECONNECT.orgFolderNav().length > 0) {
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
		// Removed for now - FeideConnect cannot provide this for all orgs
		// $('.feideOrg').html(' ' + FEIDE_CONNECT.user().org.name);
		$('.feideOrg').html(' ' + FEIDE_CONNECT.user().org.id);
		$('.feideOrgShortname').html(' ' + FEIDE_CONNECT.user().org.shortname);
		// Removed for now - FeideConnect cannot provide this for all orgs
		//$('.feideAffiliation').html(' ' + FEIDE_CONNECT.user().affiliation);
		$('.feideAffiliation').html(' medlem');
		$('.userImage').attr('src', FEIDE_CONNECT.user().photo);
		$('.userRole').html(' ' + KIND.role());
		// Dev
		$('#connectSessionInfo').text(JSON.stringify(FEIDE_CONNECT.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
		//

		// Removed for now. FeideConnect does not offer this info for all orgs ;(
		//FEIDE_CONNECT.isEmployee() ? $('#employeeCheck').html(success).removeClass('bg-yellow').addClass('bg-green') : $('#employeeCheck').html(error).removeClass('bg-yellow').addClass('bg-red');
		KIND.isSubscriber() ? $('#subscriberCheck').html(success).removeClass('bg-yellow').addClass('bg-green') : $('#subscriberCheck').html(error).removeClass('bg-yellow').addClass('bg-red');

	}

})();