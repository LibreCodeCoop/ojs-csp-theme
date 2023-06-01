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
						{include file="frontend/components/social-media.tpl"}
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
	<div id="logos">
        <div id="logosesquerda">
            <ul>
                <li class="acesso"><a href="https://portal.fiocruz.br/acesso-informacao"><span class="oculta">Página do Acesso à informação</span></a></li>
                <li class="castelocemanos"><a href="https://agencia.fiocruz.br/100-anos-do-castelo-fiocruz"><span class="oculta">Página dos 110 anos do castelo</span></a></li>
                <li class="AquiSUS"><a href="https://portal.fiocruz.br/aqui-somos-sus"><span class="oculta">Página aqui somos SUS</span></a></li>
            </ul>
        </div>

        <div id="logosdireita">
            <ul>
                <li class="ensp"><a href="http://www.ensp.fiocruz.br/portal-ensp/"><span class="oculta">Página da Escola Nacional de Saúde Pública Sergio Arouca</span></a></li>
                <li class="sus"><a href="http://portalms.saude.gov.br/sistema-unico-de-saude/sistema-unico-de-saude"><span class="oculta">Página do Sistema Único de Saúde</span></a></li>
                <li class="fiocruz"><a href="https://portal.fiocruz.br/"><span class="oculta">Página da Fundação Oswaldo Cruz</span></a></li>
                <li class="msaude"><a href="http://portalms.saude.gov.br/"><span class="oculta">Página do Ministério da Saúde</span></a></li>
                <li class="gfederal"><a href="http://www.brasil.gov.br/"><span class="oculta">Página do Governo Federal</span></a></li>
            </ul>
        </div>
    </div>
</div><!-- pkp_structure_footer_wrapper -->

</div><!-- pkp_structure_page -->

{load_script context="frontend"}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>