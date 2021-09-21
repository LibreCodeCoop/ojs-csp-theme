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
						<a href="https://creativecommons.org/licenses/by/2.0/br/">
							<img class="image-footer" src="{$baseUrl}/plugins/themes/csp/assets/footer-l1.png">
						</a>
					</div>

					{if $pageFooter}
					<div class="col-md-3 text-footer">
						{$pageFooter}
					</div>
					{/if}

					<div class="col-md-2">
						<a href="https://www.abecbrasil.org.br/novo/">
							<img class="image-footer" src="{$baseUrl}/plugins/themes/csp/assets/footer-l8.png">
						</a>
					</div>
					<div class="col-md-1">
						<a href="https://portal.fiocruz.br">
							<img class="image-footer image-define" src="{$baseUrl}/plugins/themes/csp/assets/footer-l3.png">
						</a>
					</div>
					<div class="col-md-1">
						<a href="http://ensp.fiocruz.br/">
							<img class="image-footer image-define" src="{$baseUrl}/plugins/themes/csp/assets/footer-l4.png">
						</a>
					</div>
					<div class="col-md-1">
						<a href="https://www.gov.br/cnpq/pt-br">
							<img class="image-footer image-define" src="{$baseUrl}/plugins/themes/csp/assets/footer-l5.png">
						</a>
					</div>
					<div class="col-md-1">
						<a href="https://www.gov.br/capes/pt-br">
							<img class="image-footer image-define" src="{$baseUrl}/plugins/themes/csp/assets/footer-l6.png">
						</a>
					</div>
					<div class="col-md-1">
						<a href="http://www.faperj.br/">
							<img class="image-footer image-define" src="{$baseUrl}/plugins/themes/csp/assets/footer-l7.png">
						</a>
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
