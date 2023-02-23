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
		$this->addScript('lens', 'js/lens.js');
		$this->addStyle('csp', 'styles/backend.less', array( 'contexts' => 'backend'));

		HookRegistry::register ('TemplateManager::display', array($this, 'loadTemplateData'));
		HookRegistry::register('TemplateManager::fetch', array($this, 'fetchTemplate'));
		HookRegistry::register('Templates::Common::Sidebar', array($this, 'addDates'));
		//HookRegistry::register('LensGalleyPlugin::articleDownload', array($this, 'lensGalleyPluginArticleDownload'));

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

	public function fetchTemplate($hookName, $args){
        $request = Application::get()->getRequest();
		$router = $request->getRouter();
		$page = $router->_page;
		$op = $router->getRequestedOp($request);
		if($op == "index"){
			$context = $request->getContext();
			$requestPath = $request->getRequestPath();
			$baseUrl = $request->getBaseUrl();
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
	}

	public function loadTemplateData($hookName, $args) {
		$templateMgr = $args[0];
        $request = Application::get()->getRequest();
		$context = $request->getContext();
		$requestPath = $request->getRequestPath();
		$baseUrl = $request->getBaseUrl();
		$router = $request->getRouter();
		$page = $router->_page;
		$op = $router->getRequestedOp($request);
		$navigationLocale = AppLocale::getLocale();

		if ($args[1] == "frontend/pages/indexJournal.tpl") {
			$issueDao = DAORegistry::getDAO('IssueDAO'); /* @var $issueDao IssueDAO */
			$currentIssue = $issueDao->getCurrent($context->getId());

			$userDao = DAORegistry::getDAO('UserDAO');
			$interviews = $userDao->retrieve(
				<<<QUERY
				SELECT p.publication_id, s.setting_value
				FROM publications p
				LEFT JOIN publication_settings s
				ON s.publication_id = p.publication_id
				WHERE section_id = (SELECT DISTINCT section_id FROM ojs.section_settings WHERE setting_value = 'ENTREVISTA'
				) AND s.setting_name = 'title' AND s.locale = '$navigationLocale'
				ORDER BY publication_id ASC LIMIT 3
				QUERY
			);

			if(!is_null($currentIssue)){
				$coverImageUrl = $currentIssue->getLocalizedCoverImageUrl();
				$coverImageAltText = $currentIssue->getLocalizedCoverImageAltText();
			}
		} else {
			$coverImageUrl = null;
			$coverImageAltText = null;
		}

		/* Make citation */
		if($args[1] == "frontend/pages/article.tpl"){
			$pathArray = explode("/",$requestPath);
			$submissionId = end($pathArray);
			$submissionDAO = Application::getSubmissionDAO();
			$submission = $submissionDAO->getById($submissionId);
			$publication = $submission->getCurrentPublication();
			$publicationLocale = $publication->getData('locale');
			foreach ($publication->getData('authors') as $key => $value) {
				$givenName = $value->getData('givenName',$publicationLocale);
				$familyName = !is_null($value->getData('givenName')) ? $value->getData('familyName',$publicationLocale) : null;
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
			$issueDao = DAORegistry::getDAO('IssueDAO'); /* @var $issueDao IssueDAO */
			$issue = $issueDao->getById($publication->getData('issueId'));

			$citation = implode(", ",$authors).". ";
			$citation .= $publication->getData('title',$publicationLocale).". ";
			$citation .= $context->getLocalizedName()." ";
			$citation .= $issue->getData('year')."; ";
			$citation .= $issue->getData('volume');
			$citation .= "(".$issue->getData('number').")";
			if($issue->getData('year') > 2016){
				$doiArray = explode('x', strtolower($publication->getData('pub-id::doi')));
				$citation .= ':e00'.substr($doiArray[1],2);
			}
			if ($publication->getData('pub-id::doi')) {
				$citation .= " doi: ".$publication->getData('pub-id::doi');
			}
			$templateMgr->assign(array(
				'issue' => $issue,
			));
		}

        $templateMgr->assign(array(
			'requestPath' => $requestPath,
			'baseUrl' => $baseUrl,
			'page' => $page,
			'coverImageUrl' => $coverImageUrl,
            'coverImageAltText' => $coverImageAltText,
			'context' => $context,
			'op' => $op,
			'interviews' => $interviews,
			'citation' => $citation,
			'navigationLocale' => $navigationLocale
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
			foreach ($resultAno as $rowAno) {
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
							`year` = $rowAno->ANO
							AND s.setting_name = 'title'
							and s.locale = 'pt_BR'
							and i.published = 1
						ORDER BY ordem
					QUERY
				);
				foreach ($resultMes as $rowIssue) {
					$array[$rowAno->ANO][$rowIssue->volume][$rowIssue->numero] = $rowIssue->issue_id;
				}
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

	public function string_between_two_string($str, $starting_word, $ending_word)
	{
		$subtring_start = strpos($str, $starting_word);
		$subtring_start += strlen($starting_word);
		$size = strpos($str, $ending_word, $subtring_start) - $subtring_start;
		return substr($str, $subtring_start, $size);
	}

	public function lensGalleyPluginArticleDownload($hookName, $args){
		$request = Application::get()->getRequest();
		list($submission, $galley) = $args;
		$hooks = HookRegistry::getHooks("ArticleHandler::download");
		foreach ($hooks as $hookList) {
			foreach ($hookList as $hook) {
				if(is_a($hook[0], LensGalleyPlugin::class)){
					$lensGalley = $hook[0];
					break 2;
				}
			}
		}
		$sectionId = $args[0]->_data["publications"][0]->_data["sectionId"];
		$XMLlocale = $args[1]->_data["locale"];
		$navigationLocale = AppLocale::getLocale();
		$xmlContents = $lensGalley->_getXMLContents($request, $galley);
		file_put_contents("/tmp/xmlContents2.txt",$xmlContents."\n",FILE_APPEND);
		$sections = array(1, 4, 6, 7, 8, 9);
		if($navigationLocale == $XMLlocale){
			return;
		}
		if($XMLlocale == "pt_BR"){
			switch ($navigationLocale) {
				case "en_US":
					if(strpos($xmlContents, '<sub-article article-type="translation" id="s1" xml:lang="en">')){
						$articleMeta = $this->string_between_two_string($xmlContents, '<article-meta>', '</article-meta>');
						$articleFrontStubEN = $this->string_between_two_string($xmlContents, 'xml:lang="en">','<body>');
						$bodyMain = $this->string_between_two_string($xmlContents, '</front>','<back>');
						$bodyEN = $this->string_between_two_string($xmlContents, '</front-stub>','</sub-article>');

						$xmlContents = str_replace($articleMeta, $articleFrontStubEN, $xmlContents);
						$xmlContents = str_replace($bodyMain, $bodyEN, $xmlContents);
					}
					break;
				case "es_ES":
					if(strpos($xmlContents, '<sub-article article-type="translation" id="s2" xml:lang="es">')){
						$articleMeta = $this->string_between_two_string($xmlContents, '<article-meta>', '</article-meta>');
						$articleFrontStubEN = $this->string_between_two_string($xmlContents, 'xml:lang="en">','<body>');
						$bodyMain = $this->string_between_two_string($xmlContents, '</front>','<back>');
						$bodyEN = $this->string_between_two_string($xmlContents, '</front-stub>','</sub-article>');

						$xmlContents = str_replace($bodyEN, '', $xmlContents);
						$xmlContents = str_replace($articleFrontStubEN, '', $xmlContents);

						$articleFrontStubES = $this->string_between_two_string($xmlContents, 'xml:lang="es">','<body>');
						$bodyES = $this->string_between_two_string($xmlContents, '</front-stub>','</sub-article>');

						$xmlContents = str_replace($articleMeta, $articleFrontStubES, $xmlContents);
						$xmlContents = str_replace($bodyMain, $bodyES, $xmlContents);
					}
					break;
			}
		}
		if($XMLlocale == "en_US"){
			switch ($navigationLocale) {
				case "pt_BR":
					if(strpos($xmlContents, '<sub-article article-type="translation" id="s1" xml:lang="pt">')){
						$articleMeta = $this->string_between_two_string($xmlContents, '<article-meta>', '</article-meta>');
						$articleFrontStubPT = $this->string_between_two_string($xmlContents, 'xml:lang="pt">','<body>');
						$bodyMain = $this->string_between_two_string($xmlContents, '</front>','<back>');
						$bodyPT = $this->string_between_two_string($xmlContents, '</front-stub>','</sub-article>');

						$xmlContents = str_replace($articleMeta, $articleFrontStubPT, $xmlContents);
						$xmlContents = str_replace($bodyMain, $bodyPT, $xmlContents);
					}
					break;
				case "es_ES":
					if(strpos($xmlContents, '<sub-article article-type="translation" id="s2" xml:lang="es">')){
						$articleMeta = $this->string_between_two_string($xmlContents, '<article-meta>', '</article-meta>');
						$articleFrontStubES = $this->string_between_two_string($xmlContents, 'xml:lang="es">','<body>');
						$bodyEN = $this->string_between_two_string($xmlContents, '</front>','<back>');
						$bodyES = $this->string_between_two_string($xmlContents, '</front-stub>','</sub-article>');

						$xmlContents = str_replace($articleMeta, $articleFrontStubES, $xmlContents);
						$xmlContents = str_replace($bodyEN, $bodyES, $xmlContents);
					}
					break;
			}
		}

		header('Content-Type: application/xml');
		header('Content-Length: ' . strlen($xmlContents));
		header('Content-Disposition: inline');
		header('Cache-Control: private');
		header('Pragma: public');
		echo $xmlContents;
		$returner = true;
		HookRegistry::call('LensGalleyPlugin::articleDownloadFinished', array(&$returner));
		return true;
	}
}
