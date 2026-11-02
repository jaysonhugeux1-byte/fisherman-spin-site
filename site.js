// Les deux petites choses dynamiques du site : le choix de la durée dans les tarifs, et le message de la page de
// retour après un paiement Stripe (paiement.html?paiement=ok, ?abonnement=annule…).

const euros = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });

// Tarifs : 1, 3 ou 6 mois. Les prix sont ceux réglés dans Stripe (docs/lancement.md de l'application).
document.querySelectorAll(".durees button").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const duree = Number(bouton.dataset.duree);
    document.querySelectorAll(".durees button").forEach((b) => b.setAttribute("aria-pressed", String(b === bouton)));
    document.querySelectorAll(".formule[data-prix-1]").forEach((f) => {
      const prix = Number(f.getAttribute(`data-prix-${duree}`));
      f.querySelector(".prix").textContent = euros(prix);
      f.querySelector(".periode").textContent = duree === 1 ? "par mois" : `pour ${duree} mois, soit ${euros(Math.round((prix / duree) * 100) / 100)} par mois`;
    });
  });
});

// Retour de Stripe.
const retour = document.querySelector("[data-retour]");
if (retour) {
  const p = new URLSearchParams(location.search);
  const messages = {
    "paiement-ok": ["✓", "Paiement reçu", "Retourne dans Fisherman Spin : tes jetons GTO apparaissent sur ta page Compte dans quelques secondes. Ton reçu arrive par e-mail."],
    "paiement-annule": ["–", "Paiement annulé", "Rien n'a été débité. Tu peux réessayer depuis la page Compte de l'application."],
    "abonnement-ok": ["✓", "Abonnement activé", "Retourne dans Fisherman Spin : ta formule s'affiche sur ta page Compte dans quelques secondes. Ton reçu arrive par e-mail."],
    "abonnement-annule": ["–", "Abonnement non souscrit", "Rien n'a été débité. Tu peux choisir une formule à tout moment depuis la page Compte de l'application."],
  };
  const cle = p.has("paiement") ? `paiement-${p.get("paiement")}` : p.has("abonnement") ? `abonnement-${p.get("abonnement")}` : null;
  const [icone, titre, texte] = messages[cle] ?? ["✓", "C'est noté", "Tu peux fermer cette page et revenir dans l'application Fisherman Spin."];
  retour.querySelector(".icone").textContent = icone;
  retour.querySelector("h1").textContent = titre;
  retour.querySelector("p").textContent = texte;
}
