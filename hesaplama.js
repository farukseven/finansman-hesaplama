const financeTypeButtons = document.querySelectorAll('.type-button');
const financeSections = document.querySelectorAll('.finance-section');
const hesaplaButton = document.getElementById("hesaplaButton");
const odemePlani = document.getElementById("odeme-plani");
const odemeTablosu = document.getElementById("odeme-tablosu").getElementsByTagName('tbody')[0];
const accordionHeader = document.querySelector('.accordion-header');
const accordionContent = document.querySelector('.accordion-content');

const defaults = {
    house: { pesinatOrani: 20, calismaBedeliOrani: 0.15 }, // Çalışma Bedeli %15 olarak ayarlandı
    car: { pesinatOrani: 30, calismaBedeliOrani: 0.15 }    // Çalışma Bedeli %15 olarak ayarlandı
};

let currentFinanceType = 'house';
let finansmanTutariInput, tasarrufSuresiInput, calismaBedeliInput, toplamMaliyetInput, tahminiAylikTaksitInput;

function setInputs() {
    const prefix = currentFinanceType;
    finansmanTutariInput = document.getElementById(prefix + "FinansmanTutari");
    tasarrufSuresiInput = document.getElementById(prefix + "TasarrufSuresi");
    calismaBedeliInput = document.getElementById("calismaBedeli");
    toplamMaliyetInput = document.getElementById("toplamMaliyet");
    tahminiAylikTaksitInput = document.getElementById("tahminiAylikTaksit");

    addInputListeners();
}

function addInputListeners() {
    finansmanTutariInput.addEventListener("input", hesapla);
    tasarrufSuresiInput.addEventListener("input", hesapla);
}

function formatCurrency(number) {
    return new Intl.NumberFormat('tr-TR').format(number);
}

function parseCurrency(str) {
    if (typeof str !== 'string') return NaN;
    const numStr = str.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(numStr);
}

function hesapla() {
    const currentDefaults = defaults[currentFinanceType];
    let finansmanTutariStr = finansmanTutariInput.value;

    // Sadece sayısal karakterleri ve virgül/nokta ayracını koru
    finansmanTutariStr = finansmanTutariStr.replace(/[^\d.,]/g, '');

    // Formatlanmış değeri göster
    finansmanTutariInput.value = formatCurrency(parseCurrency(finansmanTutariStr));

    const finansmanTutari = parseCurrency(finansmanTutariStr);
    const tasarrufSuresi = parseInt(tasarrufSuresiInput.value);

    if (isNaN(finansmanTutari) || isNaN(tasarrufSuresi)) return;

    // Çalışma Bedeli %15 olarak hesaplanır
    const calismaBedeli = finansmanTutari * currentDefaults.calismaBedeliOrani;
    const toplamMaliyet = finansmanTutari + calismaBedeli;
    const tahminiAylikTaksit = toplamMaliyet / tasarrufSuresi;

    // Çalışma Bedeli, Toplam Maliyet ve Tahmini Aylık Taksit TL olarak gösterilir
    calismaBedeliInput.value = formatCurrency(calismaBedeli);
    toplamMaliyetInput.value = formatCurrency(toplamMaliyet);
    tahminiAylikTaksitInput.value = formatCurrency(tahminiAylikTaksit);

    // Ödeme planını güncelle
    odemeTablosu.innerHTML = '';
    for (let i = 1; i <= tasarrufSuresi; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i}</td><td>${formatCurrency(tahminiAylikTaksit)} TL</td>`;
        odemeTablosu.appendChild(row);
    }

    // Ödeme planını göster
    accordionContent.classList.add('active');
}

financeTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        financeTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFinanceType = button.getAttribute('data-type');

        financeSections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(`${currentFinanceType}-finance`).style.display = 'block';

        setInputs();
        hesapla();
    });
});

hesaplaButton.addEventListener('click', hesapla);

accordionHeader.addEventListener('click', () => {
    accordionContent.classList.toggle('active');
});

setInputs();
hesapla();