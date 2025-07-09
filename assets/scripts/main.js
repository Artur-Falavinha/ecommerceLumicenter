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

    // =====================
    // Rolagem suave para o topo ao clicar em qualquer link 'Início'
    // =====================
    // Seleciona todos os links 'Início' que devem rolar para o topo (navbar e footer)
    const linksInicioTopo = document.querySelectorAll('a[href="#image-slider-container"], footer a[href="#header"].link-scroll');
    linksInicioTopo.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Faz scroll suave até o topo da página
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Remove hover/focus visual imediatamente
            this.blur();
        });
    });

    // Remover hover/focus dos links externos ao clicar
    const linksExternos = document.querySelectorAll('a[href*="lumicenter.com/empresa"], a[href*="lumicenter.com/novidades"], a[href*="lumicenter.com/contato"]');
    linksExternos.forEach(function(link) {
        link.addEventListener('click', function() {
            this.blur();
        });
    });

    // =====================
    // Modal de Categorias Loja (delay para sumir)
    // =====================
    const lojaLink = document.getElementById('loja-link');
    const modalCategorias = document.getElementById('modal-categorias');
    let modalTimeout;
    if (lojaLink && modalCategorias) {
        lojaLink.addEventListener('mouseenter', () => {
            clearTimeout(modalTimeout);
            modalCategorias.style.display = 'block';
        });
        lojaLink.addEventListener('mouseleave', () => {
            modalTimeout = setTimeout(() => { modalCategorias.style.display = 'none'; }, 300);
        });
        modalCategorias.addEventListener('mouseenter', () => {
            clearTimeout(modalTimeout);
            modalCategorias.style.display = 'block';
        });
        modalCategorias.addEventListener('mouseleave', () => {
            modalTimeout = setTimeout(() => { modalCategorias.style.display = 'none'; }, 300);
        });
    }

    // =====================
    // Badge do Carrinho (exemplo dinâmico)
    // =====================
    function atualizarBadgeCarrinho(qtd) {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.textContent = qtd;
            badge.style.display = qtd > 0 ? 'flex' : 'none';
        }
    }
    // Exemplo: atualizarBadgeCarrinho(3); // Chame isso ao adicionar/remover produtos

    // =====================
    // User Actions (Login/Cadastro dinâmico) - delay para sumir
    // =====================
    const headerUser = document.getElementById('header-user');
    const userActions = document.getElementById('user-actions');
    let userActionsTimeout;
    if (headerUser && userActions) {
        headerUser.addEventListener('mouseenter', () => {
            clearTimeout(userActionsTimeout);
            userActions.style.display = 'flex';
        });
        headerUser.addEventListener('mouseleave', () => {
            userActionsTimeout = setTimeout(() => { userActions.style.display = 'none'; }, 300);
        });
        userActions.addEventListener('mouseenter', () => {
            clearTimeout(userActionsTimeout);
            userActions.style.display = 'flex';
        });
        userActions.addEventListener('mouseleave', () => {
            userActionsTimeout = setTimeout(() => { userActions.style.display = 'none'; }, 300);
        });
    }

    // =====================
    // Carrossel de Imagens
    // =====================
    const slider = document.getElementById('image-slider');
    const slides = slider ? slider.querySelectorAll('.image-slide') : [];
    const dotsContainer = document.getElementById('slider-dots');
    const leftArrow = document.getElementById('slider-arrow-left');
    const rightArrow = document.getElementById('slider-arrow-right');
    let currentSlide = 0;
    let intervalId = null;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function goToSlide(idx) {
        if (!slider || slides.length === 0) return;
        currentSlide = (idx + slides.length) % slides.length;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }
    function startAutoSlide() {
        stopAutoSlide();
        intervalId = setInterval(nextSlide, 5000);
    }
    function stopAutoSlide() {
        if (intervalId) clearInterval(intervalId);
    }
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                goToSlide(i);
                startAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    if (slider && slides.length > 0) {
        createDots();
        goToSlide(0);
        startAutoSlide();
        // Setas
        if (leftArrow) leftArrow.onclick = () => { prevSlide(); startAutoSlide(); };
        if (rightArrow) rightArrow.onclick = () => { nextSlide(); startAutoSlide(); };
        // Drag com mouse/touch
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('touchstart', startDrag, {passive: true});
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove, {passive: false});
    }
    function startDrag(e) {
        isDragging = true;
        slider.classList.add('dragging');
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        prevTranslate = -currentSlide * slider.offsetWidth;
        stopAutoSlide();
    }
    function dragMove(e) {
        if (!isDragging) return;
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const dx = x - startX;
        currentTranslate = prevTranslate + dx;
        slider.style.transform = `translateX(${currentTranslate}px)`;
        e.preventDefault && e.preventDefault();
    }
    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        slider.classList.remove('dragging');
        const x = e.type && e.type.includes('touch') && e.changedTouches ? e.changedTouches[0].clientX : (e ? e.clientX : 0);
        const dx = x - startX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) nextSlide();
            else prevSlide();
        } else {
            goToSlide(currentSlide);
        }
        startAutoSlide();
    }

    // =====================
    // Filtro de Preço Customizado (Slider Duplo)
    // =====================
    (function() {
        const minValue = 0;
        const maxValue = 1000;
        const step = 10;
        let currentMin = minValue;
        let currentMax = maxValue;
        const slider = document.getElementById('custom-range-slider');
        const track = document.getElementById('custom-range-track');
        const thumbMin = document.getElementById('custom-thumb-min');
        const thumbMax = document.getElementById('custom-thumb-max');
        const minValueLabel = document.getElementById('price-min-value');
        const maxValueLabel = document.getElementById('price-max-value');
        const filterBtn = document.getElementById('price-filter-btn');
        if (!slider || !track || !thumbMin || !thumbMax || !minValueLabel || !maxValueLabel) return;

        // Função para converter valor para posição em porcentagem
        function valueToPercent(val) {
            return ((val - minValue) / (maxValue - minValue)) * 100;
        }
        // Função para converter posição em px para valor
        function posToValue(posX) {
            const rect = slider.getBoundingClientRect();
            let percent = (posX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            let val = minValue + Math.round((maxValue - minValue) * percent / step) * step;
            return Math.max(minValue, Math.min(maxValue, val));
        }
        // Atualiza visual dos thumbs e faixa azul
        function updateSlider() {
            // Garante que min nunca ultrapasse max
            if (currentMin > currentMax) [currentMin, currentMax] = [currentMax, currentMin];
            // Atualiza posição dos thumbs
            thumbMin.style.left = valueToPercent(currentMin) + '%';
            thumbMax.style.left = valueToPercent(currentMax) + '%';
            // Atualiza faixa azul
            track.style.background = `linear-gradient(to right, var(--cinza-claro) ${valueToPercent(currentMin)}%, var(--azul-principal) ${valueToPercent(currentMin)}%, var(--azul-principal) ${valueToPercent(currentMax)}%, var(--cinza-claro) ${valueToPercent(currentMax)}%)`;
            // Atualiza labels
            minValueLabel.textContent = `R$ ${currentMin}`;
            maxValueLabel.textContent = `R$ ${currentMax}`;
        }
        // Eventos de arrastar os thumbs
        function startDrag(thumb, isMin) {
            function onMove(e) {
                let clientX = e.touches ? e.touches[0].clientX : e.clientX;
                let val = posToValue(clientX);
                if (isMin) {
                    currentMin = Math.min(val, currentMax);
                } else {
                    currentMax = Math.max(val, currentMin);
                }
                updateSlider();
            }
            function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('mouseup', onUp);
                document.removeEventListener('touchend', onUp);
            }
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchend', onUp);
        }
        thumbMin.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(thumbMin, true);
        });
        thumbMax.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startDrag(thumbMax, false);
        });
        thumbMin.addEventListener('touchstart', function(e) {
            e.preventDefault();
            startDrag(thumbMin, true);
        }, {passive: false});
        thumbMax.addEventListener('touchstart', function(e) {
            e.preventDefault();
            startDrag(thumbMax, false);
        }, {passive: false});
        // Inicializa
        updateSlider();
        // Botão de filtrar
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                alert(`Filtrar produtos de R$ ${currentMin} até R$ ${currentMax}`);
            });
        }
    })();

    var tabSegmentos = document.getElementById('tab-segmentos');
    var tabTipos = document.getElementById('tab-tipos');
    var conteudoSegmentos = document.getElementById('conteudo-segmentos');
    var conteudoTipos = document.getElementById('conteudo-tipos');
    if (tabSegmentos && tabTipos && conteudoSegmentos && conteudoTipos) {
        // Mostrar segmentos por padrão ao abrir o modal
        conteudoSegmentos.style.display = 'grid';
        conteudoTipos.style.display = 'none';
        tabSegmentos.classList.add('ativo');
        tabTipos.classList.remove('ativo');
        // Alternância por hover
        tabSegmentos.addEventListener('mouseenter', function() {
            conteudoSegmentos.style.display = 'grid';
            conteudoTipos.style.display = 'none';
            tabSegmentos.classList.add('ativo');
            tabTipos.classList.remove('ativo');
        });
        tabTipos.addEventListener('mouseenter', function() {
            conteudoSegmentos.style.display = 'none';
            conteudoTipos.style.display = 'grid';
            tabTipos.classList.add('ativo');
            tabSegmentos.classList.remove('ativo');
        });
    }

    // =====================
    // Limpar Filtros da Sidebar
    // =====================
    // Seleciona o botão/área de limpar filtros
    const cleanFiltersBtn = document.querySelector('.clean-filters');
    if (cleanFiltersBtn) {
        cleanFiltersBtn.addEventListener('click', function() {
            // 1. Desmarca todos os checkboxes de segmento e cor
            // Seleciona todos os checkboxes dentro da sidebar
            document.querySelectorAll('.side-bar input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // 2. Reseta os sliders de preço para os valores padrão (0 e 1000)
            const priceMin = document.getElementById('price-min');
            const priceMax = document.getElementById('price-max');
            if (priceMin && priceMax) {
                priceMin.value = 0;
                priceMax.value = 1000;
                // 3. Atualiza os valores exibidos dos preços
                const priceMinValue = document.getElementById('price-min-value');
                const priceMaxValue = document.getElementById('price-max-value');
                if (priceMinValue) priceMinValue.textContent = 'R$ 0';
                if (priceMaxValue) priceMaxValue.textContent = 'R$ 1000';
            }

            // 4. (Opcional) Adicione aqui lógica para atualizar o grid de produtos, se necessário
            // Exemplo: atualizarGridProdutos();
        });
    }
});