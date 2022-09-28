{**
 * templates/frontend/components/footer.tpl
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2003-2021 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @brief Common site frontend footer.
 *
 * @uses $isFullWidth bool Should this page be displayed without sidebars? This
 *       represents a page-level override, and doesn't indicate whether or not
 *       sidebars have been configured for thesite.
 *}

	</div><!-- pkp_structure_main -->

	{* Sidebars *}
	{if empty($isFullWidth)}
		{capture assign="sidebarCode"}{call_hook name="Templates::Common::Sidebar"}{/capture}
		{if $sidebarCode}
			{* <div class="pkp_structure_sidebar left" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">
				{$sidebarCode}
			</div><!-- pkp_sidebar.left --> *}
			{include file="frontend/components/aside.tpl"}
		{/if}
	{/if}
</div><!-- pkp_structure_content -->

<div class="pkp_structure_footer_wrapper" role="contentinfo">
	<a id="pkp_content_footer"></a>

	<div class="pkp_structure_footer">
		{if $pageFooter}
			<div class="container pkp_footer_content">
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
					<div class="col-md-4">
						{$pageFooter}
					</div>
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
				</div>
			</div>
		{/if}
	</div>
</div><!-- pkp_structure_footer_wrapper -->

</div><!-- pkp_structure_page -->

{load_script context="frontend"}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>