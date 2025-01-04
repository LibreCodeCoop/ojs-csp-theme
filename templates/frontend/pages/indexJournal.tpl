{**
 * templates/frontend/pages/indexJournal.tpl
 *
 * UPDATED/CHANGED/MODIFIED: Marc Behiels - marc@elemental.ca - 250416
 *
 * Copyright (c) 2014-2023 Simon Fraser University
 * Copyright (c) 2003-2023 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @brief Display the index page for a journal
 *
 * @uses $currentJournal Journal This journal
 * @uses $journalDescription string Journal description from HTML text editor
 * @uses $homepageImage object Image to be displayed on the homepage
 * @uses $additionalHomeContent string Arbitrary input from HTML text editor
 * @uses $announcements array List of announcements
 * @uses $numAnnouncementsHomepage int Number of announcements to display on the
 *       homepage
 * @uses $issue Issue Current issue
 *}
{include file="frontend/components/header.tpl" pageTitleTranslated=$currentJournal->getLocalizedName()}

<div id="main-content" class="page_index_journal">

	{call_hook name="Templates::Index::journal"}

	{if $homepageImage}
		<div class="homepage-image">
			<img class="img-responsive" src="{$publicFilesDir}/{$homepageImage.uploadName|escape:"url"}" alt="{$homepageImageAltText|escape}">
		</div>
	{/if}

	{if $journalDescription}
		<div class="journal-description">
			{$journalDescription}
		</div>
	{/if}

	{* Latest issue *}
	{if $issue}
		<section class="current_issue issue-section">
			<header class="header-issue">
				<div class="header-page">
					<h2>
						{translate key="journal.currentIssue"}
					</h2>
					<div id="line"></div>
				</div>
				<div class="version_issue">
					<p class="current_issue_title lead">
						{$issue->getIssueIdentification()|strip_unsafe_html}
					</p>
				</div>
			</header>
			{include file="frontend/objects/issue_toc.tpl"}
		</section>
	{/if}
</div><!-- .page -->

{include file="frontend/components/footer.tpl"}
