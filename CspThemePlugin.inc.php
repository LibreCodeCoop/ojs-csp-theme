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

		/* Make citation */
		if($args[1] == "frontend/pages/article.tpl"){
			$pathArray = explode("/",$requestPath);
			$submissionId = end($pathArray);
			$submissionDAO = Application::getSubmissionDAO();
			$submission = $submissionDAO->getById($submissionId);
			$publication = $submission->getCurrentPublication();

			foreach ($publication->getData('authors') as $key => $value) {
				$submissionLocale = $publication->_data["authors"][$key]->_data["submissionLocale"];
				$givenName = $publication->_data["authors"][$key]->_data["givenName"][$submissionLocale];
				if(strpos($givenName, ',')){
					$givenNameArray = explode(",", $givenName);
					$beginningNameArray = explode(" ", $givenNameArray[1]);
					$arraySize = count($beginningNameArray);
					for ($i=1; $i < $arraySize; $i++) {
						if($beginningNameArray[$i] === strtolower($beginningNameArray[$i])){
							$abbrev .= "";
						}else{
							$abbrev .= substr($beginningNameArray[$i], 0,1);
						}
					}
					$authors[] = $givenNameArray[0]." ".$abbrev;
				}else{
					$givenNameArray = explode(" ", $givenName);
					$beginningNameArray = array_shift($givenNameArray);
					$arraySize = count($beginningNameArray);
					for ($i=0; $i < $arraySize; $i++) {
						if($beginningNameArray[$i] === strtolower($beginningNameArray[$i])){
							$abbrev .= "";
						}else{
							$abbrev .= substr($beginningNameArray[$i], 0,1);
						}
					}
					$authors[]= end($givenNameArray)." ".$abbrev;
				}
				unset($abbrev);
			}
			$issue = $issueDao->getById($publication->_data["issueId"]);

			$citation = implode(", ",$authors).". ";
			$citation .= $publication->_data["title"][$submissionLocale].". ";
			$citation .= $context->getLocalizedName()." ";
			$citation .= $issue->_data["year"]."; ";
			$citation .= $issue->_data["volume"];
			$citation .= "(".$issue->_data["number"].")";
			if($issue->_data["year"] > 2016){
				$doiArray = explode('X', $publication->_data["pub-id::doi"]);
				$citation .= ':e'.$doiArray[1];
			}
			$citation .= " doi: ".$publication->_data["pub-id::doi"];
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
			'op' => $op,
			'interviews' => $interviews,
			'citation' => $citation
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
