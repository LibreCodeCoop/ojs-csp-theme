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
		HookRegistry::register('Templates::Common::Sidebar', array($this, 'addDates'));

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
			if(!is_null($currentIssue)){
				$coverImageUrl = $currentIssue->getLocalizedCoverImageUrl();
				$coverImageAltText = $currentIssue->getLocalizedCoverImageAltText();
			}
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
				$familyName = $publication->_data["authors"][$key]->_data["familyName"][$submissionLocale];
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
					if (!is_null($familyName)) {
						$givenNameArray = explode(" ", $givenName);
						$arraySize = count($givenNameArray);
						for ($i=0; $i <= $arraySize; $i++) {
							if($givenNameArray[$i] === strtolower($givenNameArray[$i])){
								$abbrev .= "";
							}else{
								$abbrev .= substr($givenNameArray[$i], 0,1);
							}
						}
						$familyNameArray = explode(" ", $familyName);
						$arraySize = count($familyNameArray);
						for ($i=0; $i < ($arraySize-1); $i++) {
							if($familyNameArray[$i] === strtolower($familyNameArray[$i])){
								$abbrev .= "";
							}else{
								$abbrev .= substr($familyNameArray[$i], 0,1);
							}
						}
						$authors[]= end($familyNameArray)." ".$abbrev;
					}else{
						$givenNameArray = explode(" ", $givenName);
						$arraySize = count($givenNameArray);
						for ($i=0; $i < ($arraySize-1); $i++) {
							if($givenNameArray[$i] === strtolower($givenNameArray[$i])){
								$abbrev .= "";
							}else{
								$abbrev .= substr($givenNameArray[$i], 0,1);
							}
						}
						$authors[] = $givenNameArray[$arraySize-1]." ".$abbrev;
					}

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
				$doiArray = explode('x', strtolower($publication->_data["pub-id::doi"]));
				$citation .= ':e'.$doiArray[1];
			}
			if ($publication->_data["pub-id::doi"]) {
				$citation .= " doi: ".$publication->_data["pub-id::doi"];
			}
		}
		$templateMgr = $args[0];
        $templateMgr->assign(array(
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
						SELECT
							`year`,
							volume,
							CASE
								WHEN `year` <= 2005 AND setting_value like '%sup%' THEN CONCAT('Supl.', `number`)
								WHEN `year` <= 2005 AND `number` > 12 THEN CONCAT('Supl.', (`number` - 12))
								WHEN `year` > 2005 AND `number` > 12 THEN CONCAT('Supl.', (`number` - 12))
							ELSE `number`
							END numero,
							number,
							i.issue_id,
							CASE
								WHEN setting_value like '%sup%' THEN 12 + CONVERT(REPLACE(i.`number`,'supl.',''),INT)
							ELSE CONVERT(`number`,INT)
							END ordem
						FROM
							ojs.issues i
						LEFT JOIN
							ojs.issue_settings s
						ON
							s.issue_id = i.issue_id
						WHERE
							`year` = '$rowAno[ano]'
							AND s.setting_name = 'title'
							and s.locale = 'pt_BR'
							and i.published = 1
						ORDER BY ordem
					QUERY
				);
				while (!$resultMes->EOF) {
					$rowIssue = $resultMes->GetRowAssoc(false);
					$array[$rowAno['ano']][$rowIssue['volume']][$rowIssue['numero']] = $rowIssue['issue_id'];
					$resultMes->MoveNext();
				}
				$resultAno->MoveNext();
			}
			$templateMgr = $args[0];
			$templateMgr->assign('issues', $array);
		}
	}

	function addDates($hookName, $params) {
		$request = Application::get()->getRequest();
		if(strpos($request->_requestPath, 'article/view')){
			$smarty = $params[1];
			$article = $smarty->get_template_vars('article');

			$dates = "";
			$submitdate = $article->getDateSubmitted();
			$publishdate = $article->getDatePublished();

			// Get all decisions for this submission
			$editDecisionDao = DAORegistry::getDAO('EditDecisionDAO');
			$decisions = $editDecisionDao->getEditorDecisions($article->getId());

			// Loop through the decisions
			foreach ($decisions as $decision) {
				// If we have a review stage decision and it was a submission accepted decision, get to date for the decision
				if ($decision['decision'] == '1')
					$reviewdate = $decision['dateDecided'];
			}

			$dates = array();
			if ($submitdate)
				$dates['received'] = date('Y-m-d',strtotime($submitdate));
			if ($reviewdate)
				$dates['accepted'] = date('Y-m-d',strtotime($reviewdate));
			if ($publishdate)
				$dates['published'] = date('Y-m-d',strtotime($publishdate));

			$smarty->assign('dates', $dates);

			return false;
		}
	}
}
