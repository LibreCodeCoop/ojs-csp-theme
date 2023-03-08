{if $page !== 'article'}
<aside id="sidebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.interviews"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content">
			<ul>
				{foreach from=$interviews item=interview}
					<li>
						<a target="_blank" href="{url page="article" op="view" path=$interview->publication_id}">{$interview->setting_value}</a>
					</li>
				{/foreach}
			</ul>
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.videos"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content" id="video">
			<iframe width="100%"
					src="https://www.youtube.com/embed/+lastest?list=PLjxv_Q_71tpYCzJQpHiyeq-tmEvQVEujA"
					frameborder="0" allowfullscreen>
			</iframe>
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.podcasts"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content">
			<iframe src="https://open.spotify.com/embed/show/4dSWUdWQCTb2hDthntM0ZP"
					frameBorder="0" allowfullscreen=""
					scrolling="no" width="100%" height="80px" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
			</iframe>
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.twitter"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div id="tweet" class="aside-content">
			<a class="twitter-timeline" href="https://twitter.com/CadernosSP?ref_src=twsrc%5Etfw">Tweets by CadernosSP</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>
	</div>
	<div class="aside-container">
		<div class="content-csp">
		<a href="https://periodicos.fiocruz.br/pt-br" target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/portal-periodicos.svg" />
		</a>
		</div>
		<div class="content-csp">
		<a href="https://www.scielo.br/scielo.php?script=sci_issues&pid=0102-311X&lng=pt&nrm=iso"target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/scielo.svg" />
		</a>
		</div>
	</div>
</aside><!-- pkp_sidebar.left -->
{else}
	<aside id="articlebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
		{* Article Galleys *}
			{if $primaryGalleys || $supplementaryGalleys}
				<div class="csp-download">
					{if $primaryGalleys}
						{foreach from=$primaryGalleys item=galley}
							{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
						{/foreach}
					{/if}
					{if $supplementaryGalleys}
						{foreach from=$supplementaryGalleys item=galley}
							{if (($galley->getLocale() ==  $navigationLocale) && ($galley->_submissionFile->getData('mimetype') == 'text/xml') or $galley->_submissionFile->getData('mimetype') == 'text/html')}
								{assign var="xmlExist" value=$xmlExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
							{/if}
							{if (($galley->getLocale() ==  $navigationLocale) && ($galley->_submissionFile->getData('mimetype') == 'application/pdf'))}
								{assign var="pdfExist" value=$pdfExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
							{/if}
						{/foreach}
						{if !$xmlExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'en_US') && ($galley->_submissionFile->getData('mimetype') == 'text/xml' or $galley->_submissionFile->getData('mimetype') == 'text/html'))}
									{assign var="xmlExist" value=$xmlExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'en_US') && ($galley->_submissionFile->getData('mimetype') == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
						{if !$xmlExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'pt_BR') && ($galley->_submissionFile->getData('mimetype') == 'text/xml' or $galley->_submissionFile->getData('mimetype') == 'text/html'))}
									{assign var="xmlExist" value=$xmlExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'pt_BR') && ($galley->_submissionFile->getData('mimetype') == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
					{/if}
				</div>
			{/if}
			{* how to cite *}
			<div class="csp-cite">
				<strong>{translate key="submission.howToCite"}</strong>
				<div class="csl-bib-body">
					<div class="csl-entry">
						{$citation}
					</div>
				</div>
			</div>
			<div class="list-group">
				{* test date *}
				<div class="csp-date">
					{if $dates.received}
						<strong>{translate key="plugins.themes.csp.dates.received"}</strong> {$dates.received|date_format} <br/>
					{/if}
					{if $dates.accepted}
						<strong>{translate key="plugins.themes.csp.dates.accepted"}</strong> {$dates.accepted|date_format} <br/>
					{/if}
				</div>
			</div>
	</aside>
{/if}
