{**
 * templates/user/contactForm.tpl
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2003-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * User profile form.
 *}
<script>
	$(function() {ldelim}
		// Attach the form handler.
		$('#contactForm').pkpHandler('$.pkp.controllers.form.AjaxFormHandler');
	{rdelim});
</script>

<form class="pkp_form" id="contactForm" method="post" action="{url op="saveContact"}">
	{* Help Link *}
	{help file="user-profile" class="pkp_help_tab"}

	{csrf}

	{include file="controllers/notification/inPlaceNotification.tpl" notificationId="contactFormNotification"}

	
	{fbvFormSection title="user.email" required="true" size=$fbvStyles.size.LARGE}
		{fbvElement type="email" id="email" value=$email required=true}
	{/fbvFormSection}
	{fbvFormSection title="user.phone" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="phone" id="phone" value=$phone maxlength="24" required="true"}
	{/fbvFormSection}
	{fbvFormSection title="user.affiliation" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="affiliation" id="affiliation" value=$affiliation multilingual="true" required="true"}
	{/fbvFormSection}
	{fbvFormSection title="user.affiliation2" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="affiliation2" id="affiliation2" value=$affiliation2 required="true"}
	{/fbvFormSection}
	{fbvFormSection title="common.mailingAddress" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="mailingAddress" id="mailingAddress" rich=true value=$mailingAddress required="true"}
	{/fbvFormSection}
	{fbvFormSection title="common.city" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="city" id="city" rich=true value=$city required="true"}
	{/fbvFormSection}
	{fbvFormSection title="common.state" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="state" id="state" rich=true value=$state required="true"}
	{/fbvFormSection}
	{fbvFormSection title="common.zipCode" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="text" name="zipCode" id="zipCode" rich=true value=$zipCode required="true"}
	{/fbvFormSection}
	{fbvFormSection title="common.country" size=$fbvStyles.size.LARGE required=true}
		{fbvElement type="select" name="country" id="country" required=true defaultLabel="" defaultValue="" from=$countries selected=$country translate=false}
	{/fbvFormSection}
	{fbvFormSection title="user.signature" size=$fbvStyles.size.LARGE}
		{fbvElement type="textarea" name="signature" id="signature" value=$signature rich=true}
	{/fbvFormSection}
	{if count($availableLocales) > 1}
		{fbvFormSection title="user.workingLanguages" list=true}
			{foreach from=$availableLocales key=localeKey item=localeName}
				{if $userLocales && in_array($localeKey, $userLocales)}
					{assign var="checked" value=true}
				{else}
					{assign var="checked" value=false}
				{/if}
				{fbvElement type="checkbox" name="userLocales[]" id="userLocales-$localeKey" value=$localeKey checked=$checked label=$localeName translate=false}
			{/foreach}
		{/fbvFormSection}
	{/if}

	<p>
		{capture assign="privacyUrl"}{url router=$smarty.const.ROUTE_PAGE page="about" op="privacy"}{/capture}
		{translate key="user.privacyLink" privacyUrl=$privacyUrl}
	</p>
	
	{fbvFormButtons hideCancel=true submitText="common.save"}
</form>
