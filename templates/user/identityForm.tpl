{**
 * templates/user/identityForm.tpl
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
		$('#identityForm').pkpHandler('$.pkp.controllers.form.AjaxFormHandler');
	{rdelim});
</script>

<form class="pkp_form" id="identityForm" method="post" action="{url op="saveIdentity"}" enctype="multipart/form-data">
	{* Help Link *}
	{help file="user-profile" class="pkp_help_tab"}

	{csrf}

	{include file="controllers/notification/inPlaceNotification.tpl" notificationId="identityFormNotification"}

	{fbvFormArea id="userNameInfo"}
		{fbvFormSection title="user.username"}
			{$username|escape}
		{/fbvFormSection}
	{/fbvFormArea}

	{fbvFormArea id="userFormCompactLeft"}
		{fbvFormSection title="user.name" required="true" size=$fbvStyles.size.MEDIUM inline=true}
			{fbvElement type="text" multilingual="true" required="true" id="givenName" value=$givenName maxlength="255"}
		{/fbvFormSection}
		{fbvFormSection title="user.familyName" required="true" size=$fbvStyles.size.MEDIUM inline=true}
			{fbvElement type="text" multilingual="true" required="true" id="familyName" value=$familyName maxlength="255"}
		{/fbvFormSection}
	{/fbvFormArea}

{* 	{fbvFormSection for="preferredPublicName" description="user.preferredPublicName.description"}
		{fbvElement type="text" label="user.preferredPublicName" multilingual="true" name="preferredPublicName" id="preferredPublicName" value=$preferredPublicName size=$fbvStyles.size.LARGE}
	{/fbvFormSection} *}

	<p>
		{capture assign="privacyUrl"}{url router=$smarty.const.ROUTE_PAGE page="about" op="privacy"}{/capture}
		{translate key="user.privacyLink" privacyUrl=$privacyUrl}
	</p>

	{fbvFormButtons hideCancel=true submitText="common.save"}
</form>
