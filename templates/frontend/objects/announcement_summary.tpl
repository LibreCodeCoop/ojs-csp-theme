{**
 * templates/frontend/objects/announcement_summary.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Display a summary view of an announcement
 *
 * @uses $announcement Announcement The announcement to display
 *}
<article class="announcement-summary media">
	<div>
		<h1>
			{$announcement->getLocalizedTitle()|escape} |
		</h1>
		<p class="date">
			<span class="glyphicon glyphicon-calendar"></span>
			{$announcement->getDatePosted()|escape}
		</p>
	</div>
	<div>
		{$announcement->getLocalizedDescriptionShort()|strip_unsafe_html}
		<br>
		<a href="{url router=$smarty.const.ROUTE_PAGE page="announcement" op="view" path=$announcement->getId()}">
			{translate key="plugins.themes.csp.announcement.readMore"}
		</a>
	</div>
</article><!-- .announcement-summary -->
