// ================================
// CONTADOR ANIMADO
// ================================

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

    const updateCounter = () => {

        const target = +counter.dataset.target;
        const count = +counter.innerText;

        const increment = target / 100;

        if (count < target) {

            counter.innerText =
                Math.ceil(count + increment);

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText = target;

        }

    }

    updateCounter();

});

// ================================
// SCROLL ANIMATION
// ================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add('show');

        }

    });

});

document.querySelectorAll('section').forEach(section => {

    section.classList.add('fade-in');

    observer.observe(section);

});

// ================================
// NAVBAR SCROLL
// ================================

const nav = document.querySelector('.custom-navbar');

const handleNavbarScroll = () => {
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleNavbarScroll);
window.addEventListener('DOMContentLoaded', handleNavbarScroll);

// ================================
// SHOP - CARRINHO SIMPLES
// ================================

const cart = {
    items: [],
    add(item) {
        const found = this.items.find(i => i.name === item.name);
        if (found) found.qty += 1;
        else this.items.push({ ...item, qty: 1 });
        this.save();
        this.render();
    },
    remove(name) {
        this.items = this.items.filter(i => i.name !== name);
        this.save();
        this.render();
    },
    total() {
        return this.items.reduce((s, i) => s + i.qty * parseFloat(i.price), 0);
    },
    save() {
        try { localStorage.setItem('cozy_cart', JSON.stringify(this.items)); } catch (e) {}
    },
    load() {
        try { this.items = JSON.parse(localStorage.getItem('cozy_cart')) || []; } catch (e) { this.items = []; }
    },
    render() {
        const list = document.getElementById('cart-items');
        const count = document.getElementById('cart-count');
        const totalEl = document.getElementById('cart-total');
        if (!list || !count || !totalEl) return;
        list.innerHTML = '';
        this.items.forEach(it => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `<div><strong>${it.name}</strong><div class="small text-muted">R$ ${parseFloat(it.price).toFixed(2)} x ${it.qty}</div></div><div><button class="btn btn-sm btn-outline-danger remove-item">Remover</button></div>`;
            li.querySelector('.remove-item').addEventListener('click', () => this.remove(it.name));
            list.appendChild(li);
        });
        count.innerText = this.items.reduce((s, i) => s + i.qty, 0);
        totalEl.innerText = `R$ ${this.total().toFixed(2)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cart.load();
    cart.render();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card') || e.target.closest('.card');
            if (!card) return;
            const name = card.querySelector('.card-title')?.innerText || 'Produto';
            const priceText = card.closest('[data-price]')?.dataset.price || card.querySelector('[data-price]')?.dataset.price || card.querySelector('.card-body strong')?.innerText;
            // try to extract numeric price
            let price = 0;
            const dataPrice = card.parentElement?.dataset.price || card.dataset.price;
            if (dataPrice) price = parseFloat(dataPrice);
            else if (priceText) price = parseFloat(String(priceText).replace(/[R$\s]/g, '').replace(',', '.')) || 0;

            cart.add({ name, price });
        });
    });

    // Filtrar e ordenar produtos (simples)
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const cat = document.getElementById('filter-category').value;
            const sort = document.getElementById('sort-by').value;
            const grid = document.getElementById('product-grid');
            const items = Array.from(grid.querySelectorAll('[data-price]'));

            let filtered = items.filter(it => cat === 'all' ? true : it.dataset.category === cat);

            if (sort === 'price-asc') filtered.sort((a,b)=> parseFloat(a.dataset.price)-parseFloat(b.dataset.price));
            if (sort === 'price-desc') filtered.sort((a,b)=> parseFloat(b.dataset.price)-parseFloat(a.dataset.price));

            grid.innerHTML = '';
            filtered.forEach(n=> grid.appendChild(n));
        });
    }
});