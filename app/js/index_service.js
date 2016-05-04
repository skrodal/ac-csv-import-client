// Update selected folder
$(document).on('click', 'a.folder_select', function () {
	var FOLDERINFO = {};
	FOLDERINFO.id = $(this).attr('data-folder-id');
	FOLDERINFO.name = $(this).attr('data-folder-name');
	FOLDERINFO.path = $(this).attr('data-folder-url');

	$("i.folder").removeClass("ion-ios-folder").addClass("ion-ios-folder-outline");
	$(this).prev("i").removeClass("ion-ios-folder-outline").addClass("ion-ios-folder");

	$("a.folder_select").removeClass("bold text-red");
	$(this).addClass("bold text-red");
	ADOBECONNECT.setSelectedFolder(FOLDERINFO);
});

// Check/set CSV
$('#btnCheckCSV').on('click', function(){
	if($('#txtCSV').val().length < 1) {
		UTILS.alertError('Tomt?', 'Lim inn CSV i tekstfeltet f&oslash;rst.');
		return false;
	}
	var $container = $('#csvPreviewModal').find('div.modal-body');
	$container.html('');

	try {
		$.csv.toArrays($('#txtCSV').val().trim(), {}, function(err, CSVData){
			// Make sure there is enough data
			if(CSVData.length < 2) {
				$container.html(
					'<div class="alert alert-warning">' +
						'<h4><i class="icon fa fa-warning"></i> Lite innhold...</h4>' +
						'<p>For at dette skal v&aelig;re verdt det kunne du lagt til minst to rader da!</p>' +
						'</div>');
				return false;
			}
			generateTableFromCSV(CSVData);
		});
	} catch (err){
		$container.html(
			'<div class="alert alert-warning">' +
				'<h4><i class="icon fa fa-warning"></i> Feil i CSV!</h4>' +
				'<p>'+err.message+'</p>' +
				'</div>');
		UTILS.alertError('CSV Feil', err.message);
	}

});

// Show stored CSV data
$('#btnShowCSV').on('click', function(){
	if(!ADOBECONNECT.CSVData()){
		UTILS.alertError('Mangler', 'Ingen CSV er satt.')
		return false;
	}
	generateTableFromCSV(ADOBECONNECT.CSVData());
})



// Check/set prefix
$('#btnBuildExampleURL').on('click', function(){
	var prefix = $('#txtMeetingRoomPrefix').val();
	// Check
	if(prefix.length < 1) {
		UTILS.alertError('Tomt?', 'Skriv inn en prefiks i feltet f&oslash;rst.')
	} else if(UTILS.isAlphaNumeric(prefix)) {
		$('#exampleURL').html('<small>https://connect.uninett.no/<code>' + DATAPORTEN.user().org.shortname + '</code>-<code>' + prefix + '</code>-<code>' + ADOBECONNECT.selectedFolder().name + '</code>-<code>{rom_id}</code></small>');
		$('#exampleURL').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		// Set
		ADOBECONNECT.setFolderPrefix(prefix);
	} else {
		UTILS.alertError('Ulovlige tegn', 'Godkjent: <code>a-z A-Z 0-9 -_</code>');
	}
});

$('#btnSubmitPostData').on('click', function(){
	if(ADOBECONNECT.hasRequiredPostData()){
		ADOBECONNECT.createRooms($('#resultModal'));
		$('#resultModal').modal();
	} else {
		UTILS.alertError('Vent litt...', 'Mangler fortsatt noe info før du kan g&aring; videre. F&oslash;lg steg 1-3...');
	}
});



function generateTableFromCSV(CSVData){
	var $container = $('#csvPreviewModal').find('div.modal-body');
	//
	var roomId = 'NOT SET'; var tables = ''; var $tableClone = $('#csvTableTemplate').clone(); var $tmpClone = false;
	var room, user;
	// Important!
	CSVData.sort(function(a, b) {
		return a[0] > b[0] ? 1 : -1;
	});

	var errorInCSV = false;
	$container.html('');

	// CSV is array [0] id, [1] user
	$.each(CSVData, function(index, csv){
		// We want two columns only, break otherwise.
		if(csv.length !== 2) {
			tables = '';
			$container.html(
				'<div class="alert alert-warning">' +
					'<h4><i class="icon fa fa-warning"></i> Feil format i CSV!</h4>' +
					'<p>Jeg forventer to (2) kolonner per rad, hverken mer eller mindre!</p>' +
					'</div>');
			errorInCSV = true;
			return false;
		}

		room = CSVData[index][0] = csv[0].trim(); user = CSVData[index][1] = csv[1].trim();

		if( room.length == 0 || user.length == 0 ) {
			tables = '';
			$container.html(
				'<div class="alert alert-warning">' +
					'<h4><i class="icon fa fa-warning"></i> Tomme felter</h4>' +
					'<p>En eller flere felter i CSVen din mangler verdi.</p>' +
					'</div>');
			errorInCSV = true;
			return false;
		}

		// New room, new table...
		if(roomId !== room){
			if($tmpClone !== false) tables += $tmpClone.html();
			roomId = room;
			$tmpClone = $tableClone.clone();
			$tmpClone.find('.table').attr('id', 'room_' + roomId);
		}

		$tmpClone.find('#room_' + roomId).find('tbody').append(
			'<tr><td>' + room + '</td><td>' + user + '</td></tr>'
		);
	});
	// As long as no errors were caught in the $.each loop...
	if(!errorInCSV) {
		tables += $tmpClone.html();
		$container.html(tables);
		ADOBECONNECT.setCSVData(CSVData);
	}
}

