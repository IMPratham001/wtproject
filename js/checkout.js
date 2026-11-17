document.addEventListener('DOMContentLoaded', function () {

  var checkoutModalEl = document.getElementById('checkoutModal');
  if (!checkoutModalEl) return;

  var checkoutForm = document.getElementById('checkoutForm');
  var summaryBox = document.getElementById('checkoutSummary');
  var totalEl = document.getElementById('checkoutTotal');
  var toastEl = document.getElementById('appToast');

  var ASSASSINS = {
    a1: { name: 'Gun Yamazaki', spec: 'Close Combat', price: 1800000, image: 'images/assassins/gun-yamazaki.jpg' },
    a2: { name: 'Shingen', spec: 'Sword Master', price: 2100000, image: 'images/assassins/shingen.jpg' },
    a3: { name: 'Manager Kim', spec: 'Recon', price: 950000, image: 'images/assassins/manager-kim.jpg' },
    a4: { name: 'Goo Kim', spec: 'Improvised Weapons', price: 1200000, image: 'images/assassins/goo-kim.webp' },
    a5: { name: 'Amur Tigro', spec: 'Stealth', price: 3200000, image: 'images/assassins/amur-tigro.jpg' }
  };

  var selectedAssassin = null;

  function money(n) {
    return '$' + Number(n || 0).toLocaleString('en-US');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-hire-id]');
    if (!btn) return;
    var assassin = ASSASSINS[btn.getAttribute('data-hire-id')];
    if (!assassin) return;
    selectedAssassin = assassin;

    checkoutForm.reset();
    checkoutForm.classList.remove('was-validated');

    summaryBox.innerHTML =
      '<img src="' + assassin.image + '" alt="">' +
      '<div><h6>' + assassin.name + '</h6><p>' + assassin.spec + '</p></div>';
    totalEl.textContent = money(assassin.price);

    var modal = bootstrap.Modal.getOrCreateInstance(checkoutModalEl);
    modal.show();
  });

  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!checkoutForm.checkValidity()) {
      checkoutForm.classList.add('was-validated');
      return;
    }

    if (selectedAssassin) {
      var inquiries = JSON.parse(localStorage.getItem('scaraInquiries') || '[]');
      inquiries.push({
        id: Date.now(),
        assassin: selectedAssassin.name,
        fee: money(selectedAssassin.price),
        name: document.getElementById('checkoutName').value,
        email: document.getElementById('checkoutEmail').value,
        message: '',
        date: new Date().toISOString()
      });
      localStorage.setItem('scaraInquiries', JSON.stringify(inquiries));
    }

    var modal = bootstrap.Modal.getOrCreateInstance(checkoutModalEl);
    modal.hide();

    if (toastEl && window.bootstrap) {
      var previousText = toastEl.querySelector('.toast-body').textContent;
      toastEl.querySelector('.toast-body').textContent = 'Request sent. The Agency will make contact shortly.';
      bootstrap.Toast.getOrCreateInstance(toastEl).show();
      setTimeout(function () {
        toastEl.querySelector('.toast-body').textContent = previousText;
      }, 4000);
    }
  });

});
