/**
 * Dataporten JSO kickoff for this client.
 *
 * Auth and collection of user/group info, all combined in a USER object.
 *
 */

// Global vars
var DEV = !true;

// Settings pertaining to this client.
var jso = new JSO({
	providerID: "DP-ac-csv-import",
	client_id: "CHANGEME TO: CLIENT_ID IN DASHBOARD",
	redirect_uri: "CHANGEME TO: REDIRECT URI IN DASHBOARD",
	authorization: "https://auth.dataporten.no/oauth/authorization",
	scopes: {
		request: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_ecampus-kind", "gk_ecampus-kind_admin", "gk_ac-csv-import", "gk_ac-csv-import_admin"],
		require: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_ecampus-kind", "gk_ecampus-kind_admin", , "gk_ac-csv-import", "gk_ac-csv-import_admin"]
	},
	endpoints: {
		groups: "https://groups-api.dataporten.no/groups/me/groups",
		userinfo: "https://auth.dataporten.no/userinfo",
		photo: "https://auth.dataporten.no/user/media/",
		kind: "CHANGEME TO: Find URL in Dataporten Dashboard",
		adobeconnect: "CHANGEME TO: Find URL in Dataporten Dashboard"
	},
	kind: {
		adobeConnectId: "CHANGEME TO: KIND Service ID"
	}
});

jso.callback();
// Catch response
jso.getToken(function (token) {
	// console.log('Authorization: Bearer ' + token.access_token);
	// console.log(JSON.stringify(token, undefined, 2));
});


