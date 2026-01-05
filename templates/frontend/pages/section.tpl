{**
 * plugins/generic/browseBySection/templates/frontend/pages/section.tpl
 *
 * Copyright (c) 2017 Simon Fraser University
 * Copyright (c) 2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Display the reader-facing section page.
 *
 * @uses $section Section
 * @uses $sectionPath string The URL path for this section
 * @uses $sectionDescription string
 * @uses $articles array List of Submission objects
 * @uses $issues array List of Issue objects the $articles are published in
 * @uses $currentlyShowingStart int 20 in `20-30 of 100 results`
 * @uses $currentlyShowingEnd int 30 in `20-30 of 100 results`
 * @uses $countMax int 100 in `20-30 of 100 results`
 * @uses $currentlyShowingPage int 2 in `2 of 10 pages`
 * @uses $countMaxPage int 10 in `2 of 10 pages`.
 *}

{include file="frontend/components/header.tpl" pageTitleTranslated=$section->getLocalizedTitle()|escape}
{include file="frontend/components/breadcrumbs.tpl" currentTitle=$section->getLocalizedTitle()|escape}
<div class="page page_section page_section_{$sectionPath|escape}">
	<h1 class="page_title">
		{$section->getLocalizedTitle()|escape}
	</h1>

	<div class="section_description">
		{$sectionDescription|strip_unsafe_html}
	</div>

	{if $articleGroups|@count}
		{foreach from=$articleGroups item=group} 
		{if $group.key}
		<div class="cmp_article_header" id="browse_by_section_group_{$group.key|escape}">
		{$group.key|escape}
		</div>
		{/if}
		{assign var=sortedArticles value=[]}
		{foreach from=$group.articles item=unsortedArticle}
			{assign var=publishedDate value=$unsortedArticle->getCurrentPublication()->getData('datePublished')}
			{assign var=timestamp value=$publishedDate|strtotime}
			{if !$timestamp}{assign var=timestamp value=0}{/if}
			{assign var=articleKey value=$timestamp|string_format:"%015d"|cat:'_'|cat:$unsortedArticle->getId()}
			{append var=sortedArticles value=$unsortedArticle index=$articleKey}
		{/foreach}
		{assign var=sortedKeys value=$sortedArticles|@array_keys}
		{assign var=_unused value=$sortedKeys|@rsort}
		<ul class="cmp_article_list">
			{foreach from=$sortedKeys item=articleKey}
				{assign var=article value=$sortedArticles[$articleKey]}
				<li>
					{* TODO remove section=null workaround. article_summary.tpl expects a specific section array. See issue_toc.tpl. *}
					{include file="frontend/objects/article_summary.tpl" section=null showDatePublished=true hideGalleys=true}
				</li>
			{/foreach}
		</ul>
		{/foreach}

		{* Pagination *}
		{if $prevPage > 1}
			{capture assign="prevUrl"}{url|escape router=$smarty.const.ROUTE_PAGE page="section" op="view" path=$sectionPath|to_array:$prevPage}{/capture}
		{elseif $prevPage === 1}
			{capture assign="prevUrl"}{url|escape router=$smarty.const.ROUTE_PAGE page="section" op="view" path=$sectionPath}{/capture}
		{/if}
		{if $nextPage}
			{capture assign="nextUrl"}{url|escape router=$smarty.const.ROUTE_PAGE page="section" op="view" path=$sectionPath|to_array:$nextPage}{/capture}
		{/if}
		{include
			file="frontend/components/pagination.tpl"
			prevUrl=$prevUrl
			nextUrl=$nextUrl
			showingStart=$showingStart
			showingEnd=$showingEnd
			total=$total
		}

	{else}
		<p class="section_empty">
			{translate key="plugins.generic.browseBySection.emptySection"}
		</p>
	{/if}

</div><!-- .page -->

{include file="frontend/components/footer.tpl"}
