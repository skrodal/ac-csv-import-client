var KIND = (function () {
	var
		subscribers = [],            // Array with all data from Kind sorted by org
		subscriptionCount = {},      // Object counting the types of subscriptions
		subscribingOrgNames = [],    // Array with org names in alphabetical order
		subscriberDetails = {};   	 // Details about logged in user's org

	var XHR_KIND;

	// Self-invoking
	(function () {
		// Need user info before we can talk to Kind...
		$.when(FEIDE_CONNECT.readyUser()).done(function () {
			XHR_KIND = _getServiceSubscribers();
		})
	})();

	function _getServiceSubscribers() {
		return jso.ajax({
			url: jso.config.get("endpoints").kind + "service/" + jso.config.get("kind").adobeConnectId + "/subscribers/",
			dataType: 'json'
		})
			.done(function (data) {
				// Check for and catch errors before done is fired
				subscribers = JSON.parse(data)
				if (!subscribers.status || !subscribers.orgSubscribers) {
					UTILS.showAuthError("Tjenestetilganger", "Henting av tjenestetilganger (KIND) feilet.");
					return false;
				} else {
					// All good - process a few things here before done is fired...
					subscribers = JSON.parse(data).orgSubscribers;
					// Sort by org name
					subscribers = subscribers.sort(function (a, b) {
						return (a[0].org.toLowerCase() < b[0].org.toLowerCase()) ? -1 : (a[0].org.toLowerCase() > b[0].org.toLowerCase()) ? 1 : 0;
					});
					
					// Check if user comes from subscribing org (if true, subscriberDetails{} will be populated)
					if (!_isOrgSubscriber(subscribers)) {
						UTILS.showAuthError("Tjenestetilganger", "Ditt l&aelig;rested abonnerer ikke p&aring; Adobe Connect.");
						return false;
					} else {
						// OK - populate count object.
						subscriptionCount = _getSubscriptionCount(subscribers);
						UTILS.updateAuthProgress("Tjenestetilganger");
					}
				}
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.showAuthError("Tjenestetilganger XHR", "Henting av tjenestetilganger (KIND) feilet.");
			});
	}
	
	/**
	 * Check logged in user's org subscription status.
	 */
	function _isOrgSubscriber(subscribersArr) {
		subscriberDetails = {};

		$.each(subscribersArr, function (key, val) {
			// Extract details for logged in user's org
			if (val[0].org.toLowerCase() === FEIDE_CONNECT.user().org.id.toLowerCase()) {
				subscriberDetails = {
					"support": val[2].support,
					"contact": val[4].teknisk_ansvarlig,
					"subscription_status": val[1].abbstatus,
					"service_url": val[5].tjeneste_uri
				};
				// OK - Break loop
				return false;
			}
		});
		
		// Empty object returns false...
		return !$.isEmptyObject(subscriberDetails);
	}
	

	/**
	 * 1. Get an a account for type/number of subscriptions/subscribers in KIND.
	 * 2. Get a sorted list of all subscribers
	 */
	function _getSubscriptionCount(subscribersArr) {
		subscribingOrgNames = [];
		var count = { 'total': 0, 'full': 0, 'trial': 0, 'other': 0 };
		$.each(subscribersArr, function (key, val) {
			switch (val[1].abbstatus) {
				case 20:
					count.full++;
					break;
				case 15:
					count.trial++;
					break;
				default:
					count.other++;
					break;
			}
			count.total++;

			// Simple array just with org names - used extensively elsewhere
			subscribingOrgNames.push(val[0].org.toLowerCase());
		});
		return count;
	}

	/** Accessible **/
	function isSuperAdmin() {
		return (FEIDE_CONNECT.user().username.indexOf("@uninett.no") > -1);
	}

	function isOrgAdmin() {
		if (subscriberDetails) {
			return (FEIDE_CONNECT.user().email.indexOf(subscriberDetails.contact.e_post) > -1);
		}
		return false;
	}

	function getRole() {
		if (isSuperAdmin()) return 'SuperAdmin';
		if (isOrgAdmin()) return 'OrgAdmin';
		return 'Bruker';
	}

	return {
		ready: function () {
			return XHR_KIND;
		},
		subscribers: function () {
			return subscribers;
		},
		subscriptionCount: function () {
			return subscriptionCount;
		},
		subscribingOrgNames: function () {
			return subscribingOrgNames;
		},
		subscriberDetails: function () {
			return subscriberDetails;
		},
		isSubscriber: function () {
			return !$.isEmptyObject(subscriberDetails);
		},
		isSuperAdmin: function () {
			return isSuperAdmin();
		},
		isOrgAdmin: function () {
			return isOrgAdmin();
		},
		role: function () {
			return getRole();
		},

		subscriptionCodesToNames: function () {
			var codes =
				{
					x: ' --- ', 			// Mangler status
					10: 'Bestilt',		    // Bestilt
					15: 'Utprøving',	    // Demo
					20: 'Abonnent',         // Installert
					30: 'Avbestilt',		// Avbestilt
					40: 'Stengt',		    // Nedkoblet
					50: 'Utfasing' 	        // Fjernes
				};
			return codes;
		},
		subscriptionCodesToColors: function () {
			var codes =
				{
					x: 'red', 			// Mangler status
					10: 'blue',   		// Bestilt
					15: 'orange',       // Demo
					20: 'green',        // Installert
					30: 'red',	    	// Avbestilt
					40: 'red',    	    // Nedkoblet
					50: 'red' 	        // Fjernes
				};
			return codes;
		}
	}
})();






