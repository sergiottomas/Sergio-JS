/**
 * Provide an functions facility
 * Dependencies:
 * polyfill.js (Only IE < 10)
 */

var Helper = (function (document) {
    var component = {};

    /**
     * Prove mascaras de input em expressão regulares
     */

    component.masks = function () {
        var module = {
            mask_cpf: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
                v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
                v = v.replace(/(\d{3})(\d)/, "$1.$2"); //Coloca um ponto entre o terceiro e o quarto dígitos
                //de novo (para o segundo bloco de números)
                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos

                input.value = v;
            },

            mask_tel: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
                v = v.replace(/^(\d\d)(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
                v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos

                input.value = v;
            },

            mask_number: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito

                input.value = v;
            },

            mask_coin: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
                v = v.replace(/(\d)(\d{8})$/, "$1.$2"); //coloca o ponto dos milhões
                v = v.replace(/(\d)(\d{5})$/, "$1.$2"); //coloca o ponto dos milhares

                v = v.replace(/(\d)(\d{2})$/, "$1,$2"); //coloca a virgula antes dos 2 últimos dígitos

                input.value = v;
            },

            mask_date: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
                v = v.replace(/(\d{2})(\d)/, "$1/$2");
                v = v.replace(/(\d{2})(\d)/, "$1/$2");

                v = v.replace(/(\d{2})(\d{2})$/, "$1$2");

                input.value = v;
            },

            mask_rg: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, "");
                if (v.length == 8) v = v.replace(/(\d{1})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
                if (v.length == 9) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");

                input.value = v;
            },

            mask_cep: function (el) {
                var input = el;
                var v = input.value;

                v = v.replace(/\D/g, "");
                v = v.replace(/^(\d{5})(\d)/, "$1-$2");

                input.value = v;
            }
        };

        return {
            cpf: module.mask_cpf,
            tel: module.mask_tel,
            number: module.mask_number,
            coin: module.mask_coin,
            date: module.mask_date,
            rg: module.mask_rg,
            cep: module.mask_cep
        };
    };

    /**
     * Envia um texto de um elemento (DOM) para a área de transferência
     */

    component.copyToClipBoard = function (element, callback) {
        window.getSelection().removeAllRanges();

        var value = element.parentNode.querySelector("strong");
        var range = document.createRange();
        range.selectNode(value);
        window.getSelection().addRange(range);

        try {
            var success = document.execCommand('copy');
            callback(success);
        } catch (err) {
            console.log(err);
        }
    };

    component.selectElementText = function (el, win) {
        var focused = el.getAttribute("focused");
        if(!focused) {
            el.setAttribute("focused", "true");
            win = win || window;
            var doc = win.document,
                sel, range;
            if (win.getSelection && doc.createRange) {
                sel = win.getSelection();
                range = doc.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
                
            } else if (doc.body.createTextRange) {
                range = doc.body.createTextRange();
                range.moveToElementText(el);
                range.select();
            }
        } else {
            window.setTimeout( function () {
                el.removeAttribute("focused");
            }, 5000);
        }
    };

    /**
     * Valida um formulario (DOM) e retorna um objeto com o resultado da validação
     */

    component.validateForm = function (form, AttrKey) {
        var invalids = [];

        if (form.elements === undefined) {
            form = form[0];
        }

        for (var i = 0; i < form.elements.length; i++) {
            var element = form.elements[i];
            var validate = element.getAttribute(AttrKey || "data-validate");

            if (validate && element.type != "submit") {
                if (element.value === "") {
                    invalids.push(element);
                }
            }
        }

        return {
            success: invalids.length > 0,
            invalids: invalids
        };
    };

    /**
     * Procura um objeto dentro de um array
     */

    component.ObjArrContains = function (arr, key, term) {
        var found = false;
        for (var i in arr) {
            if (arr[i][key] == term) {
                found = arr[i];
            }
        }

        return found;
    };

    /**
     * Procura um termo dentro de um Array
     */

    component.ArrContains = function (arr, term) {
        var found = false;
        for (var i in arr) {
            if (arr[i] == term) {
                found = arr[i];
                break;
            }
        }

        return found;
    };

    /**
     * Converte um tipo "string" em um tipo de dado valido (Number, Boolean ou String);
     */

    component.getDataType = function (data) {
        if (data) {
            //check is number
            if (isFinite(data)) {
                if (data === undefined || data === "")
                    data = null;
                else
                    data = parseFloat(data);
            }

            if (data == "true")
                data = true;
            else if (data == "false")
                data = false;
        }

        return data;
    };

    /**
     * Converte XML em JSON ou vise-versa
     */

    component.jsonXML = function () {
        var module = {
            /**
             * Converte JSON para XML
             */

            toXML: function (json) {
                var xmlString = "<data  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"></data>";
                var parser;
                var doc;

                try {
                    parser = new DOMParser();
                    doc = parser.parseFromString(xmlString, "application/xml");
                } catch (ex) {
                    parser = new ActiveXObject("Microsoft.XMLDOM");
                    parser.loadXML(xmlString);
                    doc = parser;
                }

                var root = doc.getElementsByTagName("data")[0];

                var getNode = function (root, item) {
                    //user polyfills for Object.keys to working in IE8
                    if (item instanceof Object) {
                        var keys = Object.keys(item);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            var node = doc.createElement(key);
                            var nodeValue = item[key];

                            if (nodeValue instanceof Array) {
                                if (nodeValue.length > 0) {
                                    for (var j = 0; j < nodeValue.length; j++) {
                                        var items = doc.createElement("record");
                                        getNode(items, nodeValue[j]);
                                        node.appendChild(items);
                                    }
                                } else {
                                    nodeValue = nodeValue.length;
                                }
                            } else {
                                if (nodeValue instanceof Object) {
                                    getNode(node, nodeValue);
                                } else {
                                    nodeValue = doc.createTextNode(nodeValue);
                                    node.appendChild(nodeValue);
                                }
                            }

                            root.appendChild(node);
                        }
                    } else {
                        root.appendChild(doc.createTextNode(item));
                    }
                };

                //check JSON
                if (json instanceof Array) {
                    for (var i = 0; i < json.length; i++) {
                        var item = json[i];
                        var node = doc.createElement("record");
                        getNode(node, item);
                        root.appendChild(node);
                    }
                } else {
                    getNode(root, json);
                }

                return doc;
            },

            /**
             * Converte XML para json
             */
            parse: function (xml, ignoredDataTypesList) {
                var json = {};
                var checkNode = false;

                if (xml.childNodes.length > 1) {
                    xml = xml.documentElement;
                    checkNode = module.nodeIsArray(xml);
                    json[xml.tagName] = this.getNodes(xml, checkNode, ignoredDataTypesList);
                } else {
                    checkNode = module.nodeIsArray(xml.childNodes[0]);
                    json[xml.childNodes[0].tagName] = module.getNodes(xml.childNodes[0], checkNode, ignoredDataTypesList);
                }

                return json;
            },

            /**
             * Pega os nós filhos de um nó XML
             */

            getNodes: function (root, isArray, ignoredDataTypesList) {
                if (root.nodeType == 1) {
                    var nodes = {};
                    var innerNodes = [];
                    var rootChildren = root.children ? root.children : root.childNodes;
                    for (var i = 0; i < rootChildren.length; i++) {
                        var node = rootChildren[i];

                        var verify;

                        if (node.children) {
                            verify = node.children.length > 1;
                        } else {
                            verify = node.childNodes.length > 1;
                        }

                        if (node.nodeType == 1) {
                            if (verify) {
                                var checkNode = this.nodeIsArray(node);
                                var newNodes = this.getNodes(node, checkNode, ignoredDataTypesList);

                                if (isArray) {
                                    innerNodes.push(newNodes);
                                } else {
                                    nodes[node.nodeName] = newNodes;
                                    if (node.attributes && node.attributes.length > 0) {
                                        nodes[node.nodeName].attr = this.getAttributes(node);
                                    }
                                }
                            } else {
                                if (node.attributes && node.attributes.length > 0) {
                                    var attributes = this.getAttributes(node);
                                    innerNodes[node.nodeName] = attributes;
                                    nodes[node.nodeName] = attributes;
                                } else {
                                    var text = "";
                                    if (ignoredDataTypesList && component.ArrContains(ignoredDataTypesList, node.nodeName)) {
                                        text = node.textContent ? node.textContent : node.text;
                                        innerNodes[node.nodeName] = text;
                                        nodes[node.nodeName] = text;
                                    } else {
                                        if (isArray) {
                                            text = node.textContent ? node.textContent : node.text;
                                            innerNodes.push(text);
                                        } else {
                                            if (node.children) {
                                                if (node.children.length > 0) {
                                                    if (node.children[0].children.length > 0) {
                                                        verify = true;
                                                    }
                                                }
                                            } else {
                                                if (node.childNodes.length > 0) {
                                                    if (node.childNodes[0].childNodes.length > 0) {
                                                        verify = true;
                                                    }
                                                }
                                            }

                                            if (verify) {
                                                innerNodes[node.nodeName] = this.getNodes(node, isArray, ignoredDataTypesList);
                                                nodes[node.nodeName] = this.getNodes(node, isArray, ignoredDataTypesList);
                                            } else {
                                                text = node.textContent ? node.textContent : node.text;
                                                innerNodes[node.nodeName] = component.getDataType(text);
                                                nodes[node.nodeName] = component.getDataType(text);
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }

                    if (innerNodes.length > 0) {
                        return innerNodes;
                    } else {
                        return nodes;
                    }
                } else {
                    console.log(root);
                }
            },

            /**
             * Pega os atributos de um nó XML
             */

            getAttributes: function (node) {
                var attributes = {};

                for (var i = 0; i < node.attributes.length; i++) {
                    attributes[node.attributes[i].name] = component.getDataType(node.attributes[i].value);
                }

                return attributes;
            },

            /**
             * Verifica se o nó possui um Array de nós.
             */

            nodeIsArray: function (node) {
                var children = node.children || node.childNodes;
                if (children) {
                    var nodes = [];
                    //remove text
                    var i = 0;
                    for (i = 0; i < children.length; i++) {
                        if (children[i] && children[i].nodeType == 1) {
                            nodes.push(children[i]);
                        }
                    }

                    var isArray = true;
                    var lastChild = nodes[0] ? nodes[0].nodeName : children;
                    for (i = 0; i < nodes.length; i++) {
                        if (nodes[i].nodeName == lastChild)
                            lastChild = nodes[i].nodeName;
                        else {
                            isArray = false;
                            break;
                        }
                    }

                    return isArray;
                } else {
                    return false;
                }
            }
        };

        return {
            toXML: module.toXML,
            parse: module.parse
        };
    };

    /**
     * Realiza operações Ajax get e post
     */

    component.xhr = function () {
        var module = {};

        /**
         * Converte a resposta XML vinda do servidor em JSON
         */

        module.xmlToJson = function (xhr) {
            var json = {};
            if (xhr.responseXML) {
                json = component.jsonXML.parse(xhr.responseXML);
                if (json && json.response && json.response.data) {
                    if (json.response.data instanceof Array) {
                        if (json.response.data.length > 0) {
                            json = json.response.data;
                        } else {
                            json = [];
                        }
                    } else {
                        if (json.response.data) {
                            json = json.response.data;
                        } else {
                            json = {};
                        }
                    }
                }
            }

            return json;
        };

        /**
         * Executa uma chamada post ou get
         */

        module.exec = function (rqst) {
            var xhr = new XMLHttpRequest();
            if (xhr !== null) {
                xhr.open(rqst.method, rqst.url, (rqst.async || true));

                if (rqst.method == "POST" && !rqst.upload)
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.timeout = rqst.timeout || 10000;
                xhr.responseType = rqst.responseType || '';
                xhr.setRequestHeader("Expires", "Mon, 1 Jan 1990 00:00:00 GMT");
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Pragma", "no-cache");
                xhr.onreadystatechange = rqst.onreadystatechange || function () {
                    if (xhr.readyState === 4 && xhr.status === 404) {
                        if (rqst.parameters.onnotfound) {
                            rqst.parameters.onnotfound(xhr);
                        }
                    }

                    if (xhr.readyState === 4 && xhr.status === 200) {

                        //parse XMl responses to JSON and create responseJSON obj in XHR
                        if (rqst.parameters && rqst.parameters.xmlToJson) {
                            xhr.responseJSON = module.xmlToJson(xhr);
                        }

                        rqst.callback({
                            success: true,
                            message: xhr.status,
                            data: xhr
                        }, rqst.parameters);
                    }
                };
                xhr.onerror = rqst.onerror || function () {
                    rqst.callback({
                        success: false,
                        message: "Ocorreu um erro ao efetuar a requisição para:\n" + rqst.url + "\ntente novamente ou contate o administrador do sistema"
                    }, rqst.parameters);
                };
                xhr.ontimeout = rqst.ontimeout || function () {
                    //retry request
                    window.setTimeout(function () {
                        module.exec(rqst);
                    }, 300);
                };
                xhr.send(rqst.data);
            } else {
                window.console.log("Your browser don't support XMLHttpRequests");
            }
        };

        /**
         * Realiza uma operação GET.
         */

        module.get = function (url, callback, parameters) {
            module.exec({
                method: "GET",
                url: url,
                callback: callback,
                parameters: parameters
            });
        };

        /**
         * Realiza uma operação POST.
         * @parametros: 
         * url: Url da chamada, 
         * data: Dado a ser enviado aceita Objeto ou QueryString,
         * parameters: Envia algumas opções na chamada AJAX que são: 
         * xmlToJson (Boolean):  Define se converte uma resposta XML em JSON
         */

        module.post = function (url, data, callback, parameters) {
            //convert data object in querystring
            if (data !== null && typeof (data) === "object") {
                var querystring = "";
                var keys = Object.keys(data);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = data[key];

                    //remove whitespace in both sides of string
                    value = typeof (value) == "string" ? value.trim() : value;
                    querystring += key + "=" + value;

                    if (i < (keys.length - 1))
                        querystring += "&";
                }

                data = querystring;
            }

            module.exec({
                method: "POST",
                url: url,
                callback: callback,
                data: data,
                parameters: parameters
            });
        };

        module.upload = function (url, data, callback, parameters) {
            module.exec({
                method: "POST",
                upload: true,
                url: url,
                callback: callback,
                data: data,
                parameters: parameters
            });
        };

        return {
            get: module.get,
            post: module.post,
            upload: module.upload
        };
    };

    component.charConvert = function (text) {
        if (text.match(/➞/g)) {
            text = text.replace(/➞/g, " to yield ");
        }

        return text;
    };

    return {
        xhr: component.xhr,
        ArrContains: component.ArrContains,
        charConvert: component.charConvert,
        selectElementText: component.selectElementText,
        getDataType: component.getDataType,
        jsonXML: component.jsonXML
    };
})(document);