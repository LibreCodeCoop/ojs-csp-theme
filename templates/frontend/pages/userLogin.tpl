{**
 * templates/frontend/pages/userLogin.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2000-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * User login form.
 *
 *}
<style>
main{
	width: 100% !important;
}
</style>
{include file="frontend/components/header.tpl" pageTitle="user.login"}
{* {include file="frontend/components/breadcrumbs.tpl" currentTitleKey="user.login"} *}

<div class="page page_login">


	{* A login message may be displayed if the user was redireceted to the
		login page from another request. Examples include if login is required
	   before dowloading a file. *}
	{if $loginMessage}
		<div class="alert alert-info" role="alert">
			{translate key=$loginMessage}
		</div>
	{/if}

	<h1 class="namePage line">Acesso</h1>

	<div class="alert alert-danger text-center">
		<h3><b>Atenção!</b></h3>
		<h3 style="line-height:2">
			Para acompanhamento de manuscritos submetidos até dezembro de 2024, clique <a href="https://cadernos.ensp.fiocruz.br/csp1/portal/saga.php">aqui! </a>
		</h3>
	</div>
	<div class="alert alert-info">
		<h3 style="line-height:2">Para novas submissões, utilize o login abaixo:</h3>
		<form class="pkp_form login " id="login" method="post" action="{$loginUrl}">
			{csrf}
			<input type="hidden" name="source" value="{$source|strip_unsafe_html|escape}" />

			{if $error}
				<div class="alert alert-danger" role="alert">
					{translate key=$error reason=$reason}
				</div>
			{/if}

			<div class="form-group">
				<label class="csp_form" for="login-username">
					{translate key="user.username"}
				</label>
				<input type="text" name="username" class="form-control csp_input" id="login-username" placeholder="{translate key='user.username'}" value="{$username|escape}" maxlenght="32" required>
			</div>

			<div class="form-group">
				<label class="csp_form" for="login-password">
					{translate key="user.password"}
				</label>
				<input type="password" name="password" class="form-control csp_input" id="login-password" placeholder="{translate key='user.password'}" password="true" maxlength="32" required="$passwordRequired">
			</div>

			<div class="form-group p-r">
				<a class="underline" href="{url page="login" op="lostPassword"}">
					{translate key="user.login.forgotPassword"}
				</a>
			</div>

			<div class="checkbox">
				<label>
					<input type="checkbox" name="remember" id="remember" value="1" checked="$remember"> {translate key="user.login.rememberUsernameAndPassword"}
				</label>
			</div>

			<div class="buttons">
				{if !$disableUserReg}
					{capture assign="registerUrl"}{url page="user" op="register" source=$source}{/capture}
					<a class="btn btn-link btn-csp-register" href="{$registerUrl}" role="button">
						{translate key="user.login.registerNewAccount"}
					</a>
				{/if}
				<button type="submit" class="btn btn-csp">
					{translate key="user.login"}
				</button>
			</div>
		</form>
	</div>

</div><!-- .page -->



{include file="common/frontend/footer.tpl"}

<script>
	document.querySelector(".btn.btn-link").innerText = "Registrar-se"
</script>
