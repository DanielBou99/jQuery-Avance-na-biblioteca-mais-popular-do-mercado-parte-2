var tempoInicial = $("#tempo-digitacao").text();
// Pegar o elemento textarea
var campo = $(".campo-digitacao");

// chamar todas as funções quando a página terminar de carregar
$(document).ready(function() {

    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    $("#botao-reiniciar").click(reiniciaJogo);
    inicializaMarcadores();
    atualizaPlacar();
    
    $("#usuarios").selectize({
        create: true,
        sortField: 'text'
    });

    $(".tooltip").tooltipster({
        trigger: "custom"
    });

});

function atualizaTempoInicial(tempo) {
    tempoInicial = tempo;
    $("#tempo-digitacao").text(tempo);
}

/** Seleciona a frase da página e atualiza a quantidade de palavras */
function atualizaTamanhoFrase() {

    // Pegar o conteúdo dentro do elemento com classe .frase
    var frase = $(".frase").text();
    // Quebrar a frase com separador espaço e contar a quantidade de palavras
    var numPalavras = frase.split(" ").length;
    // Pegar o elemento html que informa o tamanho da frase
    var tamanhoFrase = $("#tamanho-frase");
    // Incluir o tamanho da frase no elemento
    tamanhoFrase.text(numPalavras);
}

function inicializaContadores() {

    // Adicionar uma função ao evento de digitar na textarea
    campo.on("input", function() {
        // .val() pega o valor digitado pelo usuário, bom para formularios
        var conteudo = campo.val();

        // contar a quantidade de palavras e atualizar o elemento html
        var qtdPalavras = conteudo.split(/\S+/).length - 1;
        $("#contador-palavras").text(qtdPalavras);

        // contar a quantidade de caracteres e atualizar o elemento html
        var qtdCaracteres = conteudo.replace(/\s/g, '').length;
        $("#contador-caracteres").text(qtdCaracteres);
    });
}

function inicializaCronometro() {

    campo.one("focus", function() {
        // diminuir o tempo que o usuário tem para digitar
        var tempoRestante = $("#tempo-digitacao").text();
        
        $("#botao-reiniciar").attr("disabled",true);

        var cronometroID = setInterval(function() {
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);

            // desabilitar a textarea quando o tempo chegar em zero 0
            if (tempoRestante < 1) {
                clearInterval(cronometroID);
                finalizaJogo();
            }
        }, 1000)
    });
}

function finalizaJogo() {
    campo.attr("disabled", true);
    $("#botao-reiniciar").attr("disabled", false);
    campo.toggleClass("campo-desativado");
    inserePlacar();
}

function reiniciaJogo() {

    // botão para reiniciar o jogo
    campo.attr("disabled", false);
    campo.val("");
    $("#contador-palavras").text("0");
    $("#contador-caracteres").text("0");
    $("#tempo-digitacao").text(tempoInicial);
    inicializaCronometro();
    campo.toggleClass("campo-desativado");
    campo.removeClass("borda-verde");
    campo.removeClass("borda-vermelha");
}

// Função para alterar a cor da borda  do textarea
// quando o usuário estiver digitando a frase.
function inicializaMarcadores() {

    campo.on("input", function() {
        var frase = $(".frase").text();
        var digitado = campo.val();
        var comparavel = frase.substr(0,digitado.length);
        
        if (digitado == comparavel) {
            campo.removeClass("borda-vermelha");
            campo.addClass("borda-verde");
        } else {
            campo.removeClass("borda-verde");
            campo.addClass("borda-vermelha");
        }
    });
}