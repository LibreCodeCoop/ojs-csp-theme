{**
 * templates/user/userGroups.tpl
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2003-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * The user group (role) selection part of the registration and profile forms.
 * @uses $contexts array List of journals/presses on this site that have enabled registration
 * @uses $showOtherContexts bool Whether or not to show the other contexts selection
 *}

{fbvFormArea id="userGroups" title="user.interests" class=border}
	{fbvFormSection for="interests"}
		{fbvElement type="interests" id="interests" interests=$interests}
	{/fbvFormSection}
{/fbvFormArea}
