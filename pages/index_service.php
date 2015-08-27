<!-- Main content -->
    <section id="pageService" class="content app_page hidden">
	    <class class="row">
		    <class class="col-lg-12">
			    <div class="box box-solid">
				    <div class="box-header">
					    <h3 class="box-title">Klar - ferdig - g&aring;...</h3>
				    </div>
				    <div class="box-body">
					    <p>
						    F&oslash;lg instruksjonene fra 1-3 under og klikk deretter p&aring; den store knappen!
					    </p>
				    </div>
			    </div>
		    </class>
	    </class>


	    <div class="row">
			<div class="col-lg-4 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-folder-outline"> 1. Velg mappe for m&oslash;terom</h3>
					</div>
					<div class="box-body">
						<p>
							Her kan du angi hvor m&oslash;terommene skal opprettes i Adobe Connect. Alle m&oslash;terom vil legges i denne mappa.
						</p>

						<p>
							Denne tjenesten vil <b>ikke</b> opprette nye mapper for deg, det kan du evt. gj&oslash;re manuelt i
							<a class="orgSharedMtgsURL" href="https://connect.uninett.no" target="_blank">Adobe Connect Central</a> <small><sup><i class="fa fa-external-link"></i></sup></small>.
						</p>

						<p>
							Vi fant disse mappene under <code>Shared Meetings</code> for ditt l&aelig;rested:
						</p>

						<div id="acFolderTree">
							<!-- ADOBECONNECT.folderTree -->
						</div>
					</div>
					<div class="box-footer">
						<span class="icon ion-ios-information">
							Du har valgt mappe: <code class="selectedFolderName">INGEN MAPPE VALGT</code>
						</span>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>

			<div class="col-lg-4 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> 2. Lim inn CSV</h3>
					</div>
					<div class="box-body">
						<p>
							Lim inn <a href="https://no.wikipedia.org/wiki/CSV" target="_blank">CSV</a> <small><sup><i class="fa fa-external-link"></i></sup></small> med f&oslash;lgende struktur: <code>rom_id</code>, <code>feide_brukernavn</code>:
						</p>

							<textarea name="" id="txtCSV" class="form-control" rows="6" style="width: 100%;" placeholder="rom,brukernavn"></textarea>
