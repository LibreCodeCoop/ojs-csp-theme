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
use PKP\plugins\ThemePlugin;
use PKP\plugins\Hook;	
use APP\facades\Repo;
use APP\decision\Decision;
use APP\template\TemplateManager;
use PKP\facades\Locale;
use APP\issue\Collector;
class CspThemePlugin extends ThemePlugin {

    /**
     * Carrega os estilos personalizados de nosso tema
     * @return null
     */

    public function init() {

        $this->setParent('bootstrapthreethemeplugin');
        $this->addStyle('child-stylesheet', 'styles/index.less');
		$this->addScript('csp', 'js/frontend.js', array( 'contexts' => 'frontend'));
		$this->addScript('lens', 'js/lens.js');
		$this->addStyle('csp', 'styles/backend.less', array( 'contexts' => 'backend'));

		Hook::add ('TemplateManager::display', [$this, 'loadTemplateData']);
		Hook::add('Templates::Common::Sidebar', [$this, 'addSidebar']);
		Hook::add('Templates::Common::Footer::PageFooter', [$this, 'addFooter']);

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

	public function loadTemplateData($hookName, $args) {
		$request = Application::get()->getRequest();
		$templateMgr = TemplateManager::getManager($request);
		$context = $request->getContext();
		$requestPath = $request->getRequestPath();
		$baseUrl = $request->getBaseUrl();
		$router = $request->getRouter();
		$page = $router->_page;
		$op = $router->getRequestedOp($request);
		$navigationLocale = Locale::getLocale();
		$arrayHeader = array();
		$arrayArticle = array();
		$arrayArchive = array();

		if (str_contains($args[1], 'frontend')){
			// Seleção de entrevistas para exibir em sidebar
			$issueDao = Repo::issue();
			$currentIssue = $issueDao->getCurrent($context->getId());
			$publicationsCollector = Repo::publication()->getCollector()
            ->filterByContextIds([$context->getId()]);
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
			$arrayHeader = array(
				'requestPath' => $requestPath,
				'baseUrl' => $baseUrl,
				'page' => $page,
				'coverImageUrl' => $coverImageUrl,
				'coverImageAltText' => $coverImageAltText,
				'context' => $context,
				'op' => $op,
				'interviews' => $interviews,
				'navigationLocale' => $navigationLocale,
			);
		} else {
			$coverImageUrl = null;
			$coverImageAltText = null;
		}

		// Conteúdo de box Como citar
		if($args[1] == 'frontend/pages/article.tpl'){
			$publication = $args[0]->getTemplateVars('publication');
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
			$issue = $args[0]->getTemplateVars('issue');
			$citation = implode(", ",$authors).". ";
			$citation .= $publication->getData('title',$publicationLocale).". ";
			$citation .= $context->getLocalizedName()." ";
			$citation .= $issue->getData('year')."; ";
			$citation .= $issue->getData('volume');
			$citation .= "(".$issue->getData('number').")";

			$doiObject = $publication->getData('doiObject');

			if($doiObject){
				if($issue->getData('year') > 2016){
					$doiArray = explode('x', strtolower($doiObject->getData('doi')));
					$citation .= ':e00'.substr($doiArray[1],2);
				}
				if ($doiObject->getData('doi')) {
					$citation .= " doi: ".$doiObject->getData('doi');
				}
			}

			$article = $args[0]->getTemplateVars('article');

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

			$arrayArticle = array(
				'requestPath' => $requestPath,
				'baseUrl' => $baseUrl,
				'page' => $page,
				'coverImageUrl' => $coverImageUrl,
				'coverImageAltText' => $coverImageAltText,
				'context' => $context,
				'op' => $op,
				'interviews' => $interviews,
				'citation' => $citation,
				'navigationLocale' => $navigationLocale,
				'dates' => $dates,
			);
		}

		if($args[1] == 'frontend/pages/issueArchive.tpl'){
			// Query de página de acervo
			$publishedIssues = Repo::issue()->getCollector()
            ->filterByContextIds([$context->getId()])
            ->filterByPublished(true)
			->orderBy(Collector::ORDERBY_PUBLISHED_ISSUES)
            ->getMany();

			if ($publishedIssues->count() > 0) {
				$issueOptions[] = ['value' => '', 'label' => '--- ' . __('editor.issues.backIssues') . ' ---'];
				foreach ($publishedIssues as $issue) {
					$number = $issue->getNumber();
					$year = $issue->getYear();
					$volume = $issue->getVolume();
					$title = strtolower($issue->getTitle($navigationLocale));
					$isSupl = str_contains($title,'sup');
					if($isSupl){
						$order = 12 + $number;
					}
					else{
						$order = $number;
					}
					if($year <= 2005){
						if(($isSupl !== false)){
							$number = 'Supl. '.$number;
						}elseif($number > 12){
							$number = $number - 12;
							$number = 'Supl. '.$number;
						}
					}else{
						if(is_int($number)){
							$x = 1;
						}
						if(intval($number) > 12){
							$number = $number - 12;
							$number = 'Supl. '.$number;
						}
					}
					$array[$year][$volume][$order] = array($number => $issue->getId());
				}
			}
			$arrayArchive = array('issues' => $array);
		}

		$array = array_merge($arrayHeader, $arrayArticle, $arrayArchive);
		$templateMgr->assign($array);
	}

	// Passa datas de submissão e aceite para exibir na sidebar
	function addSidebar($hookName, $params) {
		$request = Application::get()->getRequest();
		$templateMgr = TemplateManager::getManager($request);
		if(strpos($request->_requestPath, 'article/view')){
			$article = $params[1]->getTemplateVars('article');

			$dates = "";
			$submitdate = $article->getDateSubmitted();
			$publishdate = $article->getDatePublished();

			// Get all decisions for this submission
			$decisionIterator = Repo::decision()->getCollector()
            ->filterBySubmissionIds([$article->getData('id')])
            ->getMany();

			// Loop through the decisions
			foreach ($decisionIterator as $decision) {
				// If we have a review stage decision and it was a submission accepted decision, get to date for the decision
				$x = $decision->getData('decision');
				if ($decision->getData('decision') == Decision::ACCEPT){
					$reviewdate = $decision->getData('dateDecided');
				}
			}

			$dates = array();
			if ($submitdate)
				$dates['received'] = date('Y-m-d',strtotime($submitdate));
			if ($reviewdate)
				$dates['accepted'] = date('Y-m-d',strtotime($reviewdate));
			if ($publishdate)
				$dates['published'] = date('Y-m-d',strtotime($publishdate));

				$templateMgr->assign('dates', $dates);
		}

		$templateMgr->display($this->getTemplateResource('frontend/components/aside.tpl'));
	}

	function addFooter($hookName, $params) {
		$request = Application::get()->getRequest();
		$templateMgr = TemplateManager::getManager($request);
		if (
			$params[1]->template_resource <> "plugins-1-plugins-generic-pdfJsViewer-generic-pdfJsViewer:display.tpl" and
			$params[1]->template_resource <> "plugins-1-plugins-generic-htmlArticleGalley-generic-htmlArticleGalley:display.tpl"
			) {
			$templateMgr->display($this->getTemplateResource('frontend/components/footer_logos.tpl'));
			$templateMgr->display($this->getTemplateResource('frontend/components/footer_barra_brasil.tpl'));
		}
	}
}
