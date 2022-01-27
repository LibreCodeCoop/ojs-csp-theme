<?php
import('lib.pkp.classes.plugins.ThemePlugin');
class CspThemePlugin extends ThemePlugin {

    /**
     * Carrega os estilos personalizados de nosso tema
     * @return null
     */

    public function init() {

        $this->setParent('bootstrapthreethemeplugin');
        $this->addStyle('child-stylesheet', 'styles/index.less');
		$this->addScript('csp', 'js/index.js');
		$this->addStyle('csp', 'styles/backend.less', array( 'contexts' => 'backend'));

		HookRegistry::register ('TemplateManager::display', array($this, 'loadTemplateData'));
		HookRegistry::register('TemplateManager::fetch', array($this, 'fetchTemplate'));
		HookRegistry::register('CitationStyleLanguage::citation', array($this, 'CitationStyleLanguageCitation'));

    }

    /**
     * Obtem o nome de exibição deste tema
     * @return string
     */
    function getDisplayName() {
        return __('plugins.themes.csp.name');
    }

    /**
     * Obtem a descrição deste plugin
     * @return string
     */
    function getDescription() {
        return __('plugins.themes.csp.description');
    }

	public function CitationStyleLanguageCitation($hookName, $args)
	{
		foreach ($args[0]->author as $key => $value) {
			$completeName = $value->family;
			$completeNameArray = explode(" ", $completeName);
			$arraySize = count($completeNameArray);
			for ($i=1; $i < $arraySize; $i++) {
				$abbrev .= substr($completeNameArray[$i], 0,1);
			}
			$args[0]->author[$key]->family = $completeNameArray[0]." ".$abbrev;
		}

	}
	public function fetchTemplate($hookName, $args)
	{
        $request = Application::get()->getRequest();
        $request = Application::get()->getRequest();
		$context = $request->getContext();
		$requestPath = $request->getRequestPath();
		$baseUrl = $request->getBaseUrl();
		$router = $request->getRouter();
		$page = $router->_page;
		$op = $router->_op;
        $count = $args[1] != 'frontend/pages/issueArchive.tpl' ? 1 : null;
		$params = array(
			'contextId' => $context->getId(),
			'orderBy' => 'seq',
			'orderDirection' => 'ASC',
			'count' => $count,
			'offset' => 0,
			'isPublished' => true
        );

		$issues = iterator_to_array(Services::get('issue')->getMany($params));
		if (isset($issues[0])) {
			$coverImageUrl = $issues[0]->getLocalizedCoverImageUrl();
			$coverImageAltText = $issues[0]->getLocalizedCoverImageAltText();
		} else {
			$coverImageUrl = null;
			$coverImageAltText = null;
		}

		$templateMgr = $args[0];
        $templateMgr->assign(array(
			'issues' => $issues,
			'requestPath' => $requestPath,
			'baseUrl' => $baseUrl,
			'page' => $page,
			'coverImageUrl' => $coverImageUrl,
            'coverImageAltText' => $coverImageAltText,
			'context' => $context,
			'op' => $op
		));
	}

	public function loadTemplateData($hookName, $args) {

        $request = Application::get()->getRequest();
		$context = $request->getContext();
		$requestPath = $request->getRequestPath();
		$baseUrl = $request->getBaseUrl();
		$router = $request->getRouter();
		$page = $router->_page;
		$op = $router->_op;

		$issueDao = DAORegistry::getDAO('IssueDAO'); /* @var $issueDao IssueDAO */
		$currentIssue = $issueDao->getCurrent($context->getId());

		if ($args[1] == "frontend/pages/indexJournal.tpl") {
			$coverImageUrl = $currentIssue->getLocalizedCoverImageUrl();
			$coverImageAltText = $currentIssue->getLocalizedCoverImageAltText();
		} else {
			$coverImageUrl = null;
			$coverImageAltText = null;
		}

		$userDao = DAORegistry::getDAO('UserDAO');
		$result = $userDao->retrieve(
			<<<QUERY
			SELECT p.publication_id, s.setting_value
			FROM publications p
			LEFT JOIN publication_settings s
			ON s.publication_id = p.publication_id
			WHERE section_id = 10 AND s.setting_name = 'title' AND s.locale = 'pt_BR'
			ORDER BY publication_id ASC LIMIT 3
			QUERY
		);
		$interviews = $result->GetRows();

		$templateMgr = $args[0];
        $templateMgr->assign(array(
			'issues' => $issues,
			'requestPath' => $requestPath,
			'baseUrl' => $baseUrl,
			'page' => $page,
			'coverImageUrl' => $coverImageUrl,
            'coverImageAltText' => $coverImageAltText,
			'context' => $context,
			'op' => $op,
			'interviews' => $interviews,
		));

		if($args[1] == 'frontend/pages/userRegister.tpl'){ /* Passa id de avaliador para checkbox ir marcado */
			$userGroupDao = DAORegistry::getDAO('UserGroupDAO');
			$group = $userGroupDao->getDefaultByRoleId($context->getId(), ROLE_ID_REVIEWER);
			$userGroupIds[] = $group->getData('id');
			$templateMgr->assign('userGroupIds',$userGroupIds);
		}
		if($args[1] == 'frontend/pages/issueArchive.tpl'){
			$userDao = DAORegistry::getDAO('UserDAO');
			$resultAno = $userDao->retrieve(
				<<<QUERY
				SELECT DISTINCT `year` AS ANO
				FROM ojs.issues i
				ORDER BY i.`year` DESC
				QUERY
			);

			while (!$resultAno->EOF) {
				$rowAno = $resultAno->GetRowAssoc(false);
				$resultMes = $userDao->retrieve(
					<<<QUERY
					SELECT `year`, volume, number, issue_id
					FROM ojs.issues i
					WHERE `year` = '$rowAno[ano]'
					ORDER BY i.issue_id
					QUERY
				);
				while (!$resultMes->EOF) {
					$rowIssue = $resultMes->GetRowAssoc(false);
					$array[$rowAno['ano']][$rowIssue['volume']][$rowIssue['number']] = $rowIssue['issue_id'];
					$resultMes->MoveNext();
				}
				$resultAno->MoveNext();
			}

			$templateMgr = $args[0];
			$templateMgr->assign('issues', $array);
		}
	}
}
