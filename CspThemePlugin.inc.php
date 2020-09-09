<?php
import('lib.pkp.classes.plugins.ThemePlugin');
class CspThemePlugin extends ThemePlugin {

    /**
     * Carrega os estilos personalizados de nosso tema
     * @return null
     */
    public function init() {
        
        //$this->addStyle('stylesheet', 'styles/index.less');
        $this->setParent('bootstrapthreethemeplugin');
        //$this->modifyStyle('stylesheet', array('addLess' => array('styles/index.less')));
        $this->addStyle('child-stylesheet', 'styles/index.less');

        HookRegistry::register ('TemplateManager::display', array($this, 'loadTemplateData'));
	
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

		// Retrieve the TemplateManager
        $templateMgr = $args[0];

        $request = Application::getRequest();
        
		$page = isset($args[0]) ? (int) $args[0] : 1;
		$context = $request->getContext();

		$count = $context->getData('itemsPerPage') ? $context->getData('itemsPerPage') : Config::getVar('interface', 'items_per_page');
        $offset = $page > 1 ? ($page - 1) * $count : 0;
                
        

        $context = $request->getContext();
		$params = array(
			'contextId' => $context->getId(),
			'orderBy' => 'seq',
			'orderDirection' => 'ASC',
			'count' => 12,
			'offset' => 0,
			'isPublished' => true,
        );        
        
		$issues = iterator_to_array(Services::get('issue')->getMany($params));
		$total = Services::get('issue')->getMax($params);

		$showingStart = $offset + 1;
		$showingEnd = min($offset + $count, $offset + count($issues));
		$nextPage = $total > $showingEnd ? $page + 1 : null;
		$prevPage = $showingStart > 1 ? $page - 1 : null;

 		$templateMgr->assign(array(
			'issues' => $issues,
			'showingStart' => $showingStart,
			'showingEnd' => $showingEnd,
			'total' => $total,
			'nextPage' => $nextPage,
			'prevPage' => $prevPage,
		)); 

	}    
}
