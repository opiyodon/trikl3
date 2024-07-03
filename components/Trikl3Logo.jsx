import { Image } from "@nextui-org/react";

const Trikl3Logo = () => (
  <div className="w-14 h-14 mr-1">
    <Image
      src="/assets/logo.png"
      className=""
      alt="Trikl3 Logo"
      width={56} // Assuming 14 * 4px as a default sizing unit
      height={56}
    />
  </div>
);

export default Trikl3Logo;
