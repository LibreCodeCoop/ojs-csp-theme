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
        $this->modifyStyle('stylesheet', array('addLess' => array('styles/index.less')));
        //$this->addStyle('child-stylesheet', 'styles/index.less');                
	
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
}
