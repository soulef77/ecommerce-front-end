import Link from "next/link";

export function Header() {
    return (
        <header>
            <Link
                href="/shop"
                className="text-[#2C1810] hover:text-[#8B6F47] transition font-medium"
            >
                Boutique
            </Link>
            <div className="container">
                <div className="logo">BAZA</div>

                <nav>
                    <Link href="#">Collection Palace</Link>
                    <Link href="#">Abayas</Link>
                    <Link href="#">Capes</Link>
                </nav>
            </div>
        </header>
    );
}
