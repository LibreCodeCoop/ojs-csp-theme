# ojs-csp-theme

Template para o site do OJS (Open Journal Systems) do Cadenos de Saúde Pública da Fiocruz

## Setup

* Instale o tema Bootstrap 3
* Clone este repositório dentro da pasta plugins da seguinte forma:
```bash
git clone git@github.com:LyseonTech/ojs-csp-theme.git csp
```
> **OBS** é importante que o diretório onde o plugin é clonado se chame csp

## Desenvolvimento

Abra o arquivo de configuração do OJS (`config.inc.php`) e certifique de que está com o cache desabilitado atribuindo `none` para `object_cache` e `Off` para `web_cache`
