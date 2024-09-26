import { Image } from "@nextui-org/react";

const Trikl3Logo = () => (
  <div className="w-10 h-10 md:w-14 md:h-14 mr-1">
    <Image
      src="/assets/logo.png"
      className=""
      alt="Trikl3 Logo"
      width={40}
      height={40}
      sizes="(max-width: 768px) 40px, 56px"
    />
  </div>
);

export default Trikl3Logo;