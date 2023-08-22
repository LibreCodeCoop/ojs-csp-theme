<?php

/**
 * @file plugins/themes/csp/CspThemePlugin.php
 *
 * Copyright (c) 2020-2023 Lívia Gouvêa
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class CspThemePlugin
 * @brief Default theme
 */

namespace APP\plugins\themes\csp;

use APP\core\Application;
use APP\i18n\AppLocale;
use PKP\config\Config;
use PKP\facades\Locale;
use PKP\plugins\ThemePlugin;
use PKP\plugins\Hook;	
use APP\facades\Repo;
use APP\decision\Decision;

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


		Hook::add ('TemplateManager::display', [$this, 'loadTemplateData']);
		Hook::add('TemplateManager::fetch', [$this, 'fetchTemplate']);
		Hook::add('Templates::Common::Sidebar', [$this, 'addDates']);

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

	public function fetchTemplate($hookName, $args){ return;
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
			$collector = Repo::issue()->getCollector()->limit(1)->offset(0);
			$collector->filterByContextIds([$context->getId()]);
			$issues = $collector->getMany();
			if ($issues) {
				$coverImageUrl = $issues->getLocalizedCoverImageUrl();
				$coverImageAltText = $issues->getLocalizedCoverImageAltText();
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

		if (str_contains($args[1], 'frontend')){
			$issueDao = Repo::issue();
			$currentIssue = $issueDao->getCurrent($context->getId());
			$publicationsCollector = Repo::publication()->getCollector()
            ->filterByContextIds([$context->getId()]);
            // ->orderBy(\APP\submission\Collector::ORDERBY_SEQUENCE, \APP\submission\Collector::ORDER_DIR_ASC);

			$interviews = $publicationsCollector->getQueryBuilder()
				->join('publication_settings AS p', 'p.publication_id', '=', 's.publication_id')
				->where('s.setting_name', 'title')
				->where('s.locale', 'pt')
				->where('s.setting_value', 'ENTREVISTA')
				->select('p.section_id, s.setting_value');


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
			$submission = Repo::submission()->get($submissionId, $context->getId());
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
							//	$abbrev .= substr($givenNameArray[$i], 0,1);
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
			$issue = Repo::issue()->get($publication->getData('issueId'), $context->getId()); 
			$citation = implode(", ",$authors).". ";
			$citation .= $publication->getData('title',$publicationLocale).". ";
			$citation .= $context->getLocalizedName()." ";
			$citation .= $issue->getData('year')."; ";
			$citation .= $issue->getData('volume');
			$citation .= "(".$issue->getData('number').")";
			if($issue->getData('year') > 2016){
//				$doiArray = explode('x', strtolower($publication->getLocalizedData('pub-id::doi')));
//				$citation .= ':e00'.substr($doiArray[1],2);
			}
			if ($publication->getLocalizedData('pub-id::doi')) {
				$citation .= " doi: ".$publication->getLocalizedData('pub-id::doi');
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
			$article = $smarty->getTemplateVars('article');

			$dates = "";
			$submitdate = $article->getDateSubmitted();
			$publishdate = $article->getDatePublished();

            $editDecisions = Repo::decision()->getCollector()
                ->filterBySubmissionIds([$article->getData('id')])
				->getMany();

			foreach ($editDecisions->reverse() as $editDecision) {
				if ($editDecision->getData('decision') == Decision::ACCEPT) {
					$acceptdate = $editDecision->getData('dateDecided');
				}
			}

			$dates = array();
			if ($submitdate)
				$dates['received'] = date('Y-m-d',strtotime($submitdate));
			if ($acceptdate)
				$dates['accepted'] = date('Y-m-d',strtotime($acceptdate));
			if ($publishdate)
				$dates['published'] = date('Y-m-d',strtotime($publishdate));

			$smarty->assign('dates', $dates);

			return false;
		}
	}
}
