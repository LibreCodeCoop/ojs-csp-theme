{**
 * templates/frontend/objects/issue_toc.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief View of an Issue which displays a full table of contents.
 *
 * @uses $issue Issue The issue
 * @uses $issueTitle string Title of the issue. May be empty
 * @uses $issueSeries string Vol/No/Year string for the issue
 * @uses $issueGalleys array Galleys for the entire issue
 * @uses $hasAccess bool Can this user access galleys for this context?
 * @uses $showGalleyLinks bool Show galley links to users without access?
 *}
<div class="issue-toc">


	{* Indicate if this is only a preview *}

	{if !$issue->getPublished()}
		{include file="frontend/components/notification.tpl" type="warning" messageKey="editor.issues.preview"}
	{/if}

	{* Articles *}
	<div class="sections row">

		{foreach name=sections from=$publishedSubmissions item=section}
			<section {if count($section.articles) > 1}class="article-list" {/if}>
				{if $section.articles}
					<div class="media-list">
						{foreach from=$section.articles item=article}
							<div class="col-md-12 issue-content">
								{if $section.title}
									<div class="col-md-3 page-header-title">
										<h2>
											{$section.title|escape}
										</h2>
									</div>
								{/if}
								{include file="frontend/objects/article_summary.tpl"}
								{include file="frontend/objects/article_data.tpl"}
							</div>
						{/foreach}
					</div>
				{/if}
			</section>
		{/foreach}
	</div><!-- .sections -->
</div><!-- .issue-toc -->
