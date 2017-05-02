# Sergio-JS
Biblioteca simples com algumas funcionalidades úteis para o dia dia de um projeto sem frameworks, funciona na maioria dos browsers inclusive o IE8.

OBS: Não testado no Firefox nem no Opera.

Veja os rescursos disponíveis que você pode usar:

## xhr
Possui varias operações AJAX para sua aplicação veja elas listadas abaixo

- get(url: string, successcallback: Function, paramaters: Object) - Realiza operações get
- post(url: string, data: string | Object, callback: Function, paramaters: Object) - Realiza operações de post
- upload(url: string, data: string | Object, callback: Function, paramaters: Object) - Realiza operações de UPLOAD de arquivo via AJAX. 

Parametros possíveis:
- onnotfound (callback: function): Execute uma função caso aconteça um timeout na requisição.
- xmlToJson (convertToJSON: Boolean): Converte uma resposta XML em JSON.

## jsonXML

Converte XML em JSON ou vise-versa

- toXML(jsonData): Converte JSON em XML
- parse(xml): Converte XML em JSON


## Funções simples

- ArrContains(arrayToSearch: array, term: string | numeric) : Procura um termo dentro de um Array.

- ObjArrContains(array, key: string, term: string | numeric) : Procura um objeto dentro de um array.

- getDataType(data: string) : Converte uma string em um tipo de dado.
