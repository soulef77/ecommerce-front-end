'use client';
import Link from "next/link";

export function Footer() {
    return (<footer className="mt-16 p-4 border-t border-gray-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-bold">Baza</h3>
                        <p>Yousra</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Espace client</h4>
                        <ul>
                            <li>Mon compte</li>
                            <li>Ma commande</li>
                            <li>Mes Commandes</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold">Besoin d'aide ?</h4>
                        <ul>
                            <li>Nous Contacter</li>
                            <li>Ma Commande</li>
                            <li>Foire aux Questions</li>
                            <li>Désinscription à la Newsletter</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold">Information sur l'entreprise</h4>
                        <ul>
                            <li>À propos de Baza</li>
                            <li>Baza Elegance</li>
                            <li>Juridique</li>
                            <li>Politique de confidentialité et cookies</li>
                            <li>Informations sur l'entreprise</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold">Newsletter</h4>
                        <p>En saisissant votre adresse e-mail ci-dessous, vous acceptez de recevoir notre
                            newsletter.</p>
                        <input type="email" placeholder="Adresse Electronique" className="border p-2 mt-2"/>
                    </div>
                </div>
            </div>
        </footer>
    );
}
