{**
 * templates/frontend/pages/information.tpl
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2003-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Information page.
 *
 *}
{if !$contentOnly}
	{include file="frontend/components/header.tpl" pageTitle=$pageTitle}
{/if}

<div class="page page_information">
	{include file="frontend/components/breadcrumbs.tpl" currentTitleKey=$pageTitle}
	<div class="page-header">
		<h1>{translate key=$pageTitle}</h1>
	</div>
	{include file="frontend/components/editLink.tpl" page="management" op="settings" path="website" anchor="setup" sectionTitleKey="manager.website.information"}

		{$content}

</div>

{if !$contentOnly}
	{include file="frontend/components/footer.tpl"}
{/if}
