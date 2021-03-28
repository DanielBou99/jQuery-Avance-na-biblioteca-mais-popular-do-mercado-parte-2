$("#botao-placar").click(mostraPlacar);
$("#botao-sync").click(sincronizaPlacar);

function inserePlacar() {
    
    var corpoTabela = $(".placar").find("tbody");
    var usuario = $("#usuarios").val();
    var numPalavras = $("#contador-palavras").text();
    
    var linha = novaLinha(usuario, numPalavras);

    // Encontrar elemento dentro de linha com a classe botao-remover e adicionar um evento de click
    linha.find(".botao-remover").click(removeLinha);
    
    corpoTabela.prepend(linha);
    $(".placar").slideDown(500);
    scrollPlacar();
}

function scrollPlacar() {

    var posicaoPlacar = $(".placar").offset().top;
    $("html, body").animate(
    {
        scrollTop: posicaoPlacar
    },1000);
}

function removeLinha(event){

    event.preventDefault();
    var linha = $(this).parent().parent().fadeOut();
    linha.fadeOut(1000);
    setTimeout(function() {
        linha.remove();
    },1000);
}

function novaLinha(usuario, numPalavras) {
    
    var linha = $("<tr>"); // Cria o elemento e retorna
    
    // Cria a coluna usuario
    var colunaUsuario = $("<td>").text(usuario);
    
    // Cria a coluna palavras
    var colunaPalavras = $("<td>").text(numPalavras);
    
    // Cria a coluna com botão remover
    var colunaRemover = $("<td>");
    var link = $("<a>").addClass("botao-remover").attr("href","#");
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");
    link.append(icone);
    colunaRemover.append(link);

    // Juntar a linha dentro do <tr>
    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);

    return linha;

}

function mostraPlacar() {

    $(".placar").stop().slideToggle(600);
}

function sincronizaPlacar() {

    var placar = [];
    var linhas = $("tbody>tr");
    linhas.each(function() {
        
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras =  $(this).find("td:nth-child(2)").text();
        
        var score = {
            usuario: usuario,
            pontos: palavras
        };

        placar.push(score);
    });

    var dados = {
        placar: placar
    };

    $.post("http://localhost:3000/placar", dados, function () {
        console.log("Salvou os dados no servidor.");        
        $(".tooltip").tooltipster("open");
    }).fail(function() {
        $(".tooltip").tooltipster("open").tooltipster("content","Falha ao sincronizar :(");
    }).always(function () {
        setTimeout(function () {
            $(".tooltip").tooltipster("close");    
        },1200);
    });

}

function atualizaPlacar() {

    $.get("http://localhost:3000/placar",function(data){
        $(data).each(function(){
            var linha = novaLinha(this.usuario, this.pontos);
            linha.find(".botao-remover").click(removeLinha);
            $("tbody").append(linha);
        });
    });
}
