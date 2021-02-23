{**
 * lib/pkp/templates/frontend/components/header.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common frontend site header.
 *
 * @uses $isFullWidth bool Should this page be displayed without sidebars? This
 *       represents a page-level override, and doesn't indicate whether or not
 *       sidebars have been configured for thesite.
 *}

{* Determine whether a logo or title string is being displayed *}
{assign var="showingLogo" value=true}
{if $displayPageHeaderTitle && !$displayPageHeaderLogo && is_string($displayPageHeaderTitle)}
	{assign var="showingLogo" value=false}
{/if}

<!DOCTYPE html>
<html lang="{$currentLocale|replace:"_":"-"}" xml:lang="{$currentLocale|replace:"_":"-"}">
{if !$pageTitleTranslated}{capture assign="pageTitleTranslated"}{translate key=$pageTitle}{/capture}{/if}
{include file="frontend/components/headerHead.tpl"}
<body class="pkp_page_{$requestedPage|escape|default:"index"} pkp_op_{$requestedOp|escape|default:"index"}{if $showingLogo} has_site_logo{/if}">
	<div class="pkp_structure_page">

		<nav id="accessibility-nav" class="sr-only" role="navigation" aria-label="{translate|escape key="plugins.themes.bootstrap3.accessible_menu.label"}">
			<ul>
				<li><a href="#main-navigation">{translate|escape key="plugins.themes.bootstrap3.accessible_menu.main_navigation"}</a></li>
				<li><a href="#main-content">{translate|escape key="plugins.themes.bootstrap3.accessible_menu.main_content"}</a></li>
				<li><a href="#sidebar">{translate|escape key="plugins.themes.bootstrap3.accessible_menu.sidebar"}</a></li>
			</ul>
		</nav>

		{* Header *}
		<header class="navbar navbar-default" id="headerNavigationContainer" role="banner" style="background-image: url({$issue->getLocalizedCoverImageUrl()|escape}" alt="{$issue->getLocalizedCoverImageAltText()|escape|default:''})">
			<div class="container-fluid" id="logo-ensp-fiocruz">
				<div class="container">
					<div class="row">
						<div class="col-xs-6 col-sm-6">
							<a href="{$homeUrl}">
								<img src="{$publicFilesDir}/logo.gif">
							</a>
						</div>
						<div class="col-xs-6 col-sm-6 text-right">
							<a href="http://www.ensp.fiocruz.br/">
								<img src="{$publicFilesDir}/logo-fiocruz.png">
							</a>
						</div>
					</div><!-- .row -->
				</div>
			</div><!-- .container-fluid -->

			{* User profile, login, etc, navigation menu*}

			<div class="container-fluid" id="logo-csp">
				<div class="row">
					<div class="col-md-6">
						{*{capture assign="homeUrl"}
							{if $currentJournal && $multipleContexts}
								{url page="index" router=$smarty.const.ROUTE_PAGE}
							{else}
								{url context="index" router=$smarty.const.ROUTE_PAGE}
							{/if}
						{/capture}*}
						{if $displayPageHeaderLogo && is_array($displayPageHeaderLogo)}
							<a href="{$homeUrl}">
								<img class="logo-csp" src="{$publicFilesDir}/{$displayPageHeaderLogo.uploadName|escape:"url"}" {if $displayPageHeaderLogo.altText != ''}alt="{$displayPageHeaderLogo.altText|escape}"{/if}>
							</a>
						{elseif $displayPageHeaderTitle && !$displayPageHeaderLogo && is_string($displayPageHeaderTitle)}
							<a href="{$homeUrl}">{$displayPageHeaderTitle}</a>
						{elseif $displayPageHeaderTitle && !$displayPageHeaderLogo && is_array($displayPageHeaderTitle)}
							<a href="{$homeUrl}">
								<img class="logo-csp" src="{$publicFilesDir}/{$displayPageHeaderTitle.uploadName|escape:"url"}" alt="{$displayPageHeaderTitle.altText|escape}">
							</a>
						{else}
							<a href="{$homeUrl}">
								<img class="logo-csp" src="{$baseUrl}/templates/images/structure/logo.png" alt="{$applicationName|escape}" title="{$applicationName|escape}" />
							</a>
						{/if}
					</div>
					<div class="col-md-2" id="language">
						{capture assign="sidebarCode"}{call_hook name="Templates::Common::Sidebar"}{/capture}
						<select onchange="window.location.href=this.value">
							{foreach from=$languageToggleLocales item=localeName key=localeKey}
								<option value="{url router=$smarty.const.ROUTE_PAGE page="user" op="setLocale" path=$localeKey source=$smarty.server.REQUEST_URI}" {if $localeKey == $currentLocale} selected {/if}>
										{$localeName}
								</option>
							{/foreach}
						</select>
						<span class="glyphicon">&#xe114;</span>
					</div>
					<div class="col-md-4">
					</div>
				</div>
			</div>
			<div class="container-fluid menu">
				<div class="navbar-header">
					{* Mobile hamburger menu *}
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-menu" aria-expanded="false" aria-controls="nav-menu">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
				</div>
				{* Primary site navigation *}
				{capture assign="primaryMenu"}
					{load_menu name="primary" id="main-navigation" ulClass="nav navbar-nav"}
				{/capture}

				{if !empty(trim($primaryMenu)) || $currentContext}
					<nav id="nav-menu" class="navbar-collapse collapse" aria-label="{translate|escape key="common.navigation.site"}">
						{* Primary navigation menu for current application *}
						<div class="pull-md-left">
							{$primaryMenu}
						</div>
						{* Search form *}
						<div class="pull-md-right">
							{if $currentContext}
								{include file="frontend/components/searchForm_simple.tpl"}
							{/if}
							{load_menu name="user" id="navigationUser" ulClass="nav navbar-nav pull-right"}
						</div>
					</nav>
				{/if}
			</div><!-- .pkp_head_wrapper -->
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6 pull-md-right" id="col-carousel">
						<div id="myCarousel" class="carousel slide" data-ride="carousel">
							<!-- Indicators -->
							<ol class="carousel-indicators">
								<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
								<li data-target="#myCarousel" data-slide-to="1"></li>
								<li data-target="#myCarousel" data-slide-to="2"></li>
							</ol>

							<!-- Wrapper for slides -->
							<div class="carousel-inner">

							{* Announcements *}
								{if $numAnnouncementsHomepage && $announcements|count}
									{assign var=count value=1}
									{foreach name=announcements from=$announcements item=announcement}
										<div class="item {if $count == 1} active {/if}">
											{if $smarty.foreach.announcements.iteration > $numAnnouncementsHomepage}
												{break}
											{/if}
											{include file="frontend/objects/announcement_summary.tpl" heading="h3"}
										</div>
									{assign var=count value=$count+1}
									{/foreach}
								{/if}

							</div>

							<!-- Left and right controls -->
							<a class="left carousel-control" href="#myCarousel" data-slide="prev">
								<span class="glyphicon glyphicon-chevron-left"></span>
								<span class="sr-only">Previous</span>
							</a>
							<a class="right carousel-control" href="#myCarousel" data-slide="next">
								<span class="glyphicon glyphicon-chevron-right"></span>
								<span class="sr-only">Next</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</header><!-- .pkp_structure_head -->

		{* Wrapper for page content and sidebars *}
		<div class="pkp_structure_content container">
			<main class="pkp_structure_main col-xs-12 col-sm-10 col-md-9" role="main">
