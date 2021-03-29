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
	</div>

	{* Sidebars *}
		{if empty($isFullWidth)}
		{capture assign="sidebarCode"}{call_hook name="Templates::Common::Sidebar"}{/capture}
		{include file="frontend/components/aside.tpl"}
	{/if}
	{* /Sidebars *}


	{* {load_menu name="user" id="navigationUser" ulClass="nav nav-pills tab-list pull-right"} *}

	</div><!-- pkp_structure_content -->

	<footer class="footer" role="contentinfo">

		<div class="container">

			<div class="row">

				<div class="footer-page">
					<div class="col-md-2">
						<img class="image-footer" src="{$publicFilesDir}/footer-l1.png">
					</div>

					{if $pageFooter}
					<div class="col-md-3 text-footer">
						{$pageFooter}
					</div>
					{/if}

					<div class="col-md-2">
						<img class="image-footer" src="{$publicFilesDir}/footer-l8.png">
					</div>

					<div class="col-md-1">
						<img class="image-footer image-define" src="{$publicFilesDir}/footer-l3.png">
					</div>
					<div class="col-md-1">
						<img class="image-footer image-define" src="{$publicFilesDir}/footer-l4.png">
					</div>
					<div class="col-md-1">
						<img class="image-footer image-define" src="{$publicFilesDir}/footer-l5.png">
					</div>
					<div class="col-md-1">
						<img class="image-footer image-define" src="{$publicFilesDir}/footer-l6.png">
					</div>
					<div class="col-md-1">
						<img class="image-footer image-define" src="{$publicFilesDir}/footer-l7.png">
					</div>
				</div>
			</div> <!-- .row -->
		</div><!-- .container -->
	</footer>
</div><!-- pkp_structure_page -->

{load_script context="frontend" scripts=$scripts}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>
