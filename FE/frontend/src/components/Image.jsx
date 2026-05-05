import NextImage from "next/image";

export const Image = ({ className, children, variant, contentKey, ...props }) => {
  return (
    <NextImage
      src={props.src || "/placeholder.png"}
      alt={props.alt || "Image"}
      width={props.width || 50}
      height={props.height || 50}
      className={className}
      unoptimized
      {...props}
    />
  );
};