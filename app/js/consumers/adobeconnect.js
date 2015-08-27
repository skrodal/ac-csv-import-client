/* global saveTextAsFile */
/* global FEIDE_CONNECT */
/* global $ */
/* global jso */
/* global UTILS */
/**
 * Speaks with Adobe Connect proxy API behind Feide Connect gatekeeper.
 */

var ADOBECONNECT = (function () {
	var SELECTEDFOLDER = {};
	var orgParentFolderSco = false;
	var orgFolderNav = false;
	var CSV_DATA = false;
	var folderPrefix = false;
	var breezeToken = null;
	var serviceVersion = false;
	
	//
	var ajaxSpinner = '<span class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i>&nbsp;&nbsp;Vennligst vent... dette kan ta lang tid!</span>';

	// Mainly for testing/dev
	function _getAPIRoutes() {
		return jso.ajax({
			url: jso.config.get("endpoints").adobeconnect,
			oauth: { scopes: {require: ["gk_ac-csv-import", "gk_ac-csv-import_admin"]} },
			dataType: 'json'
		})
			.done(function (data) {
				console.log(data);
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.alertError("Adobe Connect", "<p>En feil oppstod i samtale med Adobe Connect API:</p><p><code>" + jqXHR.responseJSON.message + "</code></p>");
			});
	}

	// Self invokes
	(function _getACVersion() {
		// if(version) return version;

		return jso.ajax({
			url: jso.config.get("endpoints").adobeconnect + 'version/',
			oauth: { scopes: {require: ["gk_ac-csv-import", "gk_ac-csv-import_admin"]} },
			dataType: 'json'
		})
			.done(function (data) {
				serviceVersion = data.version;
			})
			.fail(function (jqXHR, textStatus, error) {
				var message = jqXHR.responseJSON && jqXHR.responseJSON.message || 'Fikk ingen respons fra tjener. Timeout?';
				UTILS.alertError("Adobe Connect", "<p>En feil oppstod i samtale med Adobe Connect API:</p><p><code>" + message + "</code></p>");
			});
	})();

	// Invoked by APP
	function _getOrgFolderNav() {
		// No need to talk to server if we have already done so
		if(orgFolderNav) return orgFolderNav;

		var orgFolder = FEIDE_CONNECT.user().org.shortname;

		return jso.ajax({
			url: jso.config.get("endpoints").adobeconnect + "folder/" + orgFolder + "/nav/",
			oauth: { scopes: {require: ["gk_ac-csv-import", "gk_ac-csv-import_admin"]} },
			dataType: 'json'
		})
			.done(function (data) {
				if (data.status) {
					breezeToken = data.token;
					orgFolderNav = data.data;
					buildFolderTree();
				}
			})
			.fail(function (jqXHR, textStatus, error) {
				var message = jqXHR.responseJSON && jqXHR.responseJSON.message || 'Fikk ingen respons fra tjener. Timeout?';
				UTILS.alertError("Adobe Connect", "<p>En feil oppstod i samtale med Adobe Connect API:</p><p><code>" + message + "</code></p>");
			});
	}

	function buildFolderTree() {
		$('#acFolderTree').empty();

		$.each(orgFolderNav, function (key, folderObj) {
			if (folderObj["@attributes"].depth == 0) {
				orgParentFolderSco = folderObj["@attributes"]["sco-id"];
				$('#acFolderTree').append(
					'<p id="' + folderObj["@attributes"]["sco-id"] + '" class="parent_folder" style="padding-left: 0px">' +
						'<i class="icon ion-ios-folder-outline folder"></i>&nbsp;&nbsp;' +
						'<strong><span class="folder_select" ' +
						'id="' + folderObj["@attributes"]["sco-id"] + '" ' +
						'data-folder-id="' + folderObj["@attributes"]["sco-id"] + '" ' +
						'data-folder-name="' + folderObj["name"] + '" ' +
						'data-folder-url="' + folderObj["url-path"] + '" ' +
						'data-folder-depth="' + folderObj["@attributes"]["depth"] + '">' + folderObj["name"] +
						'</span></strong>' +
						'</p>' +
						'<div id="' + folderObj["@attributes"]["sco-id"] + '" class="child_folders"></div>'
				);
				getSubfolders(folderObj["@attributes"]["sco-id"], folderObj["@attributes"]["sco-id"]);
			}
		});
		// Update all links to 'Shared Meetings' on Adobe Connect Central
		$('.orgSharedMtgsURL').attr('href', 'https://connect.uninett.no/admin/meeting/folder/list?filter-rows=100&filter-start=0&sco-id=' + orgParentFolderSco + '&tab-id=11004');

	}

	function getSubfolders(parent_folder_id, parent_div_id) {
		var padding = 0;
		var padding_increment = 20;
		var $parent_div = $('#acFolderTree').find('div#' + parent_div_id);

		// List all of roots immediate subfolders
		$.each(orgFolderNav, function (key, folderObj) {
			// If parent_folder_id is parent of this folder
			if (folderObj["@attributes"]["folder-id"] == parent_folder_id) {
				var $current_p = $('p#' + parent_folder_id);
				padding = $current_p.css("padding-left");
				padding = parseInt(padding.substring(0, padding.length - 2));
				padding += padding_increment;
				$parent_div.append(
					'<p id="' + folderObj["@attributes"]["sco-id"] + '" style="padding-left: ' + padding + 'px">' +
						'<i class="icon ion-ios-folder-outline folder"></i>&nbsp;&nbsp;' +
						'<a class="folder_select" style="cursor: pointer;"' +
						'data-folder-id="' + folderObj["@attributes"]["sco-id"] + '" ' +
						'data-folder-name="' + folderObj["name"] + '" ' +
						'data-folder-url="' + folderObj["url-path"] + '" ' +
						'data-folder-depth="' + folderObj["@attributes"]["depth"] + '">' + folderObj["name"] +
						'</a>' +
						'</p>'
				);
				// Get subfolders of last added folder
				getSubfolders(folderObj["@attributes"]["sco-id"], parent_div_id);
			}
		});
	}


	// Invoked by upload button
	function _createRooms($resultModal) {
		var $resultModalBody = $resultModal.find('.modal-body');
		$resultModalBody.html('');

		var new_csv_arr = [];
		// Stupid csv.toArrays actually extracts to an object type... Fix this before submitting
		if (CSV_DATA) {
			$.each(CSV_DATA, function (index, csv) {
				new_csv_arr.push(csv);
			});
			
			// Info
			$resultModalBody.html('<p>1. Kaller Adobe Connect API for oppretting av rom...</p>');
			// Spinner
			$resultModalBody.append(ajaxSpinner);
			
			return jso.ajax({
				url: jso.config.get("endpoints").adobeconnect + "rooms/create/",
				method: 'POST',
				data: {
					user_org_shortname: FEIDE_CONNECT.user().org.shortname,
					room_folder_sco: ADOBECONNECT.selectedFolder().id,
					csv_data: new_csv_arr,
					room_name_prefix: FEIDE_CONNECT.user().org.shortname + '-' + ADOBECONNECT.folderPrefix() + '-' + ADOBECONNECT.selectedFolder().name + '-',
					token : breezeToken
				},
				oauth: { scopes: {require: ["gk_ac-csv-import", "gk_ac-csv-import_admin"]} },
				dataType: 'json'
			})
				.done(function (data) {

					console.log(data);
					// Done! Remove spinner
					$('span:last-child', $resultModalBody).remove();

					if (typeof data === 'object') {
						$resultModalBody.append('<p>&nbsp;&nbsp;&nbsp;&nbsp;OK! Rommene er opprettet!</p>');
						createUsers(data, $resultModal);
					} else {
						$resultModal.modal("hide");
						UTILS.alertError("Oppretting av rom feilet!", "<p>Svar fra Adobe Connect: </p><code>" + JSON.stringify(data, null, 4) + "</code>");
					}
				})
				.fail(function (jqXHR, textStatus, error) {
					$('span:last-child', $resultModalBody).remove();
					$resultModal.modal("hide");
					var message = jqXHR.responseJSON && jqXHR.responseJSON.message || 'Fikk ingen respons fra tjener. Timeout?';
					UTILS.alertError("Adobe Connect", "<p>En feil oppstod i samtale med Adobe Connect API:</p><p><code>" + message + "</code></p>");
				});
		} else {
			$resultModal.modal("hide");
			UTILS.alertError("Mangler CSV!", "<p>Kan ikke opprette rom/brukere uten CSV data.</p>");
		}
	}

	// Invoked by createRooms upon completion
	function createUsers(postData, $resultModal) {
		var $resultModalBody = $resultModal.find('.modal-body');
		// Info
		$resultModalBody.append('<p>2. Kaller Adobe Connect API for oppretting av brukere/hosts...</p>');
		// Spinner
		$resultModalBody.append(ajaxSpinner);

		return jso.ajax({
			url: jso.config.get("endpoints").adobeconnect + "users/create/",
			method: 'POST',
			data: {
				user_org_shortname: FEIDE_CONNECT.user().org.shortname,
				data: postData,
				token: breezeToken
			},
			oauth: { scopes: {require: ["gk_ac-csv-import", "gk_ac-csv-import_admin"]} },
			dataType: 'json',
			timeout: 300000 // 5 mins
		})
			.done(function (data) {
				var labelAutocreatedClass = '';
				var hostStatus = '';
				var responseTable;
				var responseCSV = "room_id,room_name,room_url,manage_url&#13;&#10;";
			
				// Done! Remove spinner
				$('span:last-child', $resultModalBody).remove();
				// Show result summary				
				$resultModalBody.append('<p>&nbsp;&nbsp;&nbsp;&nbsp;OK! Brukere/hosts opprettet! Scroll nedover for informasjon.</p>');

				$resultModalBody.append('<p><span class="label label-success">Rom/Bruker ble opprettet</span></p>');
				$resultModalBody.append('<p><span class="label label-info">Rom/Bruker eksisterte allerede i tjenesten</span></p>');

				responseTable = '<div class="table-responsive no-padding">' +
								'<table class="table table-condensed table-hover table-bordered">' +
									'<tr>' +
										'<th>Rom</th>' +
										'<th>Brukere</th>' +
									'</tr>';

					$.each(data, function(roomNameId, objRoomUsers){
						labelAutocreatedClass = (objRoomUsers.room.autocreated == "true") ? 'label-success' : 'label-info';
						responseCSV += roomNameId + ',' + objRoomUsers.room.name + ',' + objRoomUsers.room.url_path + ',' + 'https://connect.uninett.no/admin/meeting/folder/list?sco-id=' + objRoomUsers.room.folder_id +  '&#13;&#10;';

						responseTable += '<tr>';
							responseTable += '<td><span class="label ' + labelAutocreatedClass + '">' + objRoomUsers.room.name + '</span></td>';
							//
							responseTable += '<td>';
								$.each(objRoomUsers.users, function(index, user){
									labelAutocreatedClass = (user.autocreated == "true") ? 'label-success' : 'label-info';
									hostStatus = (user.host == "true") ? ' <span class="label label-success">m&oslash;tevert</span>' : ' <span class="label label-danger">IKKE m&oslash;tevert</span>';
									responseTable += '<p><span class="label ' + labelAutocreatedClass + '">' + user.username + '</span> ' + hostStatus + '</p>';
								});
							responseTable += '</td>';

						responseTable += '</tr>';
					});
				responseTable += '</table></div>';
				//
				$resultModalBody.append("<h4>Status:</h4>");
				$resultModalBody.append(responseTable);

				$resultModalBody.append("<h4>CSV data: </h4><p>Om nettleser st&oslash;tter det, ble CSV automatisk lagret til disk. Evt. kan du kopiere teksten nedenfor.</p>");
				$resultModalBody.append('<textarea id="responseCSV" style="width: 100%;" rows="8">' + responseCSV + '</textarea>');
				$resultModalBody.append('<p>G&aring; til <a href="' + $('.orgSharedMtgsURL:first').attr('href') + '" target="_blank">Adobe Connect Central</a> <small><sup><i class="fa fa-external-link"></i></sup></small> og sjekk status p&aring; rommene.</p>');

				$resultModalBody.append("<h4>R&aring;data (JSON):</h4>");
				$resultModalBody.append('<textarea style="width: 100%;" rows="8">' + JSON.stringify(data, null, 4) + '</textarea>');

				saveTextAsFile("responseCSV", "ConnectImport_" + folderPrefix);
			})
			.fail(function (jqXHR, textStatus, error) {
				// Hide spinner
				$('span:last-child', $resultModalBody).remove();
				$resultModalBody.modal("hide");
				var message = jqXHR.responseJSON && jqXHR.responseJSON.message || 'Fikk ingen respons fra tjener. Timeout?';
				UTILS.alertError("Adobe Connect", "<p>En feil oppstod i samtale med Adobe Connect API:</p><p><code>" + message + "</code></p>");
				console.log(jqXHR);
				console.log(textStatus);
				console.log(error);
			});
	}


	// ----------- SETTERS ----------- //

	function setCSVData(csvData) {
		CSV_DATA = csvData;
		_updateSummaryStatus();
	}

	function setSelectedFolder(folderInfo) {
		SELECTEDFOLDER = folderInfo;
		_updateSummaryStatus();
	}

	function setFolderPrefix(prefix) {
		folderPrefix = prefix;
		_updateSummaryStatus();
	}

	// ----------- ./SETTERS ----------- //

	/**
	 * Updates UI
	 * @private
	 */
	function _updateSummaryStatus() {
		var success = '<i class="icon ion-checkmark-circled"></i>';
		if (SELECTEDFOLDER.name) {
			$('#folderCheck').html(success).removeClass('bg-yellow').addClass('bg-green');
			$('.selectedFolderName').html(SELECTEDFOLDER.name);
		}

		if (folderPrefix) {
			$('#prefixCheck').html(success).removeClass('bg-yellow').addClass('bg-green');
			$('.selectedFolderPrefix').html(folderPrefix);
		}

		if (CSV_DATA) {
			$('#csvCheck').html(success).removeClass('bg-yellow').addClass('bg-green');
			$('#btnShowCSV').removeClass('hidden');
		}
	}

	function _hasRequiredPostDataCheck() {
		var hasRequiredData = (SELECTEDFOLDER.name && folderPrefix && CSV_DATA );
		// Enable submit button
		if (hasRequiredData) {
			$('#btnSubmitPostData').removeClass('disabled');
		}
		return hasRequiredData;
	}


	return {
		getAPIRoutes: function () {
			return _getAPIRoutes();
		},
		getOrgFolderNav: function () {
			return _getOrgFolderNav();
		},
		createRooms: function ($resultModal) {
			if(_hasRequiredPostDataCheck())
				return _createRooms($resultModal);
			else
				return false;
		},
		hasRequiredPostData: function () {
			return _hasRequiredPostDataCheck();
		},
		setCSVData: function (csvData) {
			setCSVData(csvData);
			_hasRequiredPostDataCheck();
		},
		CSVData: function () {
			return CSV_DATA;
		},
		setSelectedFolder: function (folderInfo) {
			setSelectedFolder(folderInfo);
			_hasRequiredPostDataCheck();
		},
		selectedFolder: function () {
			return SELECTEDFOLDER;
		},
		setFolderPrefix: function (prefix) {
			setFolderPrefix(prefix);
			_hasRequiredPostDataCheck();
		},
		folderPrefix: function () {
			return folderPrefix;
		},
		orgFolderNav: function () {
			return orgFolderNav;
		},
		version: function () {
			return serviceVersion;
		}
	}
})(); // Self-invoking






