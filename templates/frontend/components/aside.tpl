{if $page !== 'article' && $page !== 'login'}
<div>
	{include file="frontend/components/social-media.tpl"}
	{if $additionalHomeContent}
		<div class="aside-container">
			{$additionalHomeContent}
		</div>
	{/if}
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
		<div class="content-csp">
		<a href="https://periodicos.fiocruz.br/pt-br" target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/portal-periodicos.jpg" />
		</a>
		</div>
		<div class="content-csp">
		<a href="https://www.scielo.br/j/csp/"target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/scielo.svg" />
		</a>
		</div>
	</div>
</div><!-- pkp_sidebar.left -->
{/if}
{if $page !== 'login'}
	<div>
		{* Article Galleys *}
			{if $primaryGalleys || $supplementaryGalleys}
				<div class="csp-download">
					{if $supplementaryGalleys}
						{foreach from=$supplementaryGalleys item=galley}
							{if ($galley->getFileType()|escape == 'text/xml' or $galley->getFileType()|escape == 'text/html')}
								{assign var="xmlExist" value=$xmlExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
							{/if}
							{if (($galley->getLocale() ==  $navigationLocale) && ($galley->getFileType()|escape == 'application/pdf'))}
								{assign var="pdfExist" value=$pdfExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
							{/if}
						{/foreach}
						{if !$pdfExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'en') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'pt_BR') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$supplementaryGalleys item=galley}
								{if (($galley->getLocale() ==  'es') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
								{/if}
							{/foreach}
						{/if}
					{/if}

					{if $primaryGalleys}
						{foreach from=$primaryGalleys item=galley}
							{if ($galley->getFileType()|escape == 'text/xml' or $galley->getFileType()|escape == 'text/html')}
								{assign var="xmlExist" value=$xmlExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
							{/if}
							{if (($galley->getLocale() ==  $navigationLocale) && ($galley->getFileType()|escape == 'application/pdf'))}
								{assign var="pdfExist" value=$pdfExist+1}
								{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
							{/if}
						{/foreach}
						{if !$pdfExist}
							{foreach from=$primaryGalleys item=galley}
								{if (($galley->getLocale() ==  'en') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$primaryGalleys item=galley}
								{if (($galley->getLocale() ==  'pt_BR') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
								{/if}
							{/foreach}
						{/if}
						{if !$pdfExist}
							{foreach from=$primaryGalleys item=galley}
								{if (($galley->getLocale() ==  'es') && ($galley->getFileType()|escape == 'application/pdf'))}
									{assign var="pdfExist" value=$pdfExist+1}
									{include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
								{/if}
							{/foreach}
						{/if}
					{/if}
				</div>
			{/if}
			{* how to cite *}
			{if $citation}
				<div class="csp-cite">
					<strong>{translate key="submission.howToCite"}</strong>
					<div class="csl-bib-body">
						<div class="csl-entry">
							{$citation}
						</div>
					</div>
				</div>
			{/if}
			{if $dates}
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
			{/if}
	</div>
{/if}