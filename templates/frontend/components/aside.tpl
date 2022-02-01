{if $page !== 'article'}
<aside id="sidebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.interviews"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content">
			<ul>
				{foreach key=field item=message from=$interviews}
					<li>
						<a href="{url page="article" op="view" path=$message['publication_id']}">{$message['setting_value']}</a>
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
					scrolling="no" width="100%" height="100%" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
			</iframe>
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.twitter"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div id="tweet" class="aside-content">
			<a class="twitter-timeline" data-height="350" href="https://twitter.com/Cadernossp">
				Tweets by CadernosSP
			</a>
			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

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
							{include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
						{/foreach}
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
					{* <div><strong>Received:</strong> date </div> *}
					{* <div><strong>Accepted:</strong> date </div> *}
					<div>
						{capture assign=translatedDatePublished}{translate key="submissions.published"}{/capture}
						<strong>{translate key="semicolon" label=$translatedDatePublished}</strong>
						{$publication->getLocalizedData('datePublished')|date_format}
					</div>
				</div>
			</div>
	</aside>
{/if}