<!-- Testdata - paste into textarea above...
gruppe_1, borborson@uninett.no
gruppe_1, test@feide.no
gruppe_2, frank_foreleser@spusers.feide.no
gruppe_2, simon@uninett.no
-->


						<br/>
						<ul class="list-group">
						  <li class="list-group-item">
							  Inkluder <strong>kun</strong> datarader i CSV, <strong>ikke</strong> tittelrad!
						  </li>
						  <li class="list-group-item">
							  Kun komma-separering (ikke semikolon)
						  </li>
						  <li class="list-group-item">
							  Husk linjeskift for hvert innslag...
						  </li>
						</ul>
					</div><!-- /.box-body -->
					<div class="box-footer clearfix">
						<button id="btnCheckCSV" data-toggle="modal" data-target="#csvPreviewModal" class="btn btn-info btn-sm pull-right icon ion-checkmark"> Sjekk format</button>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>



			<div class="col-lg-4 col-md-12">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-pricetag"> 3. Definer URL Prefiks</h3>
					</div>
					<div class="box-body">
						<p>
							URL til m&oslash;terommene m&aring; v&aelig;re unike. Vi bygger derfor romnavn/URL etter f&oslash;lgende formel:
						</p>

						<div id="exampleURL" class="well well-sm">
							<small>https://connect.uninett.no/<code>{org}</code>-<code>{prefiks}</code>-<code>{mappe}</code>-<code>{rom_id}</code></small>
						</div>

						<p>
							...der {rom-id} kommer fra CSV-lista di.
						</p>

						<p>
							Med <code>prefiks</code> kan du bygge inn mer metadata i romnavn/url, eks: <code>2015-Matte101-vaar</code>
						</p>
					</div><!-- /.box-body -->
					<div class="box-footer">
						<div class="input-group input-group-sm">
							<input id="txtMeetingRoomPrefix" type="text" class="form-control" placeholder="Skriv inn prefiks">
							<span class="input-group-btn">
								<button id="btnBuildExampleURL" class="btn btn-info btn-flat" type="button">Oppdater eksempel</button>
							</span>
						</div>

						<small>Godkjent er alfanumeriske tegn (<b>ikke</b> &aelig;&oslash;&aring;) samt '-' og '_'. Prefiks m&aring; starte/slutte med bokstav eller tall.</small>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
			<div class="col-lg-6">
				<!-- Session info (DEV) -->
				<div class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-information"> Oppsummering:</h3>
					</div>
					<div class="box-body">
						<ul class="list-group">
						  <li class="list-group-item">
							  <span id="folderCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i>&nbsp;&nbsp;Mangler</span>
							  Valgt mappe &nbsp;&nbsp; <code class="selectedFolderName">-</code>
						  </li>
						  <li class="list-group-item">
							  <span id="csvCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i>&nbsp;&nbsp;Mangler</span>
							  CSV godkjent &nbsp;&nbsp; <a href="#" id="btnShowCSV" data-toggle="modal" data-target="#csvPreviewModal" class="hidden">(se p&aring;...)</a>
						  </li>
						  <li  class="list-group-item">
							  <span id="prefixCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i>&nbsp;&nbsp;Mangler</span>
							  Prefiks &nbsp;&nbsp; <code class="selectedFolderPrefix">-</code>
						  </li>
						</ul>
					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>

			<div class="col-lg-6">
				<!-- Session info (DEV) -->
				<div class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title ion-checkmark"> Kj&oslash;r!</h3>
					</div>
					<div class="box-body">
						<p>N&aring; du har fulgt stegene 1-2-3 og er forn&oslash;yd med jobben, klikk knappen under :-)</p>

						<div class="text-center">
							<button id="btnSubmitPostData" class="btn btn-app btn-lg bg-aqua disabled"> <!-- data-toggle="modal" data-target="#resultModal"> -->
	                            <i class="fa fa-cloud-upload"></i>
	                        </button>
						</div>

						<p>OBS! Adobe Connect snakker mye og sakte s&aring; dette kan ta litt tid... <b>ikke</b> lukk/refresh dette vinduet f&aring;r du har f&aring;tt svar!</p>
					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>
		</div>
	</section>

<script src="app/js/consumers/adobeconnect.js"></script>
<script src="app/js/index_service.js"></script>
<script src="app/js/etc/saveTextAsFile.js"></script>

	<!-- CSV Table Modal -->
	<div id="csvPreviewModal" class="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header bg-light-blue">
					<button type="button" class="close" data-dismiss="modal" aria-label="Lukk"><span aria-hidden="true">×</span></button>
					<h4 class="modal-title">CSV Sjekk</h4>
				</div>
				<div class="modal-body" style="max-height: calc(100vh - 212px); overflow-y: auto;">
					<div class="alert alert-warning">
                        <h4><i class="icon fa fa-warning"></i> Tomt!</h4>
                        Fant ikke CSV. Har du husket å lime inn i tekstfeltet?
                    </div>
					<!-- ADOBECONNECT -->
				</div>
				<div class="modal-footer bg-light-blue">
				<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
				</div>
			</div>
		</div>
	</div>

	<!-- CSV table template (for cloning) -->
	<div id="csvTableTemplate" class="hidden">
		<table class="table table-bordered table-condensed table-hover">
			<tbody>
				<tr class="info">
					<th style="width: 10%">Rom</th>
					<th>Bruker</th>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- RESULT Modal -->
	<div id="resultModal" class="modal" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header bg-light-blue">
					<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Lukk"><span aria-hidden="true">×</span></button> -->
					<h4 class="modal-title">Oppsummering</h4>
				</div>
				<div class="modal-body" style="max-height: calc(100vh - 212px); overflow-y: auto;">
					<!-- ADOBECONNECT -->
				</div>
				<div class="modal-footer bg-light-blue">
					<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
				</div>
			</div>
		</div>
	</div>






