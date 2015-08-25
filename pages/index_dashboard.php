<!-- Main content -->
    <section id="pageDashboard" class="content app_page hidden">
	    <div class="row">
			<div class="col-md-6">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-information-outline"> Om tjenesten</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>
							Hei <span class="userFirstName"></span>!
						</p>
						<p>
							Denne tjenesten lar deg opprette m&oslash;terom i Adobe Connects <code>Shared Meetings</code> folder og knytte spesifikke
							(Feide)brukere til disse rommene. Alle brukere vil f&aring; rettigheter som <code>host</code> (m&oslash;tevert) i rom de er knyttet til.
						</p>
						<p>
							For &aring; kunne bruke tjenesten gjelder f&oslash;lgende kriterier:
						</p>

						<ul class="list-group">
						  <li class="list-group-item">
							  <span id="employeeCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i></span>
							  Tilh&oslash;righet som <code>ansatt</code> i Feide
						  </li>
						  <li class="list-group-item">
							  <span id="subscriberCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i></span>
							  <code class="feideOrg"></code> abonnerer p&aring; Adobe Connect
						  </li>
						  <li  class="list-group-item">
							  <span id="acFolderCheck" class="badge bg-yellow"><i class="fa fa-refresh fa-spin"></i></span>
							  Tilgang til mappe <code>Shared Meetings /<span class="feideOrgShortname"></span></code>
						  </li>
						</ul>

						<div id="acFolderError" class="alert alert-danger hidden">
							<h4><i class="icon fa fa-warning"></i> Samtale med Adobe Connect feilet</h4>
							<p>
								Dette gikk ikke s&aring; bra... Fors&oslash;k en refresh i nettleseren - om det ikke virker
								kan du varsle om problemet til <a href="mailto:simon.skrodal@uninett.no">simon.skrodal@uninett.no</a>.
							</p>
						</div>

					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>

			<div class="col-md-6">
				<!-- Session info (DEV) -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> Forutsetninger</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>
							Import av rom/brukere krever f&oslash;lgende struktur (<a href="https://no.wikipedia.org/wiki/CSV" target="_blank">CSV</a> <small><sup><i class="fa fa-external-link"></i></sup></small>: <code>rom_id</code>, <code>feide_brukernavn</code>):
						</p>
						<well>
<pre>
1, bruker1@org.no
1, bruker2@org.no
2, bruker4@org.no
2, bruker5@org.no
.., ..
.., ..</pre>
						</well>
						<p>
							...der <code>rom_id</code> blir en del av m&oslash;teromsnavnet (og URL) og <code>feide_brukernavn</code>
							knyttes til rommmet med rettigheter som <code>host</code> (m&oslash;tevert).
						</p>

						<p>
							Dersom <code>feide_brukernavn</code> ikke eksisterer i Adobe Connect vil bruker opprettes automatisk.
						</p>
					</div><!-- /.box-body -->
					<div class="box-footer">
						<span class="text-muted icon ion-android-alert">&nbsp;
							<small>
								Inkluder <strong>kun</strong> datarader i CSV, <strong>ikke</strong> tittelrad!
							</small>
						</span>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->
			</div>
		</div>

	    <div class="row">
			<div class="col-md-6">
				<!-- Session info (DEV) -->
				<div class="box box-warning collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title ion-code-working"> Sesjonsinformasjon (fra Feide Connect)</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<pre id="connectSessionInfo"></pre>
					</div><!-- /.box-body -->
				</div><!-- /.box -->
			</div>
		</div>
	</section>

<script src="app/js/app.js"></script>