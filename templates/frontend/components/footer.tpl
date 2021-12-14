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
				<div class="col-md-1">
					<a target="_blank" href="https://creativecommons.org/licenses/by/2.0/br/">
						<img src="{$baseUrl}/plugins/themes/csp/assets/cc-by.svg">
					</a>
				</div>
				<div class="col-md-1">
					<a target="_blank" href="https://publicationethics.org/">
						<img src="{$baseUrl}/plugins/themes/csp/assets/COPE.svg">
					</a>
				</div>
				<div class="col-md-2">
					<a target="_blank" href="https://www.abecbrasil.org.br/novo/">
						<img src="{$baseUrl}/plugins/themes/csp/assets/abec.svg">
					</a>
				</div>
				{if $pageFooter}
				<div class="col-md-4 text-footer">
					{$pageFooter}
				</div>
				{/if}
				<div class="col-md-1">
					<a target="_blank" href="http://ensp.fiocruz.br/">
						<img src="{$baseUrl}/plugins/themes/csp/assets/ensp.svg">
					</a>
				</div>
				<div class="col-md-1">
					<a target="_blank" href="https://www.gov.br/cnpq/pt-br">
						<img src="{$baseUrl}/plugins/themes/csp/assets/cnpq.svg">
					</a>
				</div>
				<div class="col-md-1">
					<a target="_blank" href="https://www.gov.br/capes/pt-br">
						<img src="{$baseUrl}/plugins/themes/csp/assets/capes.svg">
					</a>
				</div>
				<div class="col-md-1">
					<a target="_blank" href="http://www.faperj.br/">
						<img src="{$baseUrl}/plugins/themes/csp/assets/faperj.svg">
					</a>
				</div>
			</div> <!-- .row -->
		</div><!-- .container -->
	</footer>
</div><!-- pkp_structure_page -->

{load_script context="frontend" scripts=$scripts}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>
