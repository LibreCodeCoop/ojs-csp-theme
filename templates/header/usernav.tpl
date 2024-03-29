{**
 * templates/header/usernav.tpl
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2003-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Site-Wide Navigation Bar
 *}
{capture assign="homeUrl"}
	{if $currentContext}
		{url page="index" router=$smarty.const.ROUTE_PAGE}
	{elseif $multipleContexts}
		{url context="index" router=$smarty.const.ROUTE_PAGE}
	{/if}
{/capture}

<script type="text/javascript">
	// Attach the JS file tab handler.
	$(function() {ldelim}
		$('#navigationContextMenu').pkpHandler(
				'$.pkp.controllers.MenuHandler');
	{rdelim});
</script>

{if $isUserLoggedIn}
	<script type="text/javascript">
		// Attach the JS file tab handler.
		$(function() {ldelim}
			$('#navigationTasks').pkpHandler(
					'$.pkp.controllers.MenuHandler');
		{rdelim});
	</script>
{/if}

<script type="text/javascript">
	// Attach the JS file tab handler.
	$(function() {ldelim}
		$('#navigationUser').pkpHandler(
				'$.pkp.controllers.MenuHandler');
	{rdelim});
</script>
<ul id="navigationUser" class="pkp_nav_user pkp_nav_list" role="navigation" aria-label="{translate|escape key="common.navigation.user"}">
	{if isset($supportedLocales) && $supportedLocales|@count}
		<li id="navigationTasks" class="pkp_nav_tasks pkp_nav_list" role="navigation" aria-label="{translate|escape key="common.tasks"}">
				{capture assign=fetchTaskUrl}{url router=$smarty.const.ROUTE_COMPONENT component="page.PageHandler" op="tasks" escape=false}{/capture}
				{capture assign="tasksNavPlaceholder"}
					<a href="#">
						{translate key="common.tasks"}
						<span class="pkp_spinner"></span>
					</a>
				{/capture}
				{load_url_in_el el="li" class="pkp_tasks" id="userTasksWrapper" url=$fetchTaskUrl placeholder=$tasksNavPlaceholder}
		</li>
		<li class="languages" aria-haspopup="true" aria-expanded="false">
			<a href="#">
				<span class="fa fa-globe"></span>
				{$supportedLocales.$currentLocale}
			</a>
			<ul>
				{foreach from=$supportedLocales item=localeName key=localeKey}
					{if $localeKey != $currentLocale}
						<li>
							<a href="{url router=$smarty.const.ROUTE_PAGE page="user" op="setLocale" path=$localeKey}">
								{$localeName}
							</a>
						</li>
					{/if}
				{/foreach}
			</ul>
		</li>
	{/if}
	{if $homeUrl}
		<li class="view_frontend">
			<a href="{$homeUrl}">
				<span class="fa fa-eye"></span>
				{translate key="navigation.viewFrontend"}
			</a>
		</li>
	{/if}
	{if $isUserLoggedIn}
		<li class="user" aria-haspopup="true" aria-expanded="false">
			<a href="#">
				<span class="fa fa-user"></span>
				{$loggedInUsername|escape}
			</a>
			<ul>
				<li>
					<a href="{url router=$smarty.const.ROUTE_PAGE page="user" op="profile"}">
						{translate key="common.viewProfile"}
					</a>
				</li>
				<li>
					{if $isUserLoggedInAs}
						<a href="{url router=$smarty.const.ROUTE_PAGE page="login" op="signOutAsUser"}">
							{translate key="user.logOutAs"} {$loggedInUsername|escape}
						</a>
					{else}
						<a href="{url router=$smarty.const.ROUTE_PAGE page="login" op="signOut"}">
							{translate key="user.logOut"}
						</a>
					{/if}
				</li>
			</ul>
		</li>
	{/if}
</ul>
