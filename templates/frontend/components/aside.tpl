{if $page !== 'article'}
<aside id="sidebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.interviews"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content">
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.videos"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content" id="video">
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.podcasts"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div class="aside-content">
		</div>
	</div>
	<div class="aside-container">
		<div class="aside-item">
			<span>{translate|escape key="plugins.themes.csp.sidebar.twitter"}</span>
			<div class="aside-more" onclick="eventClick(this)"></div>
		</div>
		<div id="tweet" class="aside-content">
			<a class="twitter-timeline" data-height="350" href="https://twitter.com/CadernosSP?ref_src=twsrc%5Etfw">
				Tweets by CadernosSP
			</a>
			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>
	</div>
	<div class="aside-container">
		<div class="content-csp">
		<a href="https://periodicos.fiocruz.br/pt-br" target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/portal.jpg" />
		</a>
		</div>
		<div class="content-csp">
		<a href="https://www.scielo.br/scielo.php?script=sci_issues&pid=0102-311X&lng=pt&nrm=iso"target="_blank">
			<img src="{$baseUrl}/plugins/themes/csp/assets/scielo.jpg" />
		</a>
		</div>
	</div>
</aside><!-- pkp_sidebar.left -->
{else}
	<aside id="articlebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3 article-aside" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
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
				<div class="csp-border-mid"></div>
			{/if}
			{* how to cite *}
			<div class="csp-cite">
				<strong>{translate key="submission.howToCite"}</strong>
				{$citation}
			</div>

			<div class="csp-border-mid"></div>

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
