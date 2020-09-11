const aloeVereGel = new Product({
    id: 1,
    title: "ג'ל אלוורה  למריחה",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/aloeveragelly200.png",
    price: 81,
    description: "ג'ל האלוורה ידוע מזה אלפי שנים כמוצר על",
    quantity: 40,
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/61_Heb.pdf"
});
aloeVereGel.save();

const aloeHit = new Product({
    id: 2,
    title: "אלו היט לושן",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/Aloe-Heat-Lotion_200.png",
    price: 81,
    description: "אנחנו מכירים את ההרגשה של עייפות ושרירים דואבים",
    quantity: 100,
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/64_Heb.pdf"
});
aloeHit.save();

const aloeFirst = new Product({
    id: 3,
    title: "אלו פירסט",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/Aloe-Heat-Lotion_200.png",
    price: 109,
    description: "אף ערכת עזרה ראשונה אינה שלמה ללא האלו-פירסט",
    quantity: 100,
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/40_Heb.pdf"
});
aloeFirst.save();

const aloeSunScreen = new Product({
    id: 4,
    title: "אלו סאן סקרין",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/617_200.png",
    price: 113.99,
    description: "תנו לשמש לעלות",
    quantity: "100",
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/617_Heb.pdf"

});
aloeSunScreen.save();
const aloePropolis = new Product({

    id: 5,
    title: "קרם אלו פרופוליס",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/propoliscreme200.png",
    price: 109,
    description: "קרם אלו פרופוליס הוא מוצר יוצא דופן מסוגו בשוק כיום ",
    quantity: 100,
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/51_Heb.pdf",
});
// aloePropolis.save();

const aloeScrub = new Product({
    id: 6,
    title: "אלו סקראב",
    image: "https://gallery.foreverliving.com/gallery/ISR/image/products/skincare/scrub200.png",
    price: 87,
    description: "דוריות גמישות משמן החוחובה הצפות בתוך תחליב סבוני",
    quantity: 1009,
    pdf_description: "https://gallery.foreverliving.com/gallery/ISR/download/products/Skin_care/238_Heb.pdf",
})
aloeScrub.save();