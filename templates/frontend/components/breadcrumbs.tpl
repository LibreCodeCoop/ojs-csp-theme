{**
 * templates/frontend/components/breadcrumbs.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Display a breadcrumb nav item showing the current page. This basic
 *  version is for top-level pages which only need to show the Home link. For
 *  category- and series-specific breadcrumb generation, see
 *  templates/frontend/components/breadcrumbs_catalog.tpl.
 *
 * @uses $currentTitle string The title to use for the current page.
 * @uses $currentTitleKey string Translation key for title of current page.
 *}

<nav class="breadcrumb-link cmp_breadcrumbs" role="navigation" aria-label="{translate key="navigation.breadcrumbLabel"}">
	<ol class="breadcrumb csp-breadcrumb">
		<li>
			<a href="{$baseUrl}">
				{translate key="common.homepageNavigationLabel"}
			</a>
		</li>
		{if $page == "issue"}
			{if $op == "view"}
				<li>
					<a href="{url router=$smarty.const.ROUTE_PAGE page="issue" op="archive"}">
						{translate key="navigation.archives"}
					</a>
				</li>
				<li class="active">
					{$issue->getIssueIdentification()|escape}
				</li>
			{else}
				<li class="active">
					{translate key="navigation.archives"}
				</li>
			{/if}
		{elseif $page == "article"}
			<li>
				{* <a href="{url page="issue" op="view" path=$issue->getBestIssueId($currentJournal)}">
					{$issue->getIssueIdentification()|escape}
				</a> *}
			</li>
			<li class="active">
				{$section->getLocalizedTitle()}
			</li>
		{elseif $page == "announcement"}
			<li class="active">
				{$announcement->getLocalizedTitle()|escape}
			</li>
		{else}
			<li class="active">
				{translate key=$pageTitle}
			</li>
		{/if}
	</ol>
</nav>
