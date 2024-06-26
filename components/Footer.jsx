import { Link } from "@nextui-org/react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-16 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center mb-4">
          <Link href="/about" className="mx-4 my-2">About Us</Link>
          <Link href="/contact" className="mx-4 my-2">Contact</Link>
          <Link href="/privacy" className="mx-4 my-2">Privacy Policy</Link>
          <Link href="/terms" className="mx-4 my-2">Terms of Service</Link>
        </div>
        <p className="text-center text-gray-600">© 2024 Trikl3</p>
      </div>
    </footer>
  );
}

export default Footer;