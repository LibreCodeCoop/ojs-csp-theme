{**
 * templates/controllers/grid/columnGroup.tpl
 *
 * Copyright (c) 2016-2020 Simon Fraser University
 * Copyright (c) 2000-2020 John Willinsky
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Column group HTML markup for grids.



<colgroup>
	{foreach from=$columns item=column}
		{if $column->hasFlag('indent')}
			{continue}
		{/if}
		<col class="grid-column column-{$column->getId()}"
		{if $column->hasFlag('width')}
			style="width: {$column->getFlag('width')}%;"
		{/if} />
	{/foreach}
</colgroup>
 *}