{**
 * templates/frontend/pages/issueArchive.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Display a list of recent issues.
 *
 * @uses $issues Array Collection of issues to display
 * @uses $prevPage int The previous page number
 * @uses $nextPage int The next page number
 * @uses $showingStart int The number of the first item on this page
 * @uses $showingEnd int The number of the last item on this page
 * @uses $total int Count of all published monographs
 *}
{capture assign="pageTitle"}
	{if $prevPage}
		{translate key="archive.archivesPageNumber" pageNumber=$prevPage+1}
	{else}
		{translate key="archive.archives"}
	{/if}
{/capture}
{include file="frontend/components/header.tpl" pageTitleTranslated=$pageTitle}

<div id="main-content" class="page page_issue_archive">
	{include file="frontend/components/breadcrumbs.tpl" currentTitle=$pageTitle}

	{* No issues have been published *}

	{if empty($issues)}
		<div class="alert alert-info" role="alert">
			{translate key="current.noCurrentIssueDesc"}
		</div>
	{else}
		{* List issues *}
		<div class="issues media-list">
			<table>
				<tr>
					<th>{translate key="issue.year"}</th>
					<th>{translate key="issue.volume"}</th>
					<th colspan=20>{translate key="issue.number"}</th>
				</tr>
				{foreach from=$issues key=$key item=$year}
				<tr>
					<td>{$key}</td>
					{foreach from=$year key=$key item=$volume}
						<td>{$key}</td>
						<td>
						{foreach from=$volume key=$key item=$issue}
							<a href="{url|escape op="view" path=$issue}" class="archiveButton">{$key}</a>
							{* 	{include file="frontend/objects/issue_summary.tpl"} *}
						{/foreach}
						</td>
					{/foreach}
				</tr>
				{/foreach}
				<tr><br></tr>
			</table>
		</div>

		{* Pagination *}
{* 		{if $prevPage > 1}
			{capture assign=prevUrl}{url router=$smarty.const.ROUTE_PAGE page="issue" op="archive" path=$prevPage}{/capture}
		{elseif $prevPage === 1}
			{capture assign=prevUrl}{url router=$smarty.const.ROUTE_PAGE page="issue" op="archive"}{/capture}
		{/if}
		{if $nextPage}
			{capture assign=nextUrl}{url router=$smarty.const.ROUTE_PAGE page="issue" op="archive" path=$nextPage}{/capture}
		{/if}
		{include
			file="frontend/components/pagination.tpl"
			prevUrl=$prevUrl
			nextUrl=$nextUrl
			showingStart=$showingStart
			showingEnd=$showingEnd
			total=$total
		} *}
	{/if}
</div>

{include file="common/frontend/footer.tpl"}
