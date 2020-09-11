		<div class="issues media-list">
			{foreach from=$issues item="issue"}
				<div class="issue-summary">

					{* Retrieve separate entries for $issueTitle and $issueSeries *}
					{assign var=issueTitle value=$issue->getLocalizedTitle()}
					{assign var=issueSeries value=$issue->getIssueSeries()}

					{* Show cover image and use cover description *}
{* 					{if $issue->getLocalizedCoverImage()}
						<div class="media-left">
							<a class="cover" href="{url|escape op="view" path=$issue->getBestIssueId($currentJournal)}">
								<img class="media-object" src="{$issue->getLocalizedCoverImageUrl()|escape}" alt="{$issue->getLocalizedCoverImageAltText()|escape|default:''}">
							</a>
						</div>
					{/if} *}


					<div class="media-body">
						<h2 class="media-heading">
							<a class="title" href="{url|escape page="issue" op="view" path=$issue->getBestIssueId($currentJournal)}">
		
								{if $issueTitle}
									{$issueTitle|escape}
								{else}
									{$issueSeries|escape}
								{/if}
							</a>
			{* 				{if $issueTitle}
								<div class="series lead">
									{$issueSeries|escape}
								</div>
							{/if} *}
						</h2>
{* 						<div class="description">
							{$issueDescription|strip_unsafe_html|nl2br}
						</div> *}
					</div>
				</div><!-- .issue-summary -->
			{/foreach}
		</div>