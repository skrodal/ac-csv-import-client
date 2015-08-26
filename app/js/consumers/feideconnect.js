/* global JSO */
//
JSO.enablejQuery($);

var FEIDE_CONNECT = (function () {
	var USER = {};
	USER.org = {};
	var XHR_USER, XHR_GROUPS;

	// Self-invoking
	(function () {
		XHR_USER = _getUserInfo();
		// Remove for now - Feide Connect does not provide reliable info for all orgs 
		// XHR_GROUPS = _getUserGroups();
	})();

	function _getUserInfo() {
		return jso.ajax({
			url: jso.config.get("endpoints").userinfo,
			oauth: { scopes: { request: ["userinfo userinfo-feide userinfo-mail userinfo-photo"] } },
			dataType: 'json'
		})
			.done(function (data, status, res) {
				var user = data.user;

				if(user.userid_sec[0].indexOf("feide:") == -1 ){
					UTILS.showAuthError("Brukerinfo", "Tilgang til tjenesten krever p&aring;logging med Feide. Kan ikke finne ditt Feide brukernavn.");
					return false;
				}

				var username = user.userid_sec[0].split('feide:')[1];
				var org = username.split('@')[1];

				USER.id = user.userid;
				USER.username = username;
				USER.name = {
					full: user.name,
					first: user.name.split(' ')[0]
				};
				USER.email = user.email;
				USER.photo = jso.config.get("endpoints").photo + user.profilephoto;
				USER.org.id = org;
				USER.org.shortname = org.split('.')[0];
				UTILS.updateAuthProgress("Brukerinfo");
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.showAuthError("Brukerinfo", jqXHR);
			});

	}

	/**
	 * Populate USER object with group info, mostly interested in EduPersonAffiliation...
	 */
	function _getUserGroups() {
		return jso.ajax({
			url: jso.config.get("endpoints").groups,
			oauth: { scopes: { request: ["groups"] } },
			dataType: 'json'
		})
			.done(function (groups, status, res) {
				// Defaults
				USER.affiliation = null;
				USER.org.name = null;

				if(groups.length === 0) {
					UTILS.showAuthError("Mangler rettigheter", "Du har dessverre ikke tilgang til denne tjenesten (fikk ikke tak i din tilh&oslash;righet)");
				} else {
					$.each(groups, function (index, group) {
						// orgType is only present for org-type group
						if (group.orgType !== undefined) {
							// TODO: Had to remove the if below since IKT Senteret needs access - I believe they won't qualify as a "higher_education" org
							// We only allow higher ed orgs and check that the group is for same org as user's org
							//if (group.orgType.indexOf("higher_education") >= 0 && group.orgType.indexOf("home_organization") >= 0) { // && group.id.indexOf(USER.org.id) >= 0) {
								// Beware - according to docs, should return a string, not array - reported and may change
								USER.affiliation = group.membership.primaryAffiliation; // https://www.feide.no/attribute/edupersonprimaryaffiliation
								if (USER.affiliation instanceof Array) {
									USER.affiliation = USER.affiliation[0];
								}
								USER.org.name = group.displayName;
								// Done!
								return false;
							//}
						}
					});

					if (USER.affiliation.toLowerCase() !== 'employee') {
						UTILS.showAuthError("Tilh&oslash;righet", "Du mangler tilh&oslash;righet som <code>ansatt</code>!!!!");
					} else {
						UTILS.updateAuthProgress("Grupper");
					}

					USER.groups = groups;
				}
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.showAuthError("Grupper", jqXHR);
			});
	}


	/*** Expose public functions ***/
	return {
		readyUser: function () {
			return XHR_USER;
		},
		// Remove for now - Feide Connect does not provide reliable info for all orgs 
		/*
		readyGroups: function () {
			return XHR_GROUPS;
		},
		*/
		user: function () {
			return USER;
		},
		isEmployee: function () {
			return USER.affiliation.toLowerCase() === 'employee';
		}
	}
})();
