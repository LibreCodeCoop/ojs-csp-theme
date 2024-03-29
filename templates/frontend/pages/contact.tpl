{**
 * templates/frontend/pages/contact.tpl
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2003-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @brief Display the page to view the press's contact details.
 *
 * @uses $currentContext Journal|Press The current journal or press
 * @uses $mailingAddress string Mailing address for the journal/press
 * @uses $contactName string Primary contact name
 * @uses $contactTitle string Primary contact title
 * @uses $contactAffiliation string Primary contact affiliation
 * @uses $contactPhone string Primary contact phone number
 * @uses $contactEmail string Primary contact email address
 * @uses $supportName string Support contact name
 * @uses $supportPhone string Support contact phone number
 * @uses $supportEmail string Support contact email address
 *}
{include file="frontend/components/header.tpl" pageTitle="about.contact"}

<div class="page page_contact">
	{include file="frontend/components/breadcrumbs.tpl" currentTitleKey="about.contact"}
	<h1>
		{translate key="about.contact"}
	</h1>
	{include file="frontend/components/editLink.tpl" page="management" op="settings" path="context" anchor="contact" sectionTitleKey="about.contact"}

	{* Contact section *}
	<div class="contact_section">

		{if $mailingAddress}
			<div class="address">
				{$mailingAddress|nl2br|strip_unsafe_html}
			</div>
		{/if}

		{* Primary contact *}
		{if $contactTitle || $contactName || $contactAffiliation || $contactPhone || $contactEmail}
			<div class="contact primary">

				{if $contactTitle}
				<div class="title">
					{$contactTitle|escape}
				</div>
				{/if}

				{if $contactPhone}
				<div class="phone">
					<span class="value">
						{$contactPhone|escape}
					</span>
				</div>
				{/if}

				{if $contactEmail}
				<div class="email">
					{mailto address=$contactEmail encode='javascript'}
				</div>
				{/if}
			</div>
		{/if}
	</div>

</div><!-- .page -->

{include file="frontend/components/footer.tpl"}
