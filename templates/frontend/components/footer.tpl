{**
 * templates/frontend/components/footer.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common site frontend footer.
 *
 * @uses $isFullWidth bool Should this page be displayed without sidebars? This
 *       represents a page-level override, and doesn't indicate whether or not
 *       sidebars have been configured for thesite.
 *}

	</main>

	{* Sidebars *}
	{if empty($isFullWidth)}
		{capture assign="sidebarCode"}{call_hook name="Templates::Common::Sidebar"}{/capture}
		<aside id="sidebar" class="pkp_structure_sidebar left col-xs-12 col-sm-2 col-md-3" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
			<div class="pkp_block block_information">
				<h2 class="title">{translate key="plugins.themes.csp.login.box"}</h2>
				<div class="content">
					<ul>
						<li>
							{include file="frontend/pages/userLogin.tpl"}
						</li>
					</ul>
				</div>
			</div>
		</aside><!-- pkp_sidebar.left -->
	{/if}
	{* {load_menu name="user" id="navigationUser" ulClass="nav nav-pills tab-list pull-right"} *}

	</div><!-- pkp_structure_content -->

	<footer class="footer" role="contentinfo">

		<div class="container">
			
			<div class="row">
				{if $pageFooter}
				<div class="col-md-4">
					{$pageFooter}
				</div>
				{/if}
				<div class="col-md-2">
					<img src="{$publicFilesDir}/ensp.png">
				</div>
				<div class="col-md-2">
					<img src="{$publicFilesDir}/cnpq.png">
				</div>
				<div class="col-md-2">
					<img src="{$publicFilesDir}/capes.png">
				</div>
				<div class="col-md-2">
					<img src="{$publicFilesDir}/faperj.png">
				</div>

{* 				<div class="col-md-2" role="complementary">
					<a href="{url page="about" op="aboutThisPublishingSystem"}">
						<img class="img-responsive" alt="{translate key="about.aboutThisPublishingSystem"}" src="{$baseUrl}/{$brandImage}">
					</a>
				</div> *}

			</div> <!-- .row -->
		</div><!-- .container -->
	</footer>
</div><!-- pkp_structure_page -->

{load_script context="frontend" scripts=$scripts}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>
