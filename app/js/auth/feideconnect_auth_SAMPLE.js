/**
 * Feide Connect JSO kickoff for this client.
 *
 * Auth and collection of user/group info, all combined in a USER object.
 *
 */

// Global vars
var DEV = !true;

// Settings pertaining to this client.
var jso = new JSO({
	providerID: "CHANGEME TO: ANYTHING",
	client_id: "CHANGEME TO: CLIENT_ID IN DASHBOARD",
	redirect_uri: "CHANGEME TO: REDIRECT URI IN DASHBOARD",
	authorization: "https://auth.feideconnect.no/oauth/authorization",
	scopes: {
		request: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_ecampus-kind", "gk_ecampus-kind_admin", "gk_ac-csv-import", "gk_ac-csv-import_admin"],
		require: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_ecampus-kind", "gk_ecampus-kind_admin", , "gk_ac-csv-import", "gk_ac-csv-import_admin"]
	},
	endpoints: {
		groups: "https://groups-api.feideconnect.no/groups/me/groups",
		userinfo: "https://auth.feideconnect.no/userinfo",
		photo: "https://auth.feideconnect.no/user/media/",
		kind: "https://ecampus-kind.gk.feideconnect.no/api/kind-proxy/",
		adobeconnect: "https://ac-csv-import.gk.feideconnect.no/api/ac-csv-import/"
	},
	kind: {
		adobeConnectId: "99884"
	}
});

jso.callback();
// Catch response
jso.getToken(function (token) {
	// console.log('Authorization: Bearer ' + token.access_token);
	// console.log(JSON.stringify(token, undefined, 2));
});


