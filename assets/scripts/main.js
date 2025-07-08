document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os links com a classe "link-scroll"
    const links = document.querySelectorAll('a.link-scroll');

    for (const link of links) {
        link.addEventListener('click', function(e) {
            // Previne o comportamento padrão do link (o "pulo" instantâneo)
            e.preventDefault();

            // Pega o id do alvo (ex: "#secao-alvo") a partir do href do link
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Se o elemento de destino existir, rola suavemente até ele
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Define a animação de rolagem suave
                    block: 'start'      // Alinha o topo do elemento com o topo da tela
                });
            }
        });
    }
});